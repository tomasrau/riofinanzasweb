function initLearningMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.style.display =
        mobileMenu.style.display === "grid" ? "none" : "grid";
    });
  }

  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenu) mobileMenu.style.display = "none";
    });
  });
}

function initLearningFaq() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      faqItems.forEach((el) => el.classList.remove("active"));
      if (!isActive) item.classList.add("active");
    });
  });
}

function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", () => {
  initLearningMobileMenu();
  initLearningFaq();
  initRevealAnimations();
});
