// Particles system
class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > this.canvas.width || this.x < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.speedY = -this.speedY;
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.opacity;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
}

// Initialize particles
function initParticles() {
  const particlesContainer = document.getElementById('particles-js');
  if (!particlesContainer) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particlesContainer.appendChild(canvas);

  const particles = [];
  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas, ctx));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Theme management
const themes = [
  'theme-1', // Purple
  'theme-2', // Blue
  'theme-3', // Green
  'theme-4', // Red
  'theme-5', // Orange
  'theme-6'  // Teal
];

let currentThemeIndex = 0;

// Function to change theme
function changeTheme() {
  const body = document.body;
  
  // Remove current theme
  body.classList.remove(themes[currentThemeIndex]);
  
  // Move to next theme
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  
  // Add new theme
  body.classList.add(themes[currentThemeIndex]);
  
  // Update Three.js background colors to match theme
  if (window.threeBackground) {
    window.threeBackground.updateTheme(currentThemeIndex);
  }
  
  // Add transition animation
  body.classList.add('theme-transition');
  
  // Remove animation class after animation completes
  setTimeout(() => {
    body.classList.remove('theme-transition');
  }, 1000);
}

// Initialize with first theme
document.body.classList.add(themes[currentThemeIndex]);

// Change theme every 10 seconds
setInterval(changeTheme, 10000);

// Initialize Three.js background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Remove old particle system initialization
  // initParticles(); // Replaced by Three.js
  
  initModals();
  initNavigationDropdown();
});

