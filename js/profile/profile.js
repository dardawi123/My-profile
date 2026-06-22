// ======================================================
// Profile Loader
// ======================================================

async function initProfile() {
    try {

        // Load profile data
        const response = await fetch("/data/profile/profile.json");

        if (!response.ok) {
            throw new Error(`Failed to load profile.json (${response.status})`);
        }

        const data = await response.json();

        // Detect language
        let language = "en";

        const profileCard = document.querySelector(".profile-card");

        if (profileCard && profileCard.dataset.language) {
            language = profileCard.dataset.language;
        }

        const profile = data[language];

        if (!profile) {
            console.warn(`Profile data not found for language: ${language}`);
            return;
        }

        // ==================================================
        // Profile Image (Homepage + Subpages)
        // ==================================================

        document
            .querySelectorAll(".profile-image")
            .forEach(img => {
                img.src = data.image;
                img.alt = profile.name;
            });

        // ==================================================
        // Profile Text (Subpages Only)
        // ==================================================

        const name = document.getElementById("profile-name");
        if (name) name.textContent = profile.name;

        const position = document.getElementById("profile-position");
        if (position) position.textContent = profile.position;

        const department = document.getElementById("profile-department");
        if (department) department.textContent = profile.department;

        const faculty = document.getElementById("profile-faculty");
        if (faculty) faculty.textContent = profile.faculty;

        const university = document.getElementById("profile-university");
        if (university) university.textContent = profile.university;

        // ==================================================
        // Email Button
        // ==================================================

        const emailBtn = document.getElementById("profile-email");

        if (emailBtn) {
            emailBtn.href = `mailto:${profile.email}`;
            emailBtn.textContent = profile.emailButton;
        }

        // ==================================================
        // CV Button
        // ==================================================

        const cvBtn = document.getElementById("profile-cv");

        if (cvBtn) {
            cvBtn.href = "javascript:void(0)";
            cvBtn.textContent = profile.cvButton;

            if (typeof openPDF === "function") {
                cvBtn.onclick = openPDF;
            }
        }

    } catch (error) {
        console.error("Failed to load profile:", error);
    }
}