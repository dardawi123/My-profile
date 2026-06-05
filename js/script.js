
// Theme & Dark Mode Initialization
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

// Theme Color Switcher
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

    // Close style switcher after selection
    const styleSwitcher = document.querySelector(".style-switcher");
    if (styleSwitcher) {
        styleSwitcher.classList.remove("open");
    }
}

// Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    localStorage.setItem("darkMode", isDark);

    updateDayNightIcon();
}

// Day/Night Icon
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

// DOM Ready
document.addEventListener("DOMContentLoaded", () => {

    // Initialize theme and dark mode
    initTheme();

    // Style Switcher Toggle
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

    // Dark Mode Toggle Button
    const darkToggle = document.querySelector(".dark-mode-toggle");

    if (darkToggle) {
        darkToggle.addEventListener("click", toggleDarkMode);
    }

    // Day/Night Toggle Button
    const dayNight = document.querySelector(".day-night");

    if (dayNight) {
        dayNight.addEventListener("click", toggleDarkMode);
    }

    // Active Navigation Link
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
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const menuClose = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');
const body = document.body;

// Safety check (prevents crashes if any element is missing)
if (menuToggle && navLinks && menuClose && menuOverlay) {

  function openMenu() {
    navLinks.classList.add('show');
    menuOverlay.classList.add('show');
    body.classList.add('no-scroll');
  }

  function closeMenu() {
    navLinks.classList.remove('show');
    menuOverlay.classList.remove('show');
    body.classList.remove('no-scroll');
  }

  menuToggle.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);

  // Close when clicking outside menu (overlay)
  /*menuOverlay.addEventListener('click', closeMenu);*/

  // Optional: close menu when clicking a nav link (good UX)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Optional: ESC key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

} else {
  console.warn("Menu elements missing in DOM");
}

// ========== LANGUAGE SWITCH ==========
document.addEventListener("DOMContentLoaded", () => {

    const langSwitch = document.getElementById("langSwitch");
    if (!langSwitch) return;

    // 🔴 IMPORTANT FIX: normalize URL case
    let current = window.location.pathname.toLowerCase();
    let target = null;

    // HOME PAGE
    if (current === "/" || current.endsWith("/index.html")) {
        target = "/ar/index-ar.html";
    }
    else if (current.endsWith("/ar/index-ar.html")) {
        target = "/index.html";
    }

    // PROFILE PAGES
    else if (current.includes("/profile-en/")) {
        target = current
            .replace("/profile-en/", "/profile-ar/")
            .replace("-en.html", "-ar.html");
    }

    else if (current.includes("/profile-ar/")) {
        target = current
            .replace("/profile-ar/", "/profile-en/")
            .replace("-ar.html", "-en.html");
    }

    // FALLBACK (optional safety)
    else if (current.includes("-ar.html")) {
        target = current.replace("-ar.html", ".html");
    }
    else if (current.endsWith(".html")) {
        target = current.replace(".html", "-ar.html");
    }

    // DEBUG (remove later if you want)
    console.log("Current:", current);
    console.log("Target:", target);

    if (!target) return;

    // Set link
    langSwitch.href = target;

    // Click animation + redirect
    langSwitch.addEventListener("click", function (e) {
        e.preventDefault();

        this.classList.add("animate");

        setTimeout(() => {
            window.location.href = target;
        }, 300);
    });

});

// <-------------------- Scroll down arrow ---------------->
const scrollArrow = document.getElementById('scrollArrow');
const sections = document.querySelectorAll('section');

if (scrollArrow && sections.length) {

let lastScrollY = window.scrollY;
let isScrollingDown = true;

function getCurrentSectionIndex() {
    const mid = window.innerHeight / 2;
    let index = 0;

    sections.forEach((section, i) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= mid && rect.bottom >= mid) {
        index = i;
    }
    });

    return index;
}

function updateArrowVisibility() {

    const scrollTop = window.scrollY;
    const scrollBottom = scrollTop + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    const atTop = scrollTop <= 10;
    const atBottom = scrollBottom >= pageHeight - 2;

    isScrollingDown = scrollTop > lastScrollY;
    lastScrollY = scrollTop;

    scrollArrow.classList.remove('visible', 'up', 'down');

    // ❌ Bottom = always hidden
    if (atBottom) return;

    // ✔ Top = always visible
    if (atTop) {
    scrollArrow.classList.add('visible', 'down');
    return;
    }

    // ✔ Middle logic depends on direction
    if (isScrollingDown) {
    scrollArrow.classList.add('visible', 'down');
    } else {
    scrollArrow.classList.remove('visible');
    }
}

function scrollToNextSection() {
    const index = getCurrentSectionIndex();

    if (index < sections.length - 1) {
    sections[index + 1].scrollIntoView({ behavior: 'smooth' });
    }
}

