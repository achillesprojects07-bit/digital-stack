# Content Compass V1.8 — Blue Soulful Anywhere Director

A GitHub Pages PWA for Aileen's social media content planning.

## Core idea

You enter the basic reality of the day: location, activity, mood, energy, time of day, and target video length. The app writes the story first, then builds the scenes, video checklist, photo checklist, caption, and editing guide from that story.

## What it does

- Works for any location: Greece, Manila, La Union, airports, events, cafés, clinics, home days, beaches, road trips, restaurants, hotel rooms, or ordinary errands.
- Lets you enter any target video length from 15–90 seconds, including 15 seconds.
- Generates a script-first TikTok/Reels plan.
- Builds a non-redundant video checklist with a different purpose for every shot.
- Creates photo shots, caption, hashtags, thumbnail direction, and simple CapCut instructions.
- Includes expert call sheet UX after generation so you can improve a plan instead of starting over.
- Includes date filters in the archive.
- Saves inputs and plans locally in the browser with localStorage.
- Works offline after the first successful load through a service worker.

## V1.8 updates

- Added **Improve this plan** controls after the generated output.
- Added expert content-director buttons: Stronger hook, Clearer story, More visual, Less talky, More soulful not dramatic, More relatable to women 45+, More elegant, and No face today.
- Added a free-text revision note box.
- Added **Revise plan** so the app keeps your location, mood, activity, and length but rewrites the script, scenes, checklist, photos, and edit brief.
- Added revision numbering so revised plans show as version 2, version 3, etc.
- Improved no-face logic so the app uses hands, back view, silhouettes, reflections, objects, and walking shots.

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


## V1.8 update
- Reordered the output into a clear call-sheet flow: summary, hook, script, video checklist, photos, easy edit, caption.
- Moved audience fit and scene map into collapsible sections.
- Moved revision controls to the bottom so the plan is visible before improvements.
- Simplified the editing guide for easier CapCut use.


## V1.8 Update
- Added a shot-by-shot edit timeline.
- Each shot now includes matching script line, duration, media placement, transition, effect/color, sound effect, and optional photo insert.
- Added song search suggestions for CapCut/TikTok music.
- Copy/export now includes the timeline.
