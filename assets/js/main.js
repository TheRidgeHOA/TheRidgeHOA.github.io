/* ---------------------------------------------------------------------------
 * The Ridge-Heath HOA - site JavaScript
 *
 * Two small, progressive-enhancement features:
 *   1. Mobile navigation toggle (hamburger <-> X, with aria-expanded).
 *   2. Click-to-reveal email obfuscation for officers.
 * The site is fully usable without JavaScript; this only enhances it.
 * ------------------------------------------------------------------------- */
(function () {
  'use strict';

  /* --- 1. Mobile navigation toggle --------------------------------------- */
  function initNavToggle() {
    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) {
      return;
    }

    function setOpen(isOpen) {
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close main menu' : 'Open main menu');
      nav.classList.toggle('is-open', isOpen);
      document.body.classList.toggle('nav-is-open', isOpen);
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });

    // Close the menu when a navigation link is activated.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        setOpen(false);
      }
    });

    // Close the menu on Escape for keyboard users.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* --- 2. Email obfuscation: click to reveal ----------------------------- */
  /* Click-to-reveal pattern: lightly discourages naive regex scrapers, but
   * the data-user/data-domain split is trivially recombined by any modern
   * harvester. Real privacy requires a contact form or a role-based address. */
  function initEmailReveal() {
    var buttons = document.querySelectorAll('[data-email-reveal]');

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        var user = button.getAttribute('data-user');
        var domain = button.getAttribute('data-domain');
        if (!user || !domain) {
          return;
        }
        var address = user + '@' + domain;
        var link = document.createElement('a');
        link.href = 'mailto:' + address;
        link.className = 'email-reveal__address';
        link.textContent = address;
        button.replaceWith(link);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavToggle();
    initEmailReveal();
  });
})();
