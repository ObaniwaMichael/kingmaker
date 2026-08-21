// Light scroll polish for Projects page — never hide copy
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initProjectsScrollAnimations() {
  if (!document.body.classList.contains('projects-page')) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return;
  }

  const scroller = document.getElementById('projectsSnap') || document.querySelector('.projects-snap-container');
  const panels = document.querySelectorAll('.project-panel');
  if (!panels.length) return;

  let isMobile = window.innerWidth <= 960;
  window.addEventListener(
    'resize',
    () => {
      isMobile = window.innerWidth <= 960;
    },
    { passive: true }
  );

  const scrollTriggerDefaults = scroller ? { scroller } : {};

  panels.forEach((panel, index) => {
    const isOdd = index % 2 === 0;
    const projectCard = panel.querySelector('.project-card');
    const accent = panel.querySelector('.panel-accent');

    // Subtle card motion only — titles, descriptions, tags, and links stay fully visible
    if (projectCard && !isMobile) {
      gsap.fromTo(
        projectCard,
        { x: isOdd ? 24 : -24, scale: 0.98 },
        {
          x: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            ...scrollTriggerDefaults,
            trigger: panel,
            start: 'top 85%',
            toggleActions: 'play none none none',
            once: true,
          },
        }
      );

      gsap.to(projectCard, {
        y: isOdd ? -16 : 16,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          ...scrollTriggerDefaults,
          trigger: panel,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }

    if (accent) {
      gsap.fromTo(
        accent,
        { opacity: 0.35 },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            ...scrollTriggerDefaults,
            trigger: panel,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }
  });

  const snapIndicator = document.querySelector('.snap-indicator');
  if (snapIndicator) {
    gsap.to(snapIndicator, {
      opacity: 0.4,
      y: 8,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  let refreshTimeout;
  const refreshScrollTrigger = () => {
    clearTimeout(refreshTimeout);
    refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  let resizeTimeout;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(refreshScrollTrigger, 300);
    },
    { passive: true }
  );

  const images = document.querySelectorAll('.project-card img');
  let loadedCount = 0;
  const totalImages = images.length;

  if (totalImages === 0) {
    refreshScrollTrigger();
    return;
  }

  images.forEach((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      loadedCount++;
    } else {
      img.addEventListener(
        'load',
        () => {
          loadedCount++;
          if (loadedCount === totalImages) refreshScrollTrigger();
        },
        { once: true }
      );
      img.addEventListener(
        'error',
        () => {
          loadedCount++;
          if (loadedCount === totalImages) refreshScrollTrigger();
        },
        { once: true }
      );
    }
  });

  if (loadedCount === totalImages) {
    refreshScrollTrigger();
  }
}

function init() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(() => initProjectsScrollAnimations());
    });
  } else {
    requestAnimationFrame(() => initProjectsScrollAnimations());
  }
}

init();
