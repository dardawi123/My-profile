// ======================================================
// Theme & Dark Mode Initialization
// ======================================================
function initTheme() {
    const savedTheme = localStorage.getItem("themeColor") || "theme-1";
    const isDark = localStorage.getItem("darkMode") === "true";

    document.body.classList.remove(
        "theme-1",
        "theme-2",
        "theme-3",
        "theme-4",
        "theme-5"
    );
    document.body.classList.add(savedTheme);
    document.body.classList.toggle("dark", isDark);
    updateDayNightIcon();
}

// ======================================================
// Theme Color Switcher
// ======================================================
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
    const styleSwitcher = document.querySelector(".style-switcher");

    if (styleSwitcher) {
        styleSwitcher.classList.remove("open");
    }
}

// ======================================================
// Dark Mode
// ======================================================
function toggleDarkMode() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", isDark);

    updateDayNightIcon();
}

// ======================================================
// Day / Night Icon
// ======================================================
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

// ======================================================
// Theme & Navigation
// ======================================================
function initThemeAndNavigation() {

    // Always initialize theme
    initTheme();

    const pageNeedsIt =
        document.querySelector(".style-switcher") ||
        document.querySelector(".nav-links");

    if (!pageNeedsIt) {
        console.log("Theme & Navigation skipped");
        return;
    }

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

    const darkToggle = document.querySelector(".dark-mode-toggle");

    if (darkToggle) {
        darkToggle.addEventListener(
            "click",
            toggleDarkMode
        );
    }

    const dayNight = document.querySelector(".day-night");

    if (dayNight) {dayNight.addEventListener(
            "click",
            toggleDarkMode
        );
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
        }

    });
}

// ======================================================
// Menu
// ======================================================
function initMenu() {
    const pageNeedsIt = document.getElementById("menuToggle") !== null;

    if (!pageNeedsIt) {
        console.log("Menu skipped");
        return;
    }

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const menuClose = document.getElementById("menuClose");
    const menuOverlay = document.getElementById("menuOverlay");
    const body = document.body;

    if (
        !menuToggle ||
        !navLinks ||
        !menuClose ||
        !menuOverlay
    ) {
        return;
    }

    function openMenu() {
        navLinks.classList.add("show");
        menuOverlay.classList.add("show");
        body.classList.add("no-scroll");
    }

    function closeMenu() {
        navLinks.classList.remove("show");
        menuOverlay.classList.remove("show");
        body.classList.remove("no-scroll");
    }

    menuToggle.addEventListener("click", openMenu);
    menuClose.addEventListener("click", closeMenu);

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMenu();
        }
    });
}

// ======================================================
// Language Switch
// ======================================================
function initLanguageSwitch() {
    const pageNeedsIt = document.getElementById("langSwitch") !== null;

    if (!pageNeedsIt) {
        console.log("Language switch skipped");
        return;
    }

    const langSwitch = document.getElementById("langSwitch");

    langSwitch.addEventListener("click", function (e) {

        e.preventDefault();

        if (this.classList.contains("animating")) {
            return;
        }

        this.classList.add(
            "animating",
            "animate"
        );

        let path =
            window.location.pathname.toLowerCase();

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

        } else if (isArabicHome) {

            target = "/index.html";

        } else if (path.includes("/profile-en/")) {

            target = path
                .replace("/profile-en/", "/profile-ar/")
                .replace("-en.html", "-ar.html");

        } else if (path.includes("/profile-ar/")) {

            target = path
                .replace("/profile-ar/", "/profile-en/")
                .replace("-ar.html", "-en.html");

        } else {

            if (path.includes("/ar/")) {

                target =
                    path.replace("/ar/", "/");

                target =
                    target.replace("-ar.html", ".html");

            } else {

                target =
                    path.replace(".html", "-ar.html");
            }
        }

        if (!target) return;

        document.body.classList.add("fade-out");

        requestAnimationFrame(() => {
            setTimeout(() => {
                window.location.href = target;
            }, 200);
        });

    });
}

