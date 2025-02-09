document.addEventListener('DOMContentLoaded', () => {
    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Анимация при скролле
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-scroll]').forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        observer.observe(element);
    });

    // Боковое меню
    const sideMenu = document.getElementById('sideMenu');
    const aboutBtn = document.getElementById('aboutBtn');

    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sideMenu.style.left = '0';
    });

    document.querySelector('.close-btn').addEventListener('click', () => {
        sideMenu.style.left = '-300px';
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && !aboutBtn.contains(e.target)) {
            sideMenu.style.left = '-300px';
        }
    });

    // Изменение прозрачности навигации при скролле
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(48, 63, 74, 0.7)';
        } else {
            nav.style.background = 'rgba(48, 63, 74, 0.9)';
        }
    });
});