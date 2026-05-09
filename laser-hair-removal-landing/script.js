/* =============================================================
   Lumière — Motion + Interaction
   Vanilla JS, IntersectionObserver-driven, RAF-smoothed cursor.
   ============================================================= */

// ---------- Custom cursor ----------
(() => {
  if (matchMedia("(pointer: coarse)").matches) return;

  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let mx = innerWidth / 2,
    my = innerHeight / 2;
  let rx = mx,
    ry = my;

  addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  const tick = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  tick();

  document
    .querySelectorAll("a, button, summary, [data-float-chip]")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
    });
})();

// ---------- Nav scroll state ----------
(() => {
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", scrollY > 24);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });
})();

// ---------- Stagger nav fade ----------
document.querySelectorAll("[data-fade]").forEach((el, i) => {
  el.style.setProperty("--fd", `${i * 120}ms`);
});

// ---------- Reveal on scroll ----------
(() => {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document
    .querySelectorAll("[data-reveal], [data-reveal-line]")
    .forEach((el) => io.observe(el));
})();

// ---------- Stagger headline lines ----------
document.querySelectorAll("[data-reveal-line]").forEach((el, i) => {
  el.style.setProperty("--ld", `${i * 120}ms`);
});

// ---------- Stagger sibling reveals within a container ----------
document
  .querySelectorAll(
    ".grid > [data-reveal], #faq-list > [data-reveal]"
  )
  .forEach((el, i, list) => {
    if (list.length > 1) {
      el.style.setProperty("--rd", `${(i % 4) * 90}ms`);
    }
  });

// ---------- Number counter ----------
(() => {
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const animate = (el) => {
    const target = +el.dataset.target;
    const dur = 1600;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * ease(t));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target);
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll("[data-counter]").forEach((el) => io.observe(el));
})();

// ---------- Science card spotlight ----------
document.querySelectorAll(".science-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
  });
});

// ---------- Hero parallax tilt ----------
(() => {
  const card = document.querySelector("[data-float]");
  if (!card) return;
  const inner = card.querySelector(".aspect-\\[4\\/5\\]") || card.firstElementChild;
  let raf = null;

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      inner.style.transform = `rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
    });
  });
  card.addEventListener("mouseleave", () => {
    inner.style.transform = "";
  });
})();

// ---------- Form ----------
window.handleBook = (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector("button");
  const original = btn.textContent;
  btn.textContent = "✓ Got it — we'll call you";
  btn.disabled = true;
  form.querySelector("input").value = "";
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 3200);
  return false;
};

// ---------- Smooth anchor offset for sticky nav ----------
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
