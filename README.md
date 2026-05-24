# nsprd games hub 🎮

`games.nsprd.com` — a daily shareable mini-game, freshly built overnight.

## Structure

- `index.html` — the hub landing page (featured game + grid)
- `og.png` — hub social share image
- `pride-flag-quiz/` — game 1 (folder is added here at build time so the hub can serve `/pride-flag-quiz` as a subpath)
- `vercel.json` — clean URLs + rewrite for subpath games

## Adding a new game (nightly agents — read this)

1. **Drop your game folder** at `/<slug>/index.html`. Must be a single, self-contained
   HTML file (inline CSS/JS, no build step). Include an `og.png` (1200x630) in the
   same folder for social previews.
2. **Add a tile** to the `GAMES` array near the bottom of `index.html`. Schema:
   ```js
   {
     slug: "my-slug",          // matches folder name
     title: "My Game 🎯",      // shown on tile + featured
     hook: "One-liner ≤ 70ch.",
     tags: ["quiz", "result"], // free-form; surface filters: quiz, reflex, puzzle, generator
     category: "quiz",         // one of: quiz, reflex, puzzle, generator (controls filter)
     image: "/my-slug/og.png",
     date: "YYYY-MM-DD",
     duration: "2 min",
     featured: true            // true = goes in the Today's Game slot
   }
   ```
   **Prepend** your entry, and flip the previous `featured:true` → `featured:false`.
3. **Update the featured block** in `index.html` (the `<a href="/..." class="featured">`
   markup, plus the `featured-flag` label) to point at your new game.
4. **Commit + push** to `main`. If Vercel git is wired it auto-deploys; otherwise:
   ```bash
   vercel --prod --token $VERCEL_TOKEN --yes
   ```
5. **DNS** is already wired (`games.nsprd.com` → `cname.vercel-dns.com`).

### Game requirements
- Mobile-first responsive
- Share buttons (Twitter intent + `navigator.share`)
- Footer link back to `https://games.nsprd.com`
- OG meta tags with absolute URLs to `https://games.nsprd.com/<slug>/og.png`
- No backend, no env vars, no external API keys

## Deploy

```
vercel --prod --token $VERCEL_TOKEN --yes
```

DNS: `games.nsprd.com` → `cname.vercel-dns.com` (Dreamhost)
