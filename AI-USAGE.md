# AI usage

This project was built with AI assistance. This file is the record of it. It is
graded as the finals badge, and it is worth 100 points.

Entry dates are the dates of the work. This file was started on 2026-09-26, and the entries dated 2026-09-19 to 2026-09-23 were written then, after the work. The later entries were added on 2026-10-01 or afterward, so some were written several days after the work. The commit history of this file shows when each was added.

## 1. How I used AI

### 2026-09-19 - Setting up GitHub Pages deployment
- **Tool:** Claude
- **What I asked for:** Help getting my cloned repository deployed live on GitHub Pages for the first time.
- **What it gave back:** Step-by-step instructions to make the repo public, switch Pages source to GitHub Actions, and trigger the deploy workflow manually since my first push didn't touch the `client/` folder that the workflow watches.
- **What I kept, what I changed, and why:** Followed the steps exactly. When the first deploy still failed, I pasted the Actions log back and was told the failure predated the Pages source setting being switched on, so I re-ran the workflow manually and it succeeded.
- **Commit:** https://github.com/riancrtz/yumzys/commit/34c2275

### 2026-09-19 - Fixing Git push authentication
- **Tool:** Claude
- **What I asked for:** My first `git commit` failed because Git didn't recognize my identity, and my first `git push` failed with an authentication error.
- **What it gave back:** Instructions to set `git config user.name` and `user.email` (using my GitHub no-reply email for privacy), and two options for push authentication (GitHub CLI or a personal access token).
- **What I kept, what I changed, and why:** Set my Git identity as instructed. For authentication, I used `gh auth login` (GitHub CLI) rather than a personal access token, since it required less manual setup.
- **Commit:** https://github.com/riancrtz/yumzys/commit/34c2275

### 2026-09-19 - Replacing the demo app with Yumzys
- **Tool:** Claude
- **What I asked for:** Help rewriting the template's demo "sightings" app into my actual Yumzys screens (Home, Visited, Add Place), including the mock API files.
- **What it gave back:** Full rewrites of `seed.json`, `mockApi.js`, `httpApi.js`, `index.js`, and `App.jsx`, renaming every function and field from "sighting" to "place" and matching my proposal's data shape.
- **What I kept, what I changed, and why:** I kept the overall structure as given, since it matched the template's existing pattern (one interface, two implementations). I changed the seed data to real restaurants/cafés I actually want to try instead of the AI's first suggestion.
- **Commit:** https://github.com/riancrtz/yumzys/commit/5339c03

### 2026-09-19 - Debugging a blank white screen
- **Tool:** Claude
- **What I asked for:** The app showed a blank white screen after the App.jsx rewrite, and I didn't know why.
- **What it gave back:** Told me to check the browser console for the exact error, which showed one leftover import line still referencing the old function names.
- **What I kept, what I changed, and why:** Fixed the one import line as instructed. This taught me to check the console first instead of guessing.
- **Commit:** https://github.com/riancrtz/yumzys/commit/5339c03

### 2026-09-23 - Writing the places database schema
- **Tool:** Claude
- **What I asked for:** Help converting the template's `sightings` table into a `places` table matching my app's data (name, type, area, status, rating, notes, photos).
- **What it gave back:** A rewritten `schema.sql` with a `places` table, a status index, and a rewritten `seed.sql` with my real seed places.
- **What I kept, what I changed, and why:** Kept the structure and constraints (CHECK on type/status, rating range) as given, since they matched what I'd already decided in my proposal.
- **Commit:** https://github.com/riancrtz/yumzys/commit/f13fefa

### 2026-09-23 - Writing the Express API and repo layer
- **Tool:** Claude
- **What I asked for:** Help rewriting `sightingsRepo.js` and `server.js` to use the new `places` table, including adding a security gate my professor required.
- **What it gave back:** A new `placesRepo.js` with parameterized queries, a rewritten `server.js` with `/api/places` routes and HTTP Basic Auth middleware.
- **What I kept, what I changed, and why:** Kept the parameterized query pattern exactly as given, since it matched what I learned in M5 about SQL injection. Later changed the auth approach itself (see Part 2).
- **Commit:** https://github.com/riancrtz/yumzys/commit/f13fefa

