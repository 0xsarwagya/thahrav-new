import ThahravVerifyEmail from "@/emails/verify-email";
import { type Theme, pretty, render } from "@react-email/components";
import type { NodemailerConfig } from "next-auth/providers/nodemailer";
import nodemailer from "nodemailer";
import { z } from "zod";

const nodemailerSchema = z.object({
	server: z.object({
		host: z.string(),
		port: z.number(),
		auth: z.object({
			user: z.string(),
			pass: z.string(),
		}),
	}),
	from: z.string(),
	secret: z.string(),
});

export const sendVerificationEmail = async (data: {
	identifier: string;
	url: string;
	provider: NodemailerConfig;
}) => {
	const email_react = (
		<ThahravVerifyEmail link={data.url} name={data.identifier} />
	);
	const text = await render(email_react, {
		plainText: true,
	});
	const html = await pretty(await render(email_react));

	const nodemailerConfig = nodemailerSchema.parse(data.provider);

	const transporter = nodemailer.createTransport(nodemailerConfig.server);

	const mailOptions = {
		from: nodemailerConfig.from,
		to: data.identifier,
		subject: "Verify your email address",
		text,
		html,
	};

	await transporter.sendMail(mailOptions);
};
