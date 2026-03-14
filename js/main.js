/**
 * PowerGym - Sitio web gimnasio
 * Funcionalidad: menú móvil, validación de formularios, animaciones al scroll
 */

(function () {
  'use strict';

  // ===== Menú móvil =====
  const btnMenu = document.getElementById('btn-menu');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-list a');

  if (btnMenu && nav) {
    function toggleMenu() {
      btnMenu.classList.toggle('is-open');
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
    }

    function closeMenu() {
      btnMenu.classList.remove('is-open');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    btnMenu.addEventListener('click', toggleMenu);

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !btnMenu.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // ===== Scroll reveal =====
  const revealElements = document.querySelectorAll('.reveal');

  function reveal() {
    const windowHeight = window.innerHeight;
    const revealPoint = 120;

    revealElements.forEach(function (el) {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - revealPoint) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', reveal);
  window.addEventListener('load', reveal);

  // ===== Validación formulario de contacto =====
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    function showError(input, errorEl, message) {
      input.classList.add('error');
      if (errorEl) errorEl.textContent = message;
    }

    function clearError(input, errorEl) {
      input.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      clearError(nameInput, nameError);
      clearError(emailInput, emailError);
      clearError(messageInput, messageError);

      if (!nameInput.value.trim()) {
        showError(nameInput, nameError, 'Introduce tu nombre.');
        valid = false;
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, emailError, 'Introduce tu email.');
        valid = false;
      } else if (!validateEmail(emailInput.value)) {
        showError(emailInput, emailError, 'Email no válido.');
        valid = false;
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, messageError, 'Escribe un mensaje.');
        valid = false;
      }

      if (valid) {
        // Envío: mailto o aquí puedes conectar con un backend
        const mailto = 'mailto:hola@powergym.es?subject=Contacto web&body=' +
          encodeURIComponent(
            'Nombre: ' + nameInput.value + '\n' +
            'Email: ' + emailInput.value + '\n' +
            'Teléfono: ' + (document.getElementById('phone').value || '-') + '\n\n' +
            'Mensaje:\n' + messageInput.value
          );
        window.location.href = mailto;
        contactForm.reset();
        alert('Se abrirá tu cliente de correo. Si prefieres que enviemos el mensaje por ti, configura un backend en el formulario.');
      }
    });

    nameInput.addEventListener('input', function () { clearError(nameInput, nameError); });
    emailInput.addEventListener('input', function () { clearError(emailInput, emailError); });
    messageInput.addEventListener('input', function () { clearError(messageInput, messageError); });
  }

  // ===== Newsletter =====
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    const newsletterEmail = document.getElementById('newsletter-email');
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (newsletterEmail && newsletterEmail.value.trim()) {
        alert('¡Gracias por suscribirte! Te enviaremos novedades y ofertas.');
        newsletterForm.reset();
      } else {
        newsletterEmail.focus();
      }
    });
  }

  // ===== Header con scroll (opcional: reducir tamaño al hacer scroll)
  const header = document.getElementById('header');
  if (header) {
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var currentScroll = window.pageYOffset;
      if (currentScroll > 80) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = currentScroll;
    });
  }
})();