### 2026-09-23 - First attempt at securing the API with Basic Auth
- **Tool:** Claude
- **What I asked for:** How to implement the security gate my professor required, since the app has no login system.
- **What it gave back:** A plan to send Basic Auth credentials from the client using `VITE_` environment variables, and rely on the browser's native login popup for production.
- **What I kept, what I changed, and why:** This approach turned out to be flawed (see Part 2, Cases 1 and 2). I ended up removing the baked-in credentials and replacing the native-popup approach with an in-app login screen instead.
- **Commit:** https://github.com/riancrtz/yumzys/commit/6439d6b

### 2026-09-23 - Building an in-app login screen
- **Tool:** Claude
- **What I asked for:** After discovering the native browser login didn't work reliably in incognito windows, I asked for a more reliable fix.
- **What it gave back:** A `LoginScreen` component that stores credentials in memory and attaches them to every API request manually, instead of relying on the browser's own auth caching.
- **What I kept, what I changed, and why:** Kept the whole approach, since testing confirmed it worked correctly across regular and incognito windows, which the previous approach did not.
- **Commit:** https://github.com/riancrtz/yumzys/commit/7c3d1a8

### 2026-09-26 to 2026-10-01 - Writing the README to match the documentation guide
- **Tool:** Claude
- **What I asked for:** Help writing the README so it follows my professor's documentation guide: overview, setup, how to run it, features, structure, screenshots, and known issues.
- **What it gave back:** A README organized in those seven sections, with environment variable tables, an API endpoint list, and a credit line pointing to this file.
- **What I kept, what I changed, and why:** I kept the section structure and edited the text to match what I actually built. I kept my login credentials out of this public README. After I renamed the repository to yumzys, I updated every link in commit 9b145ed (https://github.com/riancrtz/yumzys/commit/9b145ed).
- **Commit:** https://github.com/riancrtz/yumzys/commit/7c84883

### 2026-09-19 to 2026-09-27 - Weekly reports, journals and the security checklist
- **Tool:** Claude
- **What I asked for:** Drafts of my week 1 and week 2 increment reports and journals, and the 31 row security checklist, for my private workspace.
- **What it gave back:** Drafts based on the work we did together, with evidence lines for each checklist row.
- **What I kept, what I changed, and why:** I ran the checks myself, such as the git history searches and the secret scanning settings, and corrected rows that did not match what I built. These files are in my private workspace, so their commits are not in this repository.
- **Commit:** Not in this repository. The files are in my private workspace.

### 2026-09-30 - Showing Unsplash photos on place cards
- **Tool:** Claude
- **What I asked for:** My professor suggested places should show pictures even when I have not uploaded one. I asked how to add photos automatically.
- **What it gave back:** A comparison of three options (static placeholders, Unsplash, Google Places), then an Express route that fetched photos from Unsplash by place type and cached them, plus client code that picked one photo per place.
- **What I kept, what I changed, and why:** I chose Unsplash and got it working, with the API key kept on the server. The photos were matched by place type, not the actual place, so cards showed random restaurants. I removed the route and the client code in a later commit (https://github.com/riancrtz/yumzys/commit/805cd7a).
- **Commit:** https://github.com/riancrtz/yumzys/commit/181a16d

### 2026-10-01 - Place Detail screen with edit
- **Tool:** Claude
- **What I asked for:** A screen to view and edit one place, since places could only be added or deleted before.
- **What it gave back:** A full rewrite of `App.jsx` with a detail view, an edit mode, and one shared form used by both the add and edit screens.
- **What I kept, what I changed, and why:** I kept the shared form so add and edit stay consistent. When I pasted the first version in, my old import line was still there without `updatePlace`, so saving an edit failed with "updatePlace is not defined." I found the cause from the error on screen and fixed the import myself.
- **Commit:** https://github.com/riancrtz/yumzys/commit/2ab0f2c

### 2026-10-01 - Replacing Unsplash with a photo link
- **Tool:** Claude
- **What I asked for:** After dropping Unsplash, a way to attach a photo to a visited place.
- **What it gave back:** A photo link field on the form for visited places only, server validation that every link starts with https and is 500 characters or fewer, and a "No photo yet" box for places without a photo.
- **What I kept, what I changed, and why:** I kept the rule that only visited places can have a photo. I tested a good image link, a normal web page link, and an http link in the browser, and checked how the page reacts to each.
- **Commit:** https://github.com/riancrtz/yumzys/commit/805cd7a

### 2026-10-01 - Applying the design system
- **Tool:** Claude
- **What I asked for:** Restyle the app with my design system: my five colors, type scale, 8px spacing, a sidebar on desktop, and one column on phones.
- **What it gave back:** A new `styles.css` and a matching rewrite of `App.jsx` with a sidebar, filter buttons, and a card grid.
- **What I kept, what I changed, and why:** I kept the palette and layout. After testing, I reported that the nav labels looked off and the content looked smaller than my wireframe. We removed the left alignment on the labels and undid a width cap that had shrunk the layout.
- **Commit:** https://github.com/riancrtz/yumzys/commit/277283d

### 2026-10-01 - Photo upload with Cloudinary
- **Tool:** Claude
- **What I asked for:** Real photo upload, because a personal log needs my own photos from the visit, not links to other people's pictures.
- **What it gave back:** A small module that shrinks a photo in the browser and uploads it to Cloudinary with an unsigned preset, a file picker in the form, and the two new build variables in the deploy workflow.
- **What I kept, what I changed, and why:** I created the Cloudinary account and the unsigned preset myself, with a folder and an allowed formats list, and tested the upload locally. The returned link goes into the existing photos field, so the server and database did not change.
- **Commit:** https://github.com/riancrtz/yumzys/commit/5702831

### 2026-10-01 - Writing a message for a failed login
- **Tool:** Claude
- **What I asked for:** After I added the photo features, my login screen just returned to the form after a wrong password with no message. I asked how to show one.
- **What it gave back:** An outline of the approach only: a flag in `App`, a prop to `LoginScreen`, and a message there. I wrote the code myself. When I pasted it back, it pointed out that a comment I left inside the JSX would show up as text on the screen.
- **What I kept, what I changed, and why:** I removed the stray comment text and all my "added" comments, then tested a wrong and a right password.
- **Commit:** https://github.com/riancrtz/yumzys/commit/340cfab

### 2026-10-01 - Checking the login before leaving the login screen
- **Tool:** Claude
- **What I asked for:** My message worked, but the whole page flashed for a moment each time a wrong password was entered, and the username I typed was wiped.
- **What it gave back:** A new `LoginScreen` that sends one request to check the credentials first, stays on the login screen when the password is wrong, and separates a wrong password from a server that is down or asleep. It also removed the flag from `App`.
- **What I kept, what I changed, and why:** I kept all of it and tested three cases: a wrong password, a right password, and the server stopped. I saw "Failed to fetch" in the last case, which is the right result.
- **Commit:** https://github.com/riancrtz/yumzys/commit/e7a3a3a

### 2026-10-01 - Asking for confirmation before deleting
- **Tool:** Claude
- **What I asked for:** One click on Delete removed a place for good, so I asked how to add a confirmation.
- **What it gave back:** The idea of using the browser's built in confirm, and a warning about one trap: the detail page runs the delete and then returns to the list, so a cancel must stop both steps. It gave no code.
- **What I kept, what I changed, and why:** I wrote the code myself: a small helper that asks the question and returns true or false, checked separately in the list button and the detail button. I tested cancel and confirm from both screens.
- **Commit:** https://github.com/riancrtz/yumzys/commit/94f2d03

### 2026-10-01 to 2026-10-02 - Multi photo gallery and a redesigned place page
- **Tool:** Claude
- **What I asked for:** My proposal and wireframe promised several photos per place with a gallery. After using the app myself, I also wanted a cleaner layout: fewer filter buttons, a Want to try page in the sidebar, places that open on their own page laid out like my wireframe, a styled delete confirmation instead of the browser's popup, a photo slideshow on the cards, and status and type as pill choices in the form.
- **What it gave back:** Rewrites of `App.jsx` and `styles.css`: up to 5 photos per place with multi file upload, a place page with a large photo, details, a photo gallery, Edit and Delete, a delete confirmation dialog, type filter buttons, a card slideshow that pauses on hover, and pill choices for status and type. It showed clickable previews of the place page and the filter colors before building them.
- **What I kept, what I changed, and why:** The design decisions were mine. I asked for each change after using the app, approved the previews, and asked it to remove the extra Close button, the black radio dot, and the visible radio circles. I found that "No photo yet" sat in the top left corner of the place page. I tested the 5 photo limit, the place page, the delete dialog, and the new pills.
- **Commit:** https://github.com/riancrtz/yumzys/commit/b852e89

### 2026-10-02 - Rewriting the Basic Auth middleware myself
- **Tool:** Claude
- **What I asked for:** My professor's instructions say to write the Basic Auth middleware ourselves, and Claude had written the first version, so I asked how to redo it properly.
- **What it gave back:** A list of the steps only, and a review of my code once I wrote it. It gave no code.
- **What I kept, what I changed, and why:** I wrote the function myself and used the first colon to split the username and password, so passwords with colons work. I tested it with curl without credentials, which gave a 401 with the WWW-Authenticate header, and with a wrong and a right password on the login screen.
- **Commit:** https://github.com/riancrtz/yumzys/commit/8ecdbc8

### 2026-10-02 - Proposal, weekly reports and README updates
- **Tool:** Claude
- **What I asked for:** My professor's instructions say the proposal copy in the repository should describe the app as built, with cut features moved to stretch goals, and that weekly reports should be written in sections. I also needed the README features and next steps brought up to date.
- **What it gave back:** A rewritten proposal, three weekly report sections drawn from my increment reports, and new README text for the features and next steps.
- **What I kept, what I changed, and why:** I checked each claim against the live app and chose my own hours: about 11, 8 and 12. Claude counted chat time as a floor, but I decided the numbers. I noted at the top of the reports that the first two weeks were written afterward. I also added my own screenshots to the README in commit https://github.com/riancrtz/yumzys/commit/c758174.
- **Commit:** README https://github.com/riancrtz/yumzys/commit/5558286, proposal https://github.com/riancrtz/yumzys/commit/7390a64, weekly reports https://github.com/riancrtz/yumzys/commit/9ec7ea8

### 2026-10-03 - Security review: helmet, rate limiting and dependency fixes
- **Tool:** Claude
- **What I asked for:** My professor's security checklist asks for helmet, rate limiting on anything that accepts a password, length limits on every text field, and an npm audit. I asked what my project was missing.
- **What it gave back:** A list of the gaps, the install command, helmet, a rate limiter that allows 20 failed requests per 15 minutes, placed above my login gate, and a server side length check on the area field, as a full `server.js`.
- **What I kept, what I changed, and why:** I installed the packages and ran `npm audit`, which found a moderate issue in a dependency of Express. `npm audit fix` solved it without `--force`. I tested with curl: the `X-Powered-By` header was gone, helmet's headers and the rate limit headers appeared, and I got nineteen 401 responses and then 429. It had predicted twenty, but my first request used one. My own `basicAuth` stayed unchanged in the file. I then tested a wrong and a right password on the live site.
- **Commit:** https://github.com/riancrtz/yumzys/commit/d79967d

### 2026-10-03 - Planning the demo video, the slides and the square image
- **Tool:** Claude, and Canva
- **What I asked for:** A flow for my 3 to 5 minute demo video that matches my professor's brief, then slides covering the problem, a demo, the tech, the challenges and what is next, and a 1080 by 1080 square image.
- **What it gave back:** A timed outline with talking points, an 8 slide PowerPoint with speaker notes, and a Canva square image with a plate and cutlery logo. It also built a Canva version of the slides, which I did not use.
- **What I kept, what I changed, and why:** I recorded the video and spoke in my own words. I chose the PowerPoint over the Canva version, and I asked it to rework the content when I noticed the brief wanted a challenges slide.
- **Commit:** Not in this repository. The slides and the image are in my private workspace `project/` folder and submitted on Canvas.

### 2026-10-04 - A search box for the place lists
- **Tool:** Claude
- **What I asked for:** With more places saved, the lists were getting long, so I asked how to add a search box that filters by name.
- **What it gave back:** The approach only: where the state goes, that the filter needs the same off-switch shape as my type filter, and that both sides should be lower cased. It asked me to work out what the "off" check should be. It gave no code.
- **What I kept, what I changed, and why:** I wrote it myself, including the condition and the input. It then suggested two additions I made: `type="search"` for the clear button, and a different empty message when a search matches nothing. This landed in the same commit as the database role work.
- **Commit:** https://github.com/riancrtz/yumzys/commit/98b4e2a

### 2026-10-04 - Connecting the app as a scoped database role
- **Tool:** Claude
- **What I asked for:** My security checklist said the app connects as Neon's default owner role, which can drop tables, when it only needs to read and write rows. I asked what the narrower role needed.
- **What it gave back:** The four things to grant, and a warning that a SERIAL id column uses a hidden sequence that needs its own grant or inserts fail. It gave no SQL.
- **What I kept, what I changed, and why:** I wrote the four statements myself and ran them in the Neon SQL editor, then checked `information_schema.role_table_grants`, which returned exactly SELECT, INSERT, UPDATE and DELETE. I saved them in `server/db/role.sql` with a placeholder password, switched `DATABASE_URL` locally and on Render, and tested the live site.
- **Commit:** https://github.com/riancrtz/yumzys/commit/98b4e2a

### 2026-10-04 - Status toggle and photo upload on the place page
- **Tool:** Claude
- **What I asked for:** My wireframe put the status toggle and Add Photo on the place page itself, but the app only had them inside Edit. I asked what the change would involve.
- **What it gave back:** Where each piece lives in the file, and four things to work out myself: what to send when saving, what the rating should become when a place becomes visited, that the pills were hidden from screen readers and would need that removed, and that two fast clicks could send two requests. It gave no code.
- **What I kept, what I changed, and why:** I wrote all of it. It reviewed my version and pointed out that a failure partway through a multi photo upload would still save the earlier photos while showing an error, which could read as nothing having saved. I changed the message to say how many photos had uploaded and that they would still be saved.
- **Commit:** https://github.com/riancrtz/yumzys/commit/2f4f6b5

### 2026-10-04 - Asking which design work was worth doing
- **Tool:** Claude
- **What I asked for:** I asked which design work would give the app the most real benefit, rather than the most lines.
- **What it gave back:** A ranked list of five areas: the phone layout, the toolbar row, the empty states, hover and focus states, and loading feedback. Later it explained why both status pills were filling with colour, which was my general `button` rule overriding `.pill`. It gave no other code.
- **What I kept, what I changed, and why:** I wrote all of the design work myself. I also added a dedicated dialog for the status change, which it had not suggested, so the app uses one style of dialog everywhere instead of the browser's.
- **Commit:** https://github.com/riancrtz/yumzys/commit/cca824d

## 2. Where the AI got it wrong

### Case 1 - Baking admin credentials into the client build
- **What it gave me:** A version of `httpApi.js` that read `VITE_ADMIN_USER` and `VITE_ADMIN_PASS` from environment variables and sent them as an Authorization header on every request, suggested as a way to test the real API locally.
- **What was wrong with it:** `VITE_` variables get compiled directly into the built JavaScript, which is public. This would have exposed the actual admin password to anyone who opened the deployed site's source, a real security flaw for something meant to gate write access to my database.
- **What I did instead:** Reverted `httpApi.js` to not send an Authorization header at all, and later replaced this whole approach with an in-app login screen that holds credentials in memory only.
- **Commit:** https://github.com/riancrtz/yumzys/commit/6439d6b

### Case 2 - Claiming the browser's native Basic Auth popup would work reliably in production
- **What it gave me:** The suggestion that once deployed, the browser's own login popup (triggered by a 401 response) would handle authentication for the whole app, no extra code needed.
- **What was wrong with it:** This didn't work reliably once the client and API were on two different origins (GitHub Pages vs Render). Modern browsers partition cached Basic Auth credentials by top-level site, especially in private/incognito windows, so a login on the API's origin didn't carry over to the client's background requests.
- **What I did instead:** Tested this myself in an incognito window, found it broke, and asked for a proper fix, an in-app login screen that manages credentials directly instead of relying on browser auth caching.
- **Commit:** https://github.com/riancrtz/yumzys/commit/7c3d1a8

### Case 3 - Adding CORS `credentials: true` that turned out to be unnecessary
- **What it gave me:** When first trying to fix the auth issue, it suggested adding `credentials: 'include'` on the client's fetch calls and `credentials: true` on the server's CORS config, to let cached browser credentials be sent cross-origin.
- **What was wrong with it:** This was a workaround for the native-popup approach, which itself turned out to be the wrong direction (see Case 2). Once I switched to the in-app login screen, this CORS setting was no longer needed and just widened what cross-origin requests the server would accept unnecessarily.
- **What I did instead:** Removed `credentials: true` from the CORS config once the in-app login screen replaced the native-auth approach entirely.
- **Commit:** https://github.com/riancrtz/yumzys/commit/7c3d1a8

### Case 4 - A photo option that did not fit the app
- **What it gave me:** It described Unsplash as "real-ish photos" and helped me build it. Earlier in the setup it also told me to share my API key in the chat.
- **What was wrong with it:** The photos did not match the actual places. Sharing an API key in a chat is also wrong, since keys belong only in `.env` and the hosting dashboard. It corrected the key advice in its next message.
- **What I did instead:** I removed Unsplash and used a photo link on visited places, then moved to real upload. The key never went into the repository.
- **Commit:** https://github.com/riancrtz/yumzys/commit/805cd7a

### Case 5 - Design choices that needed fixing
- **What it gave me:** A design system with white text on the terracotta button, and later a layout change that centered the content and made it narrow.
- **What was wrong with it:** White on #D08549 is about 2.9 to 1, below the 4.5 to 1 my own accessibility checklist promises. The centering made the app look smaller than my wireframe.
- **What I did instead:** The app uses dark brown text on the buttons, and I removed the width cap after seeing the result on screen.
- **Commit:** https://github.com/riancrtz/yumzys/commit/277283d

### Case 6 - A photo box that stayed broken
- **What it gave me:** A photo component that showed "No photo yet" after an image failed to load.
- **What was wrong with it:** The failed state never reset. After one bad link, the box stayed on "No photo yet" even after I saved a good link, until I refreshed the page. It found this while I was testing the link field.
- **What I did instead:** I used the corrected version, which resets the failed state whenever the link changes.
- **Commit:** https://github.com/riancrtz/yumzys/commit/805cd7a

### Case 7 - Wrong guesses about Cloudinary
- **What it gave me:** While setting up Cloudinary it said Neon cannot store image files and guessed that the default `ml_default` preset was signed.
- **What was wrong with it:** A Postgres database can technically hold images, though it is a poor fit. And my preset list showed that `ml_default` was unsigned. It also could not tell me where the allowed formats setting was in the console.
- **What I did instead:** I read my own preset list, made a separate `yumzys_unsigned` preset, and found the allowed formats field myself.
- **Commit:** https://github.com/riancrtz/yumzys/commit/5702831

### Case 8 - A login message that made the whole page flash
- **What it gave me:** A design where `App` shows the whole app as soon as the login form is submitted, and only goes back to the login screen if the server answers 401, with a flag in `App` to show the message.
- **What was wrong with it:** The message worked, but every wrong password made the entire page flash for the length of one request, and the typed username was lost. I noticed it while testing.
- **What I did instead:** I asked for a fix, and the check moved inside the login screen, so the app only appears after the server accepts the login.
- **Commit:** https://github.com/riancrtz/yumzys/commit/e7a3a3a

### Case 9 - A placeholder stuck in the corner
- **What it gave me:** A new style for the large photo on the place page.
- **What was wrong with it:** The new rule came later in the stylesheet than the rule that centers "No photo yet", so it overrode the centering, and the text sat in the top left corner of the empty photo box.
- **What I did instead:** I spotted it on the page. The fix moved the centering rule to the end of the stylesheet so it wins.
- **Commit:** https://github.com/riancrtz/yumzys/commit/b852e89

### Case 10 - Building a popup I did not ask for
- **What it gave me:** When I said a place's options should "pop up" when I click it, it put the whole place view inside a popup dialog.
- **What was wrong with it:** I meant the place should open with its options showing, like the place page in my wireframe, not a popup over the list.
- **What I did instead:** I told it what I meant. It asked which behavior I wanted and showed a clickable preview of a separate page, and I approved that before it rewrote the code. Only the delete confirmation stayed a popup.
- **Commit:** https://github.com/riancrtz/yumzys/commit/b852e89

### Case 11 - A checklist row that was not true
- **What it gave me:** Row 27 of my security checklist, drafted as Yes, saying all my commits use a GitHub no-reply email.
- **What was wrong with it:** It never checked. My git log showed one commit, the initial commit that GitHub created from the class template, with my personal email as the author.
- **What I did instead:** I changed row 27 to No, explained the finding in the checklist, and turned on GitHub's email privacy settings. I did not rewrite history, because that would break every commit link in this file.
- **Commit:** Not in this repository. The checklist is in my private workspace.

### Case 12 - Edit instructions I applied to the wrong place
- **What it gave me:** Instructions to add a small pill component and to replace the form inside `PlaceForm`, as two separate pieces.
- **What was wrong with it:** The instructions were easy to misapply. I pasted the new form into the pill component and left the old `PlaceForm` untouched, so the page did not change, and the new component would have crashed.
- **What I did instead:** It checked my file, saw the mix up, and gave me one full replacement for both functions. I checked the page afterward.
- **Commit:** https://github.com/riancrtz/yumzys/commit/b852e89

## 3. Who wrote what

### Written by me
- **File:** `client/src/App.jsx` (the type filter)
- **Commit:** https://github.com/riancrtz/yumzys/commit/4b45bd1
- **What it does and why it is built this way:** The Home screen already had a status filter (All, Want to try, Visited). I added a second filter by type (Restaurant or Cafe) next to it. I added a `typeFilter` state, a second row of buttons that follows the same pattern as the first, and changed `visiblePlaces` so a place only shows if it matches both filters, using `&&`. I also simplified the status check to `filter === 'all' || p.status === filter`, so it needs one `filter` call and not a three way ternary. The two filters work together because each one is its own piece of state. Claude later rewrote the filter controls several times, as a shared `FilterRow` component, then a dropdown, and finally the type buttons in `TypeFilter`. The status filter now comes from the sidebar page instead of buttons. The `typeFilter` state and the type half of the `visiblePlaces` condition are still the code I wrote.

### Written by me
- **File:** `client/src/App.jsx` (the delete confirmation)
- **Commit:** https://github.com/riancrtz/yumzys/commit/94f2d03
- **What it does and why it is built this way:** Before, one click on Delete removed a place for good. Now a small helper, `confirmDelete`, asks "Delete (place name)?" with the browser's `confirm` and returns true or false. Each Delete button checks it in its own click handler. I did not put the question inside `handleDelete` because the detail page's button calls `handleDelete` and then `setView(returnView)`. With the question inside, cancelling would still have sent me back to the list. Checking it in each button means cancelling does nothing at all, and I tested cancel and confirm from both the list and the detail page. Claude later replaced this with a styled confirmation dialog (commit https://github.com/riancrtz/yumzys/commit/b852e89), so this code is no longer in the app.

### Written by me
- **File:** `server/server.js` (the `basicAuth` middleware)
- **Commit:** https://github.com/riancrtz/yumzys/commit/8ecdbc8
- **What it does and why it is built this way:** My professor asked us to write the Basic Auth gate ourselves. Claude had written the first version, so I rewrote it from his description, with Claude only listing the steps. It reads the `Authorization` header and rejects anything that does not start with `Basic `. It decodes the rest from base64 and splits it at the first colon only, so a password that contains a colon still works, which the earlier `split(':')` version would have broken. It compares the username and password with `ADMIN_USER` and `ADMIN_PASS` from the environment, calls `next()` on a match, and otherwise sends a 401 with a `WWW-Authenticate` header. It is registered before every `/api/places` route, so all of them are behind it.

### Written by me
- **File:** `client/src/App.jsx` (the search box)
- **Commit:** https://github.com/riancrtz/yumzys/commit/98b4e2a
- **What it does and why it is built this way:** The search box filters the list as you type. `searchText` is React state, so the list updates on every keystroke. Both the place name and the search text are lower cased, so "Cafe" and "cafe" match. An empty box (`searchText === ''`) shows every place. The empty message checks `searchText` so it says "No places match your search." after a search and "No places here yet." when there are no places at all.

### Written by me
- **File:** `server/db/role.sql`
- **Commit:** https://github.com/riancrtz/yumzys/commit/98b4e2a
- **What it does and why it is built this way:** It creates a `places_app` role that can only read, add, edit and delete rows in `places`. It cannot drop tables or create roles, so a leaked connection string does less damage. The schema grant is needed because Postgres will not let a role into a schema without it. The `SERIAL` id uses a hidden sequence, so the role needs a grant on `places_id_seq` or inserts fail. `npm run db:reset` still needs the owner connection string because it creates the tables, and `places_app` is not allowed to do that.

### Written by me
- **File:** `client/src/App.jsx` (`PlaceDetails`, the status toggle and photo upload)
- **Commit:** https://github.com/riancrtz/yumzys/commit/2f4f6b5
- **What it does and why it is built this way:** The status pills switch a place between Want to try and Visited in one click, and "+ Add Photo" opens a file picker and uploads. `toValues` builds the full place object that `updatePlace` expects, and each caller changes only what it needs to. Switching to Visited sets the rating to 4 so the place does not show zero stars. Switching to Want to try clears the rating and photos, so it asks for confirmation first when photos exist. The `busy` flag is true while saving or uploading and disables the buttons, so double clicks cannot send two requests.

### Written by me
- **Files:** `client/src/App.jsx` and `client/src/styles.css` (the design pass and the status dialog)
- **Commit:** https://github.com/riancrtz/yumzys/commit/cca824d
- **What it does and why it is built this way:** This pass polishes how the app looks and feels. The layout now works on a phone: the controls are at least 44px tall, the nav wraps cleanly, and long place names no longer push the page sideways. Hover and focus states are consistent, so a selected tab, chip or pill stays solid when hovered. The search box sits on the same row as the type chips. Empty states (no places, no search results, no photos) show a short message with a button instead of plain text. A spinner and "Saving..." line show while a status change or photo upload is in progress. Switching a visited place with photos to Want to try now opens an in-app dialog instead of the browser popup, because that switch clears the rating and photos and cannot be undone. Cancel is focused by default so an accidental Enter keeps the photos, and the dialog reuses the existing `Modal`, so it matches the delete dialog.

### The AI-written part I understand best
- **File:** `client/src/App.jsx` (`LoginScreen`)
- **Commit:** https://github.com/riancrtz/yumzys/commit/e7a3a3a
- **What it does and why we kept it:** `LoginScreen` checks the credentials before leaving the login screen. On submit it saves them with `setCredentials`, then calls `listPlaces()`, and only calls `onLogin()` if that works. A 401 shows "Invalid username or password.", and any other error, like a server that is down or asleep, shows that error's own message. My first version let `App` show the whole app as soon as I submitted and return to the login screen after the 401. That made the page flash and wiped the username I typed. Checking inside `LoginScreen` fixed both, and I tested a wrong password, a right password, and the server stopped.

I have measured my own share of this project rather than estimated it. On 2026-10-04 the application source was 1,904 lines of JavaScript, JSX, CSS and SQL, not counting dependencies. The parts I wrote come to about 430 lines, roughly 22 percent: the type filter (26), the delete confirmation (13), the Basic Auth middleware (about 20), the search box and the database role file (about 20), the status toggle and photo upload on the place page (107), and the design pass and status dialog (264). Some of the earlier lines were later replaced by Claude, so the share still in the final app is a little lower than that. The rest was written by Claude or came from the class template, and I tested, deployed and debugged all of it.