// ======================================================
// Scroll Arrow
// ======================================================
function initScrollArrow() {
    const scrollArrow = document.getElementById("scrollArrow");
    const sections = document.querySelectorAll("section");
    const pageNeedsIt =
        scrollArrow !== null &&
        sections.length > 0;

    if (!pageNeedsIt) {
        console.log("Scroll Arrow skipped");
        return;
    }

    let lastScrollY = window.scrollY;
    let isScrollingDown = true;

    function getCurrentSectionIndex() {

        const mid = window.innerHeight / 2;

        let index = 0;

        sections.forEach((section, i) => {

            const rect = section.getBoundingClientRect();

            if (
                rect.top <= mid &&
                rect.bottom >= mid
            ) {
                index = i;
            }

        });

        return index;
    }

    function updateArrowVisibility() {
        const scrollTop = window.scrollY;
        const scrollBottom = scrollTop + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        const atTop =
            scrollTop <= 10;
        const atBottom =
            scrollBottom >= pageHeight - 2;

        isScrollingDown =
            scrollTop > lastScrollY;

        lastScrollY = scrollTop;

        scrollArrow.classList.remove(
            "visible",
            "up",
            "down"
        );

        if (atBottom) return;

        if (atTop) {
            scrollArrow.classList.add(
                "visible",
                "down"
            );
            return;
        }

        if (isScrollingDown) {
            scrollArrow.classList.add(
                "visible",
                "down"
            );
        } else {
            scrollArrow.classList.remove(
                "visible"
            );
        }
    }

    function scrollToNextSection() {
        const index = getCurrentSectionIndex();

        if (index < sections.length - 1) {

            sections[index + 1].scrollIntoView({
                behavior: "smooth"
            });

        }
    }

    scrollArrow.addEventListener(
        "click",
        scrollToNextSection
    );

    window.addEventListener(
        "scroll",
        updateArrowVisibility
    );

    window.addEventListener(
        "resize",
        updateArrowVisibility
    );

    updateArrowVisibility();
}
// ======================================================
// Scroll To Top
// ======================================================
function initScrollToTop() {
    const scrollToTopButton =
        document.querySelector(
            ".footer-iconTop a"
        );

    const pageNeedsIt =
        scrollToTopButton !== null;

    if (!pageNeedsIt) {
        console.log("Scroll To Top skipped");
        return;
    }

    scrollToTopButton.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            const start = window.scrollY;
            const distance = start;
            const duration = 500;

            let startTime = null;

            function smoothScroll(timestamp) {

                if (!startTime) {
                    startTime = timestamp;
                }

                const progress = timestamp - startTime;
                const scrollAmount =
                    Math.min(
                        progress / duration,
                        1
                    );

                window.scrollTo(
                    0,
                    start - distance * scrollAmount
                );

                if (scrollAmount < 1) {
                    requestAnimationFrame(
                        smoothScroll
                    );
                }
            }

            requestAnimationFrame(
                smoothScroll
            );
        }
    );
}
// ======================================================
// Open / Download PDF
// ======================================================
function openPDF() {
    const path = window.location.pathname.toLowerCase();

    const isArabicPage =
        path.includes("/ar/")
        || path.includes("-ar.html");

    const pdfPath = isArabicPage
        ? "/assets/cv/Dr-Merfat-Alardawi-Resume-ar.pdf"
        : "/assets/cv/Dr-Merfat-Alardawi-Resume-en.pdf";

    window.open(pdfPath, "_blank");
}

// ======================================================
// Popup Modal
// ======================================================
function initPopupModal() {
    const pageNeedsIt =
        document.querySelector("[data-tab]") !== null ||
        document.querySelector(".popup_wrap") !== null;

    if (!pageNeedsIt) {
        console.log("Popup modal skipped");
        return;
    }

    document.addEventListener("click", (e) => {

        // OPEN POPUP
        const link = e.target.closest("a[data-tab]");

        if (link) {

            e.preventDefault();

            const modal =
                document.getElementById(
                    link.dataset.tab
                );

            if (modal) {
                modal.classList.add("show");
                document.body.classList.add("no-scroll");
            }
        }

        // CLOSE BUTTON
        const closeBtn =
            e.target.closest(".close_btn");

        if (closeBtn) {

            const modal = closeBtn.closest(".popup_wrap");

            if (modal) {
                modal.classList.remove("show");
                document.body.classList.remove("no-scroll");
            }
        }

        // CLICK OUTSIDE
        if (e.target.classList.contains("popup_wrap")) {

            e.target.classList.remove("show");
            document.body.classList.remove("no-scroll");

        }

    });
}

