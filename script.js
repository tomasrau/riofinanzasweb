// Menú mobile
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

// FAQ accordion
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

// Barra de cotizaciones
async function loadQuotesBar() {
  const ticker = document.getElementById("quotesTicker");
  if (!ticker) return;

  const config = window.RIO_QUOTES_CONFIG || {};
  const manualQuotes = config.manualQuotes || {};

  try {
    const response = await fetch("https://dolarapi.com/v1/dolares");
    if (!response.ok) {
      throw new Error("No se pudieron obtener las cotizaciones");
    }

    const data = await response.json();

    const casas = {
      oficial: "Oficial",
      blue: "Blue",
      bolsa: "MEP",
      contadoconliqui: "CCL",
      mayorista: "Mayorista",
    };

    const selectedOrder = [
      "oficial",
      "blue",
      "bolsa",
      "contadoconliqui",
      "mayorista",
    ];

    const selectedQuotes = selectedOrder
      .map((key) => {
        const item = data.find((quote) => quote.casa === key);
        if (!item) return null;

        const manual = manualQuotes[key];

        if (manual) {
          return {
            ...item,
            nombre: manual.label || casas[key] || item.nombre,
            compra: manual.compra,
            venta: manual.venta,
            isManual: true,
          };
        }

        return {
          ...item,
          nombre: casas[key] || item.nombre,
        };
      })
      .filter(Boolean);

    const formatPrice = (value) =>
      new Intl.NumberFormat("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);

    const quotesHtml = selectedQuotes
      .map(
        (quote) => `
          <div class="quote-item ${quote.isManual ? "quote-item-manual" : ""}">
            <span class="quote-name">${quote.nombre}</span>
            <span class="quote-value">Compra ${formatPrice(quote.compra)}</span>
            <span class="quote-value">Venta ${formatPrice(quote.venta)}</span>
            <span class="quote-separator">|</span>
          </div>
        `
      )
      .join("");

    ticker.innerHTML = `
      <div class="quotes-track">
        ${quotesHtml}
        ${quotesHtml}
      </div>
    `;
  } catch (error) {
    ticker.innerHTML = `
      <div class="quotes-track">
        <div class="quote-item quote-error">
          No fue posible cargar las cotizaciones en este momento.
        </div>
      </div>
    `;
  }
}

// Formulario -> WhatsApp
function initContactForm() {
  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("successBox");

  if (!form) return;

  const whatsappNumber = form.dataset.whatsapp;
  const baseWhatsUrl = `https://wa.me/${whatsappNumber}`;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const telefono = document.getElementById("telefono")?.value.trim() || "";
    const servicio = document.getElementById("servicio")?.value.trim() || "";
    const mensaje = document.getElementById("mensaje")?.value.trim() || "";

    const texto = `
Hola, RIO. Quiero realizar una consulta.

Nombre: ${nombre}
Email: ${email}
Teléfono: ${telefono || "-"}
Servicio de interés: ${servicio}
Mensaje: ${mensaje || "-"}
    `.trim();

    const finalUrl = `${baseWhatsUrl}?text=${encodeURIComponent(texto)}`;
    window.open(finalUrl, "_blank");

    if (successBox) successBox.style.display = "block";
    form.reset();
  });
}

// Animaciones de aparición
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

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  loadQuotesBar();
  initContactForm();
  initRevealAnimations();
});