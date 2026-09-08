// Service Worker & PWA Install Registration

let deferredPrompt = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker Registered Successfully:', reg.scope))
      .catch(err => console.log('Service Worker Registration Failed:', err));
  });
}

// Catch Install Prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btnInstall = document.getElementById('btn-pwa-install');
  if (btnInstall) {
    btnInstall.style.display = 'inline-flex';
    btnInstall.addEventListener('click', installPWA);
  }
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted PWA installation');
      }
      deferredPrompt = null;
      const btnInstall = document.getElementById('btn-pwa-install');
      if (btnInstall) btnInstall.style.display = 'none';
    });
  }
}
