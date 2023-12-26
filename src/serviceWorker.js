// serviceWorker.js

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        console.log("hiiiiiiiiiiiiiiiiii")
        const registration = await navigator.serviceWorker.register('./service-worker.js');

        // Check if there's a waiting service worker
        if (registration.waiting) {
          // Awaiting for user confirmation to update
          await askUserToReload(registration);
        }
        
        // Check for updates on controller change
        registration.addEventListener('updatefound', () => {
          if (registration.installing) {
            // Track progress of installing service worker
            registration.installing.addEventListener('statechange', () => {
              if (registration.waiting) {
                // Awaiting for user confirmation to update
                askUserToReload(registration);
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    });
  }
}

async function askUserToReload(registration) {
  if (window.confirm('A new version is available. Reload to update?')) {
    // Send message to service worker to skip waiting and activate the new version
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}
