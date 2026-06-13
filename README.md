# Content Compass V1.0

A GitHub Pages PWA for Aileen's social media content planning.

## What it does

- Takes simple daily inputs: location, activity, mood, time, energy, filming help.
- Generates a script-first TikTok/Reels plan.
- Builds scene-by-scene video shots from the script.
- Creates photo shot list, caption, hashtags, thumbnail text, and CapCut edit brief.
- Saves inputs and plans locally in the browser with localStorage.
- Works offline after the first successful load through a service worker.

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
