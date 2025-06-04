"use client";

import { useEffect, useState } from "react";
import { ShoppingBagIcon } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";
import { useIsMobile } from "@/hooks/use-device";
import { Button } from "../ui/button";

export const CartView = () => {
	const isMobile = useIsMobile();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative"
					aria-label="Open shopping cart"
				>
					<ShoppingBagIcon className="size-5" />
					<span className="sr-only">Shopping cart</span>
					<span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
						0
					</span>
				</Button>
			</SheetTrigger>
			<SheetContent side={isMobile ? "bottom" : "right"}>
				<SheetHeader>
					<SheetTitle>Shopping Cart</SheetTitle>
				</SheetHeader>
				<div className="flex h-full flex-col">
					<div className="flex-1">
						<p className="py-6 text-center text-muted-foreground">
							Your cart is empty
						</p>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};