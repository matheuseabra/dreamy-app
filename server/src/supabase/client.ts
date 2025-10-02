import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Database } from './database.types';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

// Prefer service role key for server-side operations if provided. The service role
// key bypasses row-level security (RLS) and should only be set in server env vars.
const SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY/SUPABASE_SERVICE_ROLE_KEY environment variables");
}

// For server-side use we disable session persistence. Keep generic typed client.
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

export default supabase;
