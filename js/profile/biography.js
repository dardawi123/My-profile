async function initBiography() {
    const container = document.getElementById("biographyContent");

    if (!container) {
        console.log("Biography skipped");
        return;
    }

    try {
        const response = await fetch("/data/profile/biography.json");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const lang =
            document.documentElement.lang === "ar"
                ? "ar"
                : "en";

        let html = "";

        // Biography
        html += renderBiography(data.biography, lang);

        // Work Experience
        html += renderYearListSection(data.workExperience, lang);

        // Professional Associations
        html += renderYearListSection(data.associations, lang);

        // Key Initiatives
        html += renderYearListSection(data.initiatives, lang);

        // Research Interests
        html += renderTextSection(data.researchInterests, lang);

        // Research Degree Supervision
        html += renderSimpleListSection(data.supervision, lang);

        // Reviews
        html += renderReviewsTable(data.reviews, lang);

        container.innerHTML = html;

    } catch (error) {
        console.error("Error loading biography:", error);
    }
}

/* ----------------------------------------
   Biography
---------------------------------------- */

function renderBiography(section, lang) {
    return `
        <div class="container2">
            <h2>${section.title[lang]}</h2>

            ${section.paragraphs[lang]
                .map(paragraph => `<p>${paragraph}</p>`)
                .join("")}
        </div>
    `;
}

/* ----------------------------------------
   Research Interests
---------------------------------------- */

function renderTextSection(section, lang) {
    return `
        <div class="container3">
            <h3 class="title">${section.title[lang]}</h3>
            <p>${section.content[lang]}</p>
        </div>
    `;
}

/* ----------------------------------------
   Work Experience / Associations /
   Initiatives
---------------------------------------- */

function renderYearListSection(section, lang) {
    return `
        <div class="container3">
            <h3 class="title">${section.title[lang]}</h3>

            <ul>
                ${section.items.map(item => `
                    <li>
                        <span class="year">
                            ${item.year[lang]}:
                        </span>
                        ${item.description[lang]}
                    </li>
                `).join("")}
            </ul>
        </div>
    `;
}

/* ----------------------------------------
   Supervision
---------------------------------------- */

function renderSimpleListSection(section, lang) {
    return `
        <div class="container3">
            <h3 class="title">${section.title[lang]}</h3>

            <ul>
                ${section.items.map(item => `
                    <li>${item[lang]}</li>
                `).join("")}
            </ul>
        </div>
    `;
}

/* ----------------------------------------
   Reviews Table
---------------------------------------- */

function renderReviewsTable(section, lang) {
    return `
        <div class="container3">
            <h3 class="title">${section.title[lang]}</h3>

            <table dir="ltr">
                <thead>
                    <tr>
                        <th>${section.headers.journal[lang]}</th>
                        <th>${section.headers.role[lang]}</th>
                    </tr>
                </thead>

                <tbody>
                    ${section.items.map(item => `
                        <tr>
                            <td>
                                ${item.journal}
                                <a
                                    href="${item.url}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    [Link]
                                </a>
                            </td>

                            <td>${item.role[lang]}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

/* ----------------------------------------
   Init
---------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    initBiography
);