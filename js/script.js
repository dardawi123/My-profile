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
        "theme-5",
        "theme-6"

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
        "theme-5",
        "theme-6"
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

    // CHANGED: menuClose lookup removed — element no longer exists in HTML
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const menuOverlay = document.getElementById("menuOverlay");
    const body = document.body;

    if (
        !menuToggle ||
        !navLinks ||
        !menuOverlay
    ) {
        return;
    }

    // CHANGED: added aria-expanded/aria-label sync + deferred no-scroll
    function openMenu() {
        navLinks.classList.add("show");
        menuOverlay.classList.add("show");
        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close menu");

        requestAnimationFrame(() => {
            body.classList.add("no-scroll");
        });
    }

    function closeMenu() {
        navLinks.classList.remove("show");
        menuOverlay.classList.remove("show");
        body.classList.remove("no-scroll");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Toggle menu");
    }

    // NEW: hamburger now toggles instead of only opening
    function toggleMenu() {
        const isOpen = navLinks.classList.contains("show");
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // CHANGED: click -> toggleMenu (was openMenu); menuClose listener removed
    menuToggle.addEventListener("click", toggleMenu);
    // NEW: clicking the dimmed overlay now also closes the menu
    menuOverlay.addEventListener("click", closeMenu);

    // NEW: keyboard activation (Enter/Space) for the custom role="button" toggle
    function handleButtonKeydown(handler) {
        return (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handler();
            }
        };
    }

    menuToggle.addEventListener("keydown", handleButtonKeydown(toggleMenu));

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
function getLanguageSwitchTarget(path) {
    path = path.toLowerCase();

    const isHome =
        path === "/" ||
        path === "/index.html" ||
        path === "/index";

    const isArabicHome =
        path === "/ar/" ||
        path === "/ar/index.html" ||
        path === "/ar/index";

    if (isHome) {
        return "/ar/index.html";
    }

    if (isArabicHome) {
        return "/index.html";
    }

    if (path.includes("/profile-en/")) {
        return path
            .replace("/profile-en/", "/profile-ar/")
            .replace("-en.html", "-ar.html");
    }

    if (path.includes("/profile-ar/")) {
        return path
            .replace("/profile-ar/", "/profile-en/")
            .replace("-ar.html", "-en.html");
    }

    if (path.includes("/ar/")) {
        return path
            .replace("/ar/", "/")
            .replace("-ar.html", ".html");
    }

    return path.replace(".html", "-ar.html");
}

