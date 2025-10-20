document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name') ? document.getElementById('name').value : '';
            const email = document.getElementById('email') ? document.getElementById('email').value : '';
            const phone = document.getElementById('phone') ? document.getElementById('phone').value : '';
            const service = document.getElementById('service') ? document.getElementById('service').value : '';
            const message = document.getElementById('message') ? document.getElementById('message').value : '';
            
            // Basic form validation
            if (!name || !email || !message) {
                showFormMessage('Por favor, completa todos los campos obligatorios.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Por favor, introduce un email válido.', 'error');
                return;
            }
            
            // Show success message (in real app, this would be after server response)
            showFormMessage('¡Mensaje enviado con éxito! Me pondré en contacto contigo pronto.', 'success');
            
            // Reset form
            contactForm.reset();
        });
        
        function showFormMessage(message, type) {
            if (formMessage) {
                formMessage.textContent = message;
                formMessage.className = 'form-message';
                
                if (type === 'success') {
                    formMessage.style.backgroundColor = '#d4edda';
                    formMessage.style.color = '#155724';
                    formMessage.style.borderColor = '#c3e6cb';
                } else {
                    formMessage.style.backgroundColor = '#f8d7da';
                    formMessage.style.color = '#721c24';
                    formMessage.style.borderColor = '#f5c6cb';
                }
                
                formMessage.style.padding = '15px';
                formMessage.style.marginBottom = '20px';
                formMessage.style.borderRadius = '4px';
                formMessage.style.border = '1px solid';
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.className = 'form-message';
                    formMessage.style = '';
                }, 5000);
            }
        }
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const faqAnswer = faqItem.querySelector('.faq-answer');
                const icon = question.querySelector('i');
                
                // Toggle active class
                faqItem.classList.toggle('active');
                
                // Toggle icon
                if (icon && icon.classList.contains('fa-plus')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else if (icon) {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
                
                // Close other FAQ items
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== question) {
                        const otherFaqItem = otherQuestion.parentElement;
                        const otherFaqAnswer = otherFaqItem.querySelector('.faq-answer');
                        const otherIcon = otherQuestion.querySelector('i');
                        
                        otherFaqItem.classList.remove('active');
                        
                        if (otherIcon && otherIcon.classList.contains('fa-minus')) {
                            otherIcon.classList.remove('fa-minus');
                            otherIcon.classList.add('fa-plus');
                        }
                    }
                });
            });
        });
    }
    
    // Add animation to form groups
    const formGroups = document.querySelectorAll('.form-group');
    
    if (formGroups.length > 0) {
        formGroups.forEach((group, index) => {
            group.style.animationDelay = `${index * 0.1}s`;
            group.classList.add('fade-in-up');
        });
    }
    
    // Add animation to contact info items
    const contactInfoItems = document.querySelectorAll('.contact-info-item');
    
    if (contactInfoItems.length > 0) {
        contactInfoItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in-left');
        });
    }
    
    // Add animation to FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in-up');
        });
    }
    
    /*// Initialize map placeholder
    const mapPlaceholder = document.querySelector('.map-placeholder');
    
    if (mapPlaceholder) {
        // In a real application, you would initialize Google Maps here
        
        function initMap() {
            const madrid = { lat: 40.4168, lng: -3.7038 };
            
            const map = new google.maps.Map(document.getElementById('map'), {
                zoom: 12,
                center: madrid,
                styles: [
                    {
                        "featureType": "all",
                        "elementType": "geometry.fill",
                        "stylers": [{"weight": "2.00"}]
                    },
                    {
                        "featureType": "all",
                        "elementType": "geometry.stroke",
                        "stylers": [{"color": "#9c9c9c"}]
                    },
                    {
                        "featureType": "all",
                        "elementType": "labels.text",
                        "stylers": [{"visibility": "on"}]
                    }
                ]
            });
            
            const marker = new google.maps.Marker({
                position: madrid,
                map: map,
                title: 'Robin Deschain Photography'
            });
        }
        
        // Load Google Maps API
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        
    } */
     
    // Add scroll animations
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    const elementInView = (el, dividend = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        
        return (
            elementTop <=
            (window.innerHeight || document.documentElement.clientHeight) / dividend
        );
    };
    
    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };
    
    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };
    
    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 1.25)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };
    
    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });
    
    // Initial check on page load
    handleScrollAnimation();
});