# games.nsprd.com 🎮

Daily-ish shareable mini-games. Single-player, mobile-first, no signup.
Deployed via Vercel. Live at **https://games.nsprd.com**.

## Structure

```
games-hub/
├── index.html         # Hub landing page (loads games.json)
├── games.json         # ⭐ Single source of truth — list of games
├── vercel.json        # Static config (cleanUrls, cache headers)
├── og.png             # Hub OG image (optional)
└── <slug>/            # One folder per game
    ├── index.html     # Self-contained game (single file)
    └── og.png         # Game OG image
```

Each game lives at `/<slug>/` (e.g. `/summer-aura/`). The hub auto-renders
all games listed in `games.json`.

## ✨ How to add a new game (for nightly agents)

1. **Create your game folder** with a self-contained `index.html`:
   ```
   games-hub/<your-slug>/index.html
   games-hub/<your-slug>/og.png   # 1200x630 OG image
   ```
   Game must be:
   - Single HTML file (inline CSS/JS, no build step)
   - Mobile-first responsive
   - Have share buttons (Twitter intent + `navigator.share` fallback)
   - Footer link back to `https://games.nsprd.com`
   - OG meta tags pointing to `https://games.nsprd.com/<slug>/og.png`

2. **Add an entry to `games.json`** — prepend to the `games` array:
   ```json
   {
     "slug": "your-slug",
     "name": "Your Game Name",
     "tagline": "One-liner under ~70 chars.",
     "emoji": "🎯",
     "image": "/your-slug/og.png",
     "color": "#hexcolor",
     "tags": ["genre", "vibe"],
     "published": "YYYY-MM-DD",
     "url": "/your-slug/"
   }
   ```

3. **Update `featured`** in `games.json` to your new slug if you want it
   featured as "Game of the Day". Otherwise leave the previous featured.

4. **Commit + push** to `main`. Vercel auto-deploys.
   (If you're using a one-shot deploy: `vercel --prod --token $VERCEL_TOKEN --yes`.)

5. **DNS** is already wired (`games.nsprd.com` → `cname.vercel-dns.com`).
   No DNS work needed for sub-paths.

## Local preview

```bash
cd games-hub
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

```bash
cd games-hub
vercel --prod --token <token> --yes
```

The Vercel project is `games-hub` under team `jake-8792`. First deploy
will create it; subsequent deploys re-use `.vercel/project.json`.

## Design system (loose)

- **Palette**: gradient pink (#ff6ad5) → peach (#ffb86b) → gold (#ffd166) → sky (#5ee0ff) on deep purple (#1a0633)
- **Vibe**: maximalist Y2K, glassy cards, soft glow shadows, big rounded corners
- **Fonts**: native system stack — keep it instant on mobile
- **Sparkles**: encouraged ✨

But every game is allowed (encouraged) to break the system if it has a stronger
visual identity. The hub is the unifier.

## Conventions

- Game URLs are clean (`/summer-aura`) — `vercel.json` handles `cleanUrls`
- Result/state URLs are encouraged via querystrings (e.g. `?aura=poolWitch`) so links shared from a result page show that result
- All assets are static — no backend, no environment variables in games
- Profanity should be tasteful, never punching down. We share these.
