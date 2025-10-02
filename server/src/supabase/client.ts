import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Database } from './database.types';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_KEY ?? "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY environment variables");
}

const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
