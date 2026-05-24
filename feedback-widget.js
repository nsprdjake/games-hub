/**
 * Games Feedback Widget
 * Drop-in widget for game feedback (ratings, comments, events)
 *
 * Usage:
 *   <script src="https://games.nsprd.com/feedback-widget.js"></script>
 *   <script>
 *     gamesFeedback.init({
 *       slug: 'your-game-slug',
 *       apiBase: 'https://games-api.vercel.app' // optional
 *     });
 *   </script>
 *
 *   <!-- Rating UI -->
 *   <div id="game-rating"></div>
 *
 *   <!-- Comments -->
 *   <div id="game-comments"></div>
 */

(function(window) {
  'use strict';

  const DEFAULT_API_BASE = 'https://api.games.nsprd.com';

  let config = {
    slug: null,
    apiBase: DEFAULT_API_BASE,
    visitorId: null
  };

  // Generate or retrieve visitor ID
  function getVisitorId() {
    let id = localStorage.getItem('games_visitor_id');
    if (!id) {
      id = 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      localStorage.setItem('games_visitor_id', id);
    }
    return id;
  }

  // API call helper
  async function apiCall(endpoint, method = 'GET', body = null) {
    const url = `${config.apiBase}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }
      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Record event
  async function recordEvent(kind, meta = {}) {
    if (!config.slug) {
      console.warn('gamesFeedback not initialized');
      return;
    }

    try {
      await apiCall('/api/event', 'POST', {
        slug: config.slug,
        kind,
        visitor_id: config.visitorId,
        meta
      });
    } catch (error) {
      console.error('Failed to record event:', error);
    }
  }

  // Submit rating
  async function submitRating(stars) {
    if (!config.slug) {
      throw new Error('gamesFeedback not initialized');
    }

    await apiCall('/api/rate', 'POST', {
      slug: config.slug,
      stars,
      visitor_id: config.visitorId
    });

    await recordEvent('rate', { stars });
  }

  // Submit comment
  async function submitComment(body, displayName = null) {
    if (!config.slug) {
      throw new Error('gamesFeedback not initialized');
    }

    const result = await apiCall('/api/comment', 'POST', {
      slug: config.slug,
      body,
      display_name: displayName,
      visitor_id: config.visitorId
    });

    await recordEvent('comment');
    return result;
  }

  // Get stats
  async function getStats() {
    if (!config.slug) {
      throw new Error('gamesFeedback not initialized');
    }

    return await apiCall(`/api/stats/${config.slug}`);
  }

  // Render rating UI
  function renderRating(selector) {
    const container = document.querySelector(selector);
    if (!container) return;

    const savedRating = localStorage.getItem(`rating_${config.slug}`);

    container.innerHTML = `
      <div class="game-rating">
        <div class="rating-stars" id="rating-stars">
          ${[1, 2, 3, 4, 5].map(n => `
            <span class="star ${savedRating >= n ? 'filled' : ''}" data-rating="${n}">★</span>
          `).join('')}
        </div>
        <div class="rating-text" id="rating-text">
          ${savedRating ? `You rated ${savedRating} stars` : 'Tap to rate'}
        </div>
      </div>
      <style>
        .game-rating {
          text-align: center;
          padding: 1rem;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .rating-stars {
          font-size: 2rem;
          letter-spacing: 0.25rem;
          cursor: pointer;
        }
        .star {
          color: #ddd;
          transition: color 0.2s;
        }
        .star.filled,
        .star:hover,
        .star:hover ~ .star {
          color: #ffd700;
        }
        .rating-text {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #666;
        }
      </style>
    `;

    // Handle rating clicks
    container.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', async (e) => {
        const rating = parseInt(e.target.dataset.rating);

        try {
          await submitRating(rating);
          localStorage.setItem(`rating_${config.slug}`, rating);

          // Update UI
          container.querySelectorAll('.star').forEach((s, i) => {
            s.classList.toggle('filled', i < rating);
          });
          document.getElementById('rating-text').textContent = `You rated ${rating} stars`;
        } catch (error) {
          alert('Failed to save rating: ' + error.message);
        }
      });
    });
  }

  // Render comments UI
  async function renderComments(selector) {
    const container = document.querySelector(selector);
    if (!container) return;

    try {
      const { comments } = await getStats();

      container.innerHTML = `
        <div class="game-comments">
          <h3>Comments</h3>

          <form class="comment-form" id="comment-form">
            <input
              type="text"
              id="comment-name"
              placeholder="Your name (optional)"
              maxlength="50"
            />
            <textarea
              id="comment-body"
              placeholder="Leave a comment..."
              maxlength="500"
              required
            ></textarea>
            <button type="submit">Post Comment</button>
          </form>

          <div class="comments-list" id="comments-list">
            ${comments.length === 0 ? '<p class="no-comments">No comments yet. Be the first!</p>' : ''}
            ${comments.map(c => `
              <div class="comment">
                <div class="comment-header">
                  <strong>${c.display_name || 'Anonymous'}</strong>
                  <span class="comment-date">${new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <div class="comment-body">${escapeHtml(c.body)}</div>
              </div>
            `).join('')}
          </div>
        </div>
        <style>
          .game-comments {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 600px;
            margin: 2rem auto;
            padding: 1rem;
          }
          .game-comments h3 {
            margin-bottom: 1rem;
          }
          .comment-form {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 2rem;
            padding: 1rem;
            background: #f5f5f5;
            border-radius: 8px;
          }
          .comment-form input,
          .comment-form textarea {
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: inherit;
            font-size: 1rem;
          }
          .comment-form textarea {
            min-height: 80px;
            resize: vertical;
          }
          .comment-form button {
            padding: 0.5rem 1rem;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
          }
          .comment-form button:hover {
            background: #0056b3;
          }
          .comments-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .comment {
            padding: 1rem;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
          }
          .comment-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            color: #333;
          }
          .comment-date {
            font-size: 0.875rem;
            color: #999;
          }
          .comment-body {
            color: #666;
            line-height: 1.5;
          }
          .no-comments {
            text-align: center;
            color: #999;
            padding: 2rem;
          }
        </style>
      `;

      // Handle comment submission
      document.getElementById('comment-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('comment-name').value.trim();
        const body = document.getElementById('comment-body').value.trim();

        if (!body) return;

        try {
          await submitComment(body, name || null);

          // Refresh comments
          await renderComments(selector);
        } catch (error) {
          alert('Failed to post comment: ' + error.message);
        }
      });

    } catch (error) {
      container.innerHTML = `<p>Failed to load comments</p>`;
      console.error('Failed to render comments:', error);
    }
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Public API
  window.gamesFeedback = {
    init: function(options) {
      config.slug = options.slug;
      config.apiBase = options.apiBase || DEFAULT_API_BASE;
      config.visitorId = getVisitorId();

      // Auto-fire view event
      recordEvent('view');

      // Auto-render if elements exist
      if (document.getElementById('game-rating')) {
        renderRating('#game-rating');
      }
      if (document.getElementById('game-comments')) {
        renderComments('#game-comments');
      }
    },

    event: recordEvent,
    rate: submitRating,
    comment: submitComment,
    getStats: getStats,
    renderRating: renderRating,
    renderComments: renderComments
  };

})(window);
