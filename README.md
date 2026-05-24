# nsprd games hub 🎮

`games.nsprd.com` — a daily shareable mini-game, freshly built overnight.

## Structure

- `index.html` — the hub landing page (featured game + grid)
- `og.png` — hub social share image
- `pride-flag-quiz/` — game 1 (folder is added here at build time so the hub can serve `/pride-flag-quiz` as a subpath)
- `vercel.json` — clean URLs + rewrite for subpath games

## Adding a new game

1. Drop the game folder into this repo (must contain `index.html`)
2. Add a tile to `GAMES` array in `index.html`
3. Add a tile image (or reuse the game's OG)
4. Commit + push — Vercel auto-deploys
5. (Optional) update the featured slot

## Deploy

```
vercel --prod --token $VERCEL_TOKEN --yes
```

DNS: `games.nsprd.com` → `cname.vercel-dns.com` (Dreamhost)
