import { createClient, SupabaseClient } from "@supabase/supabase-js";

const getEnv = (key: string): string | undefined => {
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  if (typeof import.meta !== "undefined" && (import.meta as any).env) {
    return (import.meta as any).env[key] as string | undefined;
  }
  return undefined;
};

let cachedClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!cachedClient) {
    const url = getEnv("VITE_SUPABASE_URL")!;
    const key = getEnv("VITE_SUPABASE_ANON_KEY")!;
    cachedClient = createClient(url, key);
  }
  return cachedClient;
};

export const getSupabaseAdminClient = (): SupabaseClient => {
  if (!cachedAdminClient) {
    const url = getEnv("VITE_SUPABASE_URL")!;
    const key = getEnv("SUPABASE_SERVICE_KEY")!;
    cachedAdminClient = createClient(url, key);
  }
  return cachedAdminClient;
};