  
// ================================
// Theme & Dark Mode Initialization
// ================================

function initTheme() {
    // Get saved values
    const savedTheme = localStorage.getItem("themeColor") || "theme-1";
    const isDark = localStorage.getItem("darkMode") === "true";

    // Remove all theme classes
    document.body.classList.remove(
        "theme-1",
        "theme-2",
        "theme-3",
        "theme-4",
        "theme-5"
    );

    // Apply saved theme
    document.body.classList.add(savedTheme);

    // Apply dark mode
    document.body.classList.toggle("dark", isDark);

    // Update day/night icon
    updateDayNightIcon();
}
// ================================
// Theme Color Switcher
// ================================

function setActiveStyle(theme) {
    document.body.classList.remove(
        "theme-1",
        "theme-2",
        "theme-3",
        "theme-4",
        "theme-5"
    );

    document.body.classList.add(theme);

    localStorage.setItem("themeColor", theme);
}

// ================================
// Dark Mode
// ================================

function toggleDarkMode() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("darkMode", isDark);

    updateDayNightIcon();
}

// ================================
// Day/Night Icon
// ================================

function updateDayNightIcon() {
    const dayNight = document.querySelector(".day-night");

    if (!dayNight) return;

    const icon = dayNight.querySelector("span");

    if (!icon) return;

    icon.classList.remove("fa-sun", "fa-moon");

    if (document.body.classList.contains("dark")) {
        icon.classList.add("fa-sun");
    } else {
        icon.classList.add("fa-moon");
    }
}

// ================================
// DOM Ready
// ================================

document.addEventListener("DOMContentLoaded", () => {

    // Initialize theme and dark mode
    initTheme();

    // ----------------------------
    // Style Switcher Toggle
    // ----------------------------

    const styleSwitcher = document.querySelector(".style-switcher");
    const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");

    if (styleSwitcher && styleSwitcherToggle) {

        styleSwitcherToggle.addEventListener("click", () => {
            styleSwitcher.classList.toggle("open");
        });

        window.addEventListener("scroll", () => {
            styleSwitcher.classList.remove("open");
        });
    }

    // ----------------------------
    // Dark Mode Toggle Button
    // ----------------------------

    const darkToggle = document.querySelector(".dark-mode-toggle");

    if (darkToggle) {
        darkToggle.addEventListener("click", toggleDarkMode);
    }

    // ----------------------------
    // Day/Night Toggle Button
    // ----------------------------

    const dayNight = document.querySelector(".day-night");

    if (dayNight) {
        dayNight.addEventListener("click", toggleDarkMode);
    }

    // ----------------------------
    // Active Navigation Link
    // ----------------------------

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }
    });
});

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

