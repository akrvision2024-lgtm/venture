/* Theme: light by default — only go dark if user explicitly chose it */
(function(){
  var t = localStorage.getItem('akr-theme');
  if (t === 'dark') document.documentElement.classList.add('dark');
  else {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('akr-theme');
  }
})();
