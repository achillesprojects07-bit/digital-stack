# Content Compass V1.5 — Blue Soulful Anywhere

A GitHub Pages PWA for Aileen's social media content planning.

## Core idea

You enter the basic reality of the day: location, activity, mood, energy, time of day, and target video length. The app writes the story first, then builds the scenes, video checklist, photo checklist, caption, and editing guide from that story.

## What it does

- Works for any location: Greece, Manila, La Union, airports, events, cafés, clinics, home days, beaches, road trips, restaurants, hotel rooms, or ordinary errands.
- Lets you enter any target video length from 15–90 seconds.
- Generates a script-first TikTok/Reels plan.
- Builds a non-redundant video checklist with a different purpose for every shot.
- Creates photo shots, caption, hashtags, thumbnail direction, and simple CapCut instructions.
- Adds controls to try another version or make the plan more soulful.
- Includes date filters in the archive.
- Saves inputs and plans locally in the browser with localStorage.
- Works offline after the first successful load through a service worker.

## V1.5 updates

- Changed the app from Greece-centered to anywhere-centered.
- Renamed the pillar from Ordinary Greece to Ordinary Life.
- Removed Greece-only captions, hashtags, and scene logic.
- Kept Greece as one possible place, not the whole app identity.
- Updated sample location to a generic neighborhood café.

## Writing direction

The voice should be poetic, reflective, soulful, warm, sensory, and grounded. The app should avoid gimmicky lines, forced jokes, forced wit, and strange food metaphors.

The woman is the center. The place supports the story.

## How to deploy on GitHub Pages

1. Create a new GitHub repository, for example `content-compass`.
2. Upload all files in this folder to the repository root.
3. Go to Settings → Pages.
4. Under Build and deployment, choose Deploy from branch.
5. Select `main` branch and `/root` folder.
6. Open the published GitHub Pages URL.
7. On iPhone or Android, open in browser and choose Add to Home Screen.

## Notes

- This is GitHub-only V1. Data is saved on the current device only.
- Firebase sync is intentionally not included yet.
- When Firebase is added later, saved plans can sync across phone and MacBook.
