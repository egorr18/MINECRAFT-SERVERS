(function () {
  const burger = document.querySelector("[data-burger]");
  const nav = document.querySelector("[data-nav]");

  // ТВОЇ атрибути для dropdown (НЕ міняємо HTML)
  const dropdownBtn = document.querySelector("[data-dropdown-btn]");
  const dropdownMenu = document.querySelector("[data-dropdown-menu]");

  const clock = document.querySelector("[data-clock]");

  // Mobile menu (burger)
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu on link click (mobile)
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  }

  // Dropdown
  function closeDropdown() {
    if (!dropdownBtn || !dropdownMenu) return;
    dropdownMenu.style.display = "none";
    dropdownBtn.setAttribute("aria-expanded", "false");
  }

  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      const opened = dropdownMenu.style.display === "block";
      dropdownMenu.style.display = opened ? "none" : "block";
      dropdownBtn.setAttribute("aria-expanded", opened ? "false" : "true");
    });

    // close on outside click
    document.addEventListener("click", closeDropdown);

    // close on ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDropdown();
    });
  }

  // Fake clock like screenshot
  if (clock) {
    setInterval(() => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      clock.textContent = `${hh}:${mm}:${ss}`;
    }, 1000);
  }

  // Discord placeholders
  document.querySelectorAll("[data-discord-link]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Discord link will be added later.");
    });
  });
})();
