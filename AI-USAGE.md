# AI usage

This project was built with AI assistance. This file is the record of it. It is
graded as the finals badge, and it is worth 100 points.

## 1. How I used AI

### 2026-09-19 - Setting up GitHub Pages deployment
- **Tool:** Claude
- **What I asked for:** Help getting my cloned repository deployed live on GitHub Pages for the first time.
- **What it gave back:** Step-by-step instructions to make the repo public, switch Pages source to GitHub Actions, and trigger the deploy workflow manually since my first push didn't touch the `client/` folder that the workflow watches.
- **What I kept, what I changed, and why:** Followed the steps exactly. When the first deploy still failed, I pasted the Actions log back and was told the failure predated the Pages source setting being switched on, so I re-ran the workflow manually and it succeeded.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/34c2275

### 2026-09-19 - Fixing Git push authentication
- **Tool:** Claude
- **What I asked for:** My first `git commit` failed because Git didn't recognize my identity, and my first `git push` failed with an authentication error.
- **What it gave back:** Instructions to set `git config user.name` and `user.email` (using my GitHub no-reply email for privacy), and two options for push authentication (GitHub CLI or a personal access token).
- **What I kept, what I changed, and why:** Set my Git identity as instructed. For authentication, I used `gh auth login` (GitHub CLI) rather than a personal access token, since it required less manual setup.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/34c2275

### 2026-09-19 - Replacing the demo app with Yumzys
- **Tool:** Claude
- **What I asked for:** Help rewriting the template's demo "sightings" app into my actual Yumzys screens (Home, Visited, Add Place), including the mock API files.
- **What it gave back:** Full rewrites of `seed.json`, `mockApi.js`, `httpApi.js`, `index.js`, and `App.jsx`, renaming every function and field from "sighting" to "place" and matching my proposal's data shape.
- **What I kept, what I changed, and why:** I kept the overall structure as given, since it matched the template's existing pattern (one interface, two implementations). I changed the seed data to real restaurants/cafés I actually want to try instead of the AI's first suggestion.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/5339c03

### 2026-09-19 - Debugging a blank white screen
- **Tool:** Claude
- **What I asked for:** The app showed a blank white screen after the App.jsx rewrite, and I didn't know why.
- **What it gave back:** Told me to check the browser console for the exact error, which showed one leftover import line still referencing the old function names.
- **What I kept, what I changed, and why:** Fixed the one import line as instructed. This taught me to check the console first instead of guessing.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/5339c03

### 2026-09-23 - Writing the places database schema
- **Tool:** Claude
- **What I asked for:** Help converting the template's `sightings` table into a `places` table matching my app's data (name, type, area, status, rating, notes, photos).
- **What it gave back:** A rewritten `schema.sql` with a `places` table, a status index, and a rewritten `seed.sql` with my real seed places.
- **What I kept, what I changed, and why:** Kept the structure and constraints (CHECK on type/status, rating range) as given, since they matched what I'd already decided in my proposal.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/f13fefa

### 2026-09-23 - Writing the Express API and repo layer
- **Tool:** Claude
- **What I asked for:** Help rewriting `sightingsRepo.js` and `server.js` to use the new `places` table, including adding a security gate my professor required.
- **What it gave back:** A new `placesRepo.js` with parameterized queries, a rewritten `server.js` with `/api/places` routes and HTTP Basic Auth middleware.
- **What I kept, what I changed, and why:** Kept the parameterized query pattern exactly as given, since it matched what I learned in M5 about SQL injection. Later changed the auth approach itself (see Part 2).
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/f13fefa

### 2026-09-23 - First attempt at securing the API with Basic Auth
- **Tool:** Claude
- **What I asked for:** How to implement the security gate my professor required, since the app has no login system.
- **What it gave back:** A plan to send Basic Auth credentials from the client using `VITE_` environment variables, and rely on the browser's native login popup for production.
- **What I kept, what I changed, and why:** This approach turned out to be flawed (see Part 2, Cases 1 and 2). I ended up removing the baked-in credentials and replacing the native-popup approach with an in-app login screen instead.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/6439d6b

### 2026-09-23 - Building an in-app login screen
- **Tool:** Claude
- **What I asked for:** After discovering the native browser login didn't work reliably in incognito windows, I asked for a more reliable fix.
- **What it gave back:** A `LoginScreen` component that stores credentials in memory and attaches them to every API request manually, instead of relying on the browser's own auth caching.
- **What I kept, what I changed, and why:** Kept the whole approach, since testing confirmed it worked correctly across regular and incognito windows, which the previous approach did not.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/7c3d1a8

## 2. Where the AI got it wrong

### Case 1 - Baking admin credentials into the client build
- **What it gave me:** A version of `httpApi.js` that read `VITE_ADMIN_USER` and `VITE_ADMIN_PASS` from environment variables and sent them as an Authorization header on every request, suggested as a way to test the real API locally.
- **What was wrong with it:** `VITE_` variables get compiled directly into the built JavaScript, which is public. This would have exposed the actual admin password to anyone who opened the deployed site's source, a real security flaw for something meant to gate write access to my database.
- **What I did instead:** Reverted `httpApi.js` to not send an Authorization header at all, and later replaced this whole approach with an in-app login screen that holds credentials in memory only.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/6439d6b

### Case 2 - Claiming the browser's native Basic Auth popup would work reliably in production
- **What it gave me:** The suggestion that once deployed, the browser's own login popup (triggered by a 401 response) would handle authentication for the whole app, no extra code needed.
- **What was wrong with it:** This didn't work reliably once the client and API were on two different origins (GitHub Pages vs Render). Modern browsers partition cached Basic Auth credentials by top-level site, especially in private/incognito windows, so a login on the API's origin didn't carry over to the client's background requests.
- **What I did instead:** Tested this myself in an incognito window, found it broke, and asked for a proper fix, an in-app login screen that manages credentials directly instead of relying on browser auth caching.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/7c3d1a8

### Case 3 - Adding CORS `credentials: true` that turned out to be unnecessary
- **What it gave me:** When first trying to fix the auth issue, it suggested adding `credentials: 'include'` on the client's fetch calls and `credentials: true` on the server's CORS config, to let cached browser credentials be sent cross-origin.
- **What was wrong with it:** This was a workaround for the native-popup approach, which itself turned out to be the wrong direction (see Case 2). Once I switched to the in-app login screen, this CORS setting was no longer needed and just widened what cross-origin requests the server would accept unnecessarily.
- **What I did instead:** Removed `credentials: true` from the CORS config once the in-app login screen replaced the native-auth approach entirely.
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/7c3d1a8

## 3. Who wrote what

### Written by me
- **File:** `client/src/App.jsx` (the type filter feature)
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/4b45bd1
- **What it does and why it is built this way:** Added a second filter, by place type (Restaurant/Cafe), alongside the existing status filter (All/Want to Try/Visited) on the Home screen. I added a new `typeFilter` state, a new row of filter buttons following the same pattern as the existing status filter, and updated the `visiblePlaces` logic to check both filters together using `&&`, so a place only shows if it matches both the selected status and the selected type. I wrote this by studying the existing status filter's pattern first, then extending it myself rather than having it written for me.

### The AI-written part I understand best
- **File:** `client/src/App.jsx`
- **Commit:** https://github.com/riancrtz/yumzys-final-project-template/commit/7c3d1a8
- **What it does and why we kept it:** This is the main app component, it handles the login screen and switches between the Home, Visited, and Add Place views using local state. I understand this file well because I debugged a blank white screen caused by a leftover import here early on, and later needed to understand exactly how the login screen's `authed` state worked so I could explain why it fixed the incognito login problem we ran into.
