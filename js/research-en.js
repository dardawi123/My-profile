
// Card and Model Generator

async function loadResearch() {

  const res =
    await fetch('data/research-en.json');

  const data =
    await res.json();

  const container =
    document.getElementById('researchContainer');

  data.forEach(item => {

    const reference = item.reference
      .map(t => `<li>${t}</li>`)
      .join('');

    const themes = item.themes
      .map(t => `<li>${t}</li>`)
      .join('');

    const card = `
      <li class="team_member ${item.categories.join(' ')}">

        <div class="image">

          <img src="${item.image}" alt="${item.title}">

          <div class="text">
            <h2>
              <i class="fa-solid ${item.icon}"></i>
              ${item.title}
            </h2>
          </div>

          <div class="btn2">
            <a href="#" data-tab="${item.id}">
              View details
            </a>
          </div>

        </div>

        <div class="popup_wrap" id="${item.id}">
          <div class="overlay"></div>

          <div class="popup_box">

            <div class="model_header">
              <h2>
                <i class="fa-solid ${item.icon}"></i>
                ${item.title}
              </h2>
              <div class="close_btn"></div>
            </div>

            <div class="model_body">

              <h3>Overview:</h3>
              ${(item.paragraphs || []).map(p => `<p>${p}</p>`).join('')}

              <h3>Research Focus:</h3>
              <p>${item.focus}</p>

              <h3>Key Themes:</h3>
                <ul>
                ${themes}
                </ul>

              <h3>Analytical Lens:</h3>
              <p>${item.lens}</p>

              <h4>References:</h4>
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
