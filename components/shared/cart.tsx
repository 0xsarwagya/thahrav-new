"use client";

import { useEffect, useState } from "react";
import { ShoppingCartIcon } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";
import { useIsMobile } from "@/hooks/use-device";

export const CartView = () => {
    const isMobile = useIsMobile();

    return (
		<Sheet>
			<SheetTrigger className="flex items-center gap-1">
				<ShoppingCartIcon className="size-5" />
				<span className="sr-only">Cart</span>
			</SheetTrigger>
			<SheetContent side={isMobile ? "bottom" : "right"}>
				<SheetHeader>
					<SheetTitle>Cart</SheetTitle>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};