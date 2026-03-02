import { createClient, SupabaseClient } from "@supabase/supabase-js";

const getEnv = (key: string): string | undefined => {
  if (typeof process !== "undefined" && typeof process.env !== "undefined" && key in process.env) {
    return process.env[key];
  }
  if (typeof import.meta !== "undefined" && (import.meta as any).env) {
    const env = (import.meta as any).env as Record<string, string | undefined>;
    if (Object.prototype.hasOwnProperty.call(env, key)) {
      return env[key];
    }
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