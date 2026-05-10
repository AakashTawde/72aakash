/* =============================================================
   Cozmaa Laser — Motion script
   GSAP + ScrollTrigger driven.
   ============================================================= */

const { gsap } = window;
gsap.registerPlugin(ScrollTrigger);

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarse = matchMedia("(pointer: coarse)").matches;

/* ---------------- PRELOADER ---------------- */
(() => {
  const pre = document.getElementById("preloader");
  const bar = pre.querySelector(".preloader-bar > span");
  const pct = document.getElementById("pct");
  let p = 0;
  const target = { v: 0 };
  const t = setInterval(() => {
    p = Math.min(100, p + Math.random() * 18 + 6);
    target.v = p;
    bar.style.width = p + "%";
    pct.textContent = Math.round(p);
    if (p >= 100) {
      clearInterval(t);
      gsap.to(pre, {
        autoAlpha: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "power3.inOut",
        onComplete: () => {
          pre.remove();
          document.body.classList.remove("loading");
          playHero();
        },
      });
    }
  }, 110);
})();

/* ---------------- CUSTOM CURSOR ---------------- */
if (!isCoarse) {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const label = ring.querySelector(".cursor-label");

  const xTo = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power2.out" });
  const yTo = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power2.out" });
  const rxTo = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
  const ryTo = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

  addEventListener("mousemove", (e) => {
    xTo(e.clientX); yTo(e.clientY);
    rxTo(e.clientX); ryTo(e.clientY);
  });

  document.querySelectorAll("a, button, summary, [data-magnet]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("hover");
      const cursorType = el.getAttribute("data-cursor");
      if (cursorType) {
        ring.classList.add("cta");
        label.textContent = cursorType;
      }
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("hover", "cta");
      label.textContent = "";
    });
  });
}

/* ---------------- MAGNETIC BUTTONS ---------------- */
if (!isCoarse && !reduced) {
  document.querySelectorAll("[data-magnet]").forEach((el) => {
    const strength = 0.25;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      gsap.to(el, { x, y, duration: 0.5, ease: "power3.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    });
  });
}

/* ---------------- NAV SCROLL STATE ---------------- */
(() => {
  const nav = document.getElementById("nav");
  ScrollTrigger.create({
    start: "top -20",
    end: 99999,
    onUpdate: (self) => nav.classList.toggle("scrolled", self.scroll() > 24),
  });
})();

/* ---------------- HERO INTRO ---------------- */
function playHero() {
  if (reduced) {
    document.querySelectorAll(".hero-title .word").forEach((w) => (w.style.transform = "none"));
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

  tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.8 })
    .to(".hero-title .word", {
      y: 0,
      duration: 1.1,
      stagger: 0.06,
      ease: "expo.out",
    }, "-=0.5")
    .from(".hero-sub", { y: 30, opacity: 0, duration: 0.8 }, "-=0.6")
    .from(".hero-actions > *", { y: 20, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.5")
    .from(".hero-trust .trust-item", { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 }, "-=0.4")
    .from(".hero-device", { y: 60, opacity: 0, scale: 0.95, duration: 1.2, ease: "expo.out" }, "-=1.1")
    .from(".chip", { scale: 0, opacity: 0, duration: 0.6, stagger: 0.15, ease: "back.out(2)" }, "-=0.6")
    .from(".scroll-cue", { opacity: 0, duration: 0.8 }, "-=0.4")
    .from("#nav > *", { y: -10, opacity: 0, duration: 0.6, stagger: 0.1 }, 0);
}

/* ---------------- HERO PARALLAX (mouse + scroll) ---------------- */
(() => {
  const hero = document.querySelector(".hero");
  if (!hero || reduced) return;

  const orbs = hero.querySelectorAll(".orb");
  const device = hero.querySelector(".hero-device");

  // Mouse parallax
  if (!isCoarse) {
    hero.addEventListener("mousemove", (e) => {
      const cx = (e.clientX / innerWidth - 0.5);
      const cy = (e.clientY / innerHeight - 0.5);
      orbs.forEach((o, i) => {
        gsap.to(o, {
          x: cx * (40 + i * 20),
          y: cy * (40 + i * 20),
          duration: 1.2,
          ease: "power3.out",
        });
      });
      gsap.to(device, {
        rotateY: cx * 12,
        rotateX: -cy * 8,
        duration: 0.8,
        ease: "power3.out",
        transformPerspective: 1400,
        transformOrigin: "center center",
      });
    });
    hero.addEventListener("mouseleave", () => {
      gsap.to(device, { rotateY: 0, rotateX: 0, duration: 1, ease: "power3.out" });
    });
  }

  // Scroll parallax on hero scene
  gsap.to(".grid-floor", {
    y: 200,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".orb-1", {
    y: -80, x: 60,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".orb-2", {
    y: 100, x: -60,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
  gsap.to(".hero-inner", {
    y: 80, opacity: 0.6,
    ease: "none",
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
  });
})();

/* ---------------- MARQUEE (GSAP infinite) ---------------- */
(() => {
  const track = document.querySelector(".marquee-track");
  if (!track) return;
  const w = track.scrollWidth / 2;
  gsap.to(track, {
    x: -w,
    duration: 40,
    ease: "none",
    repeat: -1,
  });
})();

/* ---------------- REVEAL TEXT ---------------- */
(() => {
  document.querySelectorAll(".reveal-text").forEach((el) => {
    const child = el.firstElementChild || el;
    gsap.set(child, { y: "110%" });
    ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      onEnter: () => gsap.to(child, { y: "0%", duration: 1.2, ease: "expo.out" }),
    });
  });
})();

/* ---------------- PINNED HORIZONTAL SCIENCE ---------------- */
(() => {
  if (innerWidth < 700 || reduced) return; // mobile = stacked
  const wrap = document.querySelector(".pin-wrap");
  const track = document.querySelector(".pin-track");
  if (!wrap || !track) return;

  const distance = () => track.scrollWidth - innerWidth;

  gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: wrap,
      start: "top top",
      end: () => "+=" + distance(),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  // Per-panel reveals while scrolling
  gsap.utils.toArray(".panel").forEach((panel, i) => {
    gsap.from(panel.querySelector(".panel-title"), {
      y: 40, opacity: 0, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: panel, start: "left center", containerAnimation: ScrollTrigger.getAll().find(s => s.pin === wrap) || undefined },
    });
  });
})();

/* ---------------- COUNTERS ---------------- */
(() => {
  document.querySelectorAll(".count").forEach((el) => {
    const target = +el.dataset.target;
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => (el.textContent = Math.round(obj.v)),
        });
      },
    });
  });
})();

