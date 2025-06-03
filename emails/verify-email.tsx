import { env } from "@/lib/const";
import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";

export interface ThahravVerifyEmailProps {
	link: string;
	name: string;
}

const baseUrl = env.IS_PRODUCTION
	? "https://thahrav.shop"
	: "http://localhost:3000";

export const ThahravVerifyEmail = ({ link, name }: ThahravVerifyEmailProps) => (
	<Html>
		<Head />
		<Body style={main}>
			<Preview>Your magic link</Preview>
			<Container style={container}>
				<Img
					src={new URL("/favicon.avif", baseUrl).toString()}
					width={48}
					height={48}
					alt="Thahrav"
				/>
				<Heading style={heading}>🪄 Your magic link</Heading>
				<Section style={body}>
					<Text style={paragraph}>
						Hello {name},
						<br />
						<br />
						<Link
							style={linkStyle}
							href={link}
							target="_blank"
							rel="noopener noreferrer"
						>
							👉 Click here to sign in 👈
						</Link>
					</Text>
					<Text style={paragraph}>
						If you didn't request this, please ignore this email.
					</Text>
				</Section>
				<Text style={paragraph}>
					Best,
					<br />- Thahrav Team
				</Text>
				<Hr style={hr} />
				<Img
					src={new URL("/favicon.avif", baseUrl).toString()}
					width={32}
					height={32}
					style={{
						WebkitFilter: "grayscale(100%)",
						filter: "grayscale(100%)",
						margin: "20px 0",
					}}
				/>
				<Text style={footer}>Vijaya Enterprises.</Text>
				<Text style={footer}>Chakkar Road, Muzaffarpur, Bihar 842001</Text>
			</Container>
		</Body>
	</Html>
);

ThahravVerifyEmail.PreviewProps = {
	link: baseUrl,
	name: "Sarwagya",
} as ThahravVerifyEmailProps;

export default ThahravVerifyEmail;

const main = {
	backgroundColor: "#ffffff",
	fontFamily:
		'-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
	margin: "0 auto",
	padding: "20px 25px 48px",
	backgroundImage: 'url("/static/raycast-bg.png")',
	backgroundPosition: "bottom",
	backgroundRepeat: "no-repeat, no-repeat",
};

const heading = {
	fontSize: "28px",
	fontWeight: "bold",
	marginTop: "48px",
};

const body = {
	margin: "24px 0",
};

const paragraph = {
	fontSize: "16px",
	lineHeight: "26px",
};

const linkStyle = {
	color: "#FF6363",
};

const hr = {
	borderColor: "#dddddd",
	marginTop: "48px",
};

const footer = {
	color: "#8898aa",
	fontSize: "12px",
	marginLeft: "4px",
};
