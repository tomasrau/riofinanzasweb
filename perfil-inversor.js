const totalQuestions = 10;

const profiles = {
  conservador: {
    badge: "Perfil Conservador",
    title: "Tu perfil es conservador",
    summary:
      "Priorizás la preservación del capital, la estabilidad y la baja exposición a la volatilidad. Tu enfoque suele estar más orientado a proteger el patrimonio que a maximizar retorno.",
    approach:
      "Buscás previsibilidad, liquidez y menor variación en los resultados de corto plazo.",
    risk:
      "Baja. Preferís minimizar movimientos bruscos y evitar pérdidas temporales relevantes.",
    horizon:
      "Corto a mediano plazo, con foco en resguardo y orden financiero.",
    nextStep:
      "Una conversación personalizada puede ayudarte a definir alternativas alineadas con preservación de capital y objetivos concretos."
  },
  moderado: {
    badge: "Perfil Moderado",
    title: "Tu perfil es moderado",
    summary:
      "Valorás el equilibrio entre estabilidad y rendimiento. Estás dispuesto a asumir cierto nivel de volatilidad, siempre dentro de una estrategia razonable y controlada.",
    approach:
      "Buscás combinar orden patrimonial, liquidez y crecimiento gradual.",
    risk:
      "Baja a media. Aceptás oscilaciones acotadas si el objetivo y la estrategia están bien definidos.",
    horizon:
      "Mediano plazo, con foco en balance entre resguardo y crecimiento.",
    nextStep:
      "Una consulta puede ayudarte a estructurar una estrategia diversificada coherente con tu perfil y tu horizonte."
  },
  equilibrado: {
    badge: "Perfil Equilibrado",
    title: "Tu perfil es equilibrado",
    summary:
      "Tenés disposición a asumir riesgo de manera racional para buscar mejores resultados en el tiempo, manteniendo criterio y seguimiento.",
    approach:
      "Buscás crecimiento de capital con una asignación más dinámica, sin perder de vista la gestión del riesgo.",
    risk:
      "Media. Tolerás volatilidad moderada si la estrategia tiene fundamentos.",
    horizon:
      "Mediano a largo plazo, con foco en crecimiento sostenido.",
    nextStep:
      "Una evaluación profesional puede ayudarte a definir una estrategia más precisa según objetivos, plazos y exposición deseada."
  },
  agresivo: {
    badge: "Perfil Agresivo",
    title: "Tu perfil es agresivo",
    summary:
      "Tenés mayor tolerancia al riesgo y una mirada orientada al crecimiento del capital, incluso aceptando volatilidad significativa en el corto plazo.",
    approach:
      "Priorizás retorno potencial y aceptás escenarios más variables si el horizonte y la oportunidad lo justifican.",
    risk:
      "Alta. Podés tolerar fluctuaciones importantes dentro de una estrategia con seguimiento.",
    horizon:
      "Largo plazo, con mayor foco en apreciación de capital.",
    nextStep:
      "Una conversación personalizada puede ayudarte a ordenar ese perfil de riesgo dentro de una estrategia seria y bien estructurada."
  }
};

function initMobileMenu() {
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

function updateSelectedStyles() {
  document.querySelectorAll(".question-card").forEach((card) => {
    const options = card.querySelectorAll(".option-card");
    options.forEach((option) => option.classList.remove("is-selected"));

    const checked = card.querySelector('input[type="radio"]:checked');
    if (checked) {
      checked.closest(".option-card")?.classList.add("is-selected");
      card.classList.remove("is-invalid");
    }
  });
}

function updateProgress() {
  const checkedCount = document.querySelectorAll(
    '#investorTestForm input[type="radio"]:checked'
  ).length;

  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");

  if (progressText) progressText.textContent = `${checkedCount}/${totalQuestions}`;
  if (progressFill) progressFill.style.width = `${(checkedCount / totalQuestions) * 100}%`;
}

function getTestScore() {
  let total = 0;

  for (let i = 1; i <= totalQuestions; i += 1) {
    const checked = document.querySelector(`input[name="q${i}"]:checked`);
    if (!checked) return null;
    total += Number(checked.value);
  }

  return total;
}

function getProfileByScore(score) {
  if (score <= 16) return profiles.conservador;
  if (score <= 24) return profiles.moderado;
  if (score <= 32) return profiles.equilibrado;
  return profiles.agresivo;
}

function validateTest() {
  let valid = true;

  for (let i = 1; i <= totalQuestions; i += 1) {
    const checked = document.querySelector(`input[name="q${i}"]:checked`);
    const card = document.querySelector(`input[name="q${i}"]`)?.closest(".question-card");

    if (!checked) {
      valid = false;
      card?.classList.add("is-invalid");
    } else {
      card?.classList.remove("is-invalid");
    }
  }

  return valid;
}

function openLeadModal() {
  const modal = document.getElementById("leadModal");
  if (modal) {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeLeadModal() {
  const modal = document.getElementById("leadModal");
  if (modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

function renderResult(profile) {
  document.getElementById("resultBadge").textContent = profile.badge;
  document.getElementById("resultTitle").textContent = profile.title;
  document.getElementById("resultSummary").textContent = profile.summary;
  document.getElementById("resultApproach").textContent = profile.approach;
  document.getElementById("resultRisk").textContent = profile.risk;
  document.getElementById("resultHorizon").textContent = profile.horizon;
  document.getElementById("resultNextStep").textContent = profile.nextStep;

  const resultSection = document.getElementById("resultado");
  if (resultSection) {
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function initInvestorTest() {
  const testForm = document.getElementById("investorTestForm");
  const openLeadModalBtn = document.getElementById("openLeadModal");
  const closeLeadModalBtn = document.getElementById("closeLeadModal");
  const leadModalBackdrop = document.getElementById("leadModalBackdrop");
  const leadForm = document.getElementById("leadForm");
  const retakeTest = document.getElementById("retakeTest");

  if (!testForm) return;

  testForm.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", () => {
      updateSelectedStyles();
      updateProgress();
    });
  });

  if (openLeadModalBtn) {
    openLeadModalBtn.addEventListener("click", () => {
      const isValid = validateTest();
      updateSelectedStyles();
      updateProgress();

      if (!isValid) {
        const firstInvalid = document.querySelector(".question-card.is-invalid");
        firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }

      openLeadModal();
    });
  }

  if (closeLeadModalBtn) {
    closeLeadModalBtn.addEventListener("click", closeLeadModal);
  }

  if (leadModalBackdrop) {
    leadModalBackdrop.addEventListener("click", closeLeadModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLeadModal();
    }
  });

  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const score = getTestScore();
      if (score === null) return;

      const profile = getProfileByScore(score);

      // Acá más adelante podés conectar con Sheets / Apps Script / email / CRM
      const leadData = {
        name: document.getElementById("leadName")?.value.trim() || "",
        email: document.getElementById("leadEmail")?.value.trim() || "",
        whatsapp: document.getElementById("leadWhatsapp")?.value.trim() || "",
        score,
        profile: profile.badge
      };

      console.log("Lead capturado:", leadData);

      closeLeadModal();
      renderResult(profile);
    });
  }

  if (retakeTest) {
    retakeTest.addEventListener("click", (e) => {
      e.preventDefault();

      testForm.reset();
      updateSelectedStyles();
      updateProgress();

      const resultSection = document.getElementById("resultado");
      if (resultSection) resultSection.hidden = true;

      document.getElementById("test")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  updateSelectedStyles();
  updateProgress();
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initRevealAnimations();
  initInvestorTest();
});
