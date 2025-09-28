# Backend Test Templates Guide

These are test templates meant to help increase backend coverage using Bun Test + Elysia + Eden Treaty.

Important: Do not keep TypeScript test files inside the UI package. Importing bun:test, Elysia, or backend files from the UI may break the frontend toolchain. These templates are provided as Markdown files with code blocks. Copy the snippets into your backend/test/ folder.

Recommended steps:
1. Create or open `backend/test/` in your repository.
2. Copy the code snippets from the `.template.md` files in this folder into real `.test.ts` files inside `backend/test/`.
3. Adjust import paths (e.g., `../src/...`) to match your backend structure.
4. Add any required mocks (DB, env vars, helper functions).
5. Run tests with coverage from backend folder: `bun test --coverage` or `bun test backend/test --coverage`.

Coverage strategy to reach ~80%:
- Add tests for all API routes (happy path + validation errors + 404s + 500s) using Eden Treaty or direct `app.handle(Request)`.
- Test middleware/guards (unauthorized vs authorized flows).
- Add unit tests for utilities/validators with deterministic inputs/outputs.
- Ensure error branches are exercised (invalid input, missing env, downstream failures).

Files in this directory:
- `auth.test.template.md` – Auth config route (normal + missing env).
- `routes.error.test.template.md` – Route validation and error handling (400/422, 404, 500 paths).
- `integration.enhanced.test.template.md` – Integration-like tests for core endpoints.
- `middleware.test.template.md` – Auth guard/middleware behavior.

Note on imports:
- Replace placeholder imports (e.g., `../src/routes/auth`, `../src/server`, `../src/middleware/auth`) with your actual backend file paths.
- If your app creation function differs (e.g., returns an Elysia instance or a handler), adjust the invocation accordingly.
