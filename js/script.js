/* ============================================================
   KAISAR STANLEY ELEAZAR — CINEMATIC PORTFOLIO
   Vanilla JavaScript — Premium Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ── */
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const body = document.body;

  /* ────────────────────────────────────────────
     PRELOADER
  ──────────────────────────────────────────── */
  const preloader = $('#preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
    }, 2200);
  });

  /* ────────────────────────────────────────────
     SCROLL PROGRESS BAR
  ──────────────────────────────────────────── */
  const scrollBar = $('#scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = progress + '%';
  }

  /* ────────────────────────────────────────────
     NAVBAR
  ──────────────────────────────────────────── */
  const navbar = $('#navbar');
  const navLinks = $('#navLinks');
  const hamburger = $('#hamburger');
  const navItems = $$('.navbar__link');
  const sections = $$('section[id]');

  function handleNavScroll() {
    const y = window.scrollY;

    // Solid bg
    navbar.classList.toggle('scrolled', y > 80);

    // Active section
    let current = '';
    const offset = window.innerHeight * 0.35;
    sections.forEach(s => {
      if (y >= s.offsetTop - offset) current = s.id;
    });

    navItems.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  // Hamburger
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    body.style.overflow = open ? 'hidden' : '';
  });

  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    });
  });

  /* ────────────────────────────────────────────
     SMOOTH SCROLL
  ──────────────────────────────────────────── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
      window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    });
  });

  /* ────────────────────────────────────────────
     HERO 3D PARALLAX (Mouse)
  ──────────────────────────────────────────── */
  const hero = $('#hero');
  const heroBg = $('#heroBg');
  const heroPortrait = $('#heroPortrait');

  if (hero && window.matchMedia('(min-width: 768px)').matches) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      requestAnimationFrame(() => {
        // Background shifts opposite direction for depth
        heroBg.style.transform = `translate(${-x * 20}px, ${-y * 15}px)`;

        // Text also has subtle parallax and light reflection
        const heroText = document.querySelector('.hero__text');
        const heroTitle = document.querySelector('.hero__title');
        if (heroText) {
          heroText.style.transform = `translate(${x * 12}px, ${y * 6}px)`;
        }
        
        // Premium: Shine/Reflection reacts to mouse
        if (heroTitle) {
          const moveX = x * 100; // Percentage shift
          const moveY = y * 100;
          heroTitle.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
        }

        // Photo frame tilts with perspective
        if (heroPortrait) {
          heroPortrait.style.transform =
            `translateX(${x * 12}px) translateY(${y * 8}px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg)`;
        }
      });
    });

    hero.addEventListener('mouseleave', () => {
      heroBg.style.transform = 'translate(0, 0)';
      if (heroPortrait) heroPortrait.style.transform = '';
    });
  }

  /* ────────────────────────────────────────────
     REVEAL ON SCROLL (Intersection Observer)
  ──────────────────────────────────────────── */
  const reveals = $$('.reveal');

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach(el => revealObserver.observe(el));

  /* ────────────────────────────────────────────
     3D TILT EFFECT ON CARDS & IMAGES
  ──────────────────────────────────────────── */
  if (window.matchMedia('(min-width: 768px)').matches) {
    const tiltEls = $$([
      '.experience__card',
      '.portfolio__card',
      '.other-projects__card',
      '.contact__card',
      '.timeline__card',
      '.about__img-wrap'
    ].join(','));

    const tiltConfig = { max: 8, speed: 400, scale: 1.03 };

    tiltEls.forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;   // 0 to 1
        const y = (e.clientY - rect.top) / rect.height;    // 0 to 1

        const tiltX = (tiltConfig.max * (0.5 - y)).toFixed(2);
        const tiltY = (tiltConfig.max * (x - 0.5)).toFixed(2);

        requestAnimationFrame(() => {
          el.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${tiltConfig.scale},${tiltConfig.scale},${tiltConfig.scale})`;
          el.style.transition = `transform 0.1s ease-out, box-shadow 0.4s, border-color 0.4s`;
        });
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = `transform ${tiltConfig.speed}ms var(--ease), box-shadow 0.4s, border-color 0.4s`;
      });
    });
  }

  /* ────────────────────────────────────────────
     PARALLAX GLOW ORBS
  ──────────────────────────────────────────── */
  const orbs = $$('.glow-orb');

  function parallaxOrbs() {
    if (!orbs.length || !window.matchMedia('(min-width: 768px)').matches) return;
    const y = window.scrollY;
    orbs.forEach((orb, i) => {
      orb.style.transform = `translateY(${y * (i + 1) * 0.03}px)`;
    });
  }

  /* ────────────────────────────────────────────
     FILM GRAIN ANIMATION (~8 fps)
  ──────────────────────────────────────────── */
  const grain = $('#grain');
  if (grain) {
    setInterval(() => {
      requestAnimationFrame(() => {
        grain.style.backgroundPosition = `${Math.random() * 100}% ${Math.random() * 100}%`;
      });
    }, 125);
  }

  /* ────────────────────────────────────────────
     SCROLL EVENT (throttled via rAF)
  ──────────────────────────────────────────── */
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        updateScrollProgress();
        parallaxOrbs();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // Initial calls
  handleNavScroll();
  updateScrollProgress();

  /* ────────────────────────────────────────────
     CHATBOT
  ──────────────────────────────────────────── */
  const chatbot = $('#chatbot');
  const chatbotTrigger = $('#chatbotTrigger');
  const chatbotClose = $('#chatbotClose');
  const chatbotMessages = $('#chatbotMessages');
  const chatbotOptions = $('#chatbotOptions');

  const chatResponses = {
    greeting: {
      text: "Hi! 👋 I'm Kaisar's portfolio assistant. How can I help you today?",
      options: [
        { label: '🎬 View Portfolio', action: 'portfolio' },
        { label: '📞 Contact Info', action: 'contact' },
        { label: '🤝 Collaboration', action: 'collab' },
        { label: '👤 About Kaisar', action: 'about' }
      ]
    },
    portfolio: {
      text: "Kaisar has produced 6 films including Melukis Ikatan, Rasindeu, and A Musician's Requiem. Would you like to see the portfolio section?",
      options: [
        { label: 'Go to Portfolio', action: 'scroll_portfolio' },
        { label: '⬅ Back to Menu', action: 'greeting' }
      ]
    },
    contact: {
      text: "You can reach Kaisar via:\n📧 kaisarstanley@email.com\n📱 +62 812-3456-7890\n📸 @kaisarstanley on Instagram\n\nWould you like to go to the contact section?",
      options: [
        { label: 'Go to Contact', action: 'scroll_contact' },
        { label: '⬅ Back to Menu', action: 'greeting' }
      ]
    },
    collab: {
      text: "Kaisar is open to collaboration! He specializes in:\n• Film Production\n• Creative Direction\n• Podcast Production\n• Strategic Film Marketing\n\nFeel free to reach out!",
      options: [
        { label: '📞 Contact Info', action: 'contact' },
        { label: 'Start a Project', action: 'scroll_contact' },
        { label: '⬅ Back to Menu', action: 'greeting' }
      ]
    },
    about: {
      text: "Kaisar Stanley Eleazar is a next-generation Indonesian film producer studying at Institut Seni Budaya Indonesia Bandung. He believes film is about execution creating impact and meaning.",
      options: [
        { label: 'Go to About', action: 'scroll_about' },
        { label: '🎬 View Portfolio', action: 'portfolio' },
        { label: '⬅ Back to Menu', action: 'greeting' }
      ]
    }
  };

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chatbot__msg chatbot__msg--${type}`;
    msg.textContent = text;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function showOptions(options) {
    chatbotOptions.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chatbot__option';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => handleChatAction(opt));
      chatbotOptions.appendChild(btn);
    });
  }

  function handleChatAction(opt) {
    // Show user message
    addMessage(opt.label, 'user');

    // Handle scroll actions
    if (opt.action.startsWith('scroll_')) {
      const sectionId = opt.action.replace('scroll_', '');
      const target = $(`#${sectionId}`);
      if (target) {
        setTimeout(() => {
          chatbot.classList.remove('open');
          const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
          window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
        }, 400);
      }
      return;
    }

    // Show bot response
    const response = chatResponses[opt.action];
    if (response) {
      setTimeout(() => {
        addMessage(response.text, 'bot');
        showOptions(response.options);
      }, 500);
    }
  }

  function openChatbot() {
    chatbot.classList.add('open');
    if (chatbotMessages.children.length === 0) {
      addMessage(chatResponses.greeting.text, 'bot');
      showOptions(chatResponses.greeting.options);
    }
  }

  chatbotTrigger.addEventListener('click', () => {
    if (chatbot.classList.contains('open')) {
      chatbot.classList.remove('open');
    } else {
      openChatbot();
    }
  });

  chatbotClose.addEventListener('click', () => {
    chatbot.classList.remove('open');
  });

  /* ────────────────────────────────────────────
     KEYBOARD ACCESSIBILITY
  ──────────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
      chatbot.classList.remove('open');
    }
  });

})();
