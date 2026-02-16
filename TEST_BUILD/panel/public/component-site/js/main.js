(function () {
    // ==========================================
    // 1. ИНТЕРФЕЙС: МЕНЮ, ЧАСЫ, FAQ
    // ==========================================
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
            burger.focus();
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
            dropdownMenu.style.display = opened ? "none" : "block";
            dropdownBtn.setAttribute("aria-expanded", opened ? "false" : "true");
            dropdownBtn.classList.toggle("active", !opened);
        });

        document.addEventListener("click", () => {
            closeDropdown();
            if (dropdownBtn) dropdownBtn.classList.remove("active");
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

    // ==========================================
    // 2. АВТОРИЗАЦИЯ И ПРОФИЛЬ
    // ==========================================
    document.addEventListener("DOMContentLoaded", () => {

        // --- ОБРАБОТКА ФОРМ (РЕГИСТРАЦИЯ / ВХОД) ---
        const forms = document.querySelectorAll("form");
        forms.forEach(form => {
            form.addEventListener("submit", (e) => {
                e.preventDefault();

                const usernameInput = form.querySelector('input[placeholder="Username"]');
                const emailInput = form.querySelector('input[placeholder="Email"]') || form.querySelector('input[type="email"]');
                const passInput = form.querySelector('input[placeholder="Password"]');
                const confirmPassInput = form.querySelector('input[placeholder="Confirm Password"]');
                const termsCheckbox = form.querySelector('input[type="checkbox"]');

                // Проверяем, есть ли поле "Confirm Password"
                if (confirmPassInput) {
                    // -----------------------------
                    // --- ЭТО РЕГИСТРАЦИЯ (SIGN UP)
                    // -----------------------------
                    if (termsCheckbox && !termsCheckbox.checked) {
                        return alert("Ошибка: Нужно согласиться с правилами!");
                    }
                    if (passInput && passInput.value !== confirmPassInput.value) {
                        return alert("Ошибка: Пароли не совпадают!");
                    }

                    // Берем имя из поля (или ставим стандартное)
                    const name = usernameInput && usernameInput.value ? usernameInput.value : "New User";
                    localStorage.setItem("currentUser", name);

                    window.location.href = "account.html";

                } else {
                    // -----------------------------
                    // --- ЭТО ВХОД (LOGIN)
                    // -----------------------------
                    // Проверяем, заполнил ли человек поля
                    if (!emailInput || !emailInput.value) {
                        return alert("Пожалуйста, введите ваш Email!");
                    }
                    if (!passInput || !passInput.value) {
                        return alert("Пожалуйста, введите пароль!");
                    }

                    // Красивая фишка: берем логин из email (всё, что до собачки @)
                    // Например, если ввели "hacker2026@gmail.com", в аккаунте будет имя "hacker2026"
                    const name = emailInput.value.split('@')[0];

                    localStorage.setItem("currentUser", name);
                    window.location.href = "account.html";
                }
            });
        });

        // --- ОБНОВЛЕНИЕ ИМЕНИ В АККАУНТЕ ---
        const nameElements = document.querySelectorAll("[data-username]");

        if (nameElements.length > 0) {
            // Достаем сохраненное имя (или laker_10248)
            const savedName = localStorage.getItem("currentUser") || "laker_10248";

            // Вставляем имя во все места
            nameElements.forEach(el => {
                el.textContent = savedName;
            });

            // Вставляем первую букву в аватарку
            const avatarLetter = document.querySelector("[data-avatar-letter]");
            if (avatarLetter && savedName.length > 0) {
                avatarLetter.textContent = savedName.charAt(0).toUpperCase();
            }
        }
    });
})();