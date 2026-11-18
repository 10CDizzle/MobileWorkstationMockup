/* ==========================================================================
   Casework — interactions.
   Everything here is progressive enhancement. With JavaScript disabled the
   page still reads, the FAQ still opens, and the form still posts to Google.
   ========================================================================== */
(function () {
  'use strict';

  var cfg = window.CASEWORK_CONFIG || {};
  var doc = document;

  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || doc).querySelectorAll(sel));
  }

  /* ====================================================== config into DOM */

  /* Prices — config wins over whatever is printed in the markup. */
  var plans = cfg.plans || {};
  Object.keys(plans).forEach(function (key) {
    var plan = plans[key] || {};
    if (plan.price) {
      $$('[data-price="' + key + '"]').forEach(function (el) {
        el.textContent = plan.price;
      });
    }
    if (plan.period) {
      $$('[data-period="' + key + '"]').forEach(function (el) {
        el.textContent = plan.period;
      });
    }
    /* Keep the radio value identical to the Google Form answer text. */
    if (plan.formValue) {
      var radio = $('input[data-plan-input="' + key + '"]');
      if (radio) { radio.value = plan.formValue; }
    }
  });

  /* Brand + contact, for anything rendered from config. */
  if (cfg.brand) {
    $$('[data-brand]').forEach(function (el) { el.textContent = cfg.brand; });
  }

  var yearEl = $('#year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ================================================ form: ids and plumbing */

  var form = $('#waitlist-form');
  var gform = cfg.googleForm || {};
  var entries = gform.entries || {};

  /* Which element(s) carry which Google Form entry id. */
  var FIELD_MAP = {
    email:       '#f-email',
    firstName:   '#f-first',
    role:        '#f-role',
    nights:      '#f-nights',
    reimburse:   '#f-reimburse',
    wtp:         '#f-wtp',
    notes:       '#f-notes',
    utmSource:   '#f-utm',
    planClicked: '#f-plan-clicked',
    plan:        '#plan-field input[type="radio"]',
    mustHaves:   '#musthaves-field input[type="checkbox"]'
  };

  if (form) {
    /* Point the form at the configured Google Form. */
    if (gform.formId) {
      form.setAttribute(
        'action',
        'https://docs.google.com/forms/d/e/' + gform.formId + '/formResponse'
      );
    }

    /* Stamp entry ids from config so js/config.js is the single source. */
    Object.keys(FIELD_MAP).forEach(function (key) {
      var id = entries[key];
      if (!id) { return; }
      $$(FIELD_MAP[key], form).forEach(function (el) {
        el.setAttribute('name', id);
      });
    });
  }

  /* ----------------------------------------------- where did they come from */
  var params = new URLSearchParams(window.location.search);
  var source = params.get('utm_source') || params.get('ref') || '';
  var utmField = $('#f-utm');
  if (utmField) {
    var campaign = params.get('utm_campaign');
    utmField.value = source
      ? (campaign ? source + ' / ' + campaign : source)
      : 'direct';
  }

  /* ------------------------------------------------ pricing CTA -> the form */
  var planClickedField = $('#f-plan-clicked');

  $$('[data-plan]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-plan');
      var radio = $('input[data-plan-input="' + key + '"]');

      if (radio) {
        radio.checked = true;
        syncChoiceStates();
        if (planClickedField) { planClickedField.value = radio.value; }
      }

      var target = $('#waitlist');
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start'
        });
      }
      /* Move keyboard focus along with the scroll. */
      window.setTimeout(function () {
        if (radio) { radio.focus({ preventScroll: true }); }
      }, prefersReducedMotion() ? 0 : 420);
    });
  });

  /* -------------------------------------------- checked-state for choices */
  function syncChoiceStates() {
    $$('.choice').forEach(function (label) {
      var input = $('input', label);
      label.classList.toggle('is-checked', !!(input && input.checked));
    });
  }

  $$('.choice input').forEach(function (input) {
    input.addEventListener('change', syncChoiceStates);
  });
  syncChoiceStates();

  /* ------------------------------------------------------------- submitting */
  var successPanel = $('#form-success');
  var errorPanel = $('#form-error');
  var honeypot = $('#f-company');

  if (form) {
    form.addEventListener('submit', function (event) {
      /* Native validation has already passed if we got here. */
      event.preventDefault();

      /* Spam trap: a human never sees this field, so a value means a bot.
         Pretend everything went fine and drop it on the floor. */
      if (honeypot && honeypot.value.trim() !== '') {
        showSuccess();
        return;
      }

      var submitBtn = $('button[type="submit"]', form);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (errorPanel) { errorPanel.hidden = true; }

      var data = new FormData(form);
      data.delete('company_website');

      fetch(form.getAttribute('action'), {
        method: 'POST',
        mode: 'no-cors',
        body: data
      }).then(function () {
        /* The response is opaque by design — resolving is all we get. */
        showSuccess();
      }).catch(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Join the waitlist';
        }
        if (errorPanel) { errorPanel.hidden = false; }
      });
    });
  }

  function showSuccess() {
    if (!successPanel || !form) { return; }
    form.hidden = true;
    successPanel.hidden = false;
    successPanel.focus();
  }

  /* ------------------------------------------------------- copy invite link */
  var copyBtn = $('#copy-link');
  var copyStatus = $('#copy-status');

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var url = window.location.origin + window.location.pathname + '?ref=friend';
      if (window.location.protocol === 'file:') {
        url = window.location.href.split('?')[0].split('#')[0] + '?ref=friend';
      }

      copyToClipboard(url).then(function () {
        say('Link copied.');
      }).catch(function () {
        say('Copy failed — the link is ' + url);
      });
    });
  }

  function say(message) {
    if (copyStatus) { copyStatus.textContent = message; }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var scratch = doc.createElement('textarea');
      scratch.value = text;
      scratch.setAttribute('readonly', '');
      scratch.style.position = 'absolute';
      scratch.style.left = '-9999px';
      doc.body.appendChild(scratch);
      scratch.select();
      var ok = false;
      try { ok = doc.execCommand('copy'); } catch (err) { ok = false; }
      doc.body.removeChild(scratch);
      ok ? resolve() : reject(new Error('copy unavailable'));
    });
  }

  /* ================================================== presentation niceties */

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* Sticky header gets a hairline once you scroll. */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Fade sections in as they arrive. */
  var targets = $$('.reveal');
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------- sticky CTA bar on phones */
  var bar = $('#mobile-cta');
  var hero = $('.hero');
  var waitlist = $('#waitlist');

  if (bar && hero && waitlist && 'IntersectionObserver' in window) {
    bar.hidden = false;
    document.body.classList.add('has-mobile-cta');

    var pastHero = false;
    var atForm = false;
    var paintBar = function () {
      bar.classList.toggle('is-shown', pastHero && !atForm);
    };

    new IntersectionObserver(function (entries) {
      pastHero = !entries[0].isIntersecting;
      paintBar();
    }, { threshold: 0 }).observe(hero);

    new IntersectionObserver(function (entries) {
      atForm = entries[0].isIntersecting;
      paintBar();
    }, { threshold: 0 }).observe(waitlist);
  }

  /* ------------------------------ close the phone menu after a jump */
  var menu = $('.menu');
  if (menu) {
    $$('.menu-panel a').forEach(function (link) {
      link.addEventListener('click', function () { menu.open = false; });
    });
    document.addEventListener('click', function (event) {
      if (menu.open && !menu.contains(event.target)) { menu.open = false; }
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        $('.menu > summary').focus();
      }
    });
  }

  /* ============================================== optional, off by default */
  var analytics = cfg.analytics || {};
  if (analytics.enabled && analytics.goatCounterCode) {
    var s = doc.createElement('script');
    s.async = true;
    s.setAttribute('data-goatcounter',
      'https://' + analytics.goatCounterCode + '.goatcounter.com/count');
    s.src = '//gc.zgo.at/count.js';
    doc.head.appendChild(s);
  }
}());
