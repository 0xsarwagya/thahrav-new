import { z } from "zod";

export const env = {
	IS_PRODUCTION: z.coerce.boolean().parse(process.env.VERCEL),
	SUPABASE_URL: z.string().parse(process.env.SUPABASE_URL),
	SUPABASE_SERVICE_ROLE_KEY: z
		.string()
		.parse(process.env.SUPABASE_SERVICE_ROLE_KEY),
	AUTH_SECRET: z.string().parse(process.env.AUTH_SECRET),
	AUTH_TRUST_HOST: z.string().parse(process.env.AUTH_TRUST_HOST),
	SMTP_HOST: z.string().parse(process.env.SMTP_HOST),
	SMTP_PASSWORD: z.string().parse(process.env.SMTP_PASSWORD),
	SMTP_PORT: z.coerce.number().parse(process.env.SMTP_PORT),
	SMTP_USER: z.string().parse(process.env.SMTP_USER),
	SUPABASE_PROJECT_REF: z.string().parse(process.env.SUPABASE_PROJECT_REF),
	SUPABASE_ACCESS_TOKEN: z.string().parse(process.env.SUPABASE_ACCESS_TOKEN),
};