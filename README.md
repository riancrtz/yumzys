# Yumzys

Live site: https://riancrtz.github.io/yumzys/
API: https://yumzys-api.onrender.com
Demo video: (link, added in Week 3)

Claude (Anthropic's AI assistant) wrote or shaped most of the code in this project. I ran, tested, deployed and debugged it, set up the database, hosting and photo storage accounts, and wrote the type filter on the Home screen myself. The full record is in [AI-USAGE.md](./AI-USAGE.md).

<img width="1910" height="915" alt="final-login" src="https://github.com/user-attachments/assets/15f1169b-f47b-4187-8d5f-92e78292fad6" />
<img width="1910" height="1061" alt="final-home" src="https://github.com/user-attachments/assets/205e6542-93b2-4983-b844-cc435abbf660" />
<img width="1910" height="967" alt="final-home2" src="https://github.com/user-attachments/assets/607c6ef0-2dbc-4b74-9b4e-297a433b35a1" />
<img width="1910" height="1041" alt="final-addplace" src="https://github.com/user-attachments/assets/fb5f1eec-04ff-4a9b-8057-404e26e761bb" />
<img width="349" height="1144" alt="final-mobileview" src="https://github.com/user-attachments/assets/be2052c3-3567-4532-baf1-28f47602dac0" />

## 1. Overview

Yumzys is a restaurant and café bucket list app. It lets one person keep track of places around Angeles/Pampanga they want to try, mark them as visited once they have been, rate them, and attach a photo they took. It solves the everyday problem of deciding where to eat by keeping a running personal list instead of relying on memory or scattered chat messages.

## 2. Setup and installation

**What to install first:**
- Node.js (tested on v24.18.0) and npm (tested on v11.16.0)
- Git
- No local PostgreSQL install is needed. This project uses a free hosted Neon database.
- A free Cloudinary account, only if you want photo upload to work

**Get the code:**

    git clone https://github.com/riancrtz/yumzys.git
    cd yumzys

**Install dependencies** (client and server are separate):

    cd client
    npm install
    cd ../server
    npm install

**Environment and configuration.** Copy `.env.example` to `.env` in both `client/` and `server/`, then fill in real values. The real `.env` files are git-ignored and must never be committed.

Client (`client/.env`):

| Variable | Example value | What it is |
|---|---|---|
| `VITE_USE_MOCK_API` | `false` | `false` uses the real API. Unset or `true` uses simulated demo data stored in the browser. |
| `VITE_API_BASE_URL` | `http://localhost:3000` | Where the Express API is running, no trailing slash. |
| `VITE_CLOUDINARY_CLOUD_NAME` | `your-cloud-name` | Name of the Cloudinary account used for photo uploads. |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `your-preset-name` | Name of an unsigned upload preset in that account. |

Every `VITE_` value is compiled into the built JavaScript and is public. Never put a key, a password or a connection string in one.

Server (`server/.env`):

| Variable | Example value | What it is |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@ep-example.neon.tech/dbname?sslmode=require` | PostgreSQL connection string. Get your own from Neon. |
| `CORS_ORIGINS` | `http://localhost:5173` | Comma-separated origins allowed to call the API. |
| `NODE_ENV` | `development` | Set to `production` on the deployed host. |
| `ADMIN_USER` | `admin` | Username for the app's login gate. |
| `ADMIN_PASS` | `choose-a-real-password` | Password for the app's login gate. |
| `PORT` | (leave unset) | Set by the host. Do not set it yourself. |

**Set up and seed the database.** Once `DATABASE_URL` holds your own Neon (or other PostgreSQL) connection string:

    cd server
    npm run db:reset

This creates the `places` table and inserts four sample rows.

**Set up photo upload (optional).** In a free Cloudinary account, go to Settings, then Upload, then Upload presets, and add a preset with Signing mode set to Unsigned, a folder such as `yumzys`, and Allowed formats set to `jpg, jpeg, png, webp`. Put the account's cloud name and the preset name in `client/.env`. Without them the app still works, but the photo field says upload is not set up.

## 3. How to run it

    # Terminal 1, the API
    cd server
    npm run dev
    # -> API listening on http://localhost:3000

    # Terminal 2, the client
    cd client
    npm run dev
    # -> open http://localhost:5173

When it works, `http://localhost:5173` shows a login screen. Log in with the `ADMIN_USER` and `ADMIN_PASS` you set in `server/.env`, and you should see the places list with the four sample places (LALA Garden, Grill Seoul, John's Kitchen, Cafe Dia).

To run the client alone with no backend, leave `VITE_USE_MOCK_API` unset and skip the server. The app then runs in demo mode with a notice banner, and data stays in your browser.

## 4. Features and usage

- **Log in.** Required before anything else. A wrong password shows a message, and a server that is down or waking up shows its own message.
- **Home, Want to try, Visited.** The sidebar pages list all places, places to try, and visited places. Buttons above each list filter by type: all, restaurant, or cafe.
- **Photo slideshow.** On the lists, a place with several photos cycles through them every few seconds. It pauses when you hover over or tab to the card, and stays still if your device asks for reduced motion.
- **Add Place.** Add a restaurant or café with a name, type, area, status and notes. Type and status are pill choices. Choosing Visited shows a rating field and a photo upload for up to 5 photos.
- **Place page.** Click a card to open its page: a large photo, type and area, rating, status and notes, plus a photo gallery where clicking a thumbnail shows it large. Edit opens the same form, and Delete asks for confirmation in a popup.
- **Photos.** Only visited places can have photos, up to 5. Each one is shrunk in the browser, so a phone photo uploads small and its hidden location data is dropped, then uploaded to Cloudinary, and the returned link is saved with the place.

**API endpoints:**

| Method | Path | What it does |
|---|---|---|
| GET | `/healthz` | Is the server process alive. No login needed. |
| GET | `/readyz` | Is the database reachable. No login needed. |
| GET | `/api/places` | List all places. |
| GET | `/api/places/:id` | Get one place by id. |
| POST | `/api/places` | Create a place. |
| PUT | `/api/places/:id` | Update a place. |
| DELETE | `/api/places/:id` | Delete a place. |

All `/api/places` routes require login (HTTP Basic Auth). The server validates every field, and photo links must start with `https://`.

## 5. Project structure

    client/
      src/api/            one interface, two implementations, chosen by a variable
        index.js           picks the mock or real API from VITE_USE_MOCK_API
        mockApi.js          simulated backend, stores data in localStorage
        httpApi.js          real API calls, holds the login in memory
        seed.json           starter places for demo mode
      src/components/
        DemoNotice.jsx     banner shown while running in demo mode
      src/App.jsx           login, list, detail and form screens
      src/uploadPhoto.js    shrinks a photo and uploads it to Cloudinary
      src/styles.css        design system tokens and layout
    server/
      db/
        pool.js             PostgreSQL connection pool
        run.js              runs a .sql file against DATABASE_URL
        schema.sql          the places table
        seed.sql            sample places
      placesRepo.js         parameterized queries for the places table
      server.js             Express app: routes, validation, Basic Auth
    docs/                   planning documents and weekly reports
    .github/workflows/      deploys the client to GitHub Pages

## 6. Screenshots

[Replace the placeholders at the top of this file with screenshots of the running app: the Home screen, the place detail page, and the Add Place form.]

## 7. Known issues and next steps

- Uploaded photos have public links. Anyone who has a link can open that picture.
- The Cloudinary upload preset is unsigned, so anyone who finds its name in the built site could upload an image of an allowed type to my account. The preset only accepts jpg, jpeg, png and webp, and the account is on the free plan with no card attached.
- Removing a photo from a place, or deleting a place, only removes the link. The file stays in Cloudinary.
- The app connects to the database as Neon's default owner role, which has more permissions than the app needs.
- The login is one shared account kept in memory, so refreshing the page asks for the login again.
- The API runs on a free Render instance that sleeps when idle, so the first request after a break can take up to a minute.

**What I would do next:**
- Create a scoped-down database role instead of using the default owner.
- Delete the Cloudinary file when a photo is removed, through a signed request from the server.
- Change the status and add photos directly on the place page, as in my wireframe, without opening Edit.
- Show photos of the real place through the Google Places API, which needs a billing account and a spending quota.

## Access control

This app has no user accounts and is built for one person. Every `/api/places` route is protected by a login: HTTP Basic Auth on the server, with an in-app login screen on the client. The browser's native login popup was tried first, but it does not carry over reliably when the client and API are on different origins, especially in private windows.

Credentials for grading are in the private workspace `project/README.md`, not here, because this repository is public.

## Deploying

**Client, to GitHub Pages.** Wired up in `.github/workflows/deploy-pages.yml`. Under Settings, then Pages, the source is GitHub Actions. Under Settings, then Secrets and variables, then Actions, then Variables, these four are set: `VITE_USE_MOCK_API`, `VITE_API_BASE_URL`, `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`. They are compiled in at build time, so the workflow must be run again after any change. The build only runs on changes inside `client/` or to the workflow file, or by hand with Run workflow.

**API, to Render.** Root directory `server`, build command `npm install`, start command `npm start`. The environment variables from the server table above are set in Render's dashboard.

**Database, on Neon.** A free Neon project, with the schema and sample data applied once using `npm run db:reset` against its connection string.

## Author

6APSI, Holy Angel University

## Licence

MIT, see LICENSE.
