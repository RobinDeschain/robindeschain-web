/* =========================================================
   main.js – Robin Deschain Portfolio
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    /* =========================================================
       CONFIGURACIÓN GENERAL
       ========================================================= */
    const TRANSITION_MODE = "slide"; 
    // 🔄 Cambia a "fade" o "slide" según prefieras

    /* =========================================================
       1. Smooth scroll (anclas internas)
       ========================================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* =========================================================
       2. Scroll reveal simple
       ========================================================= */
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        revealElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    /* =========================================================
       3. Sticky header (ocultar/mostrar al hacer scroll)
       ========================================================= */
    const nav = document.querySelector('.nav');
    let lastScrollTop = 0;
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    /* =========================================================
       4. Botón "ir arriba"
       ========================================================= */
    const toTopBtn = document.getElementById('to-top');
    if (toTopBtn) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 500) {
                toTopBtn.classList.add('visible');
            } else {
                toTopBtn.classList.remove('visible');
            }
        });
        toTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

/* =========================================================
   5. Transición entre páginas (fade o slide)
   ========================================================= */
const pageLinks = document.querySelectorAll('a[href$=".html"], a.nav-link');

pageLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Evita interferir con los botones internos de proyecto
        if (
            !href ||
            href.startsWith('#') ||
            href.startsWith('#proyecto-') || // 🔧 nuevo: deja pasar los modales
            this.classList.contains('project-link') ||
            window.location.pathname.endsWith(href)
        ) return;

        e.preventDefault();
        document.body.classList.add(`page-exit-${TRANSITION_MODE}`);

        setTimeout(() => {
            window.location.href = href;
        }, 500);
    });
});


   

    /* =========================================================
       6. Acordeón de Preguntas Frecuentes (FAQ)
       ========================================================= */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-question');
        const content = item.querySelector('.faq-answer');
        if (!header || !content) return;

        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Cerrar todos los demás
            faqItems.forEach(i => {
                i.classList.remove('open');
                const ans = i.querySelector('.faq-answer');
                if (ans) ans.style.maxHeight = null;
            });

            // Si estaba cerrado, abrirlo
            if (!isOpen) {
                item.classList.add('open');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

});
