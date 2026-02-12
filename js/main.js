(function () {
    const burger = document.querySelector("[data-burger]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");
    const mobileClose = document.querySelector("[data-mobile-close]");
    const dropdownBtn = document.querySelector("[data-dropdown-btn]");
    const dropdownMenu = document.querySelector("[data-dropdown-menu]");
    const clock = document.querySelector("[data-clock]");

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
            if (a.getAttribute('href') && a.getAttribute('href').includes('.html')) return;
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

            // Переключаем отображение меню
            dropdownMenu.style.display = opened ? "none" : "block";
            dropdownBtn.setAttribute("aria-expanded", opened ? "false" : "true");

            // ВАЖНО: Добавляем/убираем класс active для анимации стрелочки
            dropdownBtn.classList.toggle("active", !opened);
        });

        document.addEventListener("click", () => {
            closeDropdown();
            dropdownBtn.classList.remove("active"); // Убираем поворот при клике мимо
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

    document.querySelectorAll('.faq__item').forEach((targetDetail) => {
        targetDetail.addEventListener('click', () => {
            if (!targetDetail.hasAttribute('open')) {
                document.querySelectorAll('.faq__item').forEach((detail) => {
                    if (detail !== targetDetail) detail.removeAttribute('open');
                });
            }
        });
    });
})();