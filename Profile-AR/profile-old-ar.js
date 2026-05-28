  
    // Dark mode toggle
    const toggleBtn = document.getElementById('dayNightToggle');
    const toggleIcon = document.getElementById('toggleIcon');

    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
      toggleIcon.classList.remove('fa-moon');
      toggleIcon.classList.add('fa-sun');
    }

    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      toggleIcon.classList.toggle('fa-moon');
      toggleIcon.classList.toggle('fa-sun');

      if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });

    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const menuIcon = document.getElementById('menuIcon');
    const body = document.body;

    menuToggle.addEventListener('click', () => {
      if (!navLinks.classList.contains('show')) {
        // Open menu
        navLinks.classList.add('show');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
        body.classList.add('no-scroll');
      } else {
        // Close menu (only if close icon is shown)
        if (menuIcon.classList.contains('fa-times')) {
          navLinks.classList.remove('show');
          menuIcon.classList.remove('fa-times');
          menuIcon.classList.add('fa-bars');
          body.classList.remove('no-scroll');
        }
      }
    });

    // Active link toggle
    document.addEventListener('DOMContentLoaded', function () {
    const currentPage = window.location.pathname.split('/').pop(); // Get the current filename
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      if (linkPage === currentPage) {
        link.classList.add('active');
      }
    });
  });

  // <------------------ Scroll-to-Top functionality ----------------------->
  const scrollToTopButton = document.querySelector('.footer-iconTop a');

  scrollToTopButton.addEventListener("click", function(e) {
  e.preventDefault();  // Prevent the default anchor behavior

  // Get current scroll position
  let start = window.scrollY;
  let distance = start; // Scroll distance to the top
  let duration = 500; // Duration for scrolling (1.5 seconds, you can adjust this to make it slower or faster)
  let startTime = null;

  // Function for smooth scroll
  function smoothScroll(timestamp) {
  if (!startTime) startTime = timestamp;
  let progress = timestamp - startTime;
  let scrollAmount = Math.min(progress / duration, 1); // Calculate the scroll progress

  // Scroll to the new position
  window.scrollTo(0, start - distance * scrollAmount);

  if (scrollAmount < 1) {
  requestAnimationFrame(smoothScroll); // Continue scrolling
  }
  }

  // Start the smooth scroll animation
  requestAnimationFrame(smoothScroll);
  });
