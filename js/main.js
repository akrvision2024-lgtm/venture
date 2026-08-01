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
