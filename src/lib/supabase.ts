import { createClient, SupabaseClient } from "@supabase/supabase-js";

type EnvKey = "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY" | "SUPABASE_SERVICE_KEY";

const isBrowser = typeof window !== "undefined";

const getEnv = (key: EnvKey): string | undefined => {
  if (!isBrowser && typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }

  // Vite replaces import.meta.env.* at build time for the frontend
  if (typeof import.meta !== "undefined" && (import.meta as any).env) {
    return (import.meta as any).env[key] as string | undefined;
  }

  return undefined;
};

const requireEnv = (key: EnvKey): string => {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Missing Supabase environment variable: ${key}`);
  }
  return value;
};

let cachedClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!cachedClient) {
    const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
    const supabaseAnonKey = requireEnv("VITE_SUPABASE_ANON_KEY");
    cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return cachedClient;
};

export const getSupabaseAdminClient = (): SupabaseClient => {
  if (!cachedAdminClient) {
    const supabaseUrl = requireEnv("VITE_SUPABASE_URL");
    const serviceRoleKey = getEnv("SUPABASE_SERVICE_KEY");

    if (!serviceRoleKey) {
      throw new Error(
        "SUPABASE_SERVICE_KEY is not set. Admin operations (like POST /api/jobs and POST /api/applications) require this environment variable."
      );
    }

    cachedAdminClient = createClient(supabaseUrl, serviceRoleKey);
  }

  return cachedAdminClient;
};

