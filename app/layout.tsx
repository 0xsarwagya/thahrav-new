import "@/styles/globals.css";
import { Anek_Devanagari, Hind_Siliguri, Poppins } from "next/font/google";

const anekDevanagari = Anek_Devanagari({
	variable: "--font-anek-devanagari",
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

const hindSiliguri = Hind_Siliguri({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${anekDevanagari.variable} ${hindSiliguri.variable} ${poppins.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
