# DaddyOm — Salon Management System

A full-stack management app for a hair studio. It provides account sign-up with
email verification, JWT authentication, role-based dashboards (customer / staff /
admin), and a service directory with full create / read / update / delete.

The repository holds two independent applications:

| Folder      | What it is                                             |
| ----------- | ------------------------------------------------------ |
| `backend/`  | REST API — Express 5, TypeScript, MongoDB (Mongoose)  |
| `frontend/` | Single-page app — React 19, TypeScript, Vite, Tailwind |

There is no root `package.json`; each app is installed and run on its own.

---

## Tech stack

### Backend (`backend/`)

- **Runtime:** Node.js + Express 5, TypeScript (`module: NodeNext`, compiled to `dist/`)
- **Database:** MongoDB via Mongoose 9
- **Auth:** `jsonwebtoken` (Bearer tokens), `bcrypt` password hashing
- **Validation:** Zod schemas, applied by a `validateRequest` middleware
- **Email:** Brevo transactional email HTTP API (verification + password-reset links)
- **Dev tooling:** `nodemon` + `ts-node`

### Frontend (`frontend/`)

- **Framework:** React 19 + TypeScript, bundled by Vite 8
- **Routing:** React Router 7
- **Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (no PostCSS), "Midnight Luxe" dark theme
- **State:** Zustand 5, auth store persisted to `localStorage` (`salon-auth`)
- **Forms:** React Hook Form 7 + Zod 4 (`@hookform/resolvers`)
- **UI:** `@animateicons/react` icons, `react-toastify`, `class-variance-authority` +
  `clsx` + `tailwind-merge` (`cn` helper in `src/lib/utils.ts`)
- **Lint:** `oxlint`

---

## Repository structure

```
SALON/
├── backend/
│   └── src/
│       ├── server.ts            # entry — connect DB, then app.listen(PORT)
│       ├── app.ts               # Express app, CORS + JSON, route mounting
│       ├── seed.ts              # `npm run seed` — inserts sample services
│       ├── config/              # db connection, Brevo config
│       ├── routes/              # auth.routes.ts, service.routes.ts
│       ├── controllers/         # request/response handlers
│       ├── services/            # business logic (auth, services, email/)
│       ├── repositories/        # Mongoose data-access helpers
│       ├── models/              # User, Service schemas
│       ├── middlewares/         # protect (JWT), validateRequest (Zod), errorHandler
│       ├── validators/          # Zod request schemas
│       ├── templates/email/     # HTML email templates
│       └── utils/               # ApiError, asyncHandler, token helpers
│
└── frontend/
    ├── index.html
    ├── vite.config.ts           # React + Tailwind plugins, `@` → src alias
    ├── DESIGN.md                # design-system tokens ("Midnight Luxe")
    ├── docs/TAILWIND_SETUP.md   # styling foundation notes
    └── src/
        ├── main.tsx             # React root, BrowserRouter, ToastContainer
        ├── App.tsx              # route table (public vs protected, role routing)
        ├── pages/               # one component per route
        ├── components/
        │   ├── auth/            # auth-form building blocks
        │   ├── layout/          # shells, headers, sidebar, nav
        │   ├── ui/              # buttons, cards, modals, icons, …
        │   └── services/        # service create/edit modal
        ├── lib/                 # api.ts (fetch wrapper), utils.ts (cn)
        ├── services/            # typed API clients (auth, service)
        ├── schemas/             # Zod form validators
        ├── store/               # Zustand auth store
        └── styles/              # index/base/theme/utilities CSS
```

---

## Prerequisites

