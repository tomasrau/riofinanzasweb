const totalQuestions = 10;

let currentProfileForPdf = null;
let currentLeadForPdf = {
  name: "",
  email: "",
  whatsapp: ""
};
let currentScoreForPdf = null;

const RIO_BRAND = {
  phone: "WhatsApp: +54 9 11 6865 9656",
  email: "Email: riofinanzas2026@gmail.com",
  website: "Web: www.riofinanzas.ar",
  address: "Bella Vista, San Miguel, Buenos Aires"
};

const profiles = {
  conservador: {
    key: "conservador",
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
    key: "moderado",
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
    key: "equilibrado",
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
    key: "agresivo",
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

function waitForPdfRender(ms = 120) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, ms);
    });
  });
}

function waitForImages(container) {
  const images = Array.from(container.querySelectorAll("img"));

  if (!images.length) {
    return Promise.resolve();
  }

  return Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }

      return new Promise((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    })
  );
}

function initMobileMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.style.display === "grid";
      mobileMenu.style.display = isOpen ? "none" : "grid";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
    });
  }

  document.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenu) mobileMenu.style.display = "none";
      if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
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

  if (progressText) {
    progressText.textContent = `${checkedCount}/${totalQuestions}`;
  }

  if (progressFill) {
    progressFill.style.width = `${(checkedCount / totalQuestions) * 100}%`;
  }
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

function setTextContent(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value ?? "";
}

function getCheckedOptionTitle(questionName) {
  const checked = document.querySelector(`input[name="${questionName}"]:checked`);
  if (!checked) return "";

  return (
    checked.closest(".option-card")?.querySelector(".option-title")?.textContent?.trim() || ""
  );
}

function updateResultMeta(score, leadData) {
  setTextContent("resultScoreValue", score ?? "");
  setTextContent("resultLeadName", leadData?.name || "");
  setTextContent("resultLeadEmail", leadData?.email || "");
  setTextContent("resultLeadWhatsapp", leadData?.whatsapp || "");
  setTextContent("resultMainGoal", getCheckedOptionTitle("q1"));
}

function persistResultState(profile, score, leadData) {
  const state = {
    profileKey: profile?.key || "",
    score: score ?? null,
    leadData: leadData || {},
    mainGoal: getCheckedOptionTitle("q1"),
    selectedHorizon: getCheckedOptionTitle("q2")
  };

  localStorage.setItem("rioInvestorResult", JSON.stringify(state));
}

function clearPersistedResultState() {
  localStorage.removeItem("rioInvestorResult");
}