function initLanguageSwitch() {
    const langSwitch = document.getElementById("langSwitch");

    if (!langSwitch) {
        console.log("Language switch skipped");
        return;
    }

    const target = getLanguageSwitchTarget(window.location.pathname);

    langSwitch.setAttribute("href", target);

    let isNavigating = false;

    langSwitch.addEventListener("click", function (e) {

        if (isNavigating) {
            e.preventDefault();
            return;
        }

        isNavigating = true;
        e.preventDefault();

        document.body.classList.add("fade-out");

        requestAnimationFrame(() => {
            setTimeout(() => {
                window.location.href = target;
            }, 200);
        });

    });
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
// Popup Modal
// ======================================================
function initPopupModal() {
    const pageNeedsIt =
        document.querySelector("[data-tab]") !== null ||
        document.querySelector(".popup_wrap") !== null;

    if (!pageNeedsIt) {
     // console.log("Popup modal skipped");
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
// Sticky Header
// ======================================================
const sticky =
    document.querySelector(
        ".header-sticky"
    );

const header =
    document.querySelector(
        "header"
    );

function updateStickyHeight() {

    if (!sticky || !header) return;

    document.documentElement.style.setProperty(
        "--sticky-height",
        `${sticky.offsetHeight}px`
    );

    document.documentElement.style.setProperty(
        "--navbar-height",
        `${header.offsetHeight}px`
    );
}

// ======================================================
// Publications Filter
// ======================================================
function initPublicationsFilter() {
    const pageNeedsIt = document.querySelector(".publication-filter") !== null;

    if (!pageNeedsIt) {
     // console.log("Publications filter skipped");
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

// ======================================================
// Adjusts the Height of a Sticky Header 
// ======================================================
    updateStickyHeight();

        window.addEventListener(
            "resize",
            updateStickyHeight
        );

        const sticky =
            document.querySelector(
                ".publication-sticky"
            );

        if (sticky) {

            new ResizeObserver(
                updateStickyHeight
            ).observe(sticky);

        }

}

// ======================================================
// Activities Filter
// ======================================================
function initActivitiesFilter() {
    const pageNeedsIt = document.querySelector(".activities-filter") !== null;

    if (!pageNeedsIt) {
     // console.log("Activities filter skipped");
        return;
    }

    const lang = document.documentElement.lang || "en";
    const labels = {

        en: {
            all: "All Activities",
            conference: "Conferences",
            seminar: "Seminars",
            workshop: "Workshops",
            forum: "Forums",
            program: "Programs",
            festival: "Festivals",
        },

        ar: {
            all: "جميع الأنشطة",
            conference: "المؤتمرات",
            seminar: "الندوات",
            workshop: "ورش العمل",
            forum: "الملتقيات",
            program: "البرامج",
            festival: "المهرجانات",
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

// ======================================================
// Adjusts the Height of a Sticky Header 
// ======================================================
    updateStickyHeight();

        window.addEventListener(
            "resize",
            updateStickyHeight
        );

        const sticky =
            document.querySelector(
                ".publication-sticky"
            );

        if (sticky) {

            new ResizeObserver(
                updateStickyHeight
            ).observe(sticky);

        }

}

// ======================================================
// Team Member Filter
// ======================================================
function initTeamMemberFilter() {
    const pageNeedsIt = document.querySelector(".team_member") !== null;

    if (!pageNeedsIt) {
     // console.log("Team member filter skipped");
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
     // console.log("ScrollReveal skipped");
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
     // console.log("Typed.js skipped");
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
            "باحثة أكاديمية",
            "متخصصة في الدراسات الدرامية والسينمائية",
            "ناقدة درامية وسينمائية"
        ];

    } else {

        strings = [
            "Academic Researcher",
            "Drama and Film Studies Scholar",
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
     // console.log("Swiper skipped");
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
// Visitor Counter (Footer)
// ======================================================
function initVisitorCounter() {
    const valueEl = document.getElementById("visitorCount");
    const liveEl = document.getElementById("visitorCountLive");

    if (!valueEl) return;

    // KEY should be unique to your website.
    // OFFSET carries over the starting value from the previous HitWebCounter.
    // CountAPI endpoint:
    // https://countapi.mileshilliard.com/api/v1/hit/alardawi-com-homepage-total-visitors
    const API_BASE = "https://countapi.mileshilliard.com/api/v1";
    const KEY = "alardawi-com-homepage-total-visitors";
    const OFFSET = 1500;
    const FETCH_TIMEOUT_MS = 6000;
    const COUNT_UP_DURATION_MS = 900;
    const SESSION_FLAG = "visitorCounter:countedThisSession";
    const LOCAL_FALLBACK_KEY = "visitorCounter:localFallbackValue";

    // Fetch with timeout protection
    function fetchWithTimeout(url, timeoutMs) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);

        return fetch(url, { signal: controller.signal })
            .finally(() => clearTimeout(timer));
    }

    // Animate counter
    function animateCountTo(el, targetValue) {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (prefersReducedMotion) {
            el.textContent = targetValue.toLocaleString();
            return;
        }
        const startTime = performance.now();
        const startValue = Math.max(targetValue - 100, 0);

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(
                elapsed / COUNT_UP_DURATION_MS,
                1
            );
            const eased = easeOutCubic(progress);
            const currentValue = Math.round(
                startValue +
                (targetValue - startValue) * eased
            );
            el.textContent = currentValue.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = targetValue.toLocaleString();
            }
        }
        requestAnimationFrame(tick);
    }

    // Update displayed count
    function showCount(value, isLive) {
        animateCountTo(valueEl, value);

        if (liveEl) {
            liveEl.textContent = isLive
                ? `Total visitors: ${value.toLocaleString()}`
                : `Total visitors: ${value.toLocaleString()} (offline estimate)`;
        }
    }

    // Local fallback if API is unavailable
    function getLocalFallbackCount() {
        const alreadyCounted =
            sessionStorage.getItem(SESSION_FLAG) === "true";
        let value = parseInt(
            localStorage.getItem(LOCAL_FALLBACK_KEY),
            10
        );
        if (Number.isNaN(value)) {
            value = 0;
        }
        if (!alreadyCounted) {
            value += 1;
            localStorage.setItem(
                LOCAL_FALLBACK_KEY,
                String(value)
            );
            sessionStorage.setItem(
                SESSION_FLAG,
                "true"
            );
        }
        return value + OFFSET;
    }

    // Count visitor
    const alreadyCounted =
        sessionStorage.getItem(SESSION_FLAG) === "true";
    const action = alreadyCounted ? "get" : "hit";
    const url = `${API_BASE}/${action}/${KEY}`;

//=========================================================
// This will stop the Count visitor temerary,
// to resume it remove the below and activate the above counter visitor
    /*const isLocal =
        location.hostname === "localhost" ||
        location.hostname === "127.0.0.1";

    const alreadyCounted =
        sessionStorage.getItem(SESSION_FLAG) === "true";

    const action = isLocal
        ? "get"
        : (alreadyCounted ? "get" : "hit");

    const url = `${API_BASE}/${action}/${KEY}`;*/
//=========================================================

    fetchWithTimeout(url, FETCH_TIMEOUT_MS)
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `Counter API responded with ${response.status}`
                );
            }
            return response.json();
        })
        .then((data) => {
            const count = Number(data.value);
            if (Number.isNaN(count)) {
                throw new Error(
                    "Counter API returned an unexpected payload"
                );
            }
            if (!alreadyCounted) {
                sessionStorage.setItem(
                    SESSION_FLAG,
                    "true"
                );
            }
            showCount(count + OFFSET, true);
        })
        .catch((error) => {
            console.warn(
                "Visitor counter: falling back to local mode.",
                error
            );
            showCount(
                getLocalFallbackCount(),
                false
            );
        });
}

