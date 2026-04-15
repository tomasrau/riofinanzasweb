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

function initLearningOfferSignals() {
  const eventDate = new Date("2026-05-21T19:00:00-03:00").getTime();
  const availableSeats = 18; // Ajustar manualmente con disponibilidad real

  document.querySelectorAll("[data-seats-count]").forEach((el) => {
    el.textContent = availableSeats;
  });

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (distance > 0) {
      days = Math.floor(distance / (1000 * 60 * 60 * 24));
      hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      minutes = Math.floor((distance / (1000 * 60)) % 60);
      seconds = Math.floor((distance / 1000) % 60);
    }

    const values = {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    };

    Object.entries(values).forEach(([unit, value]) => {
      document.querySelectorAll(`[data-countdown="${unit}"]`).forEach((el) => {
        el.textContent = value;
      });
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

document.addEventListener("DOMContentLoaded", () => {
  initLearningMobileMenu();
  initLearningFaq();
  initRevealAnimations();
  initLearningOfferSignals();
});
