import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import './styles/index.css'

// PWA Service Worker event listeners for logging
if ('serviceWorker' in navigator) {
  // Wait for the plugin's auto-registration to complete, then add listeners
  window.addEventListener('load', () => {
    // Listen for service worker registration (plugin handles registration)
    navigator.serviceWorker.ready.then((registration) => {
      console.log('✅ Service Worker ready - App can work offline');

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New version available! The app will update automatically.');
            } else if (newWorker.state === 'activated') {
              console.log('✅ New version activated');
            }
          });
        }
      });
    });

    // Listen for service worker controller changes
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('🔄 Service Worker updated');
    });

    // Listen for service worker messages
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('🔄 Service Worker skip waiting');
      }
    });
  });

  // Handle offline/online status
  window.addEventListener('online', () => {
    console.log('✅ App is online');
  });

  window.addEventListener('offline', () => {
    console.log('📴 App is offline - using cached content');
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
