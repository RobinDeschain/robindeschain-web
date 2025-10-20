document.addEventListener('DOMContentLoaded', function() {
    // Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterMessage = document.getElementById('newsletterMessage');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('.newsletter-input').value;
            const button = this.querySelector('.newsletter-button');
            
            // Validación de email básica
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                showNewsletterMessage('Por favor, introduce un email válido.', 'error');
                return;
            }
            
            // Deshabilitar botón y mostrar loading
            button.disabled = true;
            button.textContent = 'Enviando...';
            
            // Simular envío (en producción, esto sería una llamada API real)
            setTimeout(() => {
                // Éxito simulado
                showNewsletterMessage('¡Gracias por suscribirte! Recibirás nuestras novedades pronto.', 'success');
                
                // Resetear formulario
                newsletterForm.reset();
                button.disabled = false;
                button.textContent = 'Suscribirse';
                
                // En producción, aquí iría la llamada a tu servicio de email marketing
                // Ejemplo: sendToMailchimp(email);
            }, 1500);
        });
    }
    
    function showNewsletterMessage(message, type) {
        if (newsletterMessage) {
            newsletterMessage.textContent = message;
            newsletterMessage.className = `newsletter-message ${type} show`;
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                newsletterMessage.classList.remove('show');
            }, 5000);
        }
    }
    
    // Smooth scroll para enlaces del footer
    const footerLinks = document.querySelectorAll('.footer-nav a, .footer-legal a, .footer-bottom-links a');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Si es un enlace interno, smooth scroll
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Animación de entrada para elementos del footer
    const footerElements = document.querySelectorAll('.footer-column');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    footerElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Función para integración con servicios de email marketing (ejemplo)
    function sendToMailchimp(email) {
        // Aquí iría la integración real con Mailchimp, Sendinblue, etc.
        console.log('Enviando email a Mailchimp:', email);
        
        // Ejemplo de cómo sería con fetch:
        /*
        fetch('https://tu-servicio-api.com/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                list_id: 'tu-list-id'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNewsletterMessage('¡Suscripción exitosa!', 'success');
            } else {
                showNewsletterMessage('Error al suscribirse. Inténtalo de nuevo.', 'error');
            }
        })
        .catch(error => {
            showNewsletterMessage('Error de conexión. Inténtalo de nuevo.', 'error');
        });
        */
    }
    
    // Trackear clicks en redes sociales (opcional)
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.getAttribute('aria-label');
            console.log(`Click en red social: ${platform}`);
            
            // Aquí podrías integrar Google Analytics o similar
            // gtag('event', 'social_click', {
            //     'social_network': platform,
            //     'event_category': 'engagement'
            // });
        });
    });
    
    // Validación de horario dinámico (opcional)
    function updateContactStatus() {
        const now = new Date();
        const day = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
        const hour = now.getHours();
        
        const isWorkingHours = (day >= 1 && day <= 5 && hour >= 10 && hour < 18) ||
                              (day === 6 && hour >= 10 && hour < 14);
        
        const contactStatus = document.querySelector('.contact-status');
        if (contactStatus) {
            if (isWorkingHours) {
                contactStatus.textContent = 'Disponible ahora';
                contactStatus.style.color = '#4CAF50';
            } else {
                contactStatus.textContent = 'Fuera de horario';
                contactStatus.style.color = '#FFC107';
            }
        }
    }
    
    // Actualizar estado cada minuto
    // setInterval(updateContactStatus, 60000);
    // updateContactStatus();
});