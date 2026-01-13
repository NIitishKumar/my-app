/**
 * ProgressBar Component
 * Top progress bar for navigation and long requests
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
  easing: 'ease',
  speed: 400,
});

export const ProgressBar = () => {
  const location = useLocation();

  useEffect(() => {
    // Start progress on route change
    NProgress.start();

    // Complete progress after a short delay
    const timer = setTimeout(() => {
      NProgress.done();
    }, 200);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  // Add custom styles for the progress bar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      #nprogress .bar {
        background: #4f46e5 !important;
        height: 3px !important;
        z-index: 9999 !important;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px #4f46e5, 0 0 5px #4f46e5 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};