// click always goes down only
scrollArrow.addEventListener('click', scrollToNextSection);

// events
window.addEventListener('scroll', updateArrowVisibility);
window.addEventListener('resize', updateArrowVisibility);
window.addEventListener('load', updateArrowVisibility);

updateArrowVisibility();

}
   
// <-------------------- Open/download a PDF one button ---------------->  
document.addEventListener('DOMContentLoaded', () => {

    const pdfButton = document.getElementById('pdfBtn');

    if (!pdfButton) {
        console.log("PDF button not found");
        return;
    }

    pdfButton.addEventListener('click', openPDF);

});

function openPDF() {
    const lang = document.documentElement.lang;

    const pdfPath = (lang === 'ar')
        ? '/assets/cv/Dr-Merfat-Alardawi-Resume-ar.pdf'
        : 'assets/cv/Dr-Merfat-Alardawi-Resume-en.pdf';

    window.open(pdfPath, '_blank');
}
    
// <-------------------- ScrollReveal Initialization ---------------->
document.addEventListener('DOMContentLoaded', () => {

    const featureExists = typeof ScrollReveal !== "undefined";
    const pageNeedsIt = document.querySelector(
        '.home-content, .heading, .project'
    ) !== null;

    if (!(featureExists && pageNeedsIt)) {
        console.log("ScrollReveal skipped");
        return;
    }

    const sr = ScrollReveal({
        distance: '80px',
        duration: 2000,
        delay: 200
    });
  
    // Top Animations
    sr.reveal('.home-content, .heading, .counter, .video-wrapper', {
        origin: 'top'
    });

    // Bottom Animations
    sr.reveal('.home-img, .project', {
        origin: 'bottom'
    });
});

// <-------------------- Typed.js Initialization -------------------->
document.addEventListener('DOMContentLoaded', () => {

    if (typeof Typed === 'undefined') {
        console.log("Typed.js not loaded - skipped");
        return;
    }

    const current = window.location.pathname;

    let strings;

    // ARABIC VERSION
    if (current.includes('-ar.html')) {
        strings = [
            '<span class="article-text">أستاذ</span> مساعد',
            '<span class="article-text">متخصصة</span> في الدراما ودراسات الأفلام',
            '<span class="article-text">ناقدة</span> درامية وسينمائية'
        ];
    } else {
        strings = [
            '<span class="article-text">an</span> Assistant Professor',
            '<span class="article-text">a</span> Specialist in Drama and Film Studies',
            '<span class="article-text">a</span> Dramatic and Cinematic Critic'
        ];
    }

    new Typed('.multiple-text', {
        strings: strings,
        typeSpeed: 65,
        backSpeed: 20,
        backDelay: 500,
        startDelay: 50,
        loop: true
    });

});

// ------------------------------ Popup modal handling ------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Open modal when clicking team links
    document.querySelectorAll('.team_list a').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const popupId = link.getAttribute('data-tab');
            const modal = document.getElementById(popupId);

            if (!modal) return;

            modal.classList.add('show');
            document.body.classList.add('no-scroll');
        });
    });

    // Close modal via close button
    document.querySelectorAll('.close_btn').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            const modal = closeBtn.closest('.popup_wrap');
            if (!modal) return;

            modal.classList.remove('show');
            document.body.classList.remove('no-scroll');
        });
    });

    // Close modal when clicking outside content (overlay)
    document.querySelectorAll('.popup_wrap').forEach((modal) => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.classList.remove('no-scroll');
            }
        });
    });
});

// ----------------------- SWIPER NEW -----------------------
document.addEventListener('DOMContentLoaded', () => {

    const featureExists = typeof Swiper !== "undefined";
    const pageNeedsIt = document.querySelector('.new-swiper') !== null;

    if (!(featureExists && pageNeedsIt)) {
        console.log("Swiper skipped (not needed or missing)");
        return;
    }

    window.swiperNew = new Swiper('.new-swiper', {
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

});

// ------------------ Scroll-to-Top functionality ------------------
const scrollToTopButton = document.querySelector('.footer-iconTop a');

if (scrollToTopButton) {
    scrollToTopButton.addEventListener('click', (e) => {
        e.preventDefault();

        const start = window.scrollY;
        const distance = start;
        const duration = 500;
        let startTime = null;

        function smoothScroll(timestamp) {
            if (!startTime) startTime = timestamp;

            const progress = timestamp - startTime;
            const scrollAmount = Math.min(progress / duration, 1);

            window.scrollTo(0, start - distance * scrollAmount);

            if (scrollAmount < 1) {
                requestAnimationFrame(smoothScroll);
            }
        }

        requestAnimationFrame(smoothScroll);
    });
}

