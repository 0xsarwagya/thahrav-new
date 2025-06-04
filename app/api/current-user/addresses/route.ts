/**
 * User Addresses API Routes
 * 
 * This module provides API endpoints for managing user addresses in the thahrav e-commerce application.
 * It handles CRUD operations for shipping and billing addresses associated with a user account.
 * All endpoints require authentication and return standardized response formats.
 * 
 * @module app/api/current-user/addresses
 */

import { auth } from "@/auth";
import { supabase } from "@/lib/const";
import type { Session } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Address data interface representing the structure of an address
 */
interface AddressData {
    id?: string;
    user_id?: string;
    country: string;
    is_billing: boolean;
    is_default: boolean;
    is_shipping: boolean;
    line1: string;
    line2?: string;
    state: string;
    zip: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Address update fields interface
 */
interface AddressUpdateData {
    country?: string;
    is_billing?: boolean;
    is_default?: boolean;
    is_shipping?: boolean;
    line1?: string;
    line2?: string;
    state?: string;
    zip?: string;
    updated_at?: string;
}

/**
 * Schema for validating address creation requests
 * Defines the required fields and validation rules for new addresses
 */
const createAddressSchema = z.object({
    country: z.string().min(2, "Country is required"),
    is_billing: z.boolean().default(false),
    is_default: z.boolean().default(false),
    is_shipping: z.boolean().default(true),
    line1: z.string().min(1, "Address line 1 is required"),
    line2: z.string().optional(),
    state: z.string().min(1, "State/Province is required"),
    zip: z.string().min(3, "ZIP/Postal code is required"),
});

/**
 * Schema for validating address update requests
 * Includes ID field and makes all other fields optional
 * Uses refinements to ensure at least one field is provided for update
 */
const updateAddressSchema = z.object({
    id: z.string().uuid("Valid address ID is required"),
    country: z.string().min(2).optional(),
    is_billing: z.boolean().optional(),
    is_default: z.boolean().optional(),
    is_shipping: z.boolean().optional(),
    line1: z.string().min(1).optional(),
    line2: z.string().optional(),
    state: z.string().min(1).optional(),
    zip: z.string().min(3).optional(),
}).refine(
    (data) => data.id,
    {
        message: "Address ID is required",
        path: ["id"]
    }
).refine(
    (data) => {
        return data.country !== undefined || 
               data.is_billing !== undefined || 
               data.is_default !== undefined || 
               data.is_shipping !== undefined || 
               data.line1 !== undefined || 
               data.line2 !== undefined || 
               data.state !== undefined || 
               data.zip !== undefined;
    },
    {
        message: "At least one field must be provided for update",
        path: ["_update"]
    }
);

/**
 * GET /api/current-user/addresses
 * 
 * Retrieves all addresses associated with the authenticated user.
 * 
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with array of addresses or error
 * 
 * @example Success Response
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "uuid",
 *       "user_id": "uuid",
 *       "line1": "123 Main St",
 *       "line2": "Apt 4B",
 *       "state": "NY",
 *       "zip": "10001",
 *       "country": "USA",
 *       "is_default": true,
 *       "is_shipping": true,
 *       "is_billing": false,
 *       "created_at": "2025-06-03T10:30:00Z",
 *       "updated_at": "2025-06-03T10:30:00Z"
 *     }
 *   ]
 * }
 */
export const GET = async (req: NextRequest) => {
    try {
        const session: Session | null = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized: No valid session found"
                },
                { status: 401 }
            );
        }

        // Query the database for all addresses belonging to the current user
        const { data: addresses, error } = await supabase
            .from("address")
            .select("*")
            .eq("user_id", session.user.id);

        // Handle database query errors
        if (error) {
            console.error("Error fetching addresses:", error);
            return NextResponse.json(
                {
                    success: false,
                    error: "Internal Server Error: Failed to fetch addresses"
                },
                { status: 500 }
            );
        }

        // Return addresses array to the client
        return NextResponse.json({
            success: true,
            data: addresses,
        });
    } catch (error: unknown) {
        // Log unexpected errors
        console.error("Error in GET /api/current-user/addresses:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error: Failed to fetch addresses"
            },
            { status: 500 }
        );
    }
}