/* ---------------- CIRCLE PROGRESS ---------------- */
(() => {
  const circle = document.querySelector(".circle-progress");
  if (!circle) return;
  ScrollTrigger.create({
    trigger: circle,
    start: "top 85%",
    once: true,
    onEnter: () => {
      gsap.to(circle, {
        strokeDashoffset: 326.7 * 0.1, // 90% fill
        duration: 2,
        ease: "power3.out",
      });
    },
  });
})();

/* ---------------- PROCESS TIMELINE STEPS ---------------- */
(() => {
  gsap.utils.toArray(".step").forEach((step, i) => {
    gsap.to(step, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: step,
        start: "top 82%",
        once: true,
      },
    });
    // Pulse the dot
    gsap.fromTo(step.querySelector(".step-rail .dot"),
      { scale: 0 },
      {
        scale: 1, duration: 0.6, ease: "back.out(2.4)",
        scrollTrigger: { trigger: step, start: "top 80%", once: true },
      }
    );
  });
})();

/* ---------------- 3D TILT ON CARDS ---------------- */
(() => {
  if (reduced || isCoarse) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    const inner = card.querySelector(".device-card") || card.querySelector(".ba-frame") || card;
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(inner, {
        rotateY: px * 14,
        rotateX: -py * 10,
        transformPerspective: 1000,
        transformOrigin: "center center",
        duration: 0.5,
        ease: "power3.out",
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(inner, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
    });
  });
})();

/* ---------------- BEFORE/AFTER REVEAL ON SCROLL ---------------- */
(() => {
  document.querySelectorAll(".ba-frame").forEach((frame) => {
    const after = frame.querySelector(".after");
    const divider = frame.querySelector(".ba-divider");
    gsap.set(after, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" });
    gsap.set(divider, { left: "100%" });

    gsap.to(after, {
      clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
      ease: "none",
      scrollTrigger: {
        trigger: frame,
        start: "top 80%",
        end: "bottom 30%",
        scrub: 1,
      },
    });
    gsap.to(divider, {
      left: "50%",
      ease: "none",
      scrollTrigger: {
        trigger: frame,
        start: "top 80%",
        end: "bottom 30%",
        scrub: 1,
      },
    });
  });
})();

/* ---------------- SECTION HEADER FADES ---------------- */
(() => {
  gsap.utils.toArray(".eyebrow, .lede").forEach((el) => {
    gsap.from(el, {
      y: 24, opacity: 0, duration: 1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
    });
  });

  gsap.utils.toArray(".price-card, .result-card").forEach((card, i) => {
    gsap.from(card, {
      y: 60, opacity: 0, duration: 1, ease: "expo.out",
      delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: card, start: "top 85%", once: true },
    });
  });
})();

/* ---------------- FORM ---------------- */
window.handleBook = (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector("button");
  const input = form.querySelector("input");

  gsap.to(form, { scale: 0.98, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.inOut" });
  const original = btn.querySelector("span").textContent;
  btn.querySelector("span").textContent = "✓ Got it — we'll call you";
  btn.disabled = true;
  input.value = "";
  setTimeout(() => {
    btn.querySelector("span").textContent = original;
    btn.disabled = false;
  }, 3200);
  return false;
};

/* ---------------- SMOOTH ANCHOR ---------------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id === "#" || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    gsap.to(window, {
      duration: 1.2,
      ease: "power3.inOut",
      scrollTo: { y: target, offsetY: 60 },
    });
  });
});

/* GSAP ScrollToPlugin fallback if not loaded */
if (!gsap.plugins?.ScrollToPlugin && !window.ScrollToPlugin) {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + scrollY - 60;
      scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* Refresh ScrollTrigger on resize */
addEventListener("resize", () => ScrollTrigger.refresh());
