  // <------------------ Day/Night Mode Toggle ----------------------->
  const dayNight = document.querySelector(".day-night");
    dayNight.addEventListener("click", () => {
    dayNight.querySelector("span").classList.toggle("fa-sun");
    dayNight.querySelector("span").classList.toggle("fa-moon");
    document.body.classList.toggle("dark");
  })
  window.addEventListener("load", () => {
    if(document.body.classList.contains("dark"))
    {
    dayNight.querySelector("span").classList.add("fa-sun");
    }
    else
    {
    dayNight.querySelector("span").classList.add("fa-moon");
    }
  })	

  // ========== ACTIVE NAV LINK HIGHLIGHT ==========
  const navLinkItems = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop();

  navLinkItems.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

  // ========== MENU TOGGLE ==========
  const menuToggle = document.getElementById('menuToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const menuIcon = document.getElementById('menuIcon');
  const body = document.body;

  if (menuToggle && navLinksContainer && menuIcon) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('show');
      menuIcon.classList.toggle('fa-bars');
      menuIcon.classList.toggle('fa-times');

      if (isOpen) {
        // Safari-safe scroll lock
        const scrollY = window.scrollY;
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.dataset.scrollY = scrollY;
      } else {
        // Restore scroll position
        body.style.position = '';
        body.style.top = '';
        window.scrollTo(0, parseInt(body.dataset.scrollY || '0'));
        delete body.dataset.scrollY;
      }
    });

    // Optional: Close menu when nav link is clicked
    const navLinks = navLinksContainer.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('show');
        menuIcon.classList.add('fa-bars');
        menuIcon.classList.remove('fa-times');
        body.style.position = '';
        body.style.top = '';
        window.scrollTo(0, parseInt(body.dataset.scrollY || '0'));
        delete body.dataset.scrollY;
      });
    });
  }

  // ========== LANGUAGE SWITCH ==========
  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.addEventListener('click', function (e) {
      e.preventDefault();
      langSwitch.classList.add('animate');

      setTimeout(() => {
        window.location.href = langSwitch.getAttribute('href');
      }, 300); // match animation duration
    });
  }

  // ========== SCROLL TO TOP ==========
  const scrollToTopButton = document.querySelector('.footer-iconTop a');
  if (scrollToTopButton) {
    scrollToTopButton.addEventListener('click', function (e) {
      e.preventDefault();
      let start = window.scrollY;
      let distance = start;
      let duration = 500; // 0.5 seconds
      let startTime = null;

      function smoothScroll(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = timestamp - startTime;
        let scrollAmount = Math.min(progress / duration, 1);
        window.scrollTo(0, start - distance * scrollAmount);

        if (scrollAmount < 1) {
          requestAnimationFrame(smoothScroll);
        }
      }

      requestAnimationFrame(smoothScroll);
    });
  };
