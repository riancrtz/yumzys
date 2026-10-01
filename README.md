# Yumzys

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

Live site: https://riancrtz.github.io/yumzys-final-project-template/
API: https://yumzys-api.onrender.com
Demo video: (link, added in Week 3)

This project was built with AI assistance. See [AI-USAGE.md](./AI-USAGE.md)
for the full record.

<img width="1535" height="814" alt="yumzys week 2 - 1" src="https://github.com/user-attachments/assets/d41dc3cd-c5ef-4ad3-a17a-07624b7cf919" />
<img width="1910" height="1746" alt="yumzys week 2 - 2" src="https://github.com/user-attachments/assets/5d832973-8b70-4549-ab7d-c363bfbe9e38" />
<img width="1910" height="1125" alt="yumzys week 2 - 3" src="https://github.com/user-attachments/assets/912466f0-c563-4f28-add7-ebdb2124be25" />
<img width="1910" height="1041" alt="yumzys week 2 - 4" src="https://github.com/user-attachments/assets/2450f6dd-93d9-4931-a1ea-e6e8c36d7961" />
<img width="1910" height="945" alt="yumzys week 2 - 5" src="https://github.com/user-attachments/assets/bfcd80b9-4f63-446d-8895-fa6cd60e00cb" />

## 1. Overview

Yumzys is a restaurant and café bucket list app. It lets one person keep track
of places they want to try around Angeles/Pampanga, mark them as visited once
they've been, and rate them afterward. It solves the everyday problem of
deciding where to eat by keeping a running personal list instead of relying
on memory or scattered chat messages.

## 2. Setup and installation

**What to install first:**
- Node.js (tested on v24.18.0) and npm (tested on v11.16.0)
- Git
- No local PostgreSQL install is required, this project uses a free hosted
  Neon database instead

**Get the code:**

    git clone https://github.com/riancrtz/yumzys-final-project-template.git
    cd yumzys-final-project-template

**Install dependencies** (client and server are separate):

    cd client
    npm install
    cd ../server
    npm install

**Environment and configuration.** Copy `.env.example` to `.env` in both
`client/` and `server/`, then fill in real values. Never commit the real
`.env` files, they are already git-ignored.

Client (`client/.env`):

| Variable | Example value | What it is |
|---|---|---|
| `VITE_USE_MOCK_API` | `false` | `false` uses the real API; unset or `true` uses simulated demo data |
| `VITE_API_BASE_URL` | `http://localhost:3000` | where the Express API is running |

Server (`server/.env`):

| Variable | Example value | What it is |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-example.neon.tech/dbname?sslmode=require` | PostgreSQL connection string (get your own from Neon) |
| `CORS_ORIGINS` | `http://localhost:5173` | comma-separated origins allowed to call the API |
| `NODE_ENV` | `development` | `production` on a deployed host |
| `ADMIN_USER` | `admin` | username for the app's login gate |
| `ADMIN_PASS` | `choose-a-real-password` | password for the app's login gate |

**Set up and seed the database.** Once `DATABASE_URL` is filled in with your
own Neon (or other PostgreSQL) connection string:

    cd server
    npm run db:reset

This creates the `places` table and inserts four sample rows.

## 3. How to run it

    # Terminal 1, the API
    cd server
    npm run dev
    # -> API listening on http://localhost:3000

    # Terminal 2, the client
    cd client
    npm run dev
    # -> open http://localhost:5173

When it works, opening `http://localhost:5173` shows a login screen. Log in
with the `ADMIN_USER` / `ADMIN_PASS` you set in `server/.env`, and you should
see the Home screen with a list of places (LALA Garden, Grill Seoul, John's
Kitchen, Cafe Dia, if you used the seed data as-is).

To run the client alone with no backend, use demo mode instead: set
`VITE_USE_MOCK_API` to anything other than `false` (or leave it unset), and
skip the server entirely.

## 4. Features and usage

- **Log in** - required before anything else, since the app has no separate
  guest mode
- **Home** - view all saved places, filter by All / Want to Try / Visited
- **Visited** - view only places marked as visited
- **Add Place** - add a new restaurant or café, with a name, type
  (restaurant/café), area, status (want to try/visited), and notes. If
  status is set to visited, a rating field also appears
- **Delete** - remove a place from the list

**API endpoints:**

| Method | Path | What it does |
|---|---|---|
| GET | `/healthz` | is the server process alive |
| GET | `/readyz` | is the database reachable |
| GET | `/api/places` | list all places |
| GET | `/api/places/:id` | get one place by id |
| POST | `/api/places` | create a new place |
| PUT | `/api/places/:id` | update a place |
| DELETE | `/api/places/:id` | delete a place |

All `/api/places` routes require login (HTTP Basic Auth), `/healthz` and
`/readyz` do not.

## 5. Project structure

    client/
      src/api/          one interface, two implementations, chosen by a variable
        index.js         picks mock or real API based on env variable
        mockApi.js        simulated backend, stores data in localStorage
        httpApi.js         real API calls, holds login credentials in memory
        seed.json          starter place data (demo mode only)
      src/components/
        DemoNotice.jsx    banner shown while running in demo mode
      src/App.jsx          main app: login screen, Home, Visited, Add Place
    server/
      db/
        pool.js            PostgreSQL connection pool
        run.js              runs a .sql file against DATABASE_URL
        schema.sql          the places table
        seed.sql            sample places
      placesRepo.js         parameterized queries: getAll, getById, create, update, remove
      server.js             Express app: routes, validation, Basic Auth middleware
    docs/                   planning documents and weekly reports

## 6. Screenshots

See the two screenshots at the top of this file, showing the Home screen with
the place list, filters, and navigation.

## 7. Known issues and next steps

- No photo upload yet, the data model supports a `photos` field, but there's
  no upload UI built
- No Place Detail screen yet, places can only be added or deleted from the
  list, there's no way to view or edit one place's full info
- Styling still uses the template's default look, my own design system
  (colors, type scale, spacing) hasn't been applied yet
- The database user the app connects as (`neondb_owner`) has full owner
  privileges rather than being scoped down to only what the app needs

**What I would do next:**
- Build the Place Detail screen with a photo gallery
- Apply my design system's colors, type, and spacing to the actual interface
- Create a scoped-down database role instead of using the default owner

## Access control

This app has no user accounts, it's built for one person. Every `/api/places`
route is protected by a login (HTTP Basic Auth on the server, with an in-app
login screen on the client, since the browser's native login popup doesn't
work reliably once the client and API are on different origins, especially
in private/incognito windows).

Credentials for grading are in the private workspace `project/README.md`, not
here, since this repository is public.

## Deploying

**Client, to GitHub Pages.** Already wired up in
`.github/workflows/deploy-pages.yml`. Settings > Pages > Build and deployment
> Source: GitHub Actions. `VITE_USE_MOCK_API` and `VITE_API_BASE_URL` are set
under Settings > Secrets and variables > Actions > Variables, then the
workflow is re-run to rebuild with them baked in.

**API, to Render.** Root directory `server`, build command `npm install`,
start command `npm start`. Environment variables set in Render's dashboard.

**Database, on Neon.** A free Neon project, schema and seed data applied once
with `npm run db:reset` pointed at its connection string.

## Author

6APSI, Holy Angel University

## Licence

MIT, see LICENSE.
