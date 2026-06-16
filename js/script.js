
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

    langSwitch.addEventListener("click", function (e) {
        e.preventDefault();

        if (this.classList.contains("animating")) return;
        this.classList.add("animating", "animate");

        // Compute target at click time (more robust)
        let path = window.location.pathname.toLowerCase();
        let target = null;

        const isHome =
            path === "/" ||
            path === "/index.html" ||
            path === "/index";

        const isArabicHome =
            path === "/ar/" ||
            path === "/ar/index.html" ||
            path === "/ar/index";

        if (isHome) {
            target = "/ar/index.html";
        }
        else if (isArabicHome) {
            target = "/index.html";
        }
        else if (path.includes("/profile-en/")) {
            target = path
                .replace("/profile-en/", "/profile-ar/")
                .replace("-en.html", "-ar.html");
        }
        else if (path.includes("/profile-ar/")) {
            target = path
                .replace("/profile-ar/", "/profile-en/")
                .replace("-ar.html", "-en.html");
        }
        else {
            if (path.includes("/ar/")) {
                target = path.replace("/ar/", "/");
                target = target.replace("-ar.html", ".html");
            } else {
                target = path.replace(".html", "-ar.html");
            }
        }

        if (!target) return;

        document.body.classList.add("fade-out");

        // Force browser paint before redirect (IMPORTANT)
        requestAnimationFrame(() => {
            setTimeout(() => {
                window.location.href = target;
            }, 200);
        });
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

document.addEventListener("DOMContentLoaded", () => {

});

// <-------------------- Open/download a PDF one button ---------------->  
function openPDF() {
    const path = window.location.pathname.toLowerCase();

    const isArabicPage = path.includes("/ar/") || path.includes("-ar.html");

    const pdfPath = isArabicPage
        ? '/assets/cv/Dr-Merfat-Alardawi-Resume-ar.pdf'
        : '/assets/cv/Dr-Merfat-Alardawi-Resume-en.pdf';

    window.open(pdfPath, '_blank');
} 

// ------------------------------ Popup modal handling ------------------------------
document.addEventListener('click', (e) => {

  // OPEN POPUP
  const link = e.target.closest('a[data-tab]');
  if (link) {
    e.preventDefault();

    const modal = document.getElementById(link.dataset.tab);

    if (modal) {
      modal.classList.add('show');
      document.body.classList.add('no-scroll');
    }
  }

  // CLOSE BUTTON
  const closeBtn = e.target.closest('.close_btn');
  if (closeBtn) {
    const modal = closeBtn.closest('.popup_wrap');

    if (modal) {
      modal.classList.remove('show');
      document.body.classList.remove('no-scroll');
    }
  }

  // CLICK OUTSIDE
  if (e.target.classList.contains('popup_wrap')) {
    e.target.classList.remove('show');
    document.body.classList.remove('no-scroll');
  }
});

/* -------------------- PUBLICATIONS FILTER -------------------- */
const pubButtons = document.querySelectorAll(".publication-filter button");
const pubRows = document.querySelectorAll(".publication-table tr[data-type]");
const pubHeading = document.getElementById("publication-heading");
const pubNoResults = document.getElementById("publication-no-results");
const pubTable = document.querySelector(".publication-table");

const lang = document.documentElement.lang || "en";

const pubLabels = {
  en: {
    all: "All Publications",
    "journal-article": "Journal Articles",
    "online-publication": "Online Publications",
    book: "Books",
    "book-chapter": "Book Chapters",
    "phd-thesis": "PhD Theses"
  },
  ar: {
    all: "جميع المنشورات",
    "journal-article": "المقالات العلمية",
    "online-publication": "المجلات الإلكترونية",
    book: "الكتب",
    "book-chapter": "فصول الكتب",
    "phd-thesis": "رسائل الدكتوراه"
  }
};

const currentLabels = pubLabels[lang] || pubLabels.en;

function filterPublications(filter) {
  let count = 0;

  pubRows.forEach(row => {
    const type = row.dataset.type;
    const show = filter === "all" || type === filter;

    row.style.display = show ? "table-row" : "none";

    if (show) {
      count++;
    }
  });

  // Update heading (UPDATED)
  if (pubHeading) {
    const locale = document.documentElement.lang === "ar" ? "ar-EG" : "en";
    const formattedCount = new Intl.NumberFormat(locale).format(count);

    pubHeading.textContent = `${currentLabels[filter]} (${formattedCount})`;
  }

  // Show/hide table
  if (pubTable) {
    pubTable.style.display = count === 0 ? "none" : "table";
  }

  // Show/hide "No Results" message
  if (pubNoResults) {
    pubNoResults.style.display = count === 0 ? "block" : "none";
  }
}

// Filter button clicks
pubButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    pubButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    filterPublications(btn.dataset.filter);
  });
});

