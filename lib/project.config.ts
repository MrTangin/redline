/**
 * Single source of truth for which optional modules are enabled.
 *
 * Nothing outside this file should hardcode a module's on/off state.
 * `pnpm run setup` and `pnpm run add:<module>` write to this file —
 * you generally shouldn't hand-edit it unless you're changing your mind
 * about a module after the fact.
 */
export const projectConfig = {
  modules: {
    database: false, // Supabase
    auth: false, // Clerk
    analytics: false, // PostHog
    monitoring: false, // Sentry
  },
} as const;

export type ModuleName = keyof typeof projectConfig.modules;
