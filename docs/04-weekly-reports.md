# Weekly reports

The sections for the weeks of 2026-09-14 and 2026-09-21 were written on 2026-10-02 from my increment reports for those weeks. From the week of 2026-09-28 on, sections are written during the week.

## Week of 2026-09-28

**Done.**
- Clicking a place opens its own page with a large photo, type and area, rating, status, notes, a photo gallery, Edit, and Delete with a confirmation popup.
- Photo upload works on the live site: up to 5 photos per visited place, shrunk in the browser and stored on Cloudinary.
- Cards with several photos show a slideshow.
- The sidebar has Home, Want to try, Visited and Add Place, with type filter buttons on each list.
- My design system is applied: terracotta palette, sidebar on desktop, one column on phones.
- A wrong password shows "Invalid username or password." without the page flashing.
- The repository is renamed to yumzys, and the live site is at https://riancrtz.github.io/yumzys/.
- I rewrote the Basic Auth middleware myself.

**Stuck.**
- Automatic Unsplash photos were matched by place type, not the actual place, so cards showed random restaurants. I removed them and built real upload instead.
- After renaming the repository, the live site was a blank white page. The build still had the old base path `/yumzys-final-project-template/` baked in, and "Re-run all jobs" reused the old repository name. A fresh "Run workflow" fixed it.
- A wrong password made the whole app flash, because `App` switched to the main screen before the server answered 401. Moving the check into the login screen fixed it.
- "No photo yet" sat in the top left corner of the place page, because the `.hero` rule (`display: block`) came after `.photo-empty` (`display: grid`) in the stylesheet.
- Saving an edit failed with "updatePlace is not defined", because my old import line in `App.jsx` was missing `updatePlace`.

**Hours.** About 12.

**Next.**
- Record the presentation video and make the slides and square image, due Sunday, October 4.
- Create a scoped-down database role instead of using the default owner.

## Week of 2026-09-21

**Done.**
- The live app reads and writes a real PostgreSQL database on Neon through my Express API on Render.
- Every `/api/places` route is behind HTTP Basic Auth, with an in-app login screen.
- Demo mode is off on the live site since 2026-09-23.
- The Home screen has a type filter (restaurant or cafe) next to the status filter.

**Stuck.**
- The browser's own Basic Auth popup did not carry over to the app. In a private window, logging in on the API's address still left the app's requests from GitHub Pages getting 401. I replaced it with an in-app login screen that sends the Authorization header itself.
- My first idea for testing locally put the admin username and password in `VITE_` variables, which get compiled into the public JavaScript. The values were only in my local `.env` and never reached the deployed build, and I removed the approach.
- Two filter buttons were both labeled "All", which was confusing until I renamed them "All statuses" and "All types".
- `git push` was rejected twice because I had edited the README on GitHub's web editor. `git pull`, then `git push`, fixed it.

**Hours.** About 8.

**Next.**
- Build the Place Detail screen with photos.
- Apply my design system to the interface.

## Week of 2026-09-14

**Done.**
- The live site is on GitHub Pages, running in demo mode with my Yumzys screens: Home with All, Want to Try and Visited filters, Visited, Add Place, and delete. Data is stored in the browser.
- My workspace `project/README.md` links to the repository and live site.

**Stuck.**
- `git commit` failed because Git did not know my identity. Setting `user.name` and `user.email` fixed it.
- The first GitHub Actions deploy failed because Pages was not set to use GitHub Actions as its source. Changing that setting and running the workflow again fixed it.
- After rewriting `App.jsx`, the app was a blank white screen. The browser console showed one leftover import still using the old Sighting function names. Fixing the import fixed it.

**Hours.** About 11.

**Next.**
- Build the real backend: a PostgreSQL database and an Express API.
- Connect the live site to it.
