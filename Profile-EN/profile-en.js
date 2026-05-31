  
        // --------------- Toggle Style Switcher ----------------------->
      const styleSwitcher = document.querySelector('.style-switcher');
      const styleSwitcherToggle = document.querySelector('.style-switcher-toggler');

      // Toggle Style Switcher visibility
      styleSwitcherToggle.addEventListener('click', () => {
          styleSwitcher.classList.toggle("open");
      });

      // Hide Style Switcher on Scroll
      window.addEventListener('scroll', () => {
          if (styleSwitcher.classList.contains("open")) {
              styleSwitcher.classList.remove("open");
          }
      });

      // <------------------ Theme Color ----------------------->
      function setActiveStyle(color) {
          // Apply the corresponding color class to the body element
          document.body.className = color; // Change the class of the body element based on the clicked color
      }

  
  
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

  // <-------------------- Menu elements ---------------->
// Mobile Navigation Menu
//  Features:
// - Opens when hamburger icon is clicked
// - Displays dark overlay behind menu
// - Prevents background page scrolling
// - Closes when:
  // 1. Close (X) button is clicked
  // 2. Overlay is clicked
    const menuToggle = document.getElementById('menuToggle'); // Hamburger button
    const navLinks = document.getElementById('navLinks');     // Sliding menu panel
    const menuClose = document.getElementById('menuClose');   // Close button inside menu
    const menuOverlay = document.getElementById('menuOverlay');       // Dark background overlay
    const body = document.body;                               // Page body

    // Open the mobile menu
    function openMenu() {
      navLinks.classList.add('show');     // Slide menu into view
      menuOverlay.classList.add('show');      // Display overlay
      body.classList.add('no-scroll');    // Prevent page scrolling
    }

    // Close the mobile menu
    function closeMenu() {
      navLinks.classList.remove('show');  // Hide menu
      menuOverlay.classList.remove('show');   // Hide overlay
      body.classList.remove('no-scroll'); // Restore page scrolling
    }

    // Open menu when hamburger icon is clicked
    menuToggle.addEventListener('click', openMenu);

    // Close menu when X icon is clicked
    menuClose.addEventListener('click', closeMenu);
    
    // Close menu when user clicks outside the menu
    /* menuOverlay.addEventListener('click', closeMenu); */


  // ========== ACTIVE NAV LINK HIGHLIGHT ==========
  const navLinkItems = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop();

  navLinkItems.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });

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


