# Dreamy Studio (monorepo)

This repository contains two workspaces managed with npm workspaces:

- `client/` — the frontend application
- `server/` — the backend server

Use the root scripts to run both apps or each individually:

- `npm run install:all` — install dependencies for all workspaces
- `npm run dev` — run both `client` and `server` dev scripts concurrently
- `npm run dev:client` — run only the client dev server
- `npm run dev:server` — run only the server dev server
