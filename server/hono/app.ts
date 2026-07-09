import { Hono } from "hono";
import { health } from "./routes/health";

/**
 * The Hono app is mounted at /api via the hono/vercel adapter in
 * app/api/[[...route]]/route.ts. Add new resources as their own file under
 * server/hono/routes/ and compose them here, the same way `health` is.
 */
export const app = new Hono()
  .basePath("/api")
  .route("/health", health);

export type AppType = typeof app;
