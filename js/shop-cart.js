/**
 * Carrito de tienda Tuluka — localStorage + pago tipo cuota (MP + alias + WhatsApp)
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'tuluka_cart';
  var WHATSAPP = '5493815086764';
  var ALIAS_MP = 'marcos.avila.mp';
  var MP_URL = 'https://www.mercadopago.com.ar';

  function getCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    updateBadge();
    renderDrawer();
  }

  function findIndex(items, id) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return i;
    }
    return -1;
  }

  function addToCart(id, name, price) {
    var items = getCart();
    var idx = findIndex(items, id);
    if (idx >= 0) {
      items[idx].qty += 1;
    } else {
      items.push({ id: id, name: name, price: price, qty: 1 });
    }
    saveCart(items);
    openDrawer();
  }

  function setQty(id, qty) {
    var items = getCart();
    var idx = findIndex(items, id);
    if (idx < 0) return;
    if (qty <= 0) {
      items.splice(idx, 1);
    } else {
      items[idx].qty = qty;
    }
    saveCart(items);
  }

  function clearCart() {
    saveCart([]);
  }

  function subtotal(items) {
    var t = 0;
    var hasConsultar = false;
    items.forEach(function (it) {
      if (it.price > 0) {
        t += it.price * it.qty;
      } else {
        hasConsultar = true;
      }
    });
    return { total: t, hasConsultar: hasConsultar };
  }

  function formatMoney(n) {
    return '$ ' + n.toLocaleString('es-AR');
  }

  function buildWhatsAppText(items, sub) {
    var lines = ['Hola, quiero confirmar pedido de la tienda Tuluka:'];
    items.forEach(function (it) {
      var line = '• ' + it.name + ' x' + it.qty;
      if (it.price > 0) line += ' (' + formatMoney(it.price * it.qty) + ')';
      else line += ' (precio a consultar)';
      lines.push(line);
    });
    if (sub.total > 0) {
      lines.push('Subtotal: ' + formatMoney(sub.total));
    }
    if (sub.hasConsultar) {
      lines.push('Incluye productos a cotizar.');
    }
    lines.push('¿Cómo sigo para pagar?');
    return encodeURIComponent(lines.join('\n'));
  }

  var drawer, overlay, badge, listEl, totalEl, btnFab;

  function setPayButtonsDisabled(disabled) {
    var mp = document.getElementById('cart-pay-mp');
    var wa = document.getElementById('cart-pay-wa');
    if (mp) {
      mp.disabled = disabled;
      mp.style.opacity = disabled ? '0.5' : '';
      mp.style.pointerEvents = disabled ? 'none' : '';
    }
    if (wa) {
      wa.disabled = disabled;
      wa.style.opacity = disabled ? '0.5' : '';
      wa.style.pointerEvents = disabled ? 'none' : '';
    }
  }

  function updateBadge() {
    var items = getCart();
    var count = 0;
    items.forEach(function (it) {
      count += it.qty;
    });
    if (badge) {
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function renderDrawer() {
    if (!listEl || !totalEl) return;
    var items = getCart();
    var sub = subtotal(items);

    if (items.length === 0) {
      listEl.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
      totalEl.innerHTML = '';
      setPayButtonsDisabled(true);
      return;
    }

    var html = '';
    items.forEach(function (it) {
      var lineTotal = it.price > 0 ? formatMoney(it.price * it.qty) : 'Consultar';
      html +=
        '<div class="cart-line" data-id="' +
        it.id +
        '">' +
        '<div class="cart-line-info">' +
        '<strong>' +
        escapeHtml(it.name) +
        '</strong>' +
        '<span class="cart-line-price">' +
        (it.price > 0 ? formatMoney(it.price) + ' c/u' : 'Precio a consultar') +
        '</span>' +
        '</div>' +
        '<div class="cart-line-actions">' +
        '<button type="button" class="cart-qty-btn" data-act="minus" data-id="' +
        it.id +
        '" aria-label="Menos">−</button>' +
        '<span class="cart-qty">' +
        it.qty +
        '</span>' +
        '<button type="button" class="cart-qty-btn" data-act="plus" data-id="' +
        it.id +
        '" aria-label="Más">+</button>' +
        '<span class="cart-line-sub">' +
        lineTotal +
        '</span>' +
        '<button type="button" class="cart-remove" data-id="' +
        it.id +
        '" aria-label="Quitar">×</button>' +
        '</div>' +
        '</div>';
    });
    listEl.innerHTML = html;

    var totalHtml = '';
    if (sub.total > 0) {
      totalHtml += '<p class="cart-total"><strong>Total a pagar (productos con precio):</strong> ' + formatMoney(sub.total) + '</p>';
    }
    if (sub.hasConsultar) {
      totalHtml += '<p class="cart-note">Algunos ítems se cotizan por WhatsApp; el total puede variar.</p>';
    }
    if (sub.total === 0 && !sub.hasConsultar) {
      totalHtml = '';
    } else if (sub.total === 0 && sub.hasConsultar) {
      totalHtml = '<p class="cart-note">Pedido solo con productos a consultar. Coordiná el precio por WhatsApp.</p>';
    }
    totalEl.innerHTML = totalHtml;

    listEl.querySelectorAll('.cart-qty-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var act = btn.getAttribute('data-act');
        var cart = getCart();
        var idx = findIndex(cart, id);
        if (idx < 0) return;
        var q = cart[idx].qty + (act === 'plus' ? 1 : -1);
        setQty(id, q);
      });
    });
    listEl.querySelectorAll('.cart-remove').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setQty(btn.getAttribute('data-id'), 0);
      });
    });
    setPayButtonsDisabled(false);
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function openDrawer() {
    if (drawer) drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (drawer) drawer.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    if (drawer) drawer.setAttribute('aria-hidden', 'true');
  }

  function init() {
    drawer = document.getElementById('cart-drawer');
    overlay = document.getElementById('cart-overlay');
    badge = document.getElementById('cart-badge');
    listEl = document.getElementById('cart-drawer-list');
    totalEl = document.getElementById('cart-drawer-total');
    btnFab = document.getElementById('btn-cart-fab');

    if (!drawer) return;

    document.querySelectorAll('[data-add-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-product-id');
        var name = btn.getAttribute('data-product-name');
        var price = parseInt(btn.getAttribute('data-product-price'), 10) || 0;
        addToCart(id, name, price);
      });
    });

    if (btnFab) {
      btnFab.addEventListener('click', function () {
        renderDrawer();
        openDrawer();
      });
    }

    var btnClose = document.getElementById('cart-drawer-close');
    if (btnClose) btnClose.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    var btnClear = document.getElementById('cart-clear');
    if (btnClear) {
      btnClear.addEventListener('click', function () {
        if (confirm('¿Vaciar el carrito?')) clearCart();
      });
    }

    var btnMp = document.getElementById('cart-pay-mp');
    if (btnMp) {
      btnMp.addEventListener('click', function () {
        if (getCart().length === 0) return;
        window.open(MP_URL, '_blank', 'noopener');
      });
    }

    var btnWa = document.getElementById('cart-pay-wa');
    if (btnWa) {
      btnWa.addEventListener('click', function () {
        var items = getCart();
        if (items.length === 0) return;
        var sub = subtotal(items);
        window.open('https://wa.me/' + WHATSAPP + '?text=' + buildWhatsAppText(items, sub), '_blank', 'noopener');
      });
    }

    updateBadge();
    renderDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
