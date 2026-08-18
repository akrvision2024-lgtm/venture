/* Disable right-click context menu */
document.addEventListener('contextmenu', function(e){ e.preventDefault(); });

/* Theme toggle logic */
(function(){
  var HTML = document.documentElement;
  var SUN  = '<svg aria-hidden="true" class="lucide h-4 w-4" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>';
  var MOON = '<svg aria-hidden="true" class="lucide h-4 w-4" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>';

  function isDark() { return HTML.classList.contains('dark'); }

  function syncButtons() {
    document.querySelectorAll('.theme-toggle').forEach(function(btn) {
      btn.innerHTML = isDark() ? SUN : MOON;
      btn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    syncButtons();
    document.querySelectorAll('.theme-toggle').forEach(function(btn) {
      btn.addEventListener('click', function() {
        HTML.classList.toggle('dark');
        localStorage.setItem('akr-theme', isDark() ? 'dark' : 'light');
        syncButtons();
      });
    });
  });
})();

/* Mobile menu toggle */
(function(){
  var menuBtn = document.querySelector('[aria-controls="mobile-menu"]');
  var mobileMenu = document.getElementById('mobile-menu');
  if (!menuBtn || !mobileMenu) return;
  var MENU_SVG = '<svg aria-hidden="true" class="lucide lucide-menu h-5 w-5" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>';
  var CLOSE_SVG = '<svg aria-hidden="true" class="lucide h-5 w-5" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>';
  function openMenu() { mobileMenu.hidden = false; menuBtn.setAttribute('aria-expanded','true'); menuBtn.setAttribute('aria-label','Close menu'); menuBtn.innerHTML = CLOSE_SVG; }
  function closeMenu() { mobileMenu.hidden = true; menuBtn.setAttribute('aria-expanded','false'); menuBtn.setAttribute('aria-label','Open menu'); menuBtn.innerHTML = MENU_SVG; }
  menuBtn.addEventListener('click', function() { mobileMenu.hidden ? openMenu() : closeMenu(); });
  mobileMenu.querySelectorAll('a').forEach(function(link) { link.addEventListener('click', closeMenu); });
})();

/* Hero video — fade in when playback starts (index.html only) */
(function(){
  var vid = document.getElementById('hero-video');
  if (!vid) return;
  vid.addEventListener('playing', function(){
    vid.style.opacity = '1';
  });
  vid.addEventListener('error', function(){ vid.style.opacity = '0'; });
})();

/* Scroll reveal — bring opacity:0 elements into view */
(function(){
  var els = document.querySelectorAll('[style*="opacity: 0"]');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el){ el.style.opacity='1'; el.style.transform='none'; }); return;
  }
  els.forEach(function(el){
    el.style.transition = 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)';
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.style.opacity='1'; e.target.style.transform='none'; io.unobserve(e.target); }
    });
  }, {threshold:0.08, rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){ io.observe(el); });
})();

/* Scroll progress bar */
(function(){
  var bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', function(){
    var pct = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, {passive:true});
})();

/* Navbar — deepen on scroll */
(function(){
  var hdr = document.querySelector('header');
  if (!hdr) return;
  window.addEventListener('scroll', function(){
    hdr.style.background = window.scrollY > 60 ? 'rgba(5,13,26,0.98)' : 'rgba(11,26,46,0.88)';
    hdr.style.boxShadow = window.scrollY > 60 ? '0 4px 24px rgba(0,0,0,0.35)' : 'none';
  }, {passive:true});
})();

/* Welcome approval popup — shows once per session */
(function(){
  var overlay = document.getElementById('akr-popup-overlay');
  if (!overlay) return;
  // Show once per browser session
  if (sessionStorage.getItem('akr-popup-seen')) {
    overlay.classList.add('hidden'); return;
  }
  var btn = document.getElementById('akr-popup-close');
  function closePopup() {
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.opacity = '0';
    setTimeout(function(){ overlay.classList.add('hidden'); }, 300);
    sessionStorage.setItem('akr-popup-seen', '1');
  }
  if (btn) btn.addEventListener('click', closePopup);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closePopup(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closePopup(); });
})();

