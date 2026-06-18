async function loadResearch() {

  const lang =
    window.location.pathname.startsWith('/ar/')
      ? 'ar'
      : 'en';

  const res =
    await fetch('/data/research.json');

  const data =
    await res.json();

  const container =
    document.getElementById('researchContainer');

  data.forEach(item => {

    const reference =
      item.reference
        .map(ref => `<li>${ref}</li>`)
        .join('');

    const themes =
      item.themes[lang]
        .map(theme => `<li>${theme}</li>`)
        .join('');

    const paragraphs =
      item.paragraphs[lang]
        .map(p => `<p>${p}</p>`)
        .join('');

    const title =
      item.title[lang];

    const focus =
      item.focus[lang];

    const lens =
      item.lens[lang];

    const labels = {
      en: {
        viewDetails: 'View Details',
        overview: 'Overview:',
        focus: 'Research Focus:',
        themes: 'Key Themes:',
        lens: 'Analytical Lens:',
        references: 'References:'
      },
      ar: {
        viewDetails: 'عرض التفاصيل',
        overview: 'نبذة:',
        focus: 'محور البحث:',
        themes: 'الموضوعات الرئيسة:',
        lens: 'المنظور التحليلي:',
        references: 'المراجع:'
      }
    };

    const t = labels[lang];

    const card = `
      <li class="team_member ${item.categories.join(' ')}">

        <div class="image">

          <img src="${item.image}" alt="${title}">

          <div class="text">
            <h2>
              <i class="fa-solid ${item.icon}"></i>
              ${title}
            </h2>
          </div>

          <div class="btn2">
            <a href="#" data-tab="${item.id}">
              ${t.viewDetails}
            </a>
          </div>

        </div>

        <div class="popup_wrap" id="${item.id}">
          <div class="overlay"></div>

          <div class="popup_box">

            <div class="model_header">
              <h2>
                <i class="fa-solid ${item.icon}"></i>
                ${title}
              </h2>
              <div class="close_btn"></div>
            </div>

            <div class="model_body">

              <h3>${t.overview}</h3>
              ${paragraphs}

              <h3>${t.focus}</h3>
              <p>${focus}</p>

              <h3>${t.themes}</h3>
              <ul>
                ${themes}
              </ul>

              <h3>${t.lens}</h3>
              <p>${lens}</p>

              <h4>${t.references}</h4>
              <ul class="reference-list">
                ${reference}
              </ul>

            </div>

          </div>
        </div>

      </li>
    `;

    container.insertAdjacentHTML(
      'beforeend',
      card
    );
  });

  initPopupModal();
  initTeamMemberFilter();
}

loadResearch();