const projects = [
  { img: "/assets/film-posters/1.png", title: "Documentary Film", alt: "Documentary film poster - Awwam project", arabic: "عوام" },
  { img: "/assets/film-posters/2.png", title: "Documentary Film", alt: "Documentary film poster - Harat Al-Mazloum project", arabic: "حارة المظلوم" },
  { img: "/assets/film-posters/3.png", title: "Documentary Film", alt: "Documentary film poster - Jazan project", arabic: "جازان" },
  { img: "/assets/film-posters/4.png", title: "Documentary Film", alt: "Documentary film poster - Southern Ardah project", arabic: "العرضة الجنوبية" },
  { img: "/assets/film-posters/5.png", title: "Documentary Film", alt: "Documentary film poster - Aqmar project", arabic: "أقمر" },
  { img: "/assets/film-posters/6.png", title: "Film", alt: "Film poster - Chameleon project", arabic: "CHAMELEON" },
  { img: "/assets/film-posters/7.png", title: "Documentary Film", alt: "Documentary film poster - Islamic art heritage project", arabic: "إرث الجمال في الفن الإسلامي" },
  { img: "/assets/film-posters/8.png", title: "Film", alt: "Film poster - Eyes of Beauty project", arabic: "عيون الجمال" },
  { img: "/assets/film-posters/9.png", title: "Film", alt: "Film poster - In the Depth of Things project", arabic: "IN THE DEPTH OF THINGS" },
  { img: "/assets/film-posters/10.png", title: "Documentary Film", alt: "Documentary film poster - The Law project", arabic: "THE LAW" },
  { img: "/assets/film-posters/11.png", title: "Documentary Film", alt: "Documentary film poster - Ceramics Hobby World project", arabic: "عالم الهوايات والخزف" },
  { img: "/assets/film-posters/12.png", title: "Film", alt: "Film poster - Touha project", arabic: "توحا" },
  { img: "/assets/film-posters/13.png", title: "Animation Film", alt: "Animation film poster - Mirage project", arabic: "Mirage" },
  { img: "/assets/film-posters/14.png", title: "Podcast", alt: "Podcast visual poster - Podcast project", arabic: "Podcast" },
  { img: "/assets/film-posters/15.png", title: "Film", alt: "Film poster - Umm Al-Saaf project", arabic: "أم السعف" },
  { img: "/assets/film-posters/16.png", title: "Film", alt: "Film poster - Survivor project", arabic: "SURVIVOR" },
  { img: "/assets/film-posters/17.png", title: "Documentary Film", alt: "Documentary film poster - Museum of the Future project", arabic: "متحف المستقبل" },
  { img: "/assets/film-posters/18.png", title: "Film", alt: "Film poster - Barwaz project", arabic: "برواز" },
  { img: "/assets/film-posters/19.png", title: "Film", alt: "Film poster - One Breath project", arabic: "One Breath" },
  { img: "/assets/film-posters/20.png", title: "Film", alt: "Film poster - iPad Child project", arabic: "طفل الايباد" },
  { img: "/assets/film-posters/21.png", title: "Film", alt: "Film poster - Silent Disorder project", arabic: "إضطراب صامت" },
  { img: "/assets/film-posters/22.png", title: "Film", alt: "Film poster - Story of Ambition project", arabic: "قصة طموح" }
];

const wrapper = document.getElementById("swiperWrapper");

projects.forEach((p, index) => {
  const slide = document.createElement("article");
  slide.className = "new-card card-article swiper-slide";

  const loading = index < 3 ? "eager" : "lazy";
  const fetchPriority = index === 0 ? 'fetchpriority="high"' : "";

  slide.innerHTML = `
    <div class="card-link">
      <img src="${p.img}"
           loading="${loading}"
           ${fetchPriority}
           alt="${p.alt}"
           class="card-img">

      <div class="card-shadow"></div>

      <div class="new-data card-data">
        <h3 class="card-name">${p.title}</h3>
      </div>
    </div>
  `;

  wrapper.appendChild(slide);
});

if (window.swiperNew) {
  swiperNew.update();
}