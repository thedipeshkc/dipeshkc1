document.addEventListener('DOMContentLoaded', function () {

  // 1. NAVBAR — scroll shadow + active links
  var navbar   = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nl');

  function updateNav() {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    var scrollY = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(function (sec) {
      if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        var a = document.querySelector('.nl[href="#' + sec.id + '"]');
        if (a) a.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // 2. MOBILE NAV TOGGLE
  var toggle  = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-links');
  toggle.addEventListener('click', function () {
    toggle.classList.toggle('open');
    navMenu.classList.toggle('open');
  });
  navLinks.forEach(function (l) {
    l.addEventListener('click', function () {
      toggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // 3. SCROLL REVEAL
  var reveals = document.querySelectorAll('[data-reveal]');

  // Stagger items in grids
  ['about-cards','skills-grid','proj-grid','edu-list','clink-list'].forEach(function (cls) {
    var parent = document.querySelector('.' + cls);
    if (parent) {
      parent.querySelectorAll('[data-reveal]').forEach(function (el, i) {
        el.style.transitionDelay = (i * 90) + 'ms';
      });
    }
  });

  var ro = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function (el) { ro.observe(el); });

  // 4. SKILL BAR ANIMATION
  var bars = document.querySelectorAll('.sk-fill');
  var bo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.style.width = e.target.getAttribute('data-w') + '%';
        bo.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(function (b) { bo.observe(b); });

  // 5. SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 8;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // 6. CONTACT FORM — powered by Formspree
  var form = document.getElementById('contact-form');
  var ok   = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Basic validation
      var n   = document.getElementById('name').value.trim();
      var em  = document.getElementById('email').value.trim();
      var msg = document.getElementById('message').value.trim();
      if (!n || !em || !msg) { alert('Please fill in your name, email and message.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { alert('Please enter a valid email address.'); return; }

      var btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        var response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          // Success
          btn.style.display = 'none';
          ok.style.display  = 'block';
          form.reset();
        } else {
          var data = await response.json();
          var errMsg = (data.errors && data.errors.map(function(e){ return e.message; }).join(', '))
                       || 'Something went wrong. Please try again.';
          alert(errMsg);
          btn.textContent = 'Send Message →';
          btn.disabled = false;
        }
      } catch (err) {
        alert('Network error. Please check your connection and try again.');
        btn.textContent = 'Send Message →';
        btn.disabled = false;
      }
    });
  }

});
