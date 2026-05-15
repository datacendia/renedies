/* Markdown renderer wrapper.
   Loads marked.js from CDN, fetches a .md file, renders into #content.
   Falls back gracefully on file:// protocol with instructions.
*/
(function () {
  const target = document.getElementById('content');
  const mdFile = document.body.getAttribute('data-md');
  if (!target || !mdFile) return;

  function loadMarked() {
    return new Promise((resolve, reject) => {
      if (window.marked) return resolve(window.marked);
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/marked@12/marked.min.js';
      s.onload = () => resolve(window.marked);
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function renderMd(text) {
    return loadMarked().then(m => {
      m.use({ breaks: false, gfm: true });
      target.innerHTML = m.parse(text);
      // Add anchor IDs and copy-pill class to inline code that looks like a domain or short script
      target.querySelectorAll('h1, h2, h3, h4').forEach(h => {
        if (!h.id) {
          h.id = h.textContent.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim().replace(/\s+/g, '-');
        }
      });
      // Initialize scroll-spy on dynamically-built content if shared.js loaded after
      window.dispatchEvent(new Event('scroll'));
      // Build dynamic TOC into [data-md-toc] if present
      const tocEl = document.querySelector('[data-md-toc]');
      if (tocEl) {
        const headings = target.querySelectorAll('h2, h3');
        const toc = [];
        headings.forEach(h => {
          const lvl = h.tagName === 'H3' ? 'nested' : '';
          toc.push(`<a href="#${h.id}" class="${lvl}">${h.textContent}</a>`);
        });
        tocEl.innerHTML = toc.join('');
      }
    });
  }

  function showFallback(err) {
    target.innerHTML = `
      <div class="callout warn">
        <strong>⚠️ This page needs to be served via HTTP to render the linked Markdown.</strong>
        <p style="margin: 10px 0 0;">You opened it via <code>file://</code>, which browsers block for fetching local files.</p>
        <p style="margin: 10px 0 0;"><strong>Quickest fix:</strong></p>
        <pre style="background: var(--code-bg); padding: 12px; border-radius: 6px; overflow:auto; margin: 8px 0;">cd c:\\Users\\User\\Remidies
npx serve .
# then open http://localhost:3000/${location.pathname.split('/').pop()}</pre>
        <p style="margin: 10px 0 0;">Or open the source markdown directly: <a href="${mdFile}">${mdFile}</a></p>
        <p style="margin: 10px 0 0; color: var(--muted); font-size: 0.85em;">Once deployed to Netlify, this fallback never appears.</p>
      </div>
    `;
    console.warn('Markdown fetch failed:', err);
  }

  fetch(mdFile)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(renderMd)
    .catch(showFallback);
})();
