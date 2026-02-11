(function () {
  const burger = document.querySelector("[data-burger]");

  const dropdownBtn = document.querySelector("[data-dropdown-btn]");
  const dropdownMenu = document.querySelector("[data-dropdown-menu]");

  const clock = document.querySelector("[data-clock]");

  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileClose = document.querySelector("[data-mobile-close]");

  if (burger && mobileMenu) {
    const openMenu = () => {
      mobileMenu.classList.add("is-open");
      mobileMenu.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      document.body.classList.add("no-scroll");
    };

    const closeMenu = () => {
      mobileMenu.classList.remove("is-open");
      mobileMenu.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    };

    burger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    if (mobileClose) mobileClose.addEventListener("click", closeMenu);

    mobileMenu.addEventListener("click", (e) => {
      if (e.target === mobileMenu) closeMenu();
    });

    mobileMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

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

    document.addEventListener("click", closeDropdown);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDropdown();
    });
  }

  if (clock) {
    setInterval(() => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      const ss = String(d.getSeconds()).padStart(2, "0");
      clock.textContent = `${hh}:${mm}:${ss}`;
    }, 1000);
  }

  document.querySelectorAll("[data-discord-link]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Discord link will be added later.");
    });
  });
})();
