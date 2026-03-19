/**
 * Configuración de pagos Tuluka — EDITÁ SOLO AQUÍ el alias de Mercado Pago
 */
window.TULUKA_MP = {
  alias: 'marcos.avila.mp', // <-- Cambiá por tu nuevo alias (ej: tuluka.mp)
  mercadoPagoUrl: 'https://www.mercadopago.com.ar',
  whatsapp: '5493815086764'
};

function tulukaApplyAliasToPage() {
  var a = window.TULUKA_MP && window.TULUKA_MP.alias;
  if (!a) return;
  document.querySelectorAll('[data-alias-mp]').forEach(function (el) {
    el.textContent = a;
  });
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tulukaApplyAliasToPage);
} else {
  tulukaApplyAliasToPage();
}
