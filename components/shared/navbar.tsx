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
import { Instagram, Menu, MoveRight, ShoppingCart, X } from "lucide-react";
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

export const Navbar = () => {
	const navigationItems = [
		{
			title: "Home",
			href: "/",
		},
		{
			title: "Shop",
			description: "Explore our collection, find your perfect fit.",
			items: [
				{
					title: "Mens",
					href: "/shop?category=mens",
				},
				{
					title: "Womens",
					href: "/shop?category=womens",
				},
				{
					title: "Unisex",
					href: "/shop?category=unisex",
				},
				{
					title: "Offers",
					href: "/shop?hasOffers=true",
				},
			],
		},
		{
			title: "About",
			href: "/about",
		},
		{
			title: "Blog",
			href: "/journal",
		},
		{
			title: "Contact",
			href: "/contact",
		},
	];

	const socialLinks = [
		{
			title: "Instagram",
			href: "https://www.instagram.com",
			icon: <InstagramIcon className="w-4 h-4" />,
		},
		{
			title: "Facebook",
			href: "https://www.facebook.com",
			icon: <FacebookIcon className="w-4 h-4" />,
		},
		{
			title: "Twitter",
			href: "https://www.twitter.com",
			icon: <TwitterIcon className="w-4 h-4" />,
		},
	];

	const [isOpen, setOpen] = useState(false);
	return (
		<header className="w-full bg-background border-b border-border px-4 md:px-0">
			<div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
				<div className="justify-start items-center gap-4 lg:flex hidden flex-row">
					<NavigationMenu className="flex justify-start items-start">
						<NavigationMenuList className="flex justify-start gap-2 flex-row">
							{navigationItems.map((item) => (
								<NavigationMenuItem key={item.title}>
									{item.href ? (
										<>
											<NavigationMenuLink>
												<Button variant="ghost">{item.title}</Button>
											</NavigationMenuLink>
										</>
									) : (
										<>
											<NavigationMenuTrigger className="font-medium text-sm">
												{item.title}
											</NavigationMenuTrigger>
											<NavigationMenuContent className="!w-[450px] p-4">
												<div className="flex flex-col lg:grid grid-cols-2 gap-4">
													<div className="flex flex-col h-full justify-between">
														<div className="flex flex-col">
															<p className="text-base">{item.title}</p>
															<p className="text-muted-foreground text-sm">
																{item.description}
															</p>
														</div>
														<Link
															href={"/shop"}
															className={cn(
																"mt-10",
																buttonVariants({
																	variant: "default",
																	size: "sm",
																}),
															)}
														>
															Shop now
														</Link>
													</div>
													<div className="flex flex-col text-sm h-full justify-end">
														{item.items?.map((subItem) => (
															<NavigationMenuLink
																href={subItem.href}
																key={subItem.title}
																className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
															>
																<span>{subItem.title}</span>
																<MoveRight className="w-4 h-4 text-muted-foreground" />
															</NavigationMenuLink>
														))}
													</div>
												</div>
											</NavigationMenuContent>
										</>
									)}
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<AppLogo className="flex lg:justify-center" />
				<div className="flex justify-end w-full gap-4">
					<CartView />
				</div>
				<div className="flex w-12 shrink lg:hidden items-end justify-end">
					<Sheet open={isOpen} onOpenChange={setOpen}>
						<SheetTrigger>
							<Menu className="w-5 h-5" />
						</SheetTrigger>
						<SheetContent side={"top"} className="px-4">
							<SheetHeader>
								<SheetTitle>
									<AppLogo />
								</SheetTitle>
								<Separator />
							</SheetHeader>
							{navigationItems.map((item) => (
								<div key={item.title}>
									<div className="flex flex-col gap-2">
										{item.href ? (
											<Link
												href={item.href}
												className="flex justify-between items-center"
											>
												<span className="text-base">{item.title}</span>
												<MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
											</Link>
										) : (
											<p className="text-base">{item.title}</p>
										)}
										<ul className="flex flex-col gap-2">
											{item.items?.map((subItem) => (
												<li key={subItem.title}>
													<Link
														href={subItem.href}
														className="flex justify-between items-center"
													>
														<span className="text-muted-foreground text-sm">
															{subItem.title}
														</span>
														<MoveRight className="w-4 h-4 stroke-1" />
													</Link>
												</li>
											))}
										</ul>
									</div>
								</div>
							))}
							<Separator />
							<SheetFooter className="flex justify-start flex-row items-start gap-2">
								{socialLinks.map((link) => (
									<Link
										href={link.href}
										key={link.title}
										className={buttonVariants({
											variant: "ghost",
											size: "icon",
										})}
									>
										{link.icon}
									</Link>
								))}
							</SheetFooter>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
};