// ======================================================
// Publications Filter
// ======================================================
function initPublicationsFilter() {
    const pageNeedsIt = document.querySelector(".publication-filter") !== null;

    if (!pageNeedsIt) {
        console.log("Publications filter skipped");
        return;
    }

    const pubButtons =
        document.querySelectorAll(
            ".publication-filter button"
        );

    const pubRows =
        document.querySelectorAll(
            ".publication-table tr[data-type]"
        );

    const pubHeading =
        document.getElementById(
            "publication-heading"
        );

    const pubNoResults =
        document.getElementById(
            "publication-no-results"
        );

    const pubTable =
        document.querySelector(
            ".publication-table"
        );

    const lang =
        document.documentElement.lang || "en";

    const pubLabels = {

        en: {
            all: "All Publications",
            "journal-article": "Journal Articles",
            "conference-proceeding": "Conference Proceedings",
            "online-publication": "Online Publications",
            book: "Books",
            "book-chapter": "Book Chapters",
            "phd-thesis": "PhD Theses"
        },

        ar: {
            all: "جميع المنشورات",
            "journal-article": "المقالات العلمية",
            "conference-proceeding": "وقائع المؤتمرات",
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

            const show =
                filter === "all" ||
                type === filter;

            row.style.display =
                show ? "table-row" : "none";

            if (show) {
                count++;
            }

        });

        if (pubHeading) {

            const locale =
                document.documentElement.lang === "ar"
                    ? "ar-EG"
                    : "en";

            const formattedCount =
                new Intl.NumberFormat(locale)
                    .format(count);

            pubHeading.textContent =
                `${currentLabels[filter]} (${formattedCount})`;
        }

        if (pubTable) {
            pubTable.style.display =
                count === 0
                    ? "none"
                    : "table";
        }

        if (pubNoResults) {
            pubNoResults.style.display =
                count === 0
                    ? "block"
                    : "none";
        }
    }

    pubButtons.forEach(btn => {

        btn.addEventListener("click", () => {

            pubButtons.forEach(b =>
                b.classList.remove("active")
            );

            btn.classList.add("active");

            filterPublications(
                btn.dataset.filter
            );

        });

    });

    filterPublications("all");
}

// ======================================================
// Activities Filter
// ======================================================
function initActivitiesFilter() {
    const pageNeedsIt = document.querySelector(".activities-filter") !== null;

    if (!pageNeedsIt) {
        console.log("Activities filter skipped");
        return;
    }

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
    
    const buttons =
        document.querySelectorAll(
            ".activities-filter button"
        );

    const rows =
        document.querySelectorAll(
            ".activity-table tr[data-type]"
        );

    const heading =
        document.getElementById(
            "activity-heading"
        );

    const noResults =
        document.getElementById(
            "activity-no-results"
        );

    const activityTable =
        document.querySelector(
            ".activity-table"
        );

    function filterActivities(filter) {

        let count = 0;

        rows.forEach(row => {

            const show =
                filter === "all" ||
                row.dataset.type === filter;

            row.style.display =
                show ? "table-row" : "none";

            if (show) {
                count++;
            }

        });

        if (heading) {

            const locale =
                document.documentElement.lang === "ar"
                    ? "ar-EG"
                    : "en";

            const formattedCount =
                new Intl.NumberFormat(locale)
                    .format(count);

            heading.textContent =
                `${currentLabels[filter]} (${formattedCount})`;
        }

        if (activityTable) {
            activityTable.style.display =
                count === 0
                    ? "none"
                    : "table";
        }

        if (noResults) {
            noResults.style.display =
                count === 0
                    ? "block"
                    : "none";
        }
    }

    buttons.forEach(btn => {

        btn.addEventListener("click", () => {

            buttons.forEach(b =>
                b.classList.remove("active")
            );

            btn.classList.add("active");

            filterActivities(
                btn.dataset.filter
            );

        });

    });

    filterActivities("all");
}

