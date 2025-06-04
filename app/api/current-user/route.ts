/**
 * API Route Handlers for User Operations
 * 
 * This module provides API endpoints for retrieving and updating the current user's information.
 * It uses Next.js Route Handlers and integrates with Supabase for data persistence.
 */

import { auth } from "@/auth";
import { supabase } from "@/lib/const";
import type { Session } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * GET /api/current-user
 * 
 * Retrieves the currently authenticated user's information.
 * 
 * @param req - The incoming Next.js request object
 * @returns A JSON response containing the user data or an error message
 */
export const GET = async (req: NextRequest) => {
    try {
        // Authenticate the current user session
        const session: Session | null = await auth();

        // Check if user is authenticated
        if (!session || !session.user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized: No valid session found"
                },
                { status: 401 }
            );
        }

        // Return the user data from the session
        return NextResponse.json({
            success: true,
            data: session.user,
        });
    } catch (error) {
        console.error("Error in GET /api/current-user:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error: Failed to fetch user data"
            },
            { status: 500 }
        );
    }
}

/**
 * OPTIONS /api/current-user
 * 
 * Handles user profile updates (name and/or image).
 * This endpoint uses the HTTP OPTIONS method to update user information.
 * 
 * @param req - The incoming Next.js request object containing update data
 * @returns A JSON response with the updated user data or an error message
 */
export const OPTIONS = async (req: NextRequest) => {
    try {
        // Authenticate the current user session
        const session: Session | null = await auth();

        // Check if user is authenticated
        if (!session || !session.user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized: No valid session found"
                },
                { status: 401 }
            );
        }

        // Parse and validate the request body
        const body = await req.json();

        // Define validation schema for user updates
        const updateSchema = z.object({
            name: z.string()
                .min(3, "Name must be at least 3 characters")
                .max(50, "Name cannot exceed 50 characters")
                .nullable()
                .optional(),
            image: z.string()
                .url("Please provide a valid URL for the image")
                .nullable()
                .optional(),
        }).refine(
            (data) => data.name || data.image,
            {
                message: "At least one field (name or image) is required for update",
            }
        );

        // Validate the request body against the schema
        const result = updateSchema.safeParse(body);

        // Handle validation errors
        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error.errors[0].message,
                },
                { status: 400 }
            );
        }

        // Update user in Supabase
        const { data: updatedUser, error } = await supabase
            .schema("next_auth")
            .from("users")
            .update({
                name: result.data.name,
                image: result.data.image,
                updated_at: new Date().toISOString(),
            })
            .eq("id", session.user.id)
            .select()
            .single();

        // Handle user not found
        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User not found in the database"
                },
                { status: 404 }
            );
        }

        // Handle database errors
        if (error) {
            console.error("Database error in OPTIONS /api/current-user:", error);
            return NextResponse.json(
                {
                    success: false,
                    error: "Database operation failed"
                },
                { status: 500 }
            );
        }

        // Return the updated user data
        return NextResponse.json({
            success: true,
            data: updatedUser,
        });

    } catch (error) {
        // Handle unexpected errors
        console.error("Unexpected error in OPTIONS /api/current-user:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error: Failed to update user data"
            },
            { status: 500 }
        );
    }
};