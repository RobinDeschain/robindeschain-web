// assets/js/menu.js - Solución específica para el menú
class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.body = document.body;
        
        this.init();
    }
    
    init() {
        if (!this.hamburger || !this.navMenu) return;
        
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
        
        document.addEventListener('click', (e) => this.handleClickOutside(e));
        document.addEventListener('keydown', (e) => this.handleEscapeKey(e));
        window.addEventListener('resize', () => this.handleResize());
    }
    
    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        this.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.body.style.overflow = '';
    }
    
    handleClickOutside(e) {
        if (this.navMenu.classList.contains('active') && 
            !this.navMenu.contains(e.target) && 
            !this.hamburger.contains(e.target)) {
            this.closeMenu();
        }
    }
    
    handleEscapeKey(e) {
        if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
            this.closeMenu();
        }
    }
    
    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMenu();
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new MobileMenu();
});