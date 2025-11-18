// Minimal JS: mobile nav toggle, smooth scroll, active nav highlighting, demo contact handling
(() => {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
  const sections = Array.from(document.querySelectorAll('main section'));

  function setNavVisibility(open){
    navToggle.setAttribute('aria-expanded', open);
    nav.setAttribute('aria-hidden', !open);
  }

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    setNavVisibility(!open);
  });

  // Smooth scroll for internal links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const hash = a.getAttribute('href');
    if (hash === '#' || hash === '') return;
    const target = document.querySelector(hash);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
      // close mobile nav
      if (window.innerWidth <= 800) setNavVisibility(false);
    }
  });

  // Active section highlighting using IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector('.primary-nav a[href="#' + id + '"]');
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {root: null, rootMargin: '0px 0px -50% 0px', threshold: 0});

  sections.forEach(s => observer.observe(s));

  // Contact form demo handler
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const copyBtn = document.getElementById('copy-email');

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'hello@example.com';
      try {
        await navigator.clipboard.writeText(email);
        status.textContent = 'Email copied to clipboard.';
      } catch (err) {
        status.textContent = 'Copy failed — email: ' + email;
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      // Basic front-end validation
      if (!data.get('name') || !data.get('email') || !data.get('message')) {
        status.textContent = 'Please complete all fields.';
        return;
      }
      // Simulate send
      status.textContent = 'Sending...';
      setTimeout(() => {
        status.textContent = 'Message sent (demo). Thank you!';
        form.reset();
      }, 800);
    });
  }

})();
