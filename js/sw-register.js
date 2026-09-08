// Service Worker & PWA Update Handler

let deferredPrompt = null;
let swRegistration = null;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        swRegistration = reg;
        console.log('Service Worker Registered Successfully:', reg.scope);

        // Check if there is an update waiting
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBadge();
            }
          });
        });
      })
      .catch(err => console.log('Service Worker Registration Failed:', err));
  });
}

// Show badge when update is ready
function showUpdateBadge() {
  const btnUpdate = document.getElementById('btn-update-app');
  if (btnUpdate) {
    btnUpdate.innerHTML = `🔄 <span style="color:#f87171; font-weight:bold;">🔴 Update Ready!</span>`;
    btnUpdate.classList.add('btn-accent');
  }
}

// Manual Check & Apply App Updates
function checkForAppUpdate() {
  const btnUpdate = document.getElementById('btn-update-app');
  if (btnUpdate) {
    btnUpdate.innerHTML = `🔄 Checking...`;
    btnUpdate.disabled = true;
  }

  if ('serviceWorker' in navigator && swRegistration) {
    swRegistration.update().then(() => {
      // Clear cache storage and force page reload
      if ('caches' in window) {
        caches.keys().then(names => {
          Promise.all(names.map(name => caches.delete(name))).then(() => {
            console.log('Caches cleared. Reloading page...');
            window.location.reload(true);
          });
        });
      } else {
        window.location.reload(true);
      }
    }).catch(err => {
      console.warn('Update check error:', err);
      window.location.reload(true);
    });
  } else {
    // Fallback force reload
    window.location.reload(true);
  }
}

// Catch PWA Install Prompt
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
