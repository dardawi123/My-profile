
// Card and Model Generator

async function loadResearch() {

  const res =
    await fetch('/data/research-ar.json');

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

              <h3>نبذة:</h3>
              <p>${item.paragraph}</p>

              <h4>المراجع:</h4>
              <ul class="reference-list">
                ${reference}
              </ul>

              <h3>محور البحث:</h3>
              <p>${item.focus}</p>

              <h3>الموضوعات الرئيسية:</h3>
                <ul>
                ${themes}
                </ul>

              <h3>الإطار التحليلي:</h3>
              <p>${item.lens}</p>

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

  initializePopups();
}

loadResearch();
