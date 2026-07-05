// ======================================================
// Publications Database Loader & Filter
// ======================================================

async function initPublications() {

    const filterContainer =
        document.querySelector(".publication-filter");

    if (!filterContainer) {
        return;
    }

    const lang =
        document.documentElement.lang === "ar"
            ? "ar"
            : "en";

    const labels = {

        en: {
            all: "All Publications",
            "journal-article": "Journal Articles",
            "conference-proceeding": "Conference Proceedings",
            "online-publication": "Online Publications",
            "book-chapter": "Book Chapters",
            book: "Books",
            "phd-thesis": "PhD Theses",
            noResults: "No results found."
        },

        ar: {
            all: "جميع المنشورات",
            "journal-article": "المقالات العلمية",
            "conference-proceeding": "وقائع المؤتمرات",
            "online-publication": "المجلات الإلكترونية",
            "book-chapter": "فصول الكتب",
            book: "الكتب",
            "phd-thesis": "رسائل الدكتوراه",
            noResults: "لا توجد نتائج."
        }

    };

    const currentLabels =
        labels[lang];

    const tableBody =
        document.getElementById(
            "publicationTableBody"
        );

    const heading =
        document.getElementById(
            "publication-heading"
        );

    const noResults =
        document.getElementById(
            "publication-no-results"
        );

    const publicationTable =
        document.querySelector(
            ".publication-table"
        );

    try {

        const response =
            await fetch(
                "/data/profile/publication.json"
            );

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const publications =
            await response.json();

        // ==================================================
        // Sort by Year DESC then ID ASC
        // ==================================================

        publications.sort(
            (a, b) => {

                if (
                    b.year !== a.year
                ) {
                    return (
                        b.year - a.year
                    );
                }

                return a.id.localeCompare(
                    b.id
                );

            }
        );

        renderPublications(
            publications,
            "all"
        );

        const buttons =
            document.querySelectorAll(
                ".publication-filter button"
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

                    renderPublications(
                        publications,
                        button.dataset.filter
                    );

                }
            );

        });

        // ==============================================
        // Render Publications
        // ==============================================

        function renderPublications(
            publicationsData,
            filter
        ) {

            const filteredPublications =
                filter === "all"
                    ? publicationsData
                    : publicationsData.filter(
                        publication =>
                            publication.type ===
                            filter
                    );

            tableBody.innerHTML = "";

            filteredPublications.forEach(
                publication => {

                    const row =
                        document.createElement(
                            "tr"
                        );

                    row.dataset.id =
                        publication.id;

                    row.dataset.type =
                        publication.type;

                    row.innerHTML = `

                        <td>${publication.year}</td>

                        <td>
                            ${formatCitation(
                                publication
                            )}

                            ${
                                publication.link
                                    ? `
                                    <a
                                        href="${publication.link}"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        [Link]
                                    </a>
                                    `
                                    : ""
                            }
                        </td>
                    `;

                    tableBody.appendChild(
                        row
                    );

                }
            );

            updateHeading(
                filter,
                filteredPublications.length
            );

            publicationTable.style.display =
                filteredPublications.length
                    ? "table"
                    : "none";

            noResults.style.display =
                filteredPublications.length
                    ? "none"
                    : "block";

        }

        // ==============================================
        // Update Heading
        // ==============================================

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
            "Publications loading error:",
            error
        );

        if (publicationTable) {

            publicationTable.style.display =
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
// Harvard Citation Formatter
// ======================================================

function formatCitation(pub) {

    switch (pub.type) {

        // ==================================================
        // Journal Article
        // ==================================================

        case "journal-article": {

            let citation = "";

            citation +=
                `${pub.authors} (${pub.year}) `;

            citation +=
                `‘${pub.title}’, `;

            citation +=
                `<em>${pub.journal}</em>`;

            const hasVolume =
                pub.volume &&
                pub.volume !== "0";

            const hasIssue =
                pub.issue &&
                pub.issue !== "0";

            if (hasVolume) {
                citation +=
                    `, ${pub.volume}`;
            }

            if (hasIssue) {
                citation +=
                    `(${pub.issue})`;
            }

            if (pub.pages) {
                citation +=
                    `, pp. ${pub.pages}`;
            }

            return citation + ".";

        }

        // ==================================================
        // Conference Proceeding
        // ==================================================

        case "conference-proceeding": {

            let citation = "";

            citation +=
                `${pub.authors} (${pub.year}) `;

            citation +=
                `‘${pub.title}’, `;

            if (pub.proceedings) {
                citation +=
                    `<em>${pub.proceedings}</em>. `;
            }

            if (pub.institution) {
                citation +=
                    `${pub.institution}, `;
            }

            if (pub.conference_location) {
                citation +=
                    `${pub.conference_location}, `;
            }

            if (pub.conference_dates) {
                citation +=
                    `${pub.conference_dates}. `;
            }

            if (pub.publisher_location) {
                citation +=
                    `${pub.publisher_location}: `;
            }

            if (pub.publisher) {
                citation +=
                    pub.publisher;
            }

            if (pub.pages) {
                citation +=
                    `, pp. ${pub.pages}`;
            }

            return citation + ".";

        }

        // ==================================================
        // Book
        // ==================================================

        case "book": {

            let citation = "";

            citation +=
                `${pub.authors} (${pub.year}) `;

            citation +=
                `<em>${pub.title}</em>. `;

            if (pub.publisher) {
                citation +=
                    pub.publisher;
            }

            return citation + ".";

        }

        // ==================================================
        // Book Chapter
        // ==================================================

        case "book-chapter": {

            let citation = "";

            citation +=
                `${pub.authors} (${pub.year}) `;

            citation +=
                `‘${pub.title}’. `;

            citation +=
                `In: `;

            if (pub.editors) {
                citation +=
                    `${pub.editors} (eds.) `;
            }

            if (pub.book) {
                citation +=
                    `<em>${pub.book}</em>. `;
            }

            if (pub.publisher) {
                citation +=
                    pub.publisher;
            }

            if (pub.pages) {
                citation +=
                    `, pp. ${pub.pages}`;
            }

            return citation + ".";

        }

        // ==================================================
        // Online Publication
        // ==================================================

        case "online-publication": {

            let citation = "";

            citation +=
                `${pub.authors} (${pub.year}) `;

            citation +=
                `‘${pub.title}’. `;

            if (pub.website) {
                citation +=
                    `<em>${pub.website}</em>`;
            }

            if (pub.date) {
                citation +=
                    `, ${pub.date}`;
            }

            return citation + ".";

        }

        // ==================================================
        // PhD Thesis
        // ==================================================

        case "phd-thesis": {

            let citation = "";

            citation +=
                `${pub.authors} (${pub.year}) `;

            citation +=
                `<em>${pub.title}</em>. `;

            citation +=
                `${pub.status}. `;

            if (pub.university) {
                citation +=
                    pub.university;
            }

            return citation + ".";

        }

        // ==================================================
        // Fallback
        // ==================================================

        default:

            return `
                ${pub.authors || ""}
                (${pub.year || ""})
                ${pub.title || ""}
            `;

    }

}

// ======================================================
// Initialize
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    initPublications
);

