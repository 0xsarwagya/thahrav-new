import { Navbar } from "../shared/navbar";

export const MarketingLayout = ({
	children,
}: { children: React.ReactNode }) => {
	return (
		<>
			<Navbar />
			{children}
		</>
	);
};
