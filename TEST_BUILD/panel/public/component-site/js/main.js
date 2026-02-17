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
    
    document.addEventListener("DOMContentLoaded", () => {

        const forms = document.querySelectorAll("form");
        forms.forEach(form => {
            form.addEventListener("submit", (e) => {
                e.preventDefault();

                const usernameInput = form.querySelector('input[placeholder="Username"]');
                const emailInput = form.querySelector('input[placeholder="Email"]') || form.querySelector('input[type="email"]');
                const passInput = form.querySelector('input[placeholder="Password"]');
                const confirmPassInput = form.querySelector('input[placeholder="Confirm Password"]');
                const termsCheckbox = form.querySelector('input[type="checkbox"]');

                if (confirmPassInput) {
                    if (termsCheckbox && !termsCheckbox.checked) {
                        return alert("Ошибка: Нужно согласиться с правилами!");
                    }
                    if (passInput && passInput.value !== confirmPassInput.value) {
                        return alert("Ошибка: Пароли не совпадают!");
                    }

                    const name = usernameInput && usernameInput.value ? usernameInput.value : "New User";
                    localStorage.setItem("currentUser", name);

                    window.location.href = "account.html";

                } else {
                    if (!emailInput || !emailInput.value) {
                        return alert("Пожалуйста, введите ваш Email!");
                    }
                    if (!passInput || !passInput.value) {
                        return alert("Пожалуйста, введите пароль!");
                    }

                    const name = emailInput.value.split('@')[0];

                    localStorage.setItem("currentUser", name);
                    window.location.href = "account.html";
                }
            });
        });

        const nameElements = document.querySelectorAll("[data-username]");

        if (nameElements.length > 0) {
            const savedName = localStorage.getItem("currentUser") || "laker_10248";

            nameElements.forEach(el => {
                el.textContent = savedName;
            });

            const avatarLetter = document.querySelector("[data-avatar-letter]");
            if (avatarLetter && savedName.length > 0) {
                avatarLetter.textContent = savedName.charAt(0).toUpperCase();
            }
        }
    });
    document.addEventListener('DOMContentLoaded', () => {

        const refreshBtn = document.querySelector('.btn-refresh-alt');
        const nameInput = document.querySelector('input[placeholder="ThunderEvolution"]');
        const subInput = document.querySelector('input[placeholder="thunderevolution281"]');
        const nameCounter = document.querySelectorAll('.counter-text')[0];

        const prefixes = ['Thunder', 'Arctic', 'Raging', 'Stealth', 'Mystic', 'Shadow', 'Crystal', 'Quantum', 'Neon'];
        const suffixes = ['Evolution', 'Warfare', 'Realms', 'Knights', 'Craft', 'Network', 'Core', 'Nexus', 'Peak'];

        if (refreshBtn && nameInput) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();

                const svgIcon = refreshBtn.querySelector('svg');
                svgIcon.style.transition = 'transform 0.4s ease';
                svgIcon.style.transform = `rotate(${Math.random() * 360 + 360}deg)`;

                const randomPre = prefixes[Math.floor(Math.random() * prefixes.length)];
                const randomSuf = suffixes[Math.floor(Math.random() * suffixes.length)];
                const newName = randomPre + randomSuf;

                nameInput.value = newName;
                updateCounter(nameInput, nameCounter, 50);

                if (subInput) {
                    subInput.value = newName.toLowerCase();
                }
            });
        }

        const locItems = document.querySelectorAll('.loc-item');
        locItems.forEach(item => {
            item.addEventListener('click', () => {
                locItems.forEach(loc => loc.classList.remove('active'));
                item.classList.add('active');

                item.style.transform = 'scale(0.96)';
                setTimeout(() => item.style.transform = 'scale(1)', 150);
            });
        });

        const descInput = document.querySelector('.area');
        const descCounter = document.querySelectorAll('.counter-text')[1];

        function updateCounter(input, counterElem, maxLength) {
            const len = input.value.length;
            counterElem.textContent = `${len}/${maxLength} characters`;

            if (len >= maxLength) {
                counterElem.style.color = 'var(--accent)';
            } else {
                counterElem.style.color = 'rgba(255, 241, 242, 0.3)';
            }
        }

        if (nameInput) {
            nameInput.addEventListener('input', () => updateCounter(nameInput, nameCounter, 50));
        }
        if (descInput) {
            descInput.addEventListener('input', () => updateCounter(descInput, descCounter, 200));
        }

        if (subInput) {
            subInput.addEventListener('input', (e) => {
                let val = e.target.value;
                val = val.toLowerCase().replace(/[^a-z0-9]/g, '');
                e.target.value = val;
            });
        }

        const launchBtn = document.querySelector('.launch-btn');
        if (launchBtn) {
            launchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const originalText = launchBtn.textContent;

                launchBtn.textContent = 'CREATING...';
                launchBtn.style.opacity = '0.8';
                launchBtn.style.pointerEvents = 'none';

                setTimeout(() => {
                    launchBtn.textContent = 'SUCCESS! ✓';
                    launchBtn.style.background = '#39a11c';
                    launchBtn.style.color = '#fff';
                    launchBtn.style.opacity = '1';

                    setTimeout(() => {
                        launchBtn.textContent = originalText;
                        launchBtn.style.background = 'var(--accent)';
                        launchBtn.style.color = 'var(--bg)';
                        launchBtn.style.pointerEvents = 'auto';
                    }, 2000);
                }, 1500);
            });
        }

    });
})();