# NextPearlJs

The modular Next.js starter that installs only what you use.

```bash
pnpm install
pnpm run setup   # answer yes/no per module — a "no" installs nothing
pnpm dev
```

Full documentation — tech stack, the module toggle system, quickstart, architecture, FAQ — lives on the app's own showcase page (`app/page.tsx`), run `pnpm dev` and open `http://localhost:3000`.

Add a module later without re-scaffolding: `pnpm run add:database`, `add:auth`, `add:analytics`, or `add:monitoring`.

See `.claude/skills/` for the design and architecture conventions this template follows.

MIT licensed.
