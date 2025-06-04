"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/client";
import { AppLogo } from "./app-logo";
import { CartView } from "./cart";
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { InstagramIcon, FacebookIcon, TwitterIcon } from "lucide-react";

const navigationItems = [
	{
		title: "Home",
		href: "/",
		description: "Return to the homepage",
	},
	{
		title: "Shop",
		description: "Explore our collection, find your perfect fit.",
		items: [
			{
				title: "Men's Collection",
				href: "/shop?category=mens",
				description: "Stylish apparel for men",
			},
			{
				title: "Women's Collection",
				href: "/shop?category=womens",
				description: "Elegant designs for women",
			},
			{
				title: "Unisex Collection",
				href: "/shop?category=unisex",
				description: "Versatile styles for everyone",
			},
			{
				title: "Special Offers",
				href: "/shop?hasOffers=true",
				description: "Exclusive deals and discounts",
			},
		],
	},
	{
		title: "About",
		href: "/about",
		description: "Learn about our story and mission",
	},
	{
		title: "Blog",
		href: "/journal",
		description: "Read our latest articles and updates",
	},
	{
		title: "Contact",
		href: "/contact",
		description: "Get in touch with our team",
	},
];

const socialLinks = [
	{
		title: "Follow us on Instagram",
		href: "https://www.instagram.com",
		icon: <InstagramIcon className="size-4" />,
	},
	{
		title: "Connect on Facebook",
		href: "https://www.facebook.com",
		icon: <FacebookIcon className="size-4" />,
	},
	{
		title: "Follow us on Twitter",
		href: "https://www.twitter.com",
		icon: <TwitterIcon className="size-4" />,
	},
];

export const Navbar = () => {
	const [isOpen, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<nav className="container relative mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8\" aria-label="Main navigation">
				<div className="flex lg:hidden">
					<Sheet open={isOpen} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="shrink-0"
								aria-label="Open menu"
							>
								<svg
									className="size-5"
									fill="none"
									height="24"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									viewBox="0 0 24 24"
									width="24"
								>
									<line x1="3" x2="21" y1="6" y2="6" />
									<line x1="3" x2="21" y1="12" y2="12" />
									<line x1="3" x2="21" y1="18" y2="18" />
								</svg>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-[300px] sm:w-[400px]">
							<SheetHeader>
								<SheetTitle>
									<AppLogo />
								</SheetTitle>
								<Separator />
							</SheetHeader>
							<nav className="flex flex-col gap-4 p-6">
								{navigationItems.map((item) => (
									<div key={item.title} className="space-y-3">
										{item.href ? (
											<Link
												href={item.href}
												className="flex items-center justify-between text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
												onClick={() => setOpen(false)}
											>
												<span>{item.title}</span>
												<MoveRight className="size-4" />
											</Link>
										) : (
											<>
												<div className="flex items-center justify-between">
													<span className="text-base font-medium">{item.title}</span>
												</div>
												<ul className="space-y-3 border-l pl-6">
													{item.items?.map((subItem) => (
														<li key={subItem.title}>
															<Link
																href={subItem.href}
																className="flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-foreground"
																onClick={() => setOpen(false)}
															>
																<span>{subItem.title}</span>
																<MoveRight className="size-4" />
															</Link>
														</li>
													))}
												</ul>
											</>
										)}
									</div>
								))}
							</nav>
							<SheetFooter className="flex-row justify-start gap-2 p-6">
								{socialLinks.map((link) => (
									<Link
										key={link.title}
										href={link.href}
										className={buttonVariants({
											variant: "ghost",
											size: "icon",
										})}
										aria-label={link.title}
									>
										{link.icon}
									</Link>
								))}
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>

				<div className="hidden lg:flex lg:gap-10">
					<AppLogo />
					<NavigationMenu className="hidden lg:flex">
						<NavigationMenuList>
							{navigationItems.map((item) => (
								<NavigationMenuItem key={item.title}>
									{item.href ? (
										<Link href={item.href} legacyBehavior passHref>
											<NavigationMenuLink
												className={cn(
													buttonVariants({ variant: "ghost" }),
													"text-sm font-medium"
												)}
											>
												{item.title}
											</NavigationMenuLink>
										</Link>
									) : (
										<>
											<NavigationMenuTrigger className="text-sm font-medium">
												{item.title}
											</NavigationMenuTrigger>
											<NavigationMenuContent>
												<div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
													<div className="flex flex-col justify-between">
														<div>
															<h3 className="text-base font-medium">{item.title}</h3>
															<p className="text-sm text-muted-foreground">
																{item.description}
															</p>
														</div>
														<Link
															href="/shop"
															className={cn(
																buttonVariants({
																	variant: "default",
																	size: "sm",
																}),
																"mt-4"
															)}
														>
															Browse all
														</Link>
													</div>
													<ul className="grid gap-2">
														{item.items?.map((subItem) => (
															<li key={subItem.title}>
																<NavigationMenuLink asChild>
																	<Link
																		href={subItem.href}
																		className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
																	>
																		<div className="text-sm font-medium leading-none">
																			{subItem.title}
																		</div>
																		<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
																			{subItem.description}
																		</p>
																	</Link>
																</NavigationMenuLink>
															</li>
														))}
													</ul>
												</div>
											</NavigationMenuContent>
										</>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>

				<div className="flex items-center gap-4">
					<div className="hidden lg:flex lg:gap-4">
						{socialLinks.map((link) => (
							<Link
								key={link.title}
								href={link.href}
								className={buttonVariants({
									variant: "ghost",
									size: "icon",
								})}
								aria-label={link.title}
							>
								{link.icon}
							</Link>
						))}
					</div>
					<CartView />
				</div>
			</nav>
		</header>
	);
};