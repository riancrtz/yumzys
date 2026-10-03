# Proposal: Yumzys (Restaurant & Café Bucket List)

The submitted version is my Canvas answer for m8a1. This copy is kept up to date with the code, so features I cut are moved to stretch goals with the reason, not deleted.

## What the app is for, in one sentence

An app that lets me keep a list of restaurants and cafés around Angeles/Pampanga I want to try, track which ones I've actually visited, and rate them afterward so I can decide where to eat next.

## Who it is for

Me, specifically. When I open it, I'm either adding a new place I heard about from friends or social media, or checking the list before a food trip to decide where to go.

## Core features (as built)

| # | Screen | What it does |
|---|---|---|
| 1 | Login | One shared login in front of the whole app. A wrong password shows a message. |
| 2 | Home | All saved places as cards, with type filter buttons (all, restaurant, cafe). Places with several photos show a slideshow. |
| 3 | Want to try | Only places I have not visited yet, with the same cards and type filter. Added after testing. |
| 4 | Visited | Only places I have visited, with the same cards and type filter. |
| 5 | Add Place | A form with name, type, area, status and notes. Choosing Visited shows a rating and up to 5 photo uploads. |
| 6 | Place page | Opens when I click a card: a large photo, type and area, rating, status, notes, a photo gallery, Edit, and Delete with a confirmation popup. |

The screens are views switched by state in `App.jsx`, not separate URL routes.

## State: what data the app holds

| Data | Shape (rough) | Who owns it | Changes when |
|---|---|---|---|
| places | `[{ id, name, type, area, status, rating, notes, photos }]` | App | I add, edit or delete a place |
| view | `"home"` \| `"want"` \| `"visited"` \| `"add"` \| `"detail"` | App | I click the sidebar or open a place |
| selectedId | id or null | App | I open a place's page |
| typeFilter | `"all"` \| `"restaurant"` \| `"cafe"` | App | I click a type button |
| form values | the fields of one place | PlaceForm | I type in the add or edit form |

The original `filterStatus` was replaced by the sidebar pages, so the status filter is now the page you are on.

## Hosting

| Piece | Host | Free tier catch |
|---|---|---|
| Client | GitHub Pages | Static files only. Build variables are public, and changing one needs a rebuild. |
| API | Render (free web service, Node) | Sleeps when idle, so the first request after a break can take about a minute. |
| Database | Neon PostgreSQL (free, Singapore) | Small storage and compute limits, and it pauses when idle. |
| Photos | Cloudinary (free plan) | A monthly credit allowance. The upload preset is unsigned, so its name is public. |

Changes:
- 2026-09-30: added Unsplash for automatic photos. Removed on 2026-10-01 because the photos did not match the actual places.
- 2026-10-01: added Cloudinary for my own photo uploads.
- 2026-10-01: renamed the repository to yumzys, which moved the live site to https://riancrtz.github.io/yumzys/.

## Demo mode

Off. The deployed client has used the real API since 2026-09-23, when `VITE_USE_MOCK_API` was set to `false`.

## Stretch goals and cut features

Cut or changed, and why:
- **Status toggle and adding photos on the place page.** Cut for a simpler page. Status and photos are changed through Edit.
- **Status filter buttons on Home.** Replaced by the Want to try and Visited pages in the sidebar, because having both was redundant.
- **Automatic photos from Unsplash.** Built and removed, because the photos were random and not of the real place.
- **Photo by pasted link.** Built and replaced by real upload, because a personal log should hold my own photos.
- **Placeholder icons by type.** Not used. A place without a photo shows "No photo yet".

Stretch goals:
- Create a scoped-down database role instead of using the default owner.
- Delete the Cloudinary file when a photo is removed.
- Change the status and add photos directly on the place page, without opening Edit.
- Photos of the real place through the Google Places API, which needs a billing account and a spending quota.

## Content gathered

- Four real starter places for the seed data: LALA Garden, Grill Seoul, John's Kitchen and Cafe Dia. Fewer than the 5 to 10 I planned.
- My own photos, uploaded through the app.

## Risks

- **Original risk, keeping the list and detail view in sync: turned out to be small.** All places live in one array in `App`, and saving an edit replaces that place in the array, so the list and the place page always agree without a reload.
- **Login across two domains: grew, then solved.** The browser's own Basic Auth popup did not work reliably between GitHub Pages and Render in private windows. I replaced it with an in-app login screen on 2026-09-23.
- **Render's cold start: still there.** The first request after a break can take about a minute, so the app shows a "server may be waking up" message.
- **Secrets in a public repository: handled.** `.env` files are git-ignored, I searched the full history for passwords, and secret scanning is on.
- **New: photo storage.** The unsigned upload preset could be used by anyone who finds its name. It only accepts image formats, and the free plan has no card attached.
