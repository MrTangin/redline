import { z } from "zod";
import { projectConfig, type ModuleName } from "./project.config";

/**
 * One Zod schema per module, listing exactly the env vars that module
 * needs to function. A module that is disabled never has its schema
 * evaluated, so its vars are never required.
 */
const moduleSchemas = {
  database: z.object({
    SUPABASE_URL: z.string().min(1),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  }),
  auth: z.object({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    CLERK_SECRET_KEY: z.string().min(1),
  }),
  analytics: z.object({
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
  }),
  monitoring: z.object({
    NEXT_PUBLIC_SENTRY_DSN: z.string().min(1),
  }),
} as const satisfies Record<ModuleName, z.ZodType>;

type ModuleEnv<M extends ModuleName> = z.infer<(typeof moduleSchemas)[M]>;

function readModuleEnv<M extends ModuleName>(moduleName: M): ModuleEnv<M> {
  const schema = moduleSchemas[moduleName];
  const result = schema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues.map((issue) => issue.path.join("."));
    throw new Error(
      `[lib/env] Module "${moduleName}" is enabled in lib/project.config.ts but is missing required ` +
        `environment variable(s): ${missing.join(", ")}. Set them in .env.local, or set ` +
        `modules.${moduleName} back to false in lib/project.config.ts.`,
    );
  }

  return result.data as ModuleEnv<M>;
}

/** Throws a descriptive error for the first enabled module with missing env vars. */
export function validateEnv(): void {
  for (const moduleName of Object.keys(projectConfig.modules) as ModuleName[]) {
    if (projectConfig.modules[moduleName]) {
      readModuleEnv(moduleName);
    }
  }
}

function requireModule<M extends ModuleName>(moduleName: M): ModuleEnv<M> {
  if (!projectConfig.modules[moduleName]) {
    throw new Error(
      `[lib/env] Tried to read env for module "${moduleName}", but it is disabled in lib/project.config.ts.`,
    );
  }
  return readModuleEnv(moduleName);
}

export const getDatabaseEnv = () => requireModule("database");
export const getAuthEnv = () => requireModule("auth");
export const getAnalyticsEnv = () => requireModule("analytics");
export const getMonitoringEnv = () => requireModule("monitoring");