/* K P Estates detail panel — close button & overlay click */
(function(){
  var panel = document.getElementById('kp-detail-panel');
  if (!panel) return;
  var closeBtn = document.getElementById('kp-detail-close');
  function closePanel() { panel.classList.add('hidden'); }
  if (closeBtn) closeBtn.addEventListener('click', closePanel);
  panel.addEventListener('click', function(e){ if (e.target === panel) closePanel(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closePanel(); });
})();

/* Floor config: update Unlock Price WhatsApp link when size is selected */
(function(){
  document.querySelectorAll('.akr-detail-config-select').forEach(function(sel) {
    sel.addEventListener('change', function() {
      var row  = sel.closest('.akr-detail-config');
      var btn  = row.querySelector('.akr-unlock-price-btn');
      if (!btn) return;
      /* WhatsApp disabled — link stays as # until number is ready */
    });
  });
})();

/* ── Brochure Download Modal ── */
(function(){
  /*
   * SETUP — Google Apps Script:
   * 1. Go to script.google.com → New project
   * 2. Paste the doPost function below, replace YOUR_SHEET_ID with your Google Sheet ID
   * 3. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy
   * 4. Copy the web app URL and paste it into SHEET_URL below
   *
   * Apps Script code:
   *   function doPost(e) {
   *     var sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
   *     var d = JSON.parse(e.postData.contents);
   *     sheet.appendRow([d.datetime, d.name, d.phone, d.email||'', d.message, d.source]);
   *     return ContentService.createTextOutput('OK');
   *   }
   *
   * BROCHURE: Place your PDF at brochure/kp-estates-brochure.pdf
   */
  var SHEET_URL    = 'https://script.google.com/macros/s/AKfycbxd2lTNJIJo29BqB7JXcNMMQSSdfsfan5cyDQJ8TsyIRgxYGAlpFrETBt92b5dhXFR20w/exec';
  var BROCHURE_URL = '/brochure/VISION_AKR_K_P_Estates_brochure.pdf';

  function openModal() {
    var m = document.getElementById('akr-brochure-modal');
    if (!m) return;
    m.classList.remove('hidden');
    setTimeout(function(){ var f = document.getElementById('akr-bf-name'); if(f) f.focus(); }, 50);
  }

  function closeModal() {
    var m = document.getElementById('akr-brochure-modal');
    if (!m) return;
    m.classList.add('hidden');
    var form = document.getElementById('akr-brochure-form');
    if (form) form.reset();
    clearErrors();
    var btn = document.getElementById('akr-brochure-submit');
    if (btn) { btn.disabled = false; btn.textContent = '\uD83D\uDCE5 Download Brochure'; }
  }

  function clearErrors() {
    ['name','phone','email','message'].forEach(function(f) {
      var err = document.getElementById('akr-err-' + f);
      if (err) err.textContent = '';
      var inp = document.getElementById('akr-bf-' + f);
      if (inp) inp.classList.remove('akr-input-error');
    });
  }

  function setError(field, msg) {
    var err = document.getElementById('akr-err-' + field);
    if (err) err.textContent = msg;
    var inp = document.getElementById('akr-bf-' + field);
    if (inp) { inp.classList.add('akr-input-error'); inp.focus(); }
  }

  function validate() {
    clearErrors();
    var ok = true;
    var name    = (document.getElementById('akr-bf-name').value    || '').trim();
    var phone   = (document.getElementById('akr-bf-phone').value   || '').trim();
    var email   = (document.getElementById('akr-bf-email').value   || '').trim();
    var message = (document.getElementById('akr-bf-message').value || '').trim();

    if (name.length < 2) {
      setError('name', 'Please enter your full name (min 2 characters).');
      ok = false;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('phone', 'Enter a valid 10-digit Indian mobile number.');
      ok = false;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('email', 'Enter a valid email address.');
      ok = false;
    }
    if (message.length < 5) {
      setError('message', 'Please enter a message (min 5 characters).');
      ok = false;
    }
    return ok;
  }

  function triggerDownload() {
    var a = document.createElement('a');
    a.href = BROCHURE_URL;
    a.download = 'KP-Estates-Brochure.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ a.remove(); }, 500);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    var btn = document.getElementById('akr-brochure-submit');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    var now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    var payload = {
      datetime : now,
      name     : (document.getElementById('akr-bf-name').value    || '').trim(),
      phone    : (document.getElementById('akr-bf-phone').value   || '').trim(),
      email    : (document.getElementById('akr-bf-email').value   || '').trim(),
      message  : (document.getElementById('akr-bf-message').value || '').trim(),
      source   : 'Brochure Download'
    };

    /* Save to Google Sheets
     * Uses fetch GET + keepalive:true so the request survives page navigation.
     * On iOS Safari, clicking the download link navigates the page which cancels
     * ordinary requests — keepalive prevents that. Falls back to script-tag for
     * very old browsers that lack fetch. Both are GET so doGet(e) handles both.
     */
    if (SHEET_URL && SHEET_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      var sheetUrl = SHEET_URL + '?' + new URLSearchParams(payload).toString();
      try {
        fetch(sheetUrl, { method: 'GET', mode: 'no-cors', keepalive: true }).catch(function(){});
      } catch (fetchErr) {
        /* Fallback for browsers without fetch */
        var s = document.createElement('script');
        s.src = sheetUrl;
        s.onerror = function(){ if (s.parentNode) s.remove(); };
        document.head.appendChild(s);
        setTimeout(function(){ if (s.parentNode) s.remove(); }, 8000);
      }
    }

    triggerDownload();
    btn.textContent = '\u2705 Download Started!';
    setTimeout(function() { closeModal(); }, 1800);
  }

  document.addEventListener('DOMContentLoaded', function() {
    var closeBtn = document.getElementById('akr-brochure-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    var modal = document.getElementById('akr-brochure-modal');
    if (modal) modal.addEventListener('click', function(ev){ if (ev.target === modal) closeModal(); });

    var form = document.getElementById('akr-brochure-form');
    if (form) form.addEventListener('submit', handleSubmit);

    /* Allow only digits in phone field */
    var phoneInput = document.getElementById('akr-bf-phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function(){
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
      });
    }

    document.addEventListener('keydown', function(ev){ if (ev.key === 'Escape') closeModal(); });
  });

  /* Expose global so onclick attribute can call it */
  window.akrDownloadBrochure = function(e) { e.preventDefault(); openModal(); };
})();