// ======================================================
// Team Member Filter
// ======================================================
function initTeamMemberFilter() {
    const pageNeedsIt = document.querySelector(".team_member") !== null;

    if (!pageNeedsIt) {
        console.log("Team member filter skipped");
        return;
    }

    document.addEventListener("click", (e) => {

        const btn = e.target.closest("[data-filter]");

        if (!btn) return;

        const filter = btn.dataset.filter;

        document
            .querySelectorAll("[data-filter]")
            .forEach(b =>
                b.classList.remove("active")
            );

        btn.classList.add("active");

        const cards =
            document.querySelectorAll(
                ".team_member"
            );

        cards.forEach(card => {

            if (filter === "all") {
                card.style.display = "block";
                return;
            }

            card.style.display =
                card.classList.contains(filter)
                    ? "block"
                    : "none";

        });

    });
}

// ======================================================
// ScrollReveal
// ======================================================
function initScrollReveal() {
    const featureExists = typeof ScrollReveal !== "undefined";
    const pageNeedsIt = document.querySelector(".heading, .project") !== null;

    if (!(featureExists && pageNeedsIt)) {
        console.log("ScrollReveal skipped");
        return;
    }

    const sr = ScrollReveal({
        distance: "30px",
        duration: 600,
        delay: 0,
        viewFactor: 0.2
    });

    sr.reveal(".heading, .project", {
        origin: "bottom"
    });
}

// ======================================================
// Typed.js
// ======================================================
function initTypedText() {
    const featureExists = typeof Typed !== "undefined";
    const pageNeedsIt = document.querySelector(".multiple-text") !== null;

    if (!(featureExists && pageNeedsIt)) {
        console.log("Typed.js skipped");
        return;
    }

    const lang = sessionStorage.getItem("lang") ||
        (
            window.location.pathname.startsWith("/ar/")
                ? "ar"
                : "en"
        );

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

    new Typed(".multiple-text", {
        strings: strings,
        typeSpeed: 45,
        backSpeed: 25,
        backDelay: 1400,
        startDelay: 200,
        loop: true,
        smartBackspace: true,
        showCursor: false
    });
}

// ======================================================
// Swiper
// ======================================================
function initSwiperNew() {
    const featureExists = typeof Swiper !== "undefined";
    const pageNeedsIt = document.querySelector(".new-swiper") !== null;

    if (!(featureExists && pageNeedsIt)) {
        console.log("Swiper skipped");
        return;
    }

    window.swiperNew = new Swiper(".new-swiper", {

        loop: true,
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 1,
        spaceBetween: 20,

        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },

        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },

        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },

        breakpoints: {

            320: {
                slidesPerView: 1,
                centeredSlides: true,
                spaceBetween: 10
            },

            375: {
                slidesPerView: 1,
                centeredSlides: true,
                spaceBetween: 15
            },

            414: {
                slidesPerView: 1.4,
                centeredSlides: true,
                spaceBetween: 10
            },

            480: {
                slidesPerView: 1.75,
                centeredSlides: true,
                spaceBetween: 20
            },

            600: {
                slidesPerView: 2,
                centeredSlides: false,
                spaceBetween: 20
            },

            768: {
                slidesPerView: 2.5,
                centeredSlides: true,
                spaceBetween: 30
            },

            1024: {
                slidesPerView: 3,
                centeredSlides: true,
                spaceBetween: 30
            },

            1280: {
                slidesPerView: 4,
                centeredSlides: false,
                spaceBetween: 40
            },

            1300: {
                slidesPerView: 5,
                centeredSlides: true,
                spaceBetween: 50
            }

        }

    });
}

// ======================================================
// Main Initializer
// ======================================================
// Initialize all static page features after the DOM loads.
// Dynamic features (Popup Modal and Team Member Filter)
// are initialized separately in research.js after the
// research cards and modals are generated.
document.addEventListener("DOMContentLoaded", () => {

    // Core UI & Navigation
    initThemeAndNavigation();
    initMenu();
    initLanguageSwitch();
    initScrollArrow();
    initScrollToTop();

    // Content Filters
    initPublicationsFilter();
    initActivitiesFilter();

    // Dynamic Content (research.js)
    /* initPopupModal(); */
    /* initTeamMemberFilter(); */

    // Visual Effects & Interactive Components
    initScrollReveal();
    initTypedText();
    initSwiperNew();

});