function renderResult(profile, score = currentScoreForPdf, leadData = currentLeadForPdf) {
  currentProfileForPdf = profile;
  currentScoreForPdf = typeof score === "number" ? score : currentScoreForPdf;
  currentLeadForPdf = {
    name: leadData?.name || "",
    email: leadData?.email || "",
    whatsapp: leadData?.whatsapp || ""
  };

  setTextContent("resultBadge", profile.badge);
  setTextContent("resultTitle", profile.title);
  setTextContent("resultSummary", profile.summary);
  setTextContent("resultApproach", profile.approach);
  setTextContent("resultRisk", profile.risk);
  setTextContent("resultHorizon", profile.horizon);
  setTextContent("resultNextStep", profile.nextStep);

  updateResultMeta(currentScoreForPdf, currentLeadForPdf);
  persistResultState(profile, currentScoreForPdf, currentLeadForPdf);

  const resultSection = document.getElementById("resultado");
  if (resultSection) {
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function getPdfProfileConfig(profileKey) {
  const configs = {
    conservador: {
      scoreRange: "Rango de referencia: 10 a 16 puntos",
      highlights: [
        "Priorizás preservar capital y evitar sobresaltos importantes.",
        "La estabilidad y la previsibilidad pesan fuerte en tu decisión.",
        "La liquidez y el orden financiero son variables centrales para vos."
      ],
      fitForProfile: [
        "Estrategias defensivas.",
        "Mayor proporción de instrumentos conservadores.",
        "Construcción patrimonial con foco en resguardo."
      ],
      strengths: [
        "Disciplina para evitar riesgos innecesarios.",
        "Buena sensibilidad para proteger capital."
      ],
      warnings: [
        "No confundir prudencia con inmovilismo.",
        "Un perfil demasiado conservador puede resignar rendimiento real en horizontes largos."
      ],
      allocation: [
        { name: "Liquidez / Money Market", weight: 35 },
        { name: "Renta fija / instrumentos conservadores", weight: 45 },
        { name: "Cobertura / diversificación", weight: 15 },
        { name: "Activos de crecimiento", weight: 5 }
      ]
    },
    moderado: {
      scoreRange: "Rango de referencia: 17 a 24 puntos",
      highlights: [
        "Buscás equilibrio entre resguardo y mejora patrimonial.",
        "Aceptás cierto nivel de variación si el objetivo es razonable.",
        "La diversificación es especialmente importante para este perfil."
      ],
      fitForProfile: [
        "Carteras balanceadas.",
        "Combinación de estabilidad y crecimiento gradual.",
        "Estrategias consistentes con plazos intermedios."
      ],
      strengths: [
        "Capacidad para combinar prudencia con búsqueda de rendimiento.",
        "Buena base para construir una estrategia ordenada."
      ],
      warnings: [
        "Evitar cambios bruscos por ruido de corto plazo.",
        "No perder coherencia entre plazo, riesgo y objetivo."
      ],
      allocation: [
        { name: "Liquidez / Money Market", weight: 20 },
        { name: "Renta fija / instrumentos defensivos", weight: 35 },
        { name: "Activos de crecimiento diversificados", weight: 30 },
        { name: "Cobertura / alternativos", weight: 15 }
      ]
    },
    equilibrado: {
      scoreRange: "Rango de referencia: 25 a 32 puntos",
      highlights: [
        "Tenés apertura a asumir riesgo moderado para buscar crecimiento.",
        "Te sentís cómodo con decisiones más dinámicas si están bien fundamentadas.",
        "Podés sostener una estrategia con volatilidad intermedia."
      ],
      fitForProfile: [
        "Carteras con mayor sesgo a crecimiento.",
        "Diversificación con foco en mediano y largo plazo.",
        "Mayor tolerancia a fluctuaciones razonables."
      ],
      strengths: [
        "Buena predisposición para construir cartera con horizonte.",
        "Capacidad de tolerar variaciones moderadas sin perder el eje."
      ],
      warnings: [
        "No sobreestimar tu tolerancia al riesgo real en momentos de caída.",
        "Evitar concentración excesiva por entusiasmo de corto plazo."
      ],
      allocation: [
        { name: "Liquidez / Money Market", weight: 15 },
        { name: "Renta fija / instrumentos defensivos", weight: 25 },
        { name: "Activos de crecimiento diversificados", weight: 45 },
        { name: "Cobertura / alternativos", weight: 15 }
      ]
    },
    agresivo: {
      scoreRange: "Rango de referencia: 33 a 40 puntos",
      highlights: [
        "Tenés mayor tolerancia a la volatilidad si el potencial es superior.",
        "Aceptás escenarios más variables a cambio de crecimiento esperado.",
        "El foco está puesto en la apreciación de capital a largo plazo."
      ],
      fitForProfile: [
        "Mayor exposición a activos de crecimiento.",
        "Horizontes largos y estrategias más dinámicas.",
        "Diversificación para administrar drawdowns."
      ],
      strengths: [
        "Capacidad de sostener estrategias con más riesgo relativo.",
        "Apertura a oportunidades de crecimiento más exigentes."
      ],
      warnings: [
        "No subestimar el impacto emocional de caídas profundas.",
        "Agresividad no debe confundirse con improvisación."
      ],
      allocation: [
        { name: "Liquidez / Money Market", weight: 10 },
        { name: "Renta fija / instrumentos defensivos", weight: 20 },
        { name: "Activos de crecimiento diversificados", weight: 55 },
        { name: "Cobertura / alternativos", weight: 15 }
      ]
    }
  };

  return configs[profileKey] || configs.moderado;
}

function normalizeScoreBar(score) {
  const minScore = 10;
  const maxScore = 40;
  const safeScore = Number(score);

  if (Number.isNaN(safeScore)) return 0;
  if (safeScore <= minScore) return 0;
  if (safeScore >= maxScore) return 100;

  return ((safeScore - minScore) / (maxScore - minScore)) * 100;
}

function formatDateAR(date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function getPdfAssetUrls() {
  const body = document.body;

  return {
    templateUrl:
      body?.dataset?.pdfTemplate || "/templates/perfil-inversor-pdf.html",
    cssUrl:
      body?.dataset?.pdfCss || "/assets/css/perfil-inversor-pdf.css"
  };
}

async function loadPdfAssets() {
  const { templateUrl, cssUrl } = getPdfAssetUrls();

  const [templateResponse, cssResponse] = await Promise.all([
    fetch(templateUrl, { cache: "no-store" }),
    fetch(cssUrl, { cache: "no-store" })
  ]);

  if (!templateResponse.ok) {
    throw new Error("No se pudo cargar el template HTML del PDF.");
  }

  if (!cssResponse.ok) {
    throw new Error("No se pudo cargar el CSS del PDF.");
  }

  const templateHtml = await templateResponse.text();
  const templateCss = await cssResponse.text();

  return { templateHtml, templateCss };
}

function createPdfHost(templateHtml, templateCss) {
  const existingHost = document.querySelector(".pdf-render-host");
  if (existingHost) existingHost.remove();

  const host = document.createElement("div");
  host.className = "pdf-render-host";
  host.setAttribute("aria-hidden", "true");

  host.style.position = "fixed";
  host.style.top = "0";
  host.style.left = "0";
  host.style.width = "794px";
  host.style.minWidth = "794px";
  host.style.maxWidth = "794px";
  host.style.background = "#ffffff";
  host.style.zIndex = "-1";
  host.style.pointerEvents = "none";
  host.style.overflow = "visible";

  host.innerHTML = `
    <style>${templateCss}</style>
    ${templateHtml}
  `;

  document.body.appendChild(host);
  return host;
}

function setPdfText(host, key, value) {
  host.querySelectorAll(`[data-pdf="${key}"]`).forEach((node) => {
    node.textContent = value ?? "";
  });
}

function setPdfList(host, key, items = []) {
  const list = host.querySelector(`[data-pdf-list="${key}"]`);
  if (!list) return;

  list.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

function setPdfAllocation(host, allocation = []) {
  const container = host.querySelector('[data-pdf-allocation="container"]');
  if (!container) return;

  container.innerHTML = "";

  allocation.forEach((item) => {
    const row = document.createElement("div");
    row.className = "pdf-allocation-row";
    row.innerHTML = `
      <div class="pdf-allocation-asset">${item.name}</div>
      <div class="pdf-allocation-bar">
        <span style="width: ${Number(item.weight) || 0}%;"></span>
      </div>
      <div class="pdf-allocation-weight">${Number(item.weight) || 0}%</div>
    `;
    container.appendChild(row);
  });
}

function getProfileDisplayName(profile) {
  return (profile?.badge || "")
    .replace(/^Perfil\s+/i, "")
    .trim();
}

function buildPdfData() {
  if (!currentProfileForPdf || currentScoreForPdf === null) {
    return null;
  }

  const pdfConfig = getPdfProfileConfig(currentProfileForPdf.key);

  const selectedMainGoal =
    getCheckedOptionTitle("q1") ||
    document.getElementById("resultMainGoal")?.textContent?.trim() ||
    "No informado";

  const selectedUserHorizon =
    getCheckedOptionTitle("q2") || currentProfileForPdf.horizon;

  return {
    generatedDate: formatDateAR(new Date()),
    profileName: getProfileDisplayName(currentProfileForPdf),
    profileDescription: currentProfileForPdf.summary,
    score: currentScoreForPdf,
    scoreRange: pdfConfig.scoreRange,
    fullName:
      currentLeadForPdf.name ||
      document.getElementById("resultLeadName")?.textContent?.trim() ||
      "No informado",
    email:
      currentLeadForPdf.email ||
      document.getElementById("resultLeadEmail")?.textContent?.trim() ||
      "No informado",
    whatsapp:
      currentLeadForPdf.whatsapp ||
      document.getElementById("resultLeadWhatsapp")?.textContent?.trim() ||
      "No informado",
    horizon: selectedUserHorizon,
    mainGoal: selectedMainGoal,
    highlights: pdfConfig.highlights,
    fitForProfile: pdfConfig.fitForProfile,
    strengths: pdfConfig.strengths,
    warnings: pdfConfig.warnings,
    nextStep: currentProfileForPdf.nextStep,
    allocation: pdfConfig.allocation,
    scoreBarPercent: normalizeScoreBar(currentScoreForPdf),
    brandPhone: RIO_BRAND.phone,
    brandEmail: RIO_BRAND.email,
    brandWebsite: RIO_BRAND.website,
    brandAddress: RIO_BRAND.address
  };
}

function populatePdfTemplate(host, data) {
  setPdfText(host, "generatedDate", data.generatedDate);
  setPdfText(host, "profileName", data.profileName);
  setPdfText(host, "profileDescription", data.profileDescription);
  setPdfText(host, "score", String(data.score));
  setPdfText(host, "scoreRange", data.scoreRange);
  setPdfText(host, "fullName", data.fullName);
  setPdfText(host, "email", data.email);
  setPdfText(host, "whatsapp", data.whatsapp);
  setPdfText(host, "horizon", data.horizon);
  setPdfText(host, "mainGoal", data.mainGoal);
  setPdfText(host, "nextStep", data.nextStep);

  setPdfText(host, "brandPhone", data.brandPhone);
  setPdfText(host, "brandEmail", data.brandEmail);
  setPdfText(host, "brandWebsite", data.brandWebsite);
  setPdfText(host, "brandAddress", data.brandAddress);

  setPdfList(host, "highlights", data.highlights);
  setPdfList(host, "fitForProfile", data.fitForProfile);
  setPdfList(host, "strengths", data.strengths);
  setPdfList(host, "warnings", data.warnings);

  setPdfAllocation(host, data.allocation);

  const scoreBar = host.querySelector('[data-pdf-bar="scoreBar"]');
  if (scoreBar) {
    scoreBar.style.width = `${data.scoreBarPercent || 0}%`;
  }
}

function buildPdfFilename(data) {
  const safeName = (data.fullName || "cliente")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  const safeProfile = (data.profileName || "perfil")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return `resultado-test-inversor-${safeProfile}-${safeName}.pdf`;
}

async function downloadResultPdf() {
  const data = buildPdfData();

  if (!data) {
    throw new Error("No hay resultado disponible para exportar.");
  }

  const { templateHtml, templateCss } = await loadPdfAssets();
  const host = createPdfHost(templateHtml, templateCss);

  try {
    populatePdfTemplate(host, data);

    const sheet = host.querySelector("#investor-pdf-sheet");
    if (!sheet) {
      throw new Error("No se encontró el contenedor principal del PDF.");
    }

    await waitForPdfRender(180);
    await waitForImages(sheet);
    await waitForPdfRender(120);

    const sheetWidth = Math.round(sheet.getBoundingClientRect().width) || 794;
    const sheetHeight = Math.round(sheet.scrollHeight);

    host.style.height = `${sheetHeight}px`;

    await waitForPdfRender(100);

    const canvas = await html2canvas(sheet, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: sheetWidth,
      height: sheetHeight,
      windowWidth: sheetWidth,
      windowHeight: sheetHeight,
      scrollX: 0,
      scrollY: 0,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedHost = clonedDoc.querySelector(".pdf-render-host");
        const clonedSheet = clonedDoc.getElementById("investor-pdf-sheet");

        if (clonedHost) {
          clonedHost.style.position = "absolute";
          clonedHost.style.top = "0";
          clonedHost.style.left = "0";
          clonedHost.style.width = `${sheetWidth}px`;
          clonedHost.style.minWidth = `${sheetWidth}px`;
          clonedHost.style.maxWidth = `${sheetWidth}px`;
          clonedHost.style.height = "auto";
          clonedHost.style.overflow = "visible";
          clonedHost.style.zIndex = "1";
          clonedHost.style.pointerEvents = "none";
          clonedHost.style.background = "#ffffff";
        }

        if (clonedSheet) {
          clonedSheet.style.width = `${sheetWidth}px`;
          clonedSheet.style.minWidth = `${sheetWidth}px`;
          clonedSheet.style.maxWidth = `${sheetWidth}px`;
          clonedSheet.style.margin = "0";
          clonedSheet.style.background = "#ffffff";
        }

        clonedDoc.body.style.margin = "0";
        clonedDoc.body.style.padding = "0";
        clonedDoc.body.style.background = "#ffffff";
      }
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = 210;
    const pageHeight = 297;

    let imgWidth = pageWidth;
    let imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = (canvas.width * imgHeight) / canvas.height;
    }

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight);
    pdf.save(buildPdfFilename(data));
  } finally {
    host.remove();
  }
}

function initPdfDownload() {
  const downloadBtn = document.getElementById("downloadPdfBtn");
  if (!downloadBtn) return;

  downloadBtn.addEventListener("click", async () => {
    if (!currentProfileForPdf) {
      alert("Primero completá el test y visualizá tu resultado.");
      return;
    }

    downloadBtn.disabled = true;
    const originalText = downloadBtn.textContent;
    downloadBtn.textContent = "Generando PDF...";

    try {
      await downloadResultPdf();
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("No se pudo generar el PDF en este momento.");
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = originalText;
    }
  });
}

function tryRestoreSavedResult() {
  const raw = localStorage.getItem("rioInvestorResult");
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);
    if (!saved?.profileKey || typeof saved?.score !== "number") return;

    const profile = profiles[saved.profileKey];
    if (!profile) return;

    currentProfileForPdf = profile;
    currentScoreForPdf = saved.score;
    currentLeadForPdf = {
      name: saved?.leadData?.name || "",
      email: saved?.leadData?.email || "",
      whatsapp: saved?.leadData?.whatsapp || ""
    };

    const resultSection = document.getElementById("resultado");
    if (resultSection && !resultSection.hidden) {
      renderResult(profile, saved.score, currentLeadForPdf);
    } else {
      updateResultMeta(saved.score, currentLeadForPdf);
    }
  } catch (error) {
    console.warn("No se pudo restaurar el estado guardado del test.", error);
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
        whatsapp: document.getElementById("leadWhatsapp")?.value.trim() || ""
      };

      const payload = {
        ...leadData,
        score,
        profile: profile.badge,
        page: window.location.href,
        userAgent: navigator.userAgent
      };

      const scriptURL =
        "https://script.google.com/macros/s/AKfycbwL5UTqYXXl_5zuJ3zpU11mX9rPjYfwl-evcgt9GklE6iY2CHrxjLEn7cG3QUFjYWlm/exec";

      if (statusEl) {
        statusEl.textContent = "Guardando tus datos...";
      }

      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain;charset=utf-8"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        console.log("Respuesta Apps Script:", result);

        currentLeadForPdf = leadData;
        currentScoreForPdf = score;

        if (statusEl) {
          statusEl.textContent = "Datos guardados correctamente.";
        }

        setTimeout(() => {
          closeLeadModal();
          renderResult(profile, score, leadData);
        }, 400);
      } catch (error) {
        console.error("Error al guardar lead:", error);

        if (statusEl) {
          statusEl.textContent =
            "No se pudieron guardar los datos. Podés intentar nuevamente.";
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

      currentProfileForPdf = null;
      currentScoreForPdf = null;
      currentLeadForPdf = {
        name: "",
        email: "",
        whatsapp: ""
      };

      clearPersistedResultState();
      updateResultMeta("", { name: "", email: "", whatsapp: "" });

      const resultSection = document.getElementById("resultado");
      if (resultSection) resultSection.hidden = true;

      document
        .getElementById("test")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  updateSelectedStyles();
  updateProgress();
  tryRestoreSavedResult();
}

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initRevealAnimations();
  initInvestorTest();
  initPdfDownload();
});
