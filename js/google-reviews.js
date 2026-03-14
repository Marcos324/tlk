/**
 * Opiniones de Google - Carga calificación y reseñas desde Google Places
 * Configurá placeId y apiKey en window.TULUKA_GOOGLE (en index.html)
 */
(function () {
  'use strict';

  var config = window.TULUKA_GOOGLE || {};
  var placeId = config.placeId || '';
  var apiKey = config.apiKey || '';
  var reviewLink = config.reviewLink || 'https://www.google.com/maps';

  var loadingEl = document.getElementById('google-reviews-loading');
  var contentEl = document.getElementById('google-reviews-content');
  var fallbackEl = document.getElementById('google-reviews-fallback');
  var ratingEl = document.getElementById('google-rating');
  var ratingTextEl = document.getElementById('google-rating-text');
  var reviewsListEl = document.getElementById('google-reviews-list');
  var linkEl = document.getElementById('google-reviews-link');
  var linkFallbackEl = document.getElementById('google-reviews-link-fallback');

  function showFallback() {
    if (loadingEl) loadingEl.style.display = 'none';
    if (contentEl) contentEl.style.display = 'none';
    if (fallbackEl) fallbackEl.style.display = 'block';
    if (linkFallbackEl) linkFallbackEl.href = reviewLink;
  }

  function starsHtml(rating) {
    var full = Math.floor(rating);
    var half = (rating % 1) >= 0.5 ? 1 : 0;
    var empty = 5 - full - half;
    var html = '';
    for (var i = 0; i < full; i++) html += '<span class="star star--full">★</span>';
    if (half) html += '<span class="star star--half">★</span>';
    for (var j = 0; j < empty; j++) html += '<span class="star star--empty">★</span>';
    return html;
  }

  function renderReviews(place) {
    if (!contentEl || !reviewsListEl) return;
    var rating = place.rating;
    var total = place.user_ratings_total;
    var reviews = place.reviews || [];

    if (ratingEl) ratingEl.innerHTML = starsHtml(rating);
    if (ratingTextEl) ratingTextEl.textContent = total ? rating + ' · ' + total + ' opiniones' : '';
    if (linkEl) linkEl.href = reviewLink;

    reviewsListEl.innerHTML = '';
    reviews.slice(0, 5).forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'google-review-card reveal';
      div.innerHTML =
        '<div class="google-review-header">' +
          '<span class="google-review-stars">' + starsHtml(r.rating) + '</span>' +
          '<span class="google-review-author">' + (r.author_name || '') + '</span>' +
          '<span class="google-review-time">' + (r.relative_time_description || '') + '</span>' +
        '</div>' +
        '<p class="google-review-text">' + (r.text || '').replace(/\n/g, '<br>') + '</p>';
      reviewsListEl.appendChild(div);
    });

    if (loadingEl) loadingEl.style.display = 'none';
    contentEl.style.display = 'block';
    if (fallbackEl) fallbackEl.style.display = 'none';

    var revealEls = reviewsListEl.querySelectorAll('.reveal');
    if (window.IntersectionObserver) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      }, { threshold: 0.1 });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  function loadGoogleAndFetch() {
    if (!placeId || !apiKey) {
      showFallback();
      return;
    }

    if (window.google && window.google.maps && window.google.maps.places) {
      fetchPlaceDetails();
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(apiKey) + '&libraries=places&callback=__tulukaGoogleCallback';
    script.async = true;
    script.defer = true;
    window.__tulukaGoogleCallback = function () {
      fetchPlaceDetails();
    };
    document.head.appendChild(script);
  }

  function fetchPlaceDetails() {
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      showFallback();
      return;
    }

    var div = document.createElement('div');
    var service = new window.google.maps.places.PlacesService(div);
    service.getDetails(
      {
        placeId: placeId,
        fields: ['name', 'rating', 'user_ratings_total', 'reviews']
      },
      function (place, status) {
        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) {
          showFallback();
          return;
        }
        renderReviews(place);
      }
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGoogleAndFetch);
  } else {
    loadGoogleAndFetch();
  }
})();
