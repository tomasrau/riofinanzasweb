const totalQuestions = 10;

const profiles = {
  conservador: {
    badge: "Perfil Conservador",
    title: "Tu perfil es conservador",
    summary:
      "Priorizás la estabilidad, la previsibilidad y el resguardo del capital. En general, te sentís más cómodo con decisiones que apunten a cuidar el dinero antes que a buscar grandes variaciones de rendimiento.",
    approach:
      "Tu forma de decidir suele estar orientada a la tranquilidad, la liquidez y el control del riesgo.",
    risk:
      "Baja. Preferís evitar cambios bruscos en el valor de tus inversiones.",
    horizon:
      "Corto a mediano plazo, con foco en orden y preservación.",
    nextStep:
      "Una consulta puede ayudarte a identificar alternativas acordes a un perfil que prioriza resguardo, estabilidad y claridad."
  },
  moderado: {
    badge: "Perfil Moderado",
    title: "Tu perfil es moderado",
    summary:
      "Buscás equilibrio entre seguridad y crecimiento. Podés aceptar cierto movimiento en el camino, siempre que tenga sentido dentro de una estrategia razonable y bien pensada.",
    approach:
      "Valorás combinar estabilidad con oportunidades de mejora en el tiempo.",
    risk:
      "Baja a media. Tolerás cambios acotados si el objetivo está claro.",
    horizon:
      "Mediano plazo, con búsqueda de balance entre cuidado y rendimiento.",
    nextStep:
      "Una conversación puede ayudarte a ordenar una estrategia diversificada, coherente con tus tiempos y tus objetivos."
  },
  equilibrado: {
    badge: "Perfil Equilibrado",
    title: "Tu perfil es equilibrado",
    summary:
      "Tenés disposición a asumir cierto nivel de riesgo para buscar crecimiento, pero sin perder de vista la necesidad de orden y seguimiento.",
    approach:
      "Te sentís cómodo con decisiones más dinámicas si están bien fundamentadas.",
    risk:
      "Media. Podés tolerar fluctuaciones moderadas dentro de una estrategia consistente.",
    horizon:
      "Mediano a largo plazo, con mayor foco en crecimiento sostenido.",
    nextStep:
      "Una evaluación profesional puede ayudarte a transformar ese perfil en una estrategia concreta, adaptada a tu situación."
  },
  agresivo: {
    badge: "Perfil Agresivo",
    title: "Tu perfil es agresivo",
    summary:
      "Tenés mayor tolerancia a la incertidumbre y estás dispuesto a atravesar variaciones importantes si eso puede traducirse en un mayor crecimiento a futuro.",
    approach:
      "Priorizás el potencial de crecimiento y aceptás escenarios más variables.",
    risk:
      "Alta. Podés convivir con movimientos relevantes en el corto plazo.",
    horizon:
      "Largo plazo, con foco en apreciación de capital y tolerancia a la volatilidad.",
    nextStep:
      "Una consulta puede ayudarte a canalizar esa mayor tolerancia al riesgo dentro de una estrategia seria y bien estructurada."
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
    const firstInput = document.querySelector(`input[name="q${i}"]`);
    const card = firstInput ? firstInput.closest(".question-card") : null;

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
    leadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const score = getTestScore();
      if (score === null) return;
  
      const profile = getProfileByScore(score);
      const statusEl = document.getElementById("leadFormStatus");
  
      const leadData = {
        name: document.getElementById("leadName")?.value.trim() || "",
        email: document.getElementById("leadEmail")?.value.trim() || "",
        whatsapp: document.getElementById("leadWhatsapp")?.value.trim() || "",
        score,
        profile: profile.badge
      };
  
      const scriptURL = "https://script.google.com/macros/s/AKfycbwL5UTqYXXl_5zuJ3zpU11mX9rPjYfwl-evcgt9GklE6iY2CHrxjLEn7cG3QUFjYWlm/exec";
  
      if (statusEl) {
        statusEl.textContent = "Guardando tus datos...";
      }
  
      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(leadData)
        });
  
        const result = await response.json();
        console.log("Respuesta Apps Script:", result);
  
        if (statusEl) {
          statusEl.textContent = "Datos guardados correctamente.";
        }
  
        setTimeout(() => {
          closeLeadModal();
          renderResult(profile);
        }, 400);
  
      } catch (error) {
        console.error("Error al guardar lead:", error);
  
        if (statusEl) {
          statusEl.textContent = "No se pudieron guardar los datos. Podés intentar nuevamente.";
        }
      }
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