/**
 * POST /api/current-user/addresses
 * 
 * Creates a new address for the authenticated user.
 * 
 * @param {NextRequest} req - The incoming request object with address data
 * @returns {Promise<NextResponse>} JSON response with created address or error
 * 
 * @example Request Body
 * {
 *   "line1": "123 Main St",
 *   "line2": "Apt 4B",
 *   "state": "NY",
 *   "zip": "10001",
 *   "country": "USA",
 *   "is_default": true,
 *   "is_shipping": true,
 *   "is_billing": false
 * }
 * 
 * @example Success Response
 * {
 *   "success": true,
 *   "data": {
 *     "id": "uuid",
 *     "user_id": "uuid",
 *     ... // all address fields
 *   }
 * }
 */
export const POST = async (req: NextRequest) => {
    try {
        const session: Session | null = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized: No valid session found"
                },
                { status: 401 }
            );
        }

        // Parse request body
        let body: Record<string, unknown>;
        try {
            body = await req.json();
        } catch (error: unknown) {
            return NextResponse.json(
                { success: false, error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        // Validate request data against schema
        const result = createAddressSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error.errors[0].message,
                },
                { status: 400 }
            );
        }

        // Insert new address into the database
        const { data: address, error } = await supabase
            .from("address")
            .insert({
                user_id: session.user.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ...result.data,
            })
            .select()
            .single();

        // Handle database errors
        if (error) {
            console.error("Error creating address:", error);
            return NextResponse.json(
                {
                    success: false,
                    error: "Internal Server Error: Failed to create address"
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: address,
        });
    } catch (error: unknown) {
        // Log unexpected errors
        console.error("Error in POST /api/current-user/addresses:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error: Failed to create address"
            },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/current-user/addresses
 * 
 * Updates an existing address for the authenticated user.
 * 
 * @param {NextRequest} req - The incoming request object with address update data
 * @returns {Promise<NextResponse>} JSON response with updated address or error
 * 
 * @example Request Body
 * {
 *   "id": "uuid", // Required
 *   "line1": "456 New St", // Optional - only include fields to update
 *   "state": "CA",
 *   "is_default": true
 * }
 * 
 * @example Success Response
 * {
 *   "success": true,
 *   "data": {
 *     "id": "uuid",
 *     "user_id": "uuid",
 *     ... // all address fields with updates applied
 *   }
 * }
 */
export const PUT = async (req: NextRequest) => {
    try {
        const session: Session | null = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized: No valid session found"
                },
                { status: 401 }
            );
        }

        // Parse request body
        let body: Record<string, unknown>;
        try {
            body = await req.json();
        } catch (error: unknown) {
            return NextResponse.json(
                { success: false, error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        // Validate request data against schema
        // Schema defined at the top of the file
        const result = updateAddressSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error.errors[0].message,
                },
                { status: 400 }
            );
        }

        // Prepare update object (only include fields that were provided)
        const updateData: AddressUpdateData = {
            updated_at: new Date().toISOString()
        };
        
        // Only include fields that were provided in the request
        if (result.data.country !== undefined) updateData.country = result.data.country;
        if (result.data.is_billing !== undefined) updateData.is_billing = result.data.is_billing;
        if (result.data.is_default !== undefined) updateData.is_default = result.data.is_default;
        if (result.data.is_shipping !== undefined) updateData.is_shipping = result.data.is_shipping;
        if (result.data.line1 !== undefined) updateData.line1 = result.data.line1;
        if (result.data.line2 !== undefined) updateData.line2 = result.data.line2;
        if (result.data.state !== undefined) updateData.state = result.data.state;
        if (result.data.zip !== undefined) updateData.zip = result.data.zip;
        
        // Update address in the database
        const { data: address, error } = await supabase
            .from("address")
            .update(updateData)
            .eq("id", result.data.id)
            // Also ensure this address belongs to the current user (security)
            .eq("user_id", session.user.id)
            .select()
            .single();

        // Handle database errors
        if (error) {
            console.error("Error updating address:", error);
            return NextResponse.json(
                {
                    success: false,
                    error: "Internal Server Error: Failed to update address"
                },
                { status: 500 }
            );
        }
        
        // Handle case where address was not found or doesn't belong to user
        if (!address) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Address not found or doesn't belong to you"
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: address,
        });
    } catch (error: unknown) {
        // Log unexpected errors
        console.error("Error in PUT /api/current-user/addresses:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error: Failed to update address"
            },
            { status: 500 }
        );
    }
}