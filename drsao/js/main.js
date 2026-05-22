/* =========================================================
   Dr. Prajct Sao website — shared scripts
   CLINIC config: update these with the real numbers/email.
   ========================================================= */

const CLINIC = {
  name: "Dr. Prajct Sao — Cozmaa Clinic",
  whatsapp: "919999999999",
  phone: "+91 99999 99999",
  email: "info@cozmaa.com"
};

/* Header scroll */
function initHeader() {
  const header = document.querySelector(".site-header, #header");
  if (!header) return;
  const toggle = () => header.classList.toggle("scrolled", window.scrollY > 30);
  toggle();
  window.addEventListener("scroll", toggle, { passive: true });
}

/* Mobile nav */
function initNav() {
  const toggle = document.querySelector(".nav-toggle, .hamburger");
  const nav = document.querySelector(".site-nav, .nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Contact link wire-up */
function initContactLinks() {
  document.querySelectorAll("[data-wa]").forEach(el => {
    const msg = el.getAttribute("data-wa") || "Hello, I would like to book a consultation with Dr. Prajct Sao.";
    el.setAttribute("href", "https://wa.me/" + CLINIC.whatsapp + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  document.querySelectorAll("[data-phone]").forEach(el => {
    el.setAttribute("href", "tel:" + CLINIC.phone.replace(/\s+/g, ""));
    if (el.dataset.fill !== undefined) el.textContent = CLINIC.phone;
  });
  document.querySelectorAll("[data-email]").forEach(el => {
    el.setAttribute("href", "mailto:" + CLINIC.email);
    if (el.dataset.fill !== undefined) el.textContent = CLINIC.email;
  });
}

/* Inquiry form */
function initInquiryForm() {
  const form = document.getElementById("inquiryForm");
  if (!form) return;
  const success = document.getElementById("formSuccess");
  const setError = (f, on) => f.closest(".field").classList.toggle("invalid", on);

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;
    const name = form.elements["name"];
    const phone = form.elements["phone"];
    const email = form.elements["email"];
    const service = form.elements["service"];
    const message = form.elements["message"];

    if (!name.value.trim()) { setError(name, true); valid = false; } else setError(name, false);
    const phoneOk = /^[0-9+\-\s]{7,15}$/.test(phone.value.trim());
    if (!phoneOk) { setError(phone, true); valid = false; } else setError(phone, false);
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, true); valid = false;
    } else setError(email, false);
    if (!service.value) { setError(service, true); valid = false; } else setError(service, false);
    if (!valid) return;

    const lead = {
      name: name.value.trim(), phone: phone.value.trim(), email: email.value.trim(),
      service: service.value, message: message.value.trim(), date: new Date().toISOString()
    };
    try {
      const leads = JSON.parse(localStorage.getItem("drsao_leads") || "[]");
      leads.push(lead);
      localStorage.setItem("drsao_leads", JSON.stringify(leads));
    } catch (err) {}

    const waText = "New enquiry for Dr. Prajct Sao%0A" +
      "Name: " + lead.name + "%0A" +
      "Phone: " + lead.phone + "%0A" +
      (lead.email ? "Email: " + lead.email + "%0A" : "") +
      "Interested in: " + lead.service + "%0A" +
      (lead.message ? "Message: " + lead.message : "");
    const waUrl = "https://wa.me/" + CLINIC.whatsapp + "?text=" + waText;

    form.style.display = "none";
    if (success) {
      success.classList.add("show");
      const waBtn = success.querySelector("[data-wa-send]");
      if (waBtn) {
        waBtn.setAttribute("href", waUrl);
        waBtn.setAttribute("target", "_blank");
        waBtn.setAttribute("rel", "noopener");
      }
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}

/* Testimonial slider */
function initTestiSlider() {
  const slides = document.getElementById("testiSlides");
  if (!slides) return;
  const total = slides.children.length;
  let idx = 0;
  const go = i => {
    idx = (i + total) % total;
    slides.style.transform = "translateX(-" + (idx * 100) + "%)";
  };
  const prev = document.getElementById("testiPrev");
  const next = document.getElementById("testiNext");
  if (prev) prev.addEventListener("click", () => go(idx - 1));
  if (next) next.addEventListener("click", () => go(idx + 1));
  setInterval(() => go(idx + 1), 6500);
}

/* Hero stat counter */
function initCounters() {
  const counters = document.querySelectorAll(".hero-stats h2[data-count]");
  if (!counters.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = cur + suffix;
      }, 28);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => io.observe(c));
}

/* Footer year */
function initYear() {
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initNav();
  initContactLinks();
  initInquiryForm();
  initTestiSlider();
  initCounters();
  initYear();
});
