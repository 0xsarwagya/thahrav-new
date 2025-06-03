import { env } from "@/lib/const";
import { sendVerificationEmail } from "@/lib/mailer";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import chalk from "chalk";
import { nanoid } from "nanoid";
import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { z } from "zod";
import { supabase } from "@/lib/const";

export const { handlers, auth, signIn, signOut } = NextAuth({
	providers: [
		Nodemailer({
			id: "passwordless",
			name: "Passwordless",
			server: {
				host: env.SMTP_HOST,
				port: env.SMTP_PORT,
				auth: {
					user: env.SMTP_USER,
					pass: env.SMTP_PASSWORD,
				},
			},
			from: env.SMTP_USER,
			secret: env.AUTH_SECRET,
			sendVerificationRequest: async (data) => {
				await sendVerificationEmail(data);
			},
		}),
	],
	adapter: SupabaseAdapter({
		url: z.string().parse(process.env.SUPABASE_URL),
		secret: z.string().parse(process.env.SUPABASE_SERVICE_ROLE_KEY),
	}),
	session: {
		strategy: "database",
		maxAge: 60 * 60 * 24 * 30,
		updateAge: 60 * 60 * 24,
		generateSessionToken: () => {
			return nanoid(256);
		},
	},
	callbacks: {
		async session({ session, user }) {
			const { data, error } = await supabase
				.schema("next_auth")
				.from("users")
				.select("*")
				.eq("id", user.id)
				.single();

			if (error) {
				throw error;
			}

			return {
				...session,
				user: {
					...user,
					...data,
				},
			};
		},
	},
	useSecureCookies: env.IS_PRODUCTION,
	trustHost: true,
	logger: {
		error: (e) => {
			console.log(chalk.red(e));
		},
		warn: (code) => {
			console.log(chalk.yellow(code));
		},
		debug: (message, metadata) => {
			console.log(chalk.gray(message), metadata);
		},
	},
});
