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
  const scrollTopBtn = $('#scrollTop');

  function handleNavScroll() {
    const y = window.scrollY;

    // Solid bg
    if (!navbar.classList.contains('navbar--solid')) {
      navbar.classList.toggle('scrolled', y > 80);
    }

    // Scroll Top Visibility
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', y > 400);
    }

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

  // Scroll Top Click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ────────────────────────────────────────────
     PORTFOLIO MODAL MANAGER
  ──────────────────────────────────────────── */
  const portfolioModal = $('#portfolioModal');
  if (portfolioModal) {
    const modalClose = $('#modalClose');
    const modalOverlay = $('#modalOverlay');
    const blogCards = $$('.portfolio__card');

    const mImage = $('#modalImage');
    const mTitle = $('#modalTitle');
    const mRole = $('#modalRole');
    const mCategory = $('#modalCategory');
    const mYear = $('#modalYear');
    const mFullDesc = $('#modalFullDesc');

    function openModal(card) {
      // Extract data
      const img = $('img', card).src;
      const title = $('.portfolio__card-title', card).textContent;
      const role = $('.portfolio__card-role', card).textContent;
      const category = card.dataset.category;
      const year = card.dataset.year;
      const fullDesc = card.dataset.fullDesc;
      const videoUrl = card.dataset.videoUrl;

      // Populate Modal
      mImage.src = img;
      mTitle.textContent = title;
      mRole.textContent = role;
      mCategory.textContent = category;
      mYear.textContent = year;
      mFullDesc.textContent = fullDesc;
      
      const mActionBtn = $('#modalActionBtn');
      if (videoUrl) {
        mActionBtn.textContent = 'Watch Video';
        mActionBtn.onclick = () => window.open(videoUrl, '_blank');
      } else {
        mActionBtn.textContent = 'Watch Trailer (Soon)';
        mActionBtn.onclick = null;
      }

      // Show Modal
      portfolioModal.classList.add('open');
      body.style.overflow = 'hidden';

      // Internal reveal animation inside modal
      const content = $('.modal__content', portfolioModal);
      content.classList.remove('visible');
      setTimeout(() => content.classList.add('visible'), 50);
    }

    function closeModal() {
      portfolioModal.classList.remove('open');
      body.style.overflow = '';
    }

    blogCards.forEach(card => {
      const cta = $('.portfolio__card-cta', card);
      if (cta) {
        cta.addEventListener('click', (e) => {
          e.preventDefault();
          openModal(card);
        });
      }
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
  }

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
      text: "Halo! 👋 Saya asisten virtual Stanley. Ada yang bisa saya bantu hari ini? Bapak bisa tanya tentang film, pengalaman, atau kontak Stanley.",
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

  const chatbotInput = $('#chatbotInput');
  const chatbotSend = $('#chatbotSend');

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chatbot__msg chatbot__msg--${type}`;
    msg.textContent = text;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return msg;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'chatbot__msg chatbot__msg--bot chatbot__loading';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    chatbotMessages.appendChild(indicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return indicator;
  }

  function showOptions(options) {
    chatbotOptions.innerHTML = '';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chatbot__option';
      btn.textContent = opt.label;
      btn.onclick = () => {
        handleChatAction(opt);
      };
      chatbotOptions.appendChild(btn);
    });
  }

  function handleChatAction(opt) {
    addMessage(opt.label, 'user');
    chatbotOptions.innerHTML = '';
    
    const indicator = showTypingIndicator();
    
    setTimeout(() => {
      indicator.remove();
      
      if (opt.action.startsWith('scroll_')) {
        const sectionId = opt.action.replace('scroll_', '');
        const target = $(`#${sectionId}`);
        if (target) {
          chatbot.classList.remove('open');
          const navH = 80;
          window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
        }
        return;
      }

      const resp = chatResponses[opt.action];
      if (resp) {
        addMessage(resp.text, 'bot');
        showOptions(resp.options);
      }
    }, 800);
  }

  function handleUserInput() {
    const input = chatbotInput.value.trim().toLowerCase();
    if (!input) return;

    addMessage(chatbotInput.value, 'user');
    chatbotInput.value = '';
    chatbotOptions.innerHTML = '';
    
    const indicator = showTypingIndicator();

    setTimeout(() => {
      indicator.remove();
      
      let matchedAction = 'default';
      
      if (input.includes('portfolio') || input.includes('film') || input.includes('movie') || input.includes('karya')) matchedAction = 'portfolio';
      else if (input.includes('contact') || input.includes('email') || input.includes('phone') || input.includes('wa') || input.includes('hubung')) matchedAction = 'contact';
      else if (input.includes('about') || input.includes('siapa') || input.includes('stanley') || input.includes('profil')) matchedAction = 'about';
      else if (input.includes('collab') || input.includes('kerjasama') || input.includes('kerja') || input.includes('hire')) matchedAction = 'collab';
      else if (input.includes('hi') || input.includes('halo') || input.includes('hello') || input.includes('hallo') || input.includes('hai') || input.includes('heii') || input.includes('hey')) matchedAction = 'greeting';

      if (matchedAction === 'default') {
        addMessage("I'm not sure I understand. Try asking about Stanley's films, his profile, or contact info.", 'bot');
        showOptions(chatResponses.greeting.options);
      } else {
        const resp = chatResponses[matchedAction];
        addMessage(resp.text, 'bot');
        showOptions(resp.options);
      }
    }, 1000);
  }

  chatbotTrigger.addEventListener('click', () => {
    if (chatbot.classList.contains('open')) {
      chatbot.classList.remove('open');
    } else {
      chatbot.classList.add('open');
      if (chatbotMessages.children.length === 0) {
        addMessage(chatResponses.greeting.text, 'bot');
        showOptions(chatResponses.greeting.options);
      }
    }
  });

  chatbotClose.addEventListener('click', () => {
    chatbot.classList.remove('open');
  });

  chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
  });

  chatbotSend.addEventListener('click', handleUserInput);

  /* ────────────────────────────────────────────
     CURSOR GLOW (LANTERN)
  ──────────────────────────────────────────── */
  const cursorGlow = $('#cursorGlow');
  if (cursorGlow) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Smooth following with RequestAnimationFrame
    function animateCursor() {
      // Lerp for smoothness
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      
      requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hide when mouse leaves window
    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursorGlow.style.opacity = '1';
    });
  }

  /* ────────────────────────────────────────────
     CONTACT FORM (WHATSAPP)
  ──────────────────────────────────────────── */
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = $('#formName').value;
      const email = $('#formEmail').value;
      const service = $('#formService').value;
      const message = $('#formMessage').value;
      
      const phone = '6281234567890'; // Destination number
      
      const whatsappText = `*Halo Stanley!*%0A` +
        `Ada pesan baru dari website portfolio:%0A%0A` +
        `*Nama:* ${name}%0A` +
        `*Email:* ${email}%0A` +
        `*Layanan:* ${service}%0A` +
        `*Pesan:* ${message}`;
        
      const waUrl = `https://wa.me/${phone}?text=${whatsappText}`;
      window.open(waUrl, '_blank');
    });
  }

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
