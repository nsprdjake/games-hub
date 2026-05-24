# Feedback Widget Integration

Drop-in widget for game ratings, comments, and analytics.

## Quick Start

Add to your game HTML:

```html
<!-- Load widget -->
<script src="https://games.nsprd.com/feedback-widget.js"></script>

<!-- Rating UI -->
<div id="game-rating"></div>

<!-- Comments section -->
<div id="game-comments"></div>

<!-- Initialize -->
<script>
  gamesFeedback.init({
    slug: 'your-game-slug'
  });
</script>
```

## Features

- **Auto-generated visitor ID** (stored in localStorage)
- **Auto-fires view event** on page load
- **One-click rating** (★★★★★)
- **Comments** with optional display name
- **Remembers your rating** per device
- **Fully styled** out of the box

## API

### Initialize

```javascript
gamesFeedback.init({
  slug: 'your-game-slug',
  apiBase: 'https://games-api.vercel.app' // optional, defaults to this
});
```

### Manual event tracking

```javascript
// Track custom events
gamesFeedback.event('play_start');
gamesFeedback.event('play_complete', { score: 100 });
gamesFeedback.event('share_click', { platform: 'twitter' });
```

### Programmatic rating

```javascript
await gamesFeedback.rate(5); // 1-5 stars
```

### Programmatic comment

```javascript
await gamesFeedback.comment('Great game!', 'Alex');
// or anonymous:
await gamesFeedback.comment('Great game!');
```

### Get stats

```javascript
const { stats, comments } = await gamesFeedback.getStats();
console.log('Average rating:', stats.rating_avg);
console.log('View count:', stats.view_count);
```

## Customization

The widget includes default styles. To customize, override these CSS classes:

- `.game-rating` — rating container
- `.rating-stars` — star row
- `.star` — individual star
- `.star.filled` — filled star
- `.game-comments` — comments container
- `.comment-form` — comment form
- `.comment` — individual comment

## Events Tracked

- `view` — auto-fired on page load
- `play_start` — manually trigger when game starts
- `play_complete` — manually trigger when game ends
- `share_click` — manually trigger when share button clicked
- `rate` — auto-fired when user rates
- `comment` — auto-fired when user comments

## Example Game Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Game</title>
</head>
<body>
  <div id="game-container">
    <!-- Your game here -->
    <button id="start-btn">Start Game</button>
    <button id="share-btn">Share</button>
  </div>

  <!-- Feedback widgets -->
  <div id="game-rating"></div>
  <div id="game-comments"></div>

  <script src="https://games.nsprd.com/feedback-widget.js"></script>
  <script>
    gamesFeedback.init({ slug: 'my-game' });

    document.getElementById('start-btn').addEventListener('click', () => {
      gamesFeedback.event('play_start');
      // start game logic
    });

    document.getElementById('share-btn').addEventListener('click', () => {
      gamesFeedback.event('share_click', { platform: 'clipboard' });
      // share logic
    });

    // When game ends:
    function onGameEnd(score) {
      gamesFeedback.event('play_complete', { score });
    }
  </script>
</body>
</html>
```

## Notes

- Widget automatically generates and persists a `visitor_id` in localStorage
- Rating is limited to one per visitor per game (last rating wins)
- Comments have basic profanity filtering
- All API calls are rate-limited server-side
