async function initTraining() {
    const container = document.getElementById("trainingList");

    if (!container) return;

    try {
        const response = await fetch("/data/profile/training.json");
        const data = await response.json();

        const lang = document.documentElement.lang === "ar" ? "ar" : "en";

        document.getElementById("trainingTitle").textContent =
            data.title[lang];

            const count = document.getElementById("trainingCount");

            if (count) {
                
                
                
                count.textContent = document.documentElement.lang === "ar"
                    ? `${data.items.length.toLocaleString("ar-SA")}+`
                    : `${data.items.length}+`;
                
                /*count.textContent = data.items.length;*/
            }
    
        container.innerHTML = data.items
            .map(item => `<li>${item[lang]}</li>`)
            .join("");

    } catch (error) {
        console.error("Error loading training data:", error);
    }
}

document.addEventListener("DOMContentLoaded", initTraining);