// Modal functionality
function initModals() {
  // CV Modal
  const cvBtn = document.getElementById('cvBtn');
  const cvModal = document.getElementById('cvModal');
  const closeCvModal = document.getElementById('closeCvModal');
  const closeCvModalBtn = document.getElementById('closeCvModalBtn');
  const downloadCvBtn = document.getElementById('downloadCvBtn');

  // Contact Modal
  const contactBtn = document.getElementById('contactBtn');
  const contactModal = document.getElementById('contactModal');
  const closeContactModal = document.getElementById('closeContactModal');
  const emailBtn = document.getElementById('emailBtn');
  const phoneBtn = document.getElementById('phoneBtn');

  // CV Modal Event Listeners
  if (cvBtn && cvModal) {
    cvBtn.addEventListener('click', () => {
      cvModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      // Initialize CV modal when opened
      initCvModal();
    });
  }

  if (closeCvModal && cvModal) {
    closeCvModal.addEventListener('click', () => {
      cvModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  if (closeCvModalBtn && cvModal) {
    closeCvModalBtn.addEventListener('click', () => {
      cvModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }

  // CV Download Button
  const downloadCvPdfBtn = document.getElementById('downloadCvPdfBtn');

  if (downloadCvPdfBtn) {
    downloadCvPdfBtn.addEventListener('click', () => {
      try {
        const link = document.createElement('a');
        link.href = '/Michael_cv.pdf';
        link.download = 'Obaniwa_Michael_Resume.pdf';
        link.click();
      } catch (error) {
        console.error('Error downloading CV PDF:', error);
        alert('Unable to download CV PDF. Please contact me directly for my CV.');
      }
    });
  }

  // Contact Modal Event Listeners
  if (contactBtn && contactModal) {
  contactBtn.addEventListener('click', () => {
    contactModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
  }

  if (closeContactModal && contactModal) {
  closeContactModal.addEventListener('click', () => {
    contactModal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  }

  // Email functionality
  if (emailBtn) {
  emailBtn.addEventListener('click', () => {
    const email = 'Obaniwamichael17@gmail.com';
    const subject = 'Portfolio Inquiry';
    const body = 'Hello Obaniwa Michael,\n\nI would like to discuss a potential opportunity with you.\n\nBest regards,';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  });
  }

  // Phone functionality
  if (phoneBtn) {
  phoneBtn.addEventListener('click', () => {
    const phoneNumber = '08071897468';
    window.open(`tel:${phoneNumber}`);
  });
  }

  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    if (cvModal && event.target === cvModal) {
      cvModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
    if (contactModal && event.target === contactModal) {
      contactModal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  // Close modals with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (cvModal) {
      cvModal.style.display = 'none';
      }
      if (contactModal) {
      contactModal.style.display = 'none';
      }
      document.body.style.overflow = 'auto';
    }
  });
}

// Navigation dropdown functionality
function initNavigationDropdown() {
  // Handle header contact button
  const headerContactBtn = document.getElementById('headerContactBtn');
  const contactModal = document.getElementById('contactModal');
  
  if (headerContactBtn && contactModal) {
    headerContactBtn.addEventListener('click', () => {
      contactModal.style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  }
  
  // Find all dropdown toggles and menus (for mobile menu)
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const dropdownMenus = document.querySelectorAll('.dropdown-menu');
  const navItems = document.querySelectorAll('.nav-item.dropdown');
  
  if (dropdownToggles.length === 0) return;
  
  // Initialize each dropdown (mobile menu)
  dropdownToggles.forEach((dropdownToggle, index) => {
    const dropdownMenu = dropdownMenus[index];
    const navItem = navItems[index];
    
    if (!dropdownToggle || !dropdownMenu || !navItem) return;
  
  // Toggle dropdown on click
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
      e.stopPropagation();
      
      // Close all other dropdowns
      navItems.forEach(item => item.classList.remove('active'));
      
      // Toggle current dropdown
    navItem.classList.toggle('active');
    });
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    navItems.forEach(navItem => {
    if (!navItem.contains(e.target)) {
      navItem.classList.remove('active');
    }
  });
  });
}

// Interactive functionality
document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM selectors for better performance
  const cachedElements = {
    navLinks: document.querySelectorAll('.nav-link'),
    searchBtn: document.querySelector('.search-btn'),
    menuBtn: document.querySelector('.menu-btn'),
    socialLinks: document.querySelectorAll('.social-icon'),
    characterImage: document.querySelector('.character-image'),
    scrollIndicator: document.querySelector('.scroll-indicator'),
    characterContainer: document.querySelector('.character-container'),
    leftSection: document.querySelector('.left-section'),
    rightSection: document.querySelector('.right-section')
  };
  
  // Initialize navigation dropdowns
  initNavigationDropdown();
  
  // Initialize contact button functionality
  initContactButton();
  
  // Smooth scrolling for navigation links (only for internal page links)
  cachedElements.navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Only prevent default for contact dropdown items, not for actual navigation
      if (this.href && this.href.includes('#')) {
      e.preventDefault();
      }
      // Let actual page navigation work normally
    });
  });

  // Header icon interactions
  if (cachedElements.searchBtn) {
    cachedElements.searchBtn.addEventListener('click', function() {
      // Search functionality placeholder - can be implemented later
    });
  }

  // Social media link interactions with bouncing effect
  cachedElements.socialLinks.forEach(link => {
    // Add bouncing class by default
    link.classList.add('bouncing');
    
    // Handle click to stop bouncing
    link.addEventListener('click', function(e) {
      // Stop the bouncing animation
      this.classList.remove('bouncing');
      
      // Add a small click effect
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 150);
      
      // Prevent default only for internal links that need it
      if (this.href.includes('mailto:') || this.href.includes('tel:') || this.href.includes('wa.me')) {
        // Let these links work normally
        return;
      }
      
      // For other links, prevent default and handle manually if needed
      e.preventDefault();
    });
  });
  
  // Add double-click to restart bouncing (optional feature)
  cachedElements.socialLinks.forEach(link => {
    link.addEventListener('dblclick', function() {
      this.classList.add('bouncing');
    });
  });

  // Add hover effects for character image
  if (cachedElements.characterImage) {
    cachedElements.characterImage.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
    });
    
    cachedElements.characterImage.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }

  // Add parallax effect for character container with throttling
  let ticking = false;
  let scrollTimeout;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    if (cachedElements.characterContainer) {
      const rate = scrolled * -0.5;
      cachedElements.characterContainer.style.transform = `translateY(${rate}px)`;
    }
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  // Throttled scroll event for better performance
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(requestTick, 16); // 60fps throttling
  }, { passive: true });

  // Add typing effect for section titles
  function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    }
    
    type();
  }

  // Apply typing effect to titles after a delay
  setTimeout(() => {
    const titles = document.querySelectorAll('.section-title');
    titles.forEach((title, index) => {
      const originalText = title.textContent;
      setTimeout(() => {
        typeWriter(title, originalText, 50);
      }, index * 500);
    });
  }, 1000);

  // Enhanced 3D scroll indicator with interactive controls
  if (cachedElements.scrollIndicator) {
    // Add floating class for enhanced 3D floating
    cachedElements.scrollIndicator.classList.add('floating');
    
    // Interactive 3D rotation on click
    cachedElements.scrollIndicator.addEventListener('click', function() {
      // Toggle between floating and rotating animations
      if (this.classList.contains('rotating')) {
        this.classList.remove('rotating');
        this.classList.add('floating');
      } else {
        this.classList.remove('floating');
        this.classList.add('rotating');
      }
    });
    
    // Add scroll-responsive behavior
    let scrollTimeout;
    window.addEventListener('scroll', function() {
      // Pause animations during scroll for better performance
      cachedElements.scrollIndicator.style.animationPlayState = 'paused';
      
      // Resume animations after scroll stops
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        cachedElements.scrollIndicator.style.animationPlayState = 'running';
      }, 150);
    }, { passive: true });
    
    // Add mouse movement tracking for dynamic 3D effect
    cachedElements.scrollIndicator.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (x - centerX) / 10;
      
      if (!this.classList.contains('rotating')) {
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      }
    });
    
    // Reset transform on mouse leave
    cachedElements.scrollIndicator.addEventListener('mouseleave', function() {
      if (!this.classList.contains('rotating')) {
        this.style.transform = '';
      }
    });
  }
});

