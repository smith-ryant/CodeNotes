// src/supabaseClient.js
// Date and Time: 2024-08-06 17:30:00

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or Anon Key not set in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Disable session persistence
    autoRefreshToken: false, // Optionally disable auto-refresh
  },
});

console.log("Supabase client initialized:", supabaseUrl);
