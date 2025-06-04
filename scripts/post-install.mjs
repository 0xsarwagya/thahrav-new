#!/usr/bin/env node
import dotenv from "dotenv";
import fs from "node:fs";
import chalk from "chalk";
import path from "node:path";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabase = createClient(
	z.string().parse(process.env.SUPABASE_URL),
	z.string().parse(process.env.SUPABASE_SERVICE_ROLE_KEY),
);

const log = {
	info: (message, data) => {
		const timestamp = new Date().toISOString();
		console.log(chalk.blue(`[INFO ] [${timestamp}] ${message}`), data ?? "");
	},
	success: (message, data) => {
		const timestamp = new Date().toISOString();
		console.log(chalk.green(`[OK   ] [${timestamp}] ${message}`), data ?? "");
	},
	warn: (message, data) => {
		const timestamp = new Date().toISOString();
		console.warn(chalk.yellow(`[WARN ] [${timestamp}] ${message}`), data ?? "");
	},
	error: (message, data) => {
		const timestamp = new Date().toISOString();
		console.error(chalk.red(`[ERROR] [${timestamp}] ${message}`), data ?? "");
	},
	debug: (message, data) => {
		const timestamp = new Date().toISOString();
		if (!process.env.IS_PRODUCTION) {
			console.log(
				chalk.magenta(`[DEBUG] [${timestamp}] ${message}`),
				data ?? "",
			);
		}
	},
};

const runQuery = async (sql) => {
	log.info("Executing SQL query");

	try {
		const res = await fetch(
			`https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_REF}/database/query`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
				},
				body: JSON.stringify({ query: sql }),
			},
		);

		const data = await res.json();

		if (!res.ok) {
			log.error("Query failed", { status: res.status, body: data });
			throw new Error(`Query failed: ${res.status}`);
		}

		log.info("Query executed successfully", data);
		return data;
	} catch (error) {
		log.error("Error during runQuery", error);
		throw error;
	}
};

const generateTypes = async () => {
	log.info("Generating types");

	const response = await fetch(
		`https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_REF}/types/typescript?included_schemas=public,next_auth`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.SUPABASE_ACCESS_TOKEN}`,
			},
		},
	);

	if (!response.ok) {
		log.error("Failed to generate types", response);
		throw new Error("Failed to generate types");
	}

	const data = await response.json();
	const { types } = data;
	// Ensure types directory exists
	if (!fs.existsSync("./types")) {
		fs.mkdirSync("./types", { recursive: true });
	}
	fs.writeFileSync("./types/supabase.ts", Buffer.from(types));
	log.info("Types generated successfully");
};

const checkIfSchemaExists = async (schemaName) => {
	log.info("Checking if schema exists", schemaName);

	try {
		const { data, error } = await supabase.rpc("check_schema_exists", {
			p_schema_name: schemaName,
		});

		if (error) {
			log.error("Error from Supabase RPC", error);
			return false;
		}

		log.info("Schema check result", data);
		return !!data;
	} catch (err) {
		log.error("Exception during checkNextAuthSchemaExists", err);
		return false;
	}
};

const createCheckSchemaExistsFunction = async () => {
	log.info("Creating check_schema_exists function");

	const createSql = `
        CREATE OR REPLACE FUNCTION check_schema_exists(p_schema_name TEXT)
        RETURNS BOOLEAN AS $$
        BEGIN
            RETURN EXISTS (
                SELECT 1
                FROM information_schema.schemata
                WHERE schema_name = p_schema_name
            );
        END;
        $$ LANGUAGE plpgsql;
    `;

	try {
		await runQuery(createSql);
		log.info("Function created successfully");
	} catch (error) {
		log.error("Failed to create function", error);
	}
};

const createNextAuthSchema = async () => {
	log.info("Creating next_auth schema");

	const sql = fs.readFileSync("./migrations/create-next-auth.sql", "utf-8");

	try {
		await runQuery(sql);
		log.info("Schema created successfully");
	} catch (error) {
		log.error("Failed to create schema", error);
	}
};

const runMigrations = async () => {
	const migrationDir = path.join(process.cwd(), "migrations");
	const baseMigrations = ["create-next-auth.sql", "base_migration_table.sql"];
	const migrationFiles = fs.readdirSync(migrationDir);

	const appliedMigrations = await getAppliedMigrations();

	const migrationsToRun = migrationFiles.filter(
		(file) =>
			!baseMigrations.includes(file) && !appliedMigrations.includes(file),
	);

	for (const migrationFile of migrationsToRun) {
		await applyMigration(migrationFile);
	}
};

const getAppliedMigrations = async () => {
	try {
		const { data, error } = await supabase.from("_migrations").select("name");

		if (error) {
			log.error("Error fetching applied migrations", error);
			return [];
		}

		return data.map((item) => item.name);
	} catch (error) {
		log.error("Exception during getAppliedMigrations", error);
		return [];
	}
};

const applyMigration = async (migrationFile) => {
	const sql = fs.readFileSync(
		path.join(process.cwd(), "migrations", migrationFile),
		"utf-8",
	);
	try {
		await runQuery(sql);
		const { data, error } = await supabase
			.from("_migrations")
			.insert({ name: migrationFile });
		log.info(`Migration ${migrationFile} executed successfully`);
	} catch (error) {
		log.error(`Failed to execute migration ${migrationFile}`, error);
	}
};

const getProducts = async () => {
	const { data, error } = await supabase.from("product").select("*");
	if (error) {
		log.error("Error fetching products", error);
		return [];
	}
	return data;
};

const main = async () => {
	await createCheckSchemaExistsFunction();
	const authSchemaExists = await checkIfSchemaExists("next_auth");
	log.info("Auth schema exists", authSchemaExists);
	if (!authSchemaExists) {
		await createNextAuthSchema();
	}

	await runQuery(
		fs.readFileSync("./migrations/base_migration_table.sql", "utf-8"),
	);

	await generateTypes();

	await runMigrations();

	await generateTypes();

	await getProducts();
};

main();
