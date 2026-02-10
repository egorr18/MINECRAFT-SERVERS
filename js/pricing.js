(function () {
  const pills = document.querySelectorAll("[data-billing]");
  const plans = document.querySelectorAll("[data-plan]");

  const billing = {
    weekly:   { mult: 1.25, suffix: "/wk" },
    monthly:  { mult: 1.00, suffix: "/mo" },
    quarterly:{ mult: 0.875, suffix: "/qtr" }, // -12.5%
    yearly:   { mult: 0.75, suffix: "/yr" },   // -25%
  };

  function setActive(key) {
    pills.forEach(p => {
      const isActive = p.dataset.billing === key;
      p.classList.toggle("is-active", isActive);
      p.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    const cfg = billing[key] || billing.yearly;

    plans.forEach(card => {
      const base = Number(card.getAttribute("data-base-price") || "0");
      const price = Math.round(base * cfg.mult * 100) / 100;

      const priceEl = card.querySelector("[data-price]");
      const sufEl = card.querySelector("[data-price-suffix]");
      if (priceEl) priceEl.textContent = price.toFixed(2);
      if (sufEl) sufEl.textContent = cfg.suffix;
    });
  }

  pills.forEach(p => p.addEventListener("click", () => setActive(p.dataset.billing)));

  // Default like screenshot: yearly
  setActive("yearly");
})();
