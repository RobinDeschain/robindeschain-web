document.addEventListener('DOMContentLoaded', function() {
    class FeaturedProjectCarousel {
        constructor() {
            this.track = document.querySelector('.featured-carousel-track');
            this.cards = document.querySelectorAll('.featured-project-card');
            this.prevButton = document.querySelector('.featured-carousel-prev');
            this.nextButton = document.querySelector('.featured-carousel-next');
            this.container = document.querySelector('.featured-carousel-container');
            
            if (!this.track || !this.cards.length || !this.prevButton || !this.nextButton) {
                return;
            }
            
            this.currentIndex = 0;
            this.cardWidth = this.getCardWidth();
            this.visibleCards = this.getVisibleCards();
            this.totalCards = this.cards.length;
            
            this.init();
        }
        
        init() {
            // Clonar tarjetas para el loop infinito
            this.cloneCards();
            
            // Event listeners
            this.prevButton.addEventListener('click', () => this.prev());
            this.nextButton.addEventListener('click', () => this.next());
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
            });
            
            // Touch support
            this.setupTouchSupport();
            
            // Responsive handling
            window.addEventListener('resize', () => this.handleResize());
            
            // Inicializar posición
            this.updatePosition();
            
            // Añadir efecto hover a las tarjetas
            this.setupCardHover();
        }
        
        getCardWidth() {
            return this.cards[0].offsetWidth;
        }
        
        getVisibleCards() {
            const containerWidth = this.container.offsetWidth;
            const cardWidth = this.getCardWidth();
            return Math.floor(containerWidth / cardWidth);
        }
        
        cloneCards() {
            const cardsArray = Array.from(this.cards);
            const clonesNeeded = this.visibleCards;
            
            // Clonar tarjetas del principio para el final
            for (let i = 0; i < clonesNeeded; i++) {
                const clone = cardsArray[i].cloneNode(true);
                this.track.appendChild(clone);
            }
            
            // Clonar tarjetas del final para el principio
            for (let i = this.totalCards - clonesNeeded; i < this.totalCards; i++) {
                const clone = cardsArray[i].cloneNode(true);
                this.track.insertBefore(clone, this.track.firstChild);
            }
            
            // Actualizar referencia a todas las tarjetas
            this.allCards = this.track.querySelectorAll('.featured-project-card');
            
            // Ajustar índice inicial para compensar los clones
            this.currentIndex = clonesNeeded;
        }
        
        prev() {
            this.currentIndex--;
            this.updatePosition();
            this.checkLoop();
        }
        
        next() {
            this.currentIndex++;
            this.updatePosition();
            this.checkLoop();
        }
        
        updatePosition() {
            const translateX = -this.currentIndex * this.cardWidth;
            this.track.style.transform = `translateX(${translateX}px)`;
        }
        
        checkLoop() {
            const totalCards = this.allCards.length;
            const clonesCount = this.visibleCards;
            const realCardsCount = this.totalCards;
            
            // Si llegamos al principio de los clones del final
            if (this.currentIndex >= realCardsCount + clonesCount) {
                this.currentIndex = clonesCount;
                this.track.style.transition = 'none';
                this.updatePosition();
                
                // Forzar reflow para aplicar la transición
                this.track.offsetHeight;
                
                this.track.style.transition = 'transform 0.5s ease-in-out';
            }
            
            // Si llegamos al final de los clones del principio
            if (this.currentIndex < clonesCount) {
                this.currentIndex = realCardsCount;
                this.track.style.transition = 'none';
                this.updatePosition();
                
                // Forzar reflow para aplicar la transición
                this.track.offsetHeight;
                
                this.track.style.transition = 'transform 0.5s ease-in-out';
            }
        }
        
        setupTouchSupport() {
            let startX = 0;
            let endX = 0;
            let isDragging = false;
            
            this.track.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                this.track.style.cursor = 'grabbing';
            }, { passive: true });
            
            this.track.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                endX = e.touches[0].clientX;
            }, { passive: true });
            
            this.track.addEventListener('touchend', () => {
                if (!isDragging) return;
                
                const diff = startX - endX;
                const threshold = this.cardWidth / 4;
                
                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        this.next();
                    } else {
                        this.prev();
                    }
                }
                
                isDragging = false;
                this.track.style.cursor = 'grab';
            });
        }
        
        setupCardHover() {
            // El efecto hover ya está manejado por CSS
            // Este método está disponible para futuras mejoras
            this.cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    // Efectos adicionales si son necesarios
                });
                
                card.addEventListener('mouseleave', () => {
                    // Restaurar efectos
                });
            });
        }
        
        handleResize() {
            // Recalcular dimensiones
            this.cardWidth = this.getCardWidth();
            this.visibleCards = this.getVisibleCards();
            
            // Actualizar posición sin transición
            this.track.style.transition = 'none';
            this.updatePosition();
            
            // Forzar reflow
            this.track.offsetHeight;
            
            // Restaurar transición
            this.track.style.transition = 'transform 0.5s ease-in-out';
            
            // Recrear clones si es necesario
            this.rebuildClones();
        }
        
        rebuildClones() {
            // Remover clones existentes
            const allCards = this.track.querySelectorAll('.featured-project-card');
            const realCardsCount = this.totalCards;
            
            // Remover clones del final
            for (let i = allCards.length - 1; i >= realCardsCount; i--) {
                this.track.removeChild(allCards[i]);
            }
            
            // Remover clones del principio
            for (let i = this.visibleCards - 1; i >= 0; i--) {
                this.track.removeChild(allCards[i]);
            }
            
            // Recrear clones
            this.cloneCards();
        }
    }
    
    // Inicializar carrusel
    new FeaturedProjectCarousel();
});