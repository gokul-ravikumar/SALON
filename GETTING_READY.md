# Getting Ready

A short checklist to get the project running locally. Full detail lives in
[`README.md`](README.md).

## Before you start

- [ ] **Node.js 20.19+ or 22.12+** installed — check with `node -v`
- [ ] **npm** available — `npm -v`
- [ ] **MongoDB** — either a local `mongod` running, or a MongoDB Atlas
      connection string ready
- [ ] **Brevo** API key + verified sender address
      — *or* plan to use the "verify in MongoDB" shortcut in step 6

## First run (~10 minutes)

Use two terminals — one for the API, one for the web app.

**Terminal 1 — backend**

```bash
cd backend
npm install
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
```

Open `backend/.env` and fill in:

- `MONGO_URI` — your database connection string
- `JWT_SECRET` — any long random string
- `PORT=5000` — must match the frontend (see troubleshooting)
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` — for outgoing email

```bash
npm run seed     # optional — loads 8 sample services
npm run dev      # expect: "MongoDB Connected …" and "Server running on port 5000"
```

**Terminal 2 — frontend**

```bash
cd frontend
npm install
npm run dev      # Vite serves on http://localhost:5173
```

`frontend/.env` is already set to `http://localhost:5000`.

**Then, in the browser:**

5. Open http://localhost:5173 and **register** an account.
6. **Verify the email** — click the link in the Brevo email, or (local dev) set
   `isEmailVerified: true` on your user document in MongoDB. Login returns `403`
   until this is done.
7. **Log in.** Optionally set `role: "admin"` (or `"staff"`) on your user in
   MongoDB to reach those dashboards — new users are `customer`.

## If something's off

- **Frontend can't reach the API** — the backend `PORT` and the
  `VITE_API_BASE_URL` in `frontend/.env` must be the same port. `.env.example`
  suggests `6000`; keep everything on `5000`.
- **`register` returns a 500** — the verification email failed to send (Brevo key
  or sender not set). The user is still created; verify it in MongoDB and move on.
- **`MongoDB` connection fails on startup** — check `MONGO_URI`, and that your
  local `mongod` / Atlas IP allowlist is reachable.
- **`node -v` too low** — Vite 8 needs Node 20.19+ or 22.12+.

## Next

- [`README.md`](README.md) — architecture, env vars, npm scripts, full API reference
- [`frontend/DESIGN.md`](frontend/DESIGN.md) — the design system
