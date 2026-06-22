async function initHighlights() {
    const containers = document.querySelectorAll('[data-type]');

    if (!containers.length) return;

    const response = await fetch('/data/profile/highlights.json');
    const data = await response.json();

    containers.forEach(container => {
        const language = container.dataset.language;
        const type = container.dataset.type;

        container.innerHTML = data[language].map(item => {
            if (type === 'homepage') {
                return `
                    <div class="stat-card">
                        <i class="${item.icon}"></i>
                        <h3 class="stat-number">${item.value}</h3>
                        <p class="stat-label">${item.label}</p>
                    </div>
                `;
            }

            return `
                <div class="highlight-card">
                    <i class="${item.icon}"></i>
                    <strong>${item.value}</strong>
                    <small>${item.label}</small>
                </div>
            `;
        }).join('');
    });
}