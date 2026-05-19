/* =========================================================
   Dr. Prajct Sao website — shared scripts
   ---------------------------------------------------------
   CLINIC config: update these values with the real clinic
   phone / WhatsApp / email before publishing the site.
   WhatsApp number must be in international format, digits
   only (country code + number), e.g. 919876543210
   ========================================================= */

const CLINIC = {
  name: "Dr. Prajct Sao — Cozmaa Clinic",
  whatsapp: "919999999999",          // <-- replace with real WhatsApp number
  phone: "+91 99999 99999",          // <-- replace with real phone number
  email: "info@cozmaa.com"           // <-- replace with real email address
};

/* ---- Mobile navigation toggle ---- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---- Wire up WhatsApp / phone / email links ---- */
function initContactLinks() {
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    const msg = el.getAttribute("data-wa") || "Hello, I would like to book a consultation with Dr. Prajct Sao.";
    el.setAttribute("href", "https://wa.me/" + CLINIC.whatsapp + "?text=" + encodeURIComponent(msg));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });
  document.querySelectorAll("[data-phone]").forEach(function (el) {
    el.setAttribute("href", "tel:" + CLINIC.phone.replace(/\s+/g, ""));
    if (el.dataset.fill !== undefined) el.textContent = CLINIC.phone;
  });
  document.querySelectorAll("[data-email]").forEach(function (el) {
    el.setAttribute("href", "mailto:" + CLINIC.email);
    if (el.dataset.fill !== undefined) el.textContent = CLINIC.email;
  });
}

/* ---- Inquiry form (lead capture) ---- */
function initInquiryForm() {
  const form = document.getElementById("inquiryForm");
  if (!form) return;
  const success = document.getElementById("formSuccess");

  function setError(field, on) {
    field.closest(".field").classList.toggle("invalid", on);
  }

  form.addEventListener("submit", function (e) {
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

    // Build the lead record
    const lead = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      service: service.value,
      message: message.value.trim(),
      date: new Date().toISOString()
    };

    // Store locally so no enquiry is lost (demo lead store)
    try {
      const leads = JSON.parse(localStorage.getItem("drsao_leads") || "[]");
      leads.push(lead);
      localStorage.setItem("drsao_leads", JSON.stringify(leads));
    } catch (err) { /* storage unavailable — ignore */ }

    // Open WhatsApp with the enquiry pre-filled so the lead reaches the clinic
    const waText =
      "New enquiry for Dr. Prajct Sao%0A" +
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

/* ---- Footer year ---- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initNav();
  initContactLinks();
  initInquiryForm();
  initYear();
});
