// ======================================================
// Activities Database Loader & Filter
// ======================================================

async function initActivities() {

    const filterContainer =
        document.querySelector(".activities-filter");

    if (!filterContainer) {
        return;
    }

    const lang =
        document.documentElement.lang === "ar"
            ? "ar"
            : "en";

    const labels = {

        en: {
            all: "All Activities",
            conference: "Conference",
            workshop: "Workshop",
            seminar: "Seminar",
            festival: "Festival",
            "forum-events": "Forum Events",
            noResults: "No results found."
        },

        ar: {
            all: "جميع الأنشطة",
            conference: "المؤتمرات",
            workshop: "ورش العمل",
            seminar: "الندوات",
            festival: "المهرجانات",
            "forum-events": "فعاليات المنتدى",
            noResults: "لا توجد نتائج."
        }

    };

    const currentLabels =
        labels[lang];

    const tableBody =
        document.getElementById(
            "activityTableBody"
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


        if (activityTable) {

            activityTable.dir =
                lang === "ar"
                    ? "rtl"
                    : "ltr";
        }

    try {

        const response =
            await fetch(
                "/data/activities.json"
            );

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const activities =
            await response.json();

        // Newest first
        activities.sort(
            (a, b) =>
                new Date(
                    b.dates.start
                ) -
                new Date(
                    a.dates.start
                )
        );

        renderActivities(
            activities,
            "all"
        );

        const buttons =
            document.querySelectorAll(
                ".activities-filter button"
            );

        buttons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(btn =>
                        btn.classList.remove(
                            "active"
                        )
                    );

                    button.classList.add(
                        "active"
                    );

                    renderActivities(
                        activities,
                        button.dataset.filter
                    );

                }
            );

        });

        // =============================================
        // Render Activities
        // =============================================

        function renderActivities(
            activitiesData,
            filter
        ) {

            const filteredActivities =
                filter === "all"
                    ? activitiesData
                    : activitiesData.filter(
                        activity =>
                            normalizeType(
                                activity.type
                            ) === filter
                    );

            tableBody.innerHTML = "";

            filteredActivities.forEach(
                activity => {

                    const row =
                        document.createElement(
                            "tr"
                        );

                    row.dataset.type =
                        normalizeType(
                            activity.type
                        );

                    const yearDate =
                        new Date(activity.dates.start);

                    const year =
                        lang === "ar"
                            ? new Intl.NumberFormat(
                                "ar-SA",
                                {
                                    useGrouping: false
                                }
                            ).format(
                                yearDate.getFullYear()
                            )
                            : yearDate.getFullYear();

                    row.innerHTML = `
                        <td>${year}</td>
                        <td>
                            ${buildDescription(
                                activity,
                                lang
                            )}
                        </td>
                    `;

                    tableBody.appendChild(
                        row
                    );

                }
            );

            updateHeading(
                filter,
                filteredActivities.length
            );

            activityTable.style.display =
                filteredActivities.length
                    ? "table"
                    : "none";

            noResults.style.display =
                filteredActivities.length
                    ? "none"
                    : "block";

        }

        // =============================================
        // Update Heading
        // =============================================

        function updateHeading(
            filter,
            count
        ) {

            const locale =
                lang === "ar"
                    ? "ar-SA"
                    : "en-US";

            const formattedCount =
                new Intl.NumberFormat(
                    locale
                ).format(count);

            heading.textContent =
                `${currentLabels[filter]} (${formattedCount})`;

        }

    } catch (error) {

        console.error(
            "Activities loading error:",
            error
        );

        if (activityTable) {
            activityTable.style.display =
                "none";
        }

        if (noResults) {
            noResults.textContent =
                currentLabels.noResults;

            noResults.style.display =
                "block";
        }

    }

}

// ======================================================
// Build Activity Description
// ======================================================

function buildDescription(
    activity,
    lang
) {

    const description =
        activity.description?.[lang] || "";

    const title =
        activity.title?.[lang] || "";

    const host =
        activity.host?.name?.[lang] || "";

    const institution =
        activity.host?.institution?.[lang] || "";

    const city =
        activity.city?.[lang] || "";

    const date =
        formatActivityDate(
            activity.dates,
            lang
        );

    const parts = [

        description
            ? `${description} <strong>${
                lang === "ar"
                    ? `"${title}"`
                    : `"${title}"`
              }</strong>`
            : "",

        host,
        institution,
        city,
        date

    ].filter(Boolean);

    if (lang === "ar") {

        return parts.join("، ") + ".";

    }

    return parts.join(", ") + ".";

}

// ======================================================
// Date Formatter
// ======================================================

function formatActivityDate(
    dates,
    lang = "en"
) {

    const start =
        new Date(dates.start);

    const end =
        new Date(dates.end);

    const locale =
        lang === "ar"
            ? "ar-SA"
            : "en-GB";

    const formatter =
        new Intl.NumberFormat(
            locale,
            {
                useGrouping: false
            }
        );

    // Same day
    if (
        start.getDate() === end.getDate() &&
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear()
    ) {

        return start.toLocaleDateString(
            locale,
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    }

    // Same month & year
    if (
        start.getMonth() === end.getMonth() &&
        start.getFullYear() === end.getFullYear()
    ) {

        const startDay =
            formatter.format(
                start.getDate()
            );

        const endDay =
            formatter.format(
                end.getDate()
            );

        const monthName =
            start.toLocaleDateString(
                locale,
                {
                    month: "long"
                }
            );

        const year =
            formatter.format(
                start.getFullYear()
            );

        return `${startDay} - ${endDay} ${monthName} ${year}`;

    }

    // Different month/year
    return `${start.toLocaleDateString(
        locale,
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    )} - ${end.toLocaleDateString(
        locale,
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    )}`;

}

// ======================================================
// Normalize Type
// ======================================================

function normalizeType(
    type = ""
) {

    return type
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

}

// ======================================================
// Initialize
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    initActivities
);