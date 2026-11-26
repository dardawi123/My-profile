const projects = [
  { img: "/assets/film-posters/1.webp", title: "Documentary Film", alt: "Documentary film poster - Awwam project", arabic: "عوام" },
  { img: "/assets/film-posters/2.webp", title: "Documentary Film", alt: "Documentary film poster - Harat Al-Mazloum project", arabic: "حارة المظلوم" },
  { img: "/assets/film-posters/3.webp", title: "Documentary Film", alt: "Documentary film poster - Jazan project", arabic: "جازان" },
  { img: "/assets/film-posters/4.webp", title: "Documentary Film", alt: "Documentary film poster - Southern Ardah project", arabic: "العرضة الجنوبية" },
  { img: "/assets/film-posters/5.webp", title: "Documentary Film", alt: "Documentary film poster - Aqmar project", arabic: "أقمر" },
  { img: "/assets/film-posters/6.webp", title: "Film", alt: "Film poster - Chameleon project", arabic: "CHAMELEON" },
  { img: "/assets/film-posters/7.webp", title: "Documentary Film", alt: "Documentary film poster - Islamic art heritage project", arabic: "إرث الجمال في الفن الإسلامي" },
  { img: "/assets/film-posters/8.webp", title: "Film", alt: "Film poster - Eyes of Beauty project", arabic: "عيون الجمال" },
  { img: "/assets/film-posters/9.webp", title: "Film", alt: "Film poster - In the Depth of Things project", arabic: "IN THE DEPTH OF THINGS" },
  { img: "/assets/film-posters/10.webp", title: "Documentary Film", alt: "Documentary film poster - The Law project", arabic: "THE LAW" },
  { img: "/assets/film-posters/11.webp", title: "Documentary Film", alt: "Documentary film poster - Ceramics Hobby World project", arabic: "عالم الهوايات والخزف" },
  { img: "/assets/film-posters/12.webp", title: "Film", alt: "Film poster - Touha project", arabic: "توحا" },
  { img: "/assets/film-posters/13.webp", title: "Animation Film", alt: "Animation film poster - Mirage project", arabic: "Mirage" },
  { img: "/assets/film-posters/14.webp", title: "Podcast", alt: "Podcast visual poster - Podcast project", arabic: "Podcast" },
  { img: "/assets/film-posters/15.webp", title: "Film", alt: "Film poster - Umm Al-Saaf project", arabic: "أم السعف" },
  { img: "/assets/film-posters/16.webp", title: "Film", alt: "Film poster - Survivor project", arabic: "SURVIVOR" },
  { img: "/assets/film-posters/17.webp", title: "Documentary Film", alt: "Documentary film poster - Museum of the Future project", arabic: "متحف المستقبل" },
  { img: "/assets/film-posters/18.webp", title: "Film", alt: "Film poster - Barwaz project", arabic: "برواز" },
  { img: "/assets/film-posters/19.webp", title: "Film", alt: "Film poster - One Breath project", arabic: "One Breath" },
  { img: "/assets/film-posters/20.webp", title: "Film", alt: "Film poster - iPad Child project", arabic: "طفل الآيباد" },
  { img: "/assets/film-posters/21.webp", title: "Film", alt: "Film poster - Silent Disorder project", arabic: "اضطراب صامت" },
  { img: "/assets/film-posters/22.webp", title: "Film", alt: "Film poster - Story of Ambition project", arabic: "قصة طموح" }
];

/* Arabic captions for each type of work (used on the Arabic homepage only) */
const typeAr = {
  "Documentary Film": "فيلم وثائقي",
  "Film": "فيلم روائي",
  "Animation Film": "فيلم رسوم متحركة",
  "Podcast": "بودكاست"
};

/* The page language decides which caption and alt text to show */
const isArabic = document.documentElement.lang === "ar";

const wrapper = document.getElementById("swiperWrapper");

projects.forEach((p) => {
  const slide = document.createElement("div");
  slide.className = "new-card card-article swiper-slide";

  const caption = isArabic ? (typeAr[p.title] || p.title) : p.title;
  const altText = isArabic
    ? `ملصق ${typeAr[p.title] || p.title} – ${p.arabic}`
    : p.alt;

  slide.innerHTML = `
    <div class="card-link">
      <img src="${p.img}"
           width="600" height="848"
           loading="lazy"
           alt="${altText}"
           class="card-img">
           
      <div class="card-shadow"></div>

      <div class="new-data card-data">
        <h3 class="card-name">${caption}</h3>
      </div>
    </div>
  `;

  wrapper.appendChild(slide);
});
