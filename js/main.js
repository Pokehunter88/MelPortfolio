/* ============================================================
   MELVIN CRABTREE — PORTFOLIO  |  main.js
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     NAV: scroll effect + hamburger
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  function updateNav() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    nav.classList.toggle('nav-open', isOpen);
    // always make nav bg visible when menu open
    nav.classList.toggle('scrolled', isOpen || window.scrollY > 40);
  });

  // close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      nav.classList.remove('nav-open');
    });
  });

  /* ----------------------------------------------------------
     HERO: subtle parallax on bg
  ---------------------------------------------------------- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      heroBg.style.transform = 'scale(1.05) translateY(' + (scrolled * 0.25) + 'px)';
    }, { passive: true });
  }

  /* ----------------------------------------------------------
     GALLERY FILTER
  ---------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const filter = btn.dataset.filter;

      // update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      // show/hide items
      galleryItems.forEach(function (item) {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ----------------------------------------------------------
     LIGHTBOX
  ---------------------------------------------------------- */
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxCap    = document.getElementById('lightbox-caption');
  const lightboxClose  = document.getElementById('lightbox-close');
  const lightboxPrev   = document.getElementById('lightbox-prev');
  const lightboxNext   = document.getElementById('lightbox-next');

  // only the visible items participate in lightbox nav
  let visibleItems = [];
  let currentIndex = 0;

  function getVisibleItems() {
    return Array.from(galleryItems).filter(function (item) {
      return !item.classList.contains('hidden');
    });
  }

  function openLightbox(index) {
    visibleItems = getVisibleItems();
    currentIndex = index;
    showSlide(currentIndex);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showSlide(index) {
    const item  = visibleItems[index];
    const img   = item.querySelector('img');
    const cap   = item.querySelector('.gallery-caption');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCap.textContent = cap ? cap.textContent : '';

    // update prev/next visibility
    lightboxPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
    lightboxNext.style.visibility = index === visibleItems.length - 1 ? 'hidden' : 'visible';
  }

  // attach click to each gallery item
  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () {
      visibleItems = getVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      openLightbox(visibleIndex);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  lightboxPrev.addEventListener('click', function () {
    if (currentIndex > 0) {
      currentIndex--;
      showSlide(currentIndex);
    }
  });

  lightboxNext.addEventListener('click', function () {
    if (currentIndex < visibleItems.length - 1) {
      currentIndex++;
      showSlide(currentIndex);
    }
  });

  // close on backdrop click
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) { closeLightbox(); }
  });

  // keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { closeLightbox(); }
    if (e.key === 'ArrowLeft'  && currentIndex > 0) { currentIndex--; showSlide(currentIndex); }
    if (e.key === 'ArrowRight' && currentIndex < visibleItems.length - 1) { currentIndex++; showSlide(currentIndex); }
  });

  /* ----------------------------------------------------------
     SMOOTH SCROLL (fallback for older browsers)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight);
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