// Add some additional visual effects
function addGlowEffect() {
  const character = document.querySelector('.character');
  if (character) {
    character.style.filter = 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))';
    
    setTimeout(() => {
      character.style.filter = 'none';
    }, 2000);
  }
}

// Trigger glow effect periodically
setInterval(addGlowEffect, 15000);

// Add theme indicator
function createThemeIndicator() {
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--accent-color);
    z-index: 1000;
    transition: all 0.3s ease;
    opacity: 0.7;
  `;
  
  document.body.appendChild(indicator);
  
  // Update indicator color when theme changes
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        indicator.style.background = getComputedStyle(document.body).getPropertyValue('--accent-color');
      }
    });
  });
  
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
  });
}

// Initialize theme indicator
setTimeout(createThemeIndicator, 1000);

// Contact button functionality across all pages
function initContactButton() {
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function() {
      // Open contact modal if it exists, otherwise use dropdown
      const contactModal = document.getElementById('contactModal');
      if (contactModal) {
        contactModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      } else {
        // Fallback: trigger the contact dropdown
        const contactDropdown = document.querySelector('.nav-item.dropdown');
        if (contactDropdown) {
          contactDropdown.classList.add('active');
        }
      }
    });
  }
}

    // Mobile menu functionality removed - no longer needed

// CV Modal Helper Functions
function showCvPreview() {
  const cvLoading = document.getElementById('cvLoading');
  const cvIframe = document.getElementById('cvIframe');
  const cvError = document.getElementById('cvError');
  
  if (cvLoading) cvLoading.style.display = 'none';
  if (cvIframe) cvIframe.style.display = 'block';
  if (cvError) cvError.style.display = 'none';
}

function showCvError() {
  const cvLoading = document.getElementById('cvLoading');
  const cvIframe = document.getElementById('cvIframe');
  const cvError = document.getElementById('cvError');
  
  if (cvLoading) cvLoading.style.display = 'none';
  if (cvIframe) cvIframe.style.display = 'none';
  if (cvError) cvError.style.display = 'block';
}

// Retry CV loading function
function retryCvLoad() {
  const cvLoading = document.getElementById('cvLoading');
  const cvIframe = document.getElementById('cvIframe');
  const cvError = document.getElementById('cvError');
  
  if (cvLoading) cvLoading.style.display = 'block';
  if (cvIframe) cvIframe.style.display = 'none';
  if (cvError) cvError.style.display = 'none';
  
  // Reload the iframe
  if (cvIframe) {
    cvIframe.src = cvIframe.src;
  }
}

// Initialize CV Modal with proper event handling
function initCvModal() {
  const cvIframe = document.getElementById('cvIframe');
  const cvLoading = document.getElementById('cvLoading');
  const cvError = document.getElementById('cvError');
  
  if (cvIframe) {
    // Reset states
    if (cvLoading) cvLoading.style.display = 'block';
    if (cvIframe) cvIframe.style.display = 'none';
    if (cvError) cvError.style.display = 'none';
    
    // Set the correct path for the CV
    cvIframe.src = '/Michael_cv.pdf';
    
    // Add load event listener
    cvIframe.addEventListener('load', function() {
      // Check if iframe actually loaded the PDF content
      setTimeout(() => {
        try {
          // Try to access iframe content to verify PDF loaded
          if (cvIframe.contentDocument || cvIframe.contentWindow) {
            showCvPreview();
          } else {
            // Check if iframe src is still the same (didn't redirect to error page)
            if (cvIframe.src.includes('Michael_cv.pdf')) {
              showCvPreview();
            } else {
              showCvError();
            }
          }
        } catch (e) {
          // Cross-origin or other error, but PDF might still be loading
          // If we get here, assume PDF loaded successfully
          showCvPreview();
        }
      }, 2000); // Increased timeout for PDF loading
    });
    
    // Add error event listener
    cvIframe.addEventListener('error', function() {
      showCvError();
    });
    
    // Set timeout for loading
    setTimeout(() => {
      if (cvLoading && cvLoading.style.display !== 'none') {
        // Try alternative approach - check if iframe loaded anything
        try {
          if (cvIframe.contentDocument && cvIframe.contentDocument.body) {
            // If iframe has content, assume PDF loaded
            showCvPreview();
          } else {
            showCvError();
          }
        } catch (e) {
          // Cross-origin restriction, but PDF might still be visible
          showCvPreview();
        }
      }
    }, 8000); // Reduced timeout
  }
}

// Cube Game Button Functionality
function initCubeGameButton() {
  const cubeGameFab = document.getElementById('cubeGameFab');
  
  if (cubeGameFab) {
    cubeGameFab.addEventListener('click', () => {
      // Open the cube game in a new tab
      window.open('https://bsehovac.github.io/the-cube/', '_blank');
    });
    
    // Add hover effect
    cubeGameFab.addEventListener('mouseenter', () => {
      cubeGameFab.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    cubeGameFab.addEventListener('mouseleave', () => {
      cubeGameFab.style.transform = 'translateY(0) scale(1)';
    });
  }
}

// Orrery Button Functionality
function initOrreryButton() {
  const orreryFab = document.getElementById('orreryFab');
  
  if (orreryFab) {
    orreryFab.addEventListener('click', () => {
      if (window.orrerySystem) {
        if (window.orrerySystem.isOrreryActive && window.orrerySystem.isOrreryMode) {
          // Currently in interactive mode, exit to background mode
          window.orrerySystem.exitOrreryMode();
        } else if (window.orrerySystem.isOrreryActive && !window.orrerySystem.isOrreryMode) {
          // Currently in background mode, enter interactive mode
          window.orrerySystem.enterOrreryMode();
        } else {
          // Orrery not active, start it
          window.orrerySystem.enterOrreryMode();
        }
      }
    });
    
    // Add hover effect
    orreryFab.addEventListener('mouseenter', () => {
      orreryFab.style.transform = 'translateY(-3px) scale(1.1)';
    });
    
    orreryFab.addEventListener('mouseleave', () => {
      orreryFab.style.transform = 'translateY(0) scale(1)';
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize existing functionality
  initNavigationDropdown();
  initContactButton();
  
  // CV Modal will be initialized when the button is clicked
  
  // Initialize Cube Game Button
  initCubeGameButton();
  
  // Initialize Orrery Button
  initOrreryButton();
  
  // Initialize Scroll Progress Bar
  initScrollProgress();
  
  // Initialize scroll reveal animations
  initScrollReveal();
  
  // Make retry function globally available
  window.retryCvLoad = retryCvLoad;
  
  // Initialize Orrery System after Three.js background is ready
  setTimeout(() => {
    if (window.threeBackground) {
      import('./orrery.js').then(({ createOrrery }) => {
        window.orrerySystem = createOrrery(window.threeBackground);
      }).catch(error => {
        console.error('Failed to load orrery system:', error);
      });
    }
  }, 2000); // Wait for Three.js background to initialize
});

// Scroll Progress Bar Functionality
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = scrollPercent + '%';
  });
}

// Scroll reveal animations for sections/cards
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if (typeof IntersectionObserver === 'undefined') {
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// Case Study Modal Functionality
class CaseStudyModal {
  constructor() {
    this.modal = document.getElementById('caseStudyModal');
    this.closeBtn = document.getElementById('closeCaseStudyModal');
    this.caseStudies = null;
    this.currentIndex = 0;
    this.galleryImages = [];
    this.focusableElements = null;
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;
    this.previousActiveElement = null;
    
    this.init();
  }

  async init() {
    if (!this.modal) return;
    
    // Import case study data
    try {
      const { caseStudies } = await import('./case-study-data.js');
      this.caseStudies = caseStudies;
    } catch (error) {
      console.error('Failed to load case study data:', error);
      return;
    }

    // Bind events
    this.bindEvents();
    
    // Check for deep link
    this.checkDeepLink();
  }

  bindEvents() {
    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close on overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('show')) {
        this.close();
      }
    });

    // Case study buttons
    document.querySelectorAll('.case-study-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const caseStudyId = e.target.getAttribute('data-case-study');
        if (caseStudyId) {
          this.previousActiveElement = e.target;
          this.open(caseStudyId);
        }
      });
    });

    // Gallery navigation
    const prevBtn = this.modal.querySelector('.gallery-prev');
    const nextBtn = this.modal.querySelector('.gallery-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevImage());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextImage());
    }

    // Keyboard navigation for gallery
    this.modal.addEventListener('keydown', (e) => {
      if (this.modal.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
          this.prevImage();
        } else if (e.key === 'ArrowRight') {
          this.nextImage();
        }
      }
    });
  }

  checkDeepLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    const caseStudy = urlParams.get('case-study');
    
    if (projectId && caseStudy === 'true' && this.caseStudies) {
      // Map project names to case study IDs
      const projectMap = {
        'portfolio': 'personal-portfolio',
        'lovers-code': 'lovers-code',
        'tifes-gourmet': 'tifes-gourmet',
        'springbase-management': 'springbase-management',
        'folashaye-global': 'folashaye-global',
        'shopmaster': 'shopmaster',
        'insightpilot': 'insightpilot',
        'mindspace-ai': 'mindspace-ai',
        'springbase-school': 'springbase-school'
      };
      
      const caseStudyId = projectMap[projectId] || projectId;
      setTimeout(() => this.open(caseStudyId), 500);
    }
  }

  open(caseStudyId) {
    if (!this.caseStudies) return;
    
    const caseStudy = this.caseStudies.find(cs => cs.id === caseStudyId);
    if (!caseStudy) {
      console.error('Case study not found:', caseStudyId);
      return;
    }

    // Populate modal content
    this.populateContent(caseStudy);
    
    // Show modal
    this.modal.classList.add('show');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Set up focus trap
    this.setupFocusTrap();
    
    // Focus first focusable element
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    }
    
    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('project', caseStudyId);
    url.searchParams.set('case-study', 'true');
    window.history.pushState({}, '', url);
  }

  close() {
    this.modal.classList.remove('show');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    
    // Remove focus trap
    this.removeFocusTrap();
    
    // Return focus to trigger button
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
    
    // Update URL
    const url = new URL(window.location);
    url.searchParams.delete('case-study');
    window.history.pushState({}, '', url);
  }

  populateContent(caseStudy) {
    // Title and meta
    const titleEl = this.modal.querySelector('.case-study-title');
    const clientEl = this.modal.querySelector('.case-study-client');
    const durationEl = this.modal.querySelector('.case-study-duration');
    
    if (titleEl) titleEl.textContent = caseStudy.title;
    if (clientEl) clientEl.textContent = caseStudy.client;
    if (durationEl) durationEl.textContent = caseStudy.duration;

    // Challenge
    const challengeEl = this.modal.querySelector('.case-study-challenge');
    if (challengeEl) challengeEl.textContent = caseStudy.challenge;

    // Role
    const roleList = this.modal.querySelector('.case-study-role');
    if (roleList) {
      roleList.innerHTML = caseStudy.role.map(item => `<li>${item}</li>`).join('');
    }

    // Technical
    const technicalList = this.modal.querySelector('.case-study-technical');
    if (technicalList) {
      technicalList.innerHTML = caseStudy.technical.map(item => `<li>${item}</li>`).join('');
    }

    // Results
    const resultsList = this.modal.querySelector('.case-study-results');
    if (resultsList) {
      resultsList.innerHTML = caseStudy.results.map(item => `<li>${item}</li>`).join('');
    }

    // Gallery
    this.setupGallery(caseStudy.images);

    // Footer links
    const liveBtn = this.modal.querySelector('.case-study-live-btn');
    const githubBtn = this.modal.querySelector('.case-study-github-btn');
    
    if (liveBtn) {
      liveBtn.href = caseStudy.liveUrl;
    }
    
    if (githubBtn && caseStudy.githubUrl) {
      githubBtn.href = caseStudy.githubUrl;
      githubBtn.style.display = 'inline-block';
    } else if (githubBtn) {
      githubBtn.style.display = 'none';
    }
  }

  setupGallery(images) {
    if (!images || images.length === 0) {
      const gallerySection = this.modal.querySelector('.case-study-gallery-section');
      if (gallerySection) gallerySection.style.display = 'none';
      return;
    }

    const gallerySection = this.modal.querySelector('.case-study-gallery-section');
    if (gallerySection) gallerySection.style.display = 'block';

    this.galleryImages = images;
    this.currentIndex = 0;

    const track = this.modal.querySelector('.gallery-track');
    const indicators = this.modal.querySelector('.gallery-indicators');
    const prevBtn = this.modal.querySelector('.gallery-prev');
    const nextBtn = this.modal.querySelector('.gallery-next');

    if (!track || !indicators) return;

    // Clear existing content
    track.innerHTML = '';
    indicators.innerHTML = '';

    // Create image elements
    images.forEach((src, index) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Project screenshot ${index + 1}`;
      img.loading = 'lazy';
      track.appendChild(img);

      // Create indicator
      const indicator = document.createElement('button');
      indicator.className = 'gallery-indicator';
      indicator.setAttribute('aria-label', `Go to image ${index + 1}`);
      indicator.addEventListener('click', () => this.goToImage(index));
      indicators.appendChild(indicator);
    });

    // Update display
    this.updateGallery();
  }

  updateGallery() {
    const track = this.modal.querySelector('.gallery-track');
    const indicators = this.modal.querySelectorAll('.gallery-indicator');
    const prevBtn = this.modal.querySelector('.gallery-prev');
    const nextBtn = this.modal.querySelector('.gallery-next');

    if (!track) return;

    // Move track
    const offset = -this.currentIndex * 100;
    track.style.transform = `translateX(${offset}%)`;

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentIndex);
    });

    // Update navigation buttons
    if (prevBtn) {
      prevBtn.disabled = this.currentIndex === 0;
    }
    if (nextBtn) {
      nextBtn.disabled = this.currentIndex === this.galleryImages.length - 1;
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateGallery();
    }
  }

  nextImage() {
    if (this.currentIndex < this.galleryImages.length - 1) {
      this.currentIndex++;
      this.updateGallery();
    }
  }

  goToImage(index) {
    if (index >= 0 && index < this.galleryImages.length) {
      this.currentIndex = index;
      this.updateGallery();
    }
  }

  setupFocusTrap() {
    // Get all focusable elements
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');

    this.focusableElements = Array.from(
      this.modal.querySelectorAll(focusableSelectors)
    ).filter(el => {
      return el.offsetParent !== null; // Only visible elements
    });

    if (this.focusableElements.length > 0) {
      this.firstFocusableElement = this.focusableElements[0];
      this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
    }

    // Trap focus within modal
    this.modal.addEventListener('keydown', this.handleFocusTrap.bind(this));
  }

  handleFocusTrap(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === this.firstFocusableElement) {
        e.preventDefault();
        this.lastFocusableElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === this.lastFocusableElement) {
        e.preventDefault();
        this.firstFocusableElement.focus();
      }
    }
  }

  removeFocusTrap() {
    this.focusableElements = null;
    this.firstFocusableElement = null;
    this.lastFocusableElement = null;
  }
}

// Initialize Case Study Modal
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on projects page
  if (document.getElementById('caseStudyModal')) {
    window.caseStudyModal = new CaseStudyModal();
  }
});
