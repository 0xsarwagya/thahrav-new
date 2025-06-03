import type NextAuth from "next-auth";
import type { User } from "@/types/supabase";

declare module "next-auth" {
    interface Session {
        id: string;
        expires: string;
        sessionToken: string;
        userId: string;
        user: User;
    }
}