/* ===========================================================
   Remedia Shared JS
   Provides: click-to-copy, search filter, dark/light toggle,
            scroll-spy sidebar highlighting
   =========================================================== */
(function () {
  'use strict';

  // ---------- THEME TOGGLE ----------
  const THEME_KEY = 'remedia-theme';
  function applyTheme(t) {
    document.documentElement.classList.toggle('light', t === 'light');
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = t === 'light' ? '🌙 Dark' : '☀ Light';
  }
  function toggleTheme() {
    const cur = localStorage.getItem(THEME_KEY) || 'dark';
    const next = cur === 'light' ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }
  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

  // ---------- CLICK-TO-COPY ----------
  function copyText(text, el) {
    navigator.clipboard.writeText(text).then(() => {
      const orig = el.textContent;
      const wasBtn = el.classList.contains('copy-btn');
      el.classList.add('copied');
      el.textContent = wasBtn ? '✓ copied' : '✓ copied!';
      setTimeout(() => {
        el.textContent = orig;
        el.classList.remove('copied');
      }, 900);
    });
  }

  document.addEventListener('click', function (e) {
    // Theme toggle
    const themeBtn = e.target.closest('.theme-toggle');
    if (themeBtn) { toggleTheme(); return; }

    // .dom or .copy-pill: copy own text
    const pill = e.target.closest('.dom, .copy-pill');
    if (pill && !e.target.closest('.copy-btn')) {
      copyText(pill.textContent.trim(), pill);
      return;
    }

    // .copy-btn with data-target: copy that element's textContent
    const btn = e.target.closest('.copy-btn');
    if (btn) {
      const tgtId = btn.getAttribute('data-target');
      if (tgtId) {
        const tgt = document.getElementById(tgtId);
        if (tgt) copyText(tgt.textContent.trim(), btn);
      }
      return;
    }
  });

  // ---------- SEARCH FILTER ----------
  // Filters anything with class .filterable based on its textContent
  // Updates count in #search-count if present
  const search = document.getElementById('search');
  const countEl = document.getElementById('search-count');
  const sections = () => document.querySelectorAll('.filterable, tr.dom-row, .prompt[data-searchable]');

  function applyFilter() {
    if (!search) return;
    const q = search.value.trim().toLowerCase();
    let visible = 0, hidden = 0;
    sections().forEach(el => {
      if (!q) {
        el.classList.remove('dom-hidden', 'hidden');
        visible++;
      } else if (el.textContent.toLowerCase().includes(q)) {
        el.classList.remove('dom-hidden', 'hidden');
        visible++;
      } else {
        if (el.tagName === 'TR') el.classList.add('dom-hidden');
        else el.classList.add('hidden');
        hidden++;
      }
    });
    if (countEl) {
      countEl.textContent = q ? `${visible} match${visible === 1 ? '' : 'es'}` : '';
    }
  }
  if (search) search.addEventListener('input', applyFilter);

  // ---------- SCROLL-SPY ----------
  const navLinks = Array.from(document.querySelectorAll('aside nav a[href^="#"]'));
  const targets = navLinks
    .map(a => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      return el ? { link: a, el } : null;
    })
    .filter(Boolean);

  function onScroll() {
    if (!targets.length) return;
    const y = window.scrollY + 120; // offset so the section is "active" before its top hits
    let active = targets[0];
    for (const t of targets) {
      if (t.el.offsetTop <= y) active = t;
      else break;
    }
    navLinks.forEach(a => a.classList.remove('active'));
    if (active) active.link.classList.add('active');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onScroll);

  // ---------- KEYBOARD SHORTCUTS ----------
  document.addEventListener('keydown', function (e) {
    // Cmd/Ctrl+K focuses search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      if (search) {
        e.preventDefault();
        search.focus();
        search.select();
      }
    }
    // Esc clears search
    if (e.key === 'Escape' && search && document.activeElement === search) {
      search.value = '';
      applyFilter();
    }
    // Shift+T toggles theme
    if (e.shiftKey && e.key === 'T' && document.activeElement !== search) {
      toggleTheme();
    }
  });
})();