- **Node.js 20.19+ or 22.12+** (required by Vite 8) and npm
- **MongoDB** — a local `mongod` instance or a MongoDB Atlas connection string
- **Brevo account** — API key + a verified sender address, needed for the email
  verification and password-reset flows. See the local-dev shortcut in
  [Notes & known issues](#notes--known-issues) if you want to skip this at first.

---

## Setup & running

Run the backend and the frontend in two terminals.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env          # PowerShell: Copy-Item .env.example .env
```

Edit `backend/.env` and set at least:

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `PORT=5000` — **the frontend expects the API on port 5000** (see the port note below)
- `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` — for outgoing email

Then:

```bash
npm run seed     # optional — loads 8 sample services if the collection is empty
npm run dev      # starts the API with auto-reload
```

You should see `MongoDB Connected: …` and `Server running on port 5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

`frontend/.env` is committed and already points at `http://localhost:5000`. Open
the app at **http://localhost:5173**.

### 3. First user

1. **Register** at `/register`.
2. **Verify the email** — click the link from the Brevo email, or (local dev) set
   `isEmailVerified: true` on your user document in MongoDB. Login is rejected with
   `403` until the email is verified.
3. **Log in** at `/login`. You land on the role dashboard for your account.
4. To see the **staff** or **admin** dashboard, set `role` to `"staff"` or
   `"admin"` on your user document in MongoDB (new users are `"customer"`).

---

## Environment variables

### Backend — `backend/.env` (from `backend/.env.example`)

| Variable                         | Required | Default                 | Purpose                                            |
| -------------------------------- | -------- | ----------------------- | ------------------------------------------------- |
| `MONGO_URI`                      | yes      | —                       | MongoDB connection string                         |
| `JWT_SECRET`                     | yes      | —                       | Signing secret for auth tokens                    |
| `JWT_EXPIRES_IN`                 | no       | `7d`                    | Token lifetime                                    |
| `PORT`                           | no       | `5000` (code fallback)  | API port — set to `5000` to match the frontend    |
| `BREVO_API_KEY`                  | for email| —                       | Brevo transactional-email API key                 |
| `BREVO_SENDER_EMAIL`             | for email| —                       | Verified Brevo sender address                     |
| `BREVO_SENDER_NAME`              | no       | `Salon`                 | Sender display name                               |
| `FRONTEND_URL`                   | no       | `http://localhost:5173` | Base URL used to build links inside emails        |
| `EMAIL_VERIFICATION_EXPIRY_HOURS`| no       | `24`                    | Verification-link lifetime                        |
| `PASSWORD_RESET_EXPIRY_HOURS`    | no       | `1`                     | Password-reset-link lifetime                      |

### Frontend — `frontend/.env`

| Variable            | Required | Default                 | Purpose                        |
| ------------------- | -------- | ----------------------- | ------------------------------ |
| `VITE_API_BASE_URL` | yes      | `http://localhost:5000` | Base URL the SPA calls the API |

---

## npm scripts

### Backend

| Script          | Action                                                       |
| --------------- | ---------------------------------------------------------- |
| `npm run dev`   | `nodemon` → `ts-node src/server.ts` (watch + reload)         |
| `npm run build` | `tsc` → compile to `dist/`                                   |
| `npm start`     | `node dist/server.js` (run the compiled build)              |
| `npm run seed`  | `ts-node src/seed.ts` — insert sample services if none exist |

### Frontend

| Script            | Action                                     |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Vite dev server on port 5173               |
| `npm run build`   | `tsc -b && vite build` → `dist/`           |
| `npm run preview` | Serve the production build locally         |
| `npm run lint`    | `oxlint`                                   |

---

## API reference

Base URL: `http://localhost:5000`. No `/api` prefix. Authenticated requests send
`Authorization: Bearer <token>` (the token returned by `POST /auth/login`).

| Method | Path                       | Auth   | Body / query                         | Purpose                                  |
| ------ | -------------------------- | ------ | ------------------------------------ | --------------------------------------- |
| GET    | `/`                        | —      | —                                    | Health check (`"Salon API Running"`)     |
| POST   | `/auth/register`           | —      | `name, email, phone, password`       | Create account, send verification email  |
| POST   | `/auth/login`              | —      | `email, password`                    | Returns `{ user: { …, token } }` (needs verified email) |
| GET    | `/auth/verify-email`       | —      | `?token=`                            | Mark the account email as verified       |
| POST   | `/auth/resend-verification`| —      | `email`                              | Re-send the verification email           |
| POST   | `/auth/forgot-password`    | —      | `email`                              | Send a password-reset link               |
| POST   | `/auth/reset-password`     | —      | `password, token`                    | Set a new password from a reset link     |
| GET    | `/auth/me`                 | Bearer | —                                    | Current user `{ id, name, email, phone, role }` |
| GET    | `/services`                | —      | —                                    | List all services                        |
| POST   | `/services`                | Bearer | `title, description, category, duration, price` | Create a service              |
| PUT    | `/services/:id`            | Bearer | same as create                       | Replace a service                        |
| DELETE | `/services/:id`            | Bearer | —                                    | Delete a service                         |

`duration` is a human string such as `"45 min"` or `"1h 30m"`. `price` is a number.

---

## Design system

The frontend ships its own design documentation:

- [`frontend/DESIGN.md`](frontend/DESIGN.md) — the "Midnight Luxe" palette and Material-style color tokens
- [`frontend/docs/TAILWIND_SETUP.md`](frontend/docs/TAILWIND_SETUP.md) — Tailwind v4 setup and the component patterns built on it

---

## Notes & known issues

- **Port mismatch.** `backend/.env.example` ships `PORT=6000`, but the code falls
  back to `5000` and `frontend/.env` targets `http://localhost:5000`. Set the
  backend `PORT=5000`, or change `VITE_API_BASE_URL` in `frontend/.env` to
  whatever port you run the API on.
- **Registration needs a working Brevo key.** `POST /auth/register` fails if the
  verification email can't be sent — but the `User` document is still created
  (unverified). For local development without Brevo, register once, then set
  `isEmailVerified: true` on that user in MongoDB and log in normally.
- **Role dashboards.** New users are `customer`. Change `role` to `staff` or
  `admin` in MongoDB to reach those dashboards.
- **No automated tests yet** in either app (the backend `test` script is a stub).
- `frontend/README.md` is the leftover Vite template readme — this file supersedes it.

For a quick, no-prose checklist, see [`GETTING_READY.md`](GETTING_READY.md).
