export const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_STORAGE_BUCKET"
] as const;

export function getMissingEnvVars() {
  return REQUIRED_ENV_VARS.filter((name) => !process.env[name]);
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}