// Initial load
filterPublications("all");

/* -------------------- ACTIVITIES FILTER -------------------- */
document.addEventListener("DOMContentLoaded", () => {

  const lang = document.documentElement.lang || "en";

  const labels = {
    en: {
      all: "All Activities",
      conference: "Conference",
      workshop: "Workshop",
      seminar: "Seminar",
      festival: "Festival",
      "forum-events": "Forum Events"
    },
    ar: {
      all: "جميع الأنشطة",
      conference: "المؤتمرات",
      workshop: "ورش العمل",
      seminar: "الندوات",
      festival: "المهرجانات",
      "forum-events": "فعاليات المنتدى"
    }
  };

  const currentLabels = labels[lang] || labels.en;

  const buttons = document.querySelectorAll(".activities-filter button");
  const rows = document.querySelectorAll(".activity-table tr[data-type]");
  const heading = document.getElementById("activity-heading");
  const noResults = document.getElementById("activity-no-results");
  const activityTable = document.querySelector(".activity-table");

  function filterActivities(filter) {
    let count = 0;

    rows.forEach(row => {
      const show = filter === "all" || row.dataset.type === filter;
      row.style.display = show ? "table-row" : "none";

      if (show) {
        count++;
      }
    });

    // Update heading (FIXED: language-aware numbers)
    if (heading) {
      const locale = document.documentElement.lang === "ar" ? "ar-EG" : "en";
      const formattedCount = new Intl.NumberFormat(locale).format(count);

      heading.textContent = `${currentLabels[filter]} (${formattedCount})`;
    }

    // Show/hide table
    if (activityTable) {
      activityTable.style.display = count === 0 ? "none" : "table";
    }

    // Show/hide "No results" message
    if (noResults) {
      noResults.style.display = count === 0 ? "block" : "none";
    }
  }

  // Button click events
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      filterActivities(btn.dataset.filter);
    });
  });

  // Initial load
  filterActivities("all");
});

// ------------------ Team member filter (show/hide by category) ------------------
document.addEventListener('click', (e) => {

  const btn = e.target.closest('[data-filter]');
  if (!btn) return;

  const filter = btn.dataset.filter;

  // remove active state
  document.querySelectorAll('[data-filter]')
    .forEach(b => b.classList.remove('active'));

  btn.classList.add('active');

  const cards = document.querySelectorAll('.team_member');

  cards.forEach(card => {

    if (filter === 'all') {
      card.style.display = 'block';
      return;
    }

    card.style.display =
      card.classList.contains(filter)
        ? 'block'
        : 'none';

  });

});

// <-------------------- ScrollReveal Initialization ---------------->
document.addEventListener('DOMContentLoaded', () => {

    const featureExists = typeof ScrollReveal !== "undefined";
    const pageNeedsIt = document.querySelector(
        '.heading, .project'
    ) !== null;

    if (!(featureExists && pageNeedsIt)) {
        console.log("ScrollReveal skipped");
        return;
    }

    const sr = ScrollReveal({
        distance: '30px',
        duration: 600,
        delay: 0,
        viewFactor: 0.2
    });

    // Bottom Animations
    sr.reveal('.heading, .project', {
        origin: 'bottom'
    });
});

// <-------------------- Typed.js Initialization -------------------->
document.addEventListener('DOMContentLoaded', () => {

    if (typeof Typed === 'undefined') {
        console.log("Typed.js not loaded - skipped");
        return;
    }

    const lang = sessionStorage.getItem("lang")
        || (window.location.pathname.startsWith("/ar/") ? "ar" : "en");

    let strings;

    if (lang === "ar") {
        strings = [
            "أستاذ مساعد",
            "باحثة أكاديمية",
            "متخصصة في الدراسات الدرامية والسينمائية",
            "ناقدة درامية وسينمائية"
        ];
        
    } else {

        strings = [
            "Assistant Professor",
            "Academic Researcher",
            "Scholar of Drama and Film Studies",
            "Drama and Film Critic"
        ];
    }

    new Typed('.multiple-text', {
        strings: strings,
        typeSpeed: 45,
        backSpeed: 25,
        backDelay: 1400,
        startDelay: 200,
        loop: true,
        smartBackspace: true,
        showCursor: false
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

