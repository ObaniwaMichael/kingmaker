// Enhanced Slideshow functionality with image preloading
export class AdvancedSlideshow {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.slide');
    this.totalSlides = this.slides.length;
    this.interval = null;
    this.isTransitioning = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    if (!this.totalSlides) return;
    this.init();
  }

  init() {
    // Show first slide immediately — don't wait on preload
    this.slides[this.currentSlide].classList.add('active');

    this.preloadImages().finally(() => {
      this.startSlideshow();
      this.setupEventListeners();
    });
  }

  preloadImages() {
    const imagePromises = Array.from(this.slides).map((slide) => {
      const img = slide.querySelector('img');
      if (!img) return Promise.resolve();

      if (img.complete && img.naturalHeight !== 0) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
      });
    });

    // Never block the slideshow if one image fails
    return Promise.allSettled(imagePromises);
  }

  startSlideshow() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (!this.isTransitioning) {
        this.nextSlide();
      }
    }, 4500);
  }

  nextSlide() {
    if (this.isTransitioning || !this.totalSlides) return;

    this.isTransitioning = true;
    this.slides[this.currentSlide].classList.remove('active');
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.slides[this.currentSlide].classList.add('active');

    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }

  setupEventListeners() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (!slideshowContainer) return;

    slideshowContainer.addEventListener('mouseenter', () => {
      if (this.interval) clearInterval(this.interval);
    });

    slideshowContainer.addEventListener('mouseleave', () => {
      this.startSlideshow();
    });

    slideshowContainer.addEventListener(
      'touchstart',
      (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    slideshowContainer.addEventListener(
      'touchend',
      (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      },
      { passive: true }
    );

    slideshowContainer.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }

  previousSlide() {
    if (this.isTransitioning || !this.totalSlides) return;

    this.isTransitioning = true;
    this.slides[this.currentSlide].classList.remove('active');
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.slides[this.currentSlide].classList.add('active');

    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AdvancedSlideshow();
});