// ======================================================
// Loader
// ======================================================
/*let loaderTimer;
let loaderShown = false;
let loaderShownAt = null;

const LOADER_SHOW_DELAY = 300;   // wait before showing the loader at all
const LOADER_MIN_VISIBLE = 500;  // once shown, keep it visible at least this long
const LOADER_FADE_OUT = 200;     // must match #loader transition duration in CSS

document.addEventListener("DOMContentLoaded", () => {
    loaderTimer = setTimeout(() => {
        const loader = document.getElementById("loader");

        if (loader) {
            loader.style.display = "flex";
            loaderShown = true;
            loaderShownAt = performance.now();
        }
    }, LOADER_SHOW_DELAY);
});

window.addEventListener("load", () => {
    clearTimeout(loaderTimer);

    const loader = document.getElementById("loader");

    if (!loader) return;

    if (loaderShown) {
        // Make sure the loader has been visible for at least
        // LOADER_MIN_VISIBLE ms before fading it out, so it never
        // flashes on screen for a few milliseconds on fast loads.
        const visibleFor = performance.now() - loaderShownAt;
        const remaining = Math.max(0, LOADER_MIN_VISIBLE - visibleFor);

        setTimeout(() => {
            loader.classList.add("hidden");

            setTimeout(() => {
                loader.remove();
            }, LOADER_FADE_OUT);
        }, remaining);
    } else {
        loader.remove();
    }
});*/

// ======================================================
// New Loader
// ======================================================
let loaderTimer;
let loaderShown = false;
let loaderShownAt = null;
let loaderHidden = false;

const LOADER_SHOW_DELAY = 300;
const LOADER_MIN_VISIBLE = 500;
const LOADER_FADE_OUT = 200;
const LOADER_MAX_WAIT = 4000; // hard ceiling — loader never stays longer than this

document.addEventListener("DOMContentLoaded", () => {
    loaderTimer = setTimeout(() => {
        const loader = document.getElementById("loader");
        if (loader) {
            loader.style.display = "flex";
            loaderShown = true;
            loaderShownAt = performance.now();
        }
    }, LOADER_SHOW_DELAY);
});

function hideLoader() {
    if (loaderHidden) return;      // only run once
    loaderHidden = true;
    clearTimeout(loaderTimer);

    const loader = document.getElementById("loader");
    if (!loader) return;

    const finish = () => {
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), LOADER_FADE_OUT);
    };

    if (loaderShown) {
        const visibleFor = performance.now() - loaderShownAt;
        const remaining = Math.max(0, LOADER_MIN_VISIBLE - visibleFor);
        setTimeout(finish, remaining);
    } else {
        loader.remove();
    }
}

// Hide as soon as the DOM/content is ready...
document.addEventListener("DOMContentLoaded", hideLoader);
// ...but never wait longer than LOADER_MAX_WAIT no matter what.
setTimeout(hideLoader, LOADER_MAX_WAIT);

document.addEventListener("click", (e) => {
  const facade = e.target.closest(".youtube-facade");
  if (!facade) return;
  const id = facade.dataset.id;
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&controls=1&modestbranding=1&playsinline=1`;
  iframe.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
  iframe.setAttribute("allowfullscreen", "");
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.background = "#000";
  facade.replaceWith(iframe);
});


// ======================================================
// Current Year
// ======================================================
function initCurrentYear() {
    const yearEl = document.getElementById("currentYear");

    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ======================================================
// Main Initializer
// ======================================================
document.addEventListener("DOMContentLoaded", () => {

    requestAnimationFrame(() => {
        document.body.classList.add("page-loaded");
    });

    // ==================================================
    // Core Utilities
    // ==================================================
    initCurrentYear();

    // ==================================================
    // Theme & Navigation
    // ==================================================
    initThemeAndNavigation();
    initMenu();
    initLanguageSwitch();
    initScrollToTop();

    // ==================================================
    // Footer & Engagement
    // ==================================================
    if (typeof initVisitorCounter === "function") {
        initVisitorCounter();
    }

    // ==================================================
    // Filters
    // ==================================================
    initPublicationsFilter();
    initActivitiesFilter();

    // ==================================================
    // Dynamic Content
    // ==================================================
    if (typeof initHighlights === "function") {
        initHighlights();
    }

    if (typeof initBiography === "function") {
        initBiography();
    }

    // ==================================================
    // Research Components
    // ==================================================
    if (typeof initPopupModal === "function") {
        initPopupModal();
    }

    if (typeof initTeamMemberFilter === "function") {
        initTeamMemberFilter();
    }

    // ==================================================
    // Visual Effects
    // ==================================================
    if (typeof initScrollReveal === "function") {
        initScrollReveal();
    }

    if (typeof initTypedText === "function") {
        initTypedText();
    }

    if (typeof initSwiperNew === "function") {
        initSwiperNew();
    }

});