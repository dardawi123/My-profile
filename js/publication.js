let publications = [];

fetch("/data/publication.json")
  .then(res => {
    if (!res.ok) throw new Error("Failed to load JSON");
    return res.json();
  })
  .then(data => {
    publications = data;

    render(publications);
    initPublicationsFilter();
  })
  .catch(err => console.error(err));


// ======================================================
// RENDER FUNCTION (UPDATED FOR NEW JSON STRUCTURE)
// ======================================================
function render(data) {
  const tbody = document.getElementById("publicationTableBody");

  tbody.innerHTML = data.map(pub => `
    <tr data-type="${pub.type}">

      <td>${pub.year}</td>

      <td>
        ${formatCitation(pub)}
        ${pub.link ? `<a href="${pub.link}" target="_blank" rel="noopener noreferrer">[Link]</a>` : ""}
      </td>

    </tr>
  `).join("");
}


// ======================================================
// FORMAT CITATION (NEW STRUCTURE SUPPORTED)
// ======================================================
function formatCitation(pub) {

  switch (pub.type) {

    // ======================================================
    // JOURNAL ARTICLE
    // ======================================================
    case "journal-article": {
      let citation = "";

      if (pub.authors) citation += `${pub.authors} (${pub.year}) `;
      citation += `‘${pub.title}’, `;
      citation += `<em>${pub.journal}</em>`;

      if (pub.volume) citation += `, ${pub.volume}`;
      if (pub.issue) citation += `(${pub.issue})`;
      if (pub.pages) citation += `, ${pub.pages}.`;

      return citation;
    }

    // ======================================================
    // CONFERENCE PROCEDING
    // ======================================================
    case "conference-proceeding": {

        let citation = "";

        if (pub.authors)
            citation += `${pub.authors} (${pub.year}) `;

        citation += `‘${pub.title}’, `;

        if (pub.proceedings)
            citation += `<em>${pub.proceedings}</em>. `;

        if (pub.institution)
            citation += `${pub.institution}, `;

        if (pub.conference_location)
            citation += `${pub.conference_location}, `;

        if (pub.conference_dates)
            citation += `${pub.conference_dates}. `;

        if (pub.publisher_location)
            citation += `${pub.publisher_location}: `;

        if (pub.publisher)
            citation += `${pub.publisher}`;

        if (pub.pages)
            citation += `, pp. ${pub.pages}`;

        return citation + ".";
    }
    // ======================================================
    // BOOK
    // ======================================================
    case "book": {
      let citation = "";

      if (pub.authors) citation += `${pub.authors} (${pub.year}) `;
      citation += `<em>${pub.title}</em>. `;

      if (pub.publisher) citation += `${pub.publisher}.`;

      return citation;
    }

    // ======================================================
    // BOOK CHAPTER
    // ======================================================
    case "book-chapter": {
      let citation = "";

      if (pub.authors) citation += `${pub.authors} (${pub.year}) `;
      citation += `‘${pub.title}’. In: `;

      if (pub.editors) citation += `${pub.editors} (eds.) `;

      if (pub.book) citation += `<em>${pub.book}</em>. `;

      if (pub.publisher) citation += `${pub.publisher}`;

      if (pub.pages) citation += `, pp. ${pub.pages}.`;

      return citation;
    }

    // ======================================================
    // ONLINE PUBLICATION
    // ======================================================
    case "online-publication": {
      let c = "";

      if (pub.authors) c += `${pub.authors} (${pub.year}) `;
      c += `‘${pub.title}’. `;

      if (pub.website) c += `<em>${pub.website}</em>, `;

      if (pub.date) c +=  `${pub.date}. `;

      if (pub.url) c += `Available at: ${pub.url}.`;

      return c + "";
    }

    // ======================================================
    // PHD THESIS
    // ======================================================
    case "phd-thesis": {

        let citation = "";

        if (pub.author)
            citation += `${pub.author} (${pub.year}) `;

        citation += `<em>${pub.title}</em>. `;

        citation += `${pub.status || "PhD"} thesis. `;

        if (pub.university)
            citation += `${pub.university}`;

        return citation + ".";
    }

    // ======================================================
    // DEFAULT (fallback)
    // ======================================================
    default: {
      return `${pub.authors || ""} (${pub.year}). ${pub.title || ""}.`;
    }
  }
}