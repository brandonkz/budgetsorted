const counters = document.querySelectorAll("[data-counter]");

const animateCounter = (el) => {
  const target = parseFloat(el.dataset.counter);
  const suffix = el.dataset.suffix || "";
  const duration = 1200;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = target * progress;
    let display = value;
    if (suffix === "bn") {
      display = `R${value.toFixed(1)}bn`;
    } else if (suffix === "k") {
      display = `R${value.toFixed(0)}k`;
    } else if (suffix === "%") {
      display = `${value.toFixed(1)}%`;
    } else {
      display = value.toFixed(0);
    }
    el.textContent = display;

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};

const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (entry.target.dataset.counter) animateCounter(entry.target);
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

[...document.querySelectorAll(".fade-up"), ...counters].forEach((el) => observer.observe(el));
