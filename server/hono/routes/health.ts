import { Hono } from "hono";

export const health = new Hono().get("/", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);
