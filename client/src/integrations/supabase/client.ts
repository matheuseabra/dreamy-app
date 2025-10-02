import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bwybnmxqmqvyfrssrkpu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3eWJubXhxbXF2eWZyc3Nya3B1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNzkxMTQsImV4cCI6MjA3NDc1NTExNH0.zu2Q28hYH3HIUHvD_VBqswuUuNoJ6LyGV4vWhwDIoWQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});