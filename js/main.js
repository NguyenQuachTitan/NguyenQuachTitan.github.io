// ---- Dynamic years of cycling calculation from Aug 2020 ----
function calculateCyclingYears() {
  const startDate = new Date(2020, 7, 1); // Month 7 is August (0-indexed)
  const now = new Date();
  let years = now.getFullYear() - startDate.getFullYear();
  if (now.getMonth() < startDate.getMonth() || (now.getMonth() === startDate.getMonth() && now.getDate() < startDate.getDate())) {
    years--;
  }
  return Math.max(1, years);
}

const currentCyclingYears = calculateCyclingYears();

// Auto update elements with data-cycling-years or data-target for years
document.querySelectorAll('[data-cycling-years]').forEach(el => {
  el.textContent = currentCyclingYears;
});
document.querySelectorAll('[data-target-years]').forEach(el => {
  el.dataset.target = currentCyclingYears;
});

// =========================================================
// ĐẠP XE HÀNG NGÀY - Main JavaScript
// =========================================================

// ---- Navbar scroll effect ----
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    // Animate hamburger to X
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
      const spans = navToggle.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ---- Active nav link ----
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
setActiveNavLink();

// ---- Scroll reveal animation ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay for grid items
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Auto-add stagger delay for siblings
  if (!el.dataset.delay) {
    el.dataset.delay = (i % 4) * 80;
  }
  revealObserver.observe(el);
});

// ---- Counter animation ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = 16;
  const steps = duration / step;
  let current = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('vi-VN') + suffix;
  }, step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => {
  el.textContent = '0';
  counterObserver.observe(el);
});

// ---- Smooth reading progress bar ----
const progressBar = document.getElementById('readingProgress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
}

// ---- Table of contents active highlight ----
const tocLinks = document.querySelectorAll('.toc-link');
const headings = document.querySelectorAll('.post-content h2, .post-content h3');
if (tocLinks.length && headings.length) {
  const tocObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });
  headings.forEach(h => tocObserver.observe(h));
}

// ---- Back to top button ----
const backTop = document.getElementById('backToTop');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.style.opacity = window.scrollY > 400 ? '1' : '0';
    backTop.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  }, { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

console.log('🚴 Đạp Xe Hàng Ngày — website loaded!');
