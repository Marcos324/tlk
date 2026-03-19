/**
 * Feed de Instagram (auto-actualizado)
 * 1. Entrá a https://snapwidget.com → Create widget → Instagram Feed
 * 2. Conectá @tulukatucuman, elegí 6 fotos, obtené el código de inserción
 * 3. En el iframe que te dan, copiá solo el valor de src= (ej: https://snapwidget.com/embed/123456)
 * 4. Pegalo abajo en SNAPWIDGET_IFRAME_SRC (reemplazá la cadena vacía)
 */
(function () {
  'use strict';

  var SNAPWIDGET_IFRAME_SRC = ''; // Ej: 'https://snapwidget.com/embed/ABC123'

  var container = document.getElementById('instagram-feed-container');
  var iframe = document.getElementById('instagram-feed-iframe');
  var setupMsg = document.getElementById('instagram-feed-setup');

  if (!container || !iframe) return;

  if (SNAPWIDGET_IFRAME_SRC && SNAPWIDGET_IFRAME_SRC.indexOf('snapwidget.com') !== -1) {
    iframe.src = SNAPWIDGET_IFRAME_SRC;
    if (setupMsg) setupMsg.style.display = 'none';
    iframe.onload = function () {
      iframe.style.minHeight = '380px';
    };
  } else {
    if (iframe) iframe.style.display = 'none';
    if (setupMsg) {
      setupMsg.innerHTML = 'Para mostrar las últimas 6 publicaciones automáticamente, creá un <a href="https://snapwidget.com/free-instagram-feed" target="_blank" rel="noopener">widget gratuito en SnapWidget</a> con @tulukatucuman y pegá la URL del iframe en <code>js/instagram-feed.js</code> (variable SNAPWIDGET_IFRAME_SRC).';
      setupMsg.classList.add('instagram-feed-setup--visible');
    }
  }
})();