/* Unlock Price: show coming-soon toast */
var _akrToastTimer = null;
function akrUnlockPrice(e) {
  e.preventDefault();
  /* Remove any in-flight toast immediately so re-clicks always work */
  var existing = document.getElementById('akr-toast');
  if (existing) existing.remove();
  if (_akrToastTimer) { clearTimeout(_akrToastTimer); _akrToastTimer = null; }

  var toast = document.createElement('div');
  toast.id = 'akr-toast';
  toast.textContent = '\uD83D\uDCDE Pricing details coming soon \u2014 check back shortly!';
  /* Fully inline styles — works even if layout.css has a cache miss */
  toast.style.cssText = [
    'position:fixed', 'bottom:2rem', 'left:50%',
    'transform:translateX(-50%) translateY(20px)',
    'background:#0B1A2E', 'color:#EEE8DF',
    'font-size:0.875rem', 'font-weight:500', 'font-family:inherit',
    'padding:0.75rem 1.5rem', 'border-radius:999px',
    'border:1px solid rgba(201,116,50,0.45)',
    'box-shadow:0 8px 28px rgba(0,0,0,0.35)',
    'z-index:999999', 'opacity:0',
    'transition:opacity 0.3s ease,transform 0.3s ease',
    'pointer-events:none', 'white-space:nowrap'
  ].join(';');
  document.body.appendChild(toast);

  /* Double-RAF ensures the initial state is painted before the transition fires */
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  _akrToastTimer = setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 350);
    _akrToastTimer = null;
  }, 3000);
}
