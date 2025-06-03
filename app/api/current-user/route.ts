import { auth } from "@/auth";
import { supabase } from "@/lib/const";
import type { Session } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const GET = async (req: NextRequest) => {
    try {
        const session: Session | null = await auth();

        if (!session || !session.user) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized"
            }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            data: session.user,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: "Internal Server Error"
        }, { status: 500 });
    }
}

export const OPTIONS = async (req: NextRequest) => {
    try {
        const session: Session | null = await auth();

        if (!session || !session.user) {
            return NextResponse.json({
                success: false,
                error: "Unauthorized"
            }, { status: 401 });
        }

        const body = await req.json();

        const updateSchema = z.object({
            name: z.string().min(3).max(50).nullable().optional(),
            image: z.string().url().nullable().optional(),
        }).refine(
            (data) => data.name || data.image,
            {
                message: "At least one field is required",
            }
        );

        const result = updateSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({
                success: false,
                error: result.error.errors[0].message,
            }, { status: 400 });
        }

        const { data: updatedUser, error } = await supabase
            .schema("next_auth")
            .from("users")
            .update({
                name: result.data.name,
                image: result.data.image,
            })
            .eq("id", session.user.id)
            .select()
            .single();

        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                error: "User not found"
            }, { status: 404 });
        }

        if (error) {
            return NextResponse.json({
                success: false,
                error: error,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            error: "Internal Server Error"
        }, { status: 500 });
    }
}