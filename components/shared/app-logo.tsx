import { cn } from "@/lib/utils/client";
import { ShoppingBagIcon } from "lucide-react";

/**
 * AppLogo component
 *
 * Displays the application logo, which is the word "Thahrav" in Hindi script.
 * It uses a specific font "Anek Devanagari" and allows for custom styling via className.
 *
 * @param {object} props - The properties for the component.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the logo text.
 * @returns {JSX.Element} The rendered logo component.
 */
export const AppLogo = ({
	className,
}: {
	className?: string;
}) => {
	return (
		<div>
			{/* The div tag is used for the wordmark logo "Thahrav" in Hindi script for better SEO. */}
			{/* The `cn` utility merges default Tailwind classes with any custom classes passed via props. */}
			{/* Default classes: text-xl for size, font-bold for weight, font-anek-devanagari for the specific Hindi font. */}
			<div className={cn("text-xl font-bold font-anek-devanagari text-foreground flex items-center", className)}>
				ठaहraव
			</div>
		</div>
	);
};
