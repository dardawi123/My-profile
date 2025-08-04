      
      // <-- Get references to the language button and dropdown menu -->
      const langBtn = document.getElementById('langBtn');
      const langOptions = document.getElementById('langOptions');

      // Toggle dropdown on click
      langBtn.addEventListener('click', () => {
      // Close style switcher if open
      if (styleSwitcher.classList.contains("open")) {
        styleSwitcher.classList.remove("open");
      }

      // Toggle language menu
      langOptions.classList.toggle('open');
      });

      // Set selected language
      langOptions.querySelectorAll('a').forEach(option => {
      option.addEventListener('click', () => {
        langBtn.textContent = option.textContent;
        langOptions.classList.remove('open');
      });
      });

      // Close dropdown if clicked outside
      document.addEventListener('click', (e) => {
      if (!langBtn.contains(e.target) && !langOptions.contains(e.target)) {
        langOptions.classList.remove('open');
      }
      });

      // Optional: close on scroll like the style switcher
      window.addEventListener('scroll', () => {
      if (langOptions.classList.contains('open')) {
        langOptions.classList.remove('open');
      }
      });

      // <-------------------- Scroll down arrow ---------------->
      const scrollArrow = document.getElementById('scrollArrow');
      const footer = document.getElementById('footer');
      const sections = document.querySelectorAll('section');
      let lastScrollY = window.scrollY;
      let isScrollingDown = true; // Default to true (initial scroll down)

      function getCurrentSectionIndex() {
        const viewportMiddle = window.innerHeight / 2;
        let index = -1;
        sections.forEach((section, i) => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
            index = i;
          }
        });
        return index;
      }

      function updateArrowVisibility() {
        const currentIndex = getCurrentSectionIndex();
        const isSmallScreen = window.innerWidth <= 768;

        // Recalculate scroll direction each time the user scrolls
        isScrollingDown = window.scrollY > lastScrollY;

        // Fix: If at the top of the page (scroll position is 0), force arrow to point down
        if (window.scrollY === 0) {
          scrollArrow.classList.remove('up');
          scrollArrow.classList.add('down');
        }

        // Hide arrow on Page 4 and beyond
        if (currentIndex === 3 || window.scrollY + window.innerHeight >= document.body.scrollHeight) {
          scrollArrow.classList.remove('visible');
        } else if (isSmallScreen && (currentIndex === 0 || currentIndex === 1)) {
          scrollArrow.classList.add('visible');
          scrollArrow.classList.remove('up', 'down');
          // Point arrow based on scroll direction
          if (isScrollingDown) {
            scrollArrow.classList.add('down');
          } else {
            scrollArrow.classList.add('up');
          }
        }

        // When on Page 4, handle the scroll direction as well
        if (currentIndex === 3) {
          if (isScrollingDown) {
            scrollArrow.classList.add('down');
            scrollArrow.classList.remove('up');
          } else {
            scrollArrow.classList.add('up');
            scrollArrow.classList.remove('down');
          }
        }

        lastScrollY = window.scrollY;
      }

      function scrollToNextSection() {
        const currentIndex = getCurrentSectionIndex();
        const nextIndex = currentIndex + 1;

        if (nextIndex < sections.length) {
          sections[nextIndex].scrollIntoView({ behavior: 'smooth' });
        }
      }

      function scrollToPreviousSection() {
        const currentIndex = getCurrentSectionIndex();
        const previousIndex = currentIndex - 1;

        if (previousIndex >= 0) {
          sections[previousIndex].scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Event listener for clicking the scroll arrow
      scrollArrow.addEventListener('click', () => {
        const currentIndex = getCurrentSectionIndex();

        if (currentIndex === 0) {
          // If we're on Page 1, force scroll to Page 2
          scrollToNextSection();
        } else if (isScrollingDown) {
          // If we're not on Page 1, scroll to the next section
          scrollToNextSection();
        } else {
          // Otherwise, scroll up
          scrollToPreviousSection();
        }
      });

      // Force arrow to point down initially when the page loads
      window.addEventListener('load', () => {
        // On page load, check if we're at the top of the page and set the arrow to point down
        if (window.scrollY === 0) {
          scrollArrow.classList.add('down');
          scrollArrow.classList.remove('up');
        }
      });

      window.addEventListener('scroll', updateArrowVisibility);
      window.addEventListener('resize', updateArrowVisibility);

      updateArrowVisibility();

      // Fix for after scrolling to Page 1 from Page 2
      // If on the top of Page 1, set arrow to point down
      window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
          scrollArrow.classList.remove('up');
          scrollArrow.classList.add('down');
        }
      });

      // <-------------------- Add delay to "More About Me" button link click (for touch devices) ---------------->
      document.getElementById('about-me-btn').addEventListener('click', function(e) {
      // Check if the device is a touch device (screen width <= 768px)
      if (window.innerWidth <= 768) {
      e.preventDefault();  // Prevent immediate navigation

      // Add a small delay to allow hover effect to complete
      setTimeout(() => {
      // Ensure the element is an anchor tag before accessing href
      if (e.target.tagName === 'A') {
      window.location.href = e.target.href;  // Redirect after the delay
      }
      }, 500);  // 500ms delay to match the hover transition time
      }
      });

      // <-------------------- Initialize ScrollReveal with global settings ---------------->
      const sr = ScrollReveal({
      distance: '80px',
      duration: 2000,
      delay: 200
      });

      // <------------------------- Reveal elements with different origins ----------------->
      sr.reveal('.home-content, .heading, .counter, .video-wrapper', { origin: 'top' });
      sr.reveal('.home-img, .project', { origin: 'bottom' });

      // <-------------------- Typed.js Initialization -------------------->
      document.addEventListener('DOMContentLoaded', function () {
  	  const typed = new Typed('.multiple-text', {
          strings: [
            '<span class="article-text">أستاذ</span> مساعد',
            '<span class="article-text">متخصصة</span> في الدراما ودراسات الأفلام',
            '<span class="article-text">ناقدة</span> درامية وسينمائية'
            ],
          typeSpeed: 65,         // Speed of typing (milliseconds per character)
          backSpeed: 20,         // Speed of backspacing (milliseconds per character)
          backDelay: 500,        // Delay before backspacing starts (milliseconds)
          startDelay: 50,        // Delay before typing starts (milliseconds)
          loop: true,            // Loop the typing effect
        });
      });

      // <------------------------------ Popup modal handling ---------------------------------->
      document.addEventListener('DOMContentLoaded', function() {
      // Handle clicks on the team member links
      document.querySelectorAll('.team_list a').forEach(function(link) {
      link.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default link behavior
      var popupId = this.getAttribute('data-tab'); // Get the ID of the modal
      var modal = document.getElementById(popupId);

      // Show the popup and disable body scrolling
      modal.classList.add('show'); // Show the modal by adding the 'show' class
      document.body.classList.add('no-scroll'); // Disable scrolling on body
      });
      });

      // Handle clicks on the close button to hide the popup
      document.querySelectorAll('.close_btn').forEach(function(closeBtn) {
      closeBtn.addEventListener('click', function() {
      var modal = this.closest('.popup_wrap');
      modal.classList.remove('show'); // Hide the modal by removing the 'show' class
      document.body.classList.remove('no-scroll'); // Enable scrolling on body
      });
      });

      // Close the modal when clicking outside the modal content (on the overlay)
      document.querySelectorAll('.popup_wrap').forEach(function(modal) {
      modal.addEventListener('click', function(e) {
      if (e.target === this) {
      modal.classList.remove('show'); // Hide the modal when clicking on the overlay
      document.body.classList.remove('no-scroll'); // Enable scrolling on body
      }
      });
      });
      });

      // <----------------------- SWIPER NEW ----------------------->
      let swiperNew = new Swiper('.new-swiper', {
      loop: true,
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 1,
      spaceBetween: 20,
      autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      },
      pagination: {
      el: '.swiper-pagination',
      clickable: true,
      },
      navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
      },
      breakpoints: {
      320: {
      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 10,
      },
      375: {
      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 15,
      },
      414: {
      slidesPerView: 1.4,
      centeredSlides: true,
      spaceBetween: 10,
      },
      480: {
      slidesPerView: 1.75,
      centeredSlides: true,
      spaceBetween: 20,
      },
      600: {
      slidesPerView: 2,
      centeredSlides: false,
      spaceBetween: 20,
      },
      768: {
      slidesPerView: 2.5,
      centeredSlides: true,
      spaceBetween: 30,
      },
      1024: {
      slidesPerView: 3,
      centeredSlides: true,
      spaceBetween: 30,
      },
      1280: {
      slidesPerView: 4,
      centeredSlides: false,
      spaceBetween: 40,
      },
      1300: {
      slidesPerView: 5,
      centeredSlides: true,
      spaceBetween: 50,
      },
      },
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
      
      // <------------------ Theme Color ----------------------->
      /*function setActiveStyle(colorClass) {
          // Remove any existing color classes
          document.body.classList.remove('color-1', 'color-2', 'color-3', 'color-4', 'color-5');
          
          // Add the selected color class
          document.body.classList.add(colorClass);
      }*/

      // <------------------ Day/Night Mode Toggle ----------------------->
      /*const dayNight = document.querySelector(".day-night");

          // Toggle between light and dark modes
          dayNight.addEventListener("click", () => {
              const isDarkMode = document.body.classList.toggle("dark");
              const icon = dayNight.querySelector("span");

              // Toggle icons
              icon.classList.toggle("fa-sun");
              icon.classList.toggle("fa-moon");

              // Save theme preference in localStorage
              localStorage.setItem("theme", isDarkMode ? "dark" : "light");
      });*/
