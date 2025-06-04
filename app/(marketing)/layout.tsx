import { MarketingLayout } from "@/components/layouts/marketing";
import "@/styles/globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main>
			<MarketingLayout>{children}</MarketingLayout>
		</main>
	);
}
