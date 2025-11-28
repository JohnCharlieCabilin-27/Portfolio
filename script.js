// Minimal JS: mobile nav toggle, smooth scroll, active nav highlighting, demo contact handling
(() => {
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  const navLinks = Array.from(document.querySelectorAll('.primary-nav a'));
  const sections = Array.from(document.querySelectorAll('main section'));

  function setNavVisibility(open){
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  // Initialize nav as closed on page load
  setNavVisibility(false);

  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    setNavVisibility(!open);
  });

  // Close nav when a nav link is clicked (for both internal and external links)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      setNavVisibility(false);
    });
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

  // Skill progress animation and percent pill coloring
  function initSkills(){
    const skills = document.querySelectorAll('.skill');
    skills.forEach(s => {
      const progress = s.querySelector('.progress');
      const fill = s.querySelector('.progress-fill');
      const percentEl = s.querySelector('.skill-percent');
      const pct = parseInt(progress.getAttribute('data-percent') || progress.getAttribute('aria-valuenow') || '0', 10);
      // set accessible value
      progress.setAttribute('aria-valuenow', String(pct));
      // animate from 0 to percent
      fill.style.width = '0%';
      // delay to allow paint
      setTimeout(() => { fill.style.width = pct + '%'; }, 80);
      // set percent text
      if (percentEl) percentEl.textContent = pct + '%';
      // color the pill
      if (percentEl) {
        percentEl.classList.remove('percent-high','percent-mid','percent-low');
        if (pct >= 75) percentEl.classList.add('percent-high');
        else if (pct >= 50) percentEl.classList.add('percent-mid');
        else percentEl.classList.add('percent-low');
      }
    });
  }

  // Animate inline proficiency line bars inside .proficiency-list
  function initInlineProficiency(){
    const items = document.querySelectorAll('.proficiency-list li');
    items.forEach(li => {
      const pct = parseInt(li.getAttribute('data-percent') || '0', 10);
      const fill = li.querySelector('.inline-progress-fill');
      const percentEl = li.querySelector('.prog-percent');
      if (fill) {
        fill.style.width = '0%';
        setTimeout(() => { fill.style.width = pct + '%'; }, 120);
      }
      if (percentEl) {
        percentEl.textContent = pct + '%';
        percentEl.classList.remove('percent-high','percent-mid','percent-low');
        if (pct >= 75) percentEl.classList.add('percent-high');
        else if (pct >= 50) percentEl.classList.add('percent-mid');
        else percentEl.classList.add('percent-low');
      }
    });
  }

  // init on load
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initSkills);
  else initSkills();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initInlineProficiency);
  else initInlineProficiency();

})();
