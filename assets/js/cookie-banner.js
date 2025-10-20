class CookieBanner {
    constructor() {
        this.banner = null;
        this.acceptButton = null;
        this.rejectButton = null;
        this.settingsButton = null;
        this.settingsModal = null;
        this.cookieName = 'robindeschain_cookie_consent';
        this.localStorageKey = 'robindeschain_consent_data';
        this.init();
    }

    init() {
        // Verificar consentimiento usando ambos métodos (cookie + localStorage)
        const consent = this.getConsent();
        
        // Solo crear el banner si no hay consentimiento
        if (!consent) {
            this.createBanner();
            this.createSettingsModal();
            this.assignEvents();
            this.showBanner();
        } else {
            this.applyConsent(consent);
        }
    }

    getConsent() {
        // Método 1: Verificar cookie
        const cookieConsent = this.getCookie(this.cookieName);
        
        // Método 2: Verificar localStorage (respaldo)
        const localStorageConsent = localStorage.getItem(this.localStorageKey);
        
        // Si existe en ambos, usar el más reciente
        if (cookieConsent && localStorageConsent) {
            try {
                const cookieData = JSON.parse(cookieConsent);
                const localStorageData = JSON.parse(localStorageConsent);
                
                // Comparar timestamps y devolver el más reciente
                if (cookieData.timestamp && localStorageData.timestamp) {
                    return new Date(cookieData.timestamp) > new Date(localStorageData.timestamp) ? cookieData : localStorageData;
                }
                return cookieData;
            } catch (e) {
                console.error('Error parsing consent data:', e);
                return localStorageConsent;
            }
        }
        
        // Si solo existe en uno, devolver ese
        if (cookieConsent) return cookieConsent;
        if (localStorageConsent) return localStorageConsent;
        
        // Si no existe en ninguno, devolver null
        return null;
    }

    saveConsent(consent) {
        const consentString = JSON.stringify(consent);
        
        // Guardar en cookie (expira en 1 año)
        this.setCookie(this.cookieName, consentString, 365);
        
        // Guardar en localStorage (persistente)
        localStorage.setItem(this.localStorageKey, consentString);
        
        // Sincronizar entre pestañas usando evento de almacenamiento
        window.dispatchEvent(new StorageEvent('storage', {
            key: this.localStorageKey,
            newValue: consentString,
            url: window.location.href
        }));
    }

    createBanner() {
        // Verificar si el banner ya existe para no duplicarlo
        if (document.getElementById('cookie-banner')) {
            this.banner = document.getElementById('cookie-banner');
            this.acceptButton = document.getElementById('cookie-accept');
            this.rejectButton = document.getElementById('cookie-reject');
            this.settingsButton = document.getElementById('cookie-settings');
            return;
        }

        const bannerHTML = `
            <div id="cookie-banner" class="cookie-banner">
                <div class="cookie-content">
                    <div class="cookie-text">
                        <h3>Política de Cookies</h3>
                        <p>Utilizamos cookies esenciales para el funcionamiento del sitio web. No utilizamos cookies de seguimiento ni de marketing, ya que somos un sitio estático informativo. Puedes obtener más información en nuestra <a href="cookies-policy.html">Política de Cookies</a>.</p>
                    </div>
                    <div class="cookie-buttons">
                        <button class="cookie-button cookie-reject" id="cookie-reject">Rechazar</button>
                        <button class="cookie-button cookie-settings" id="cookie-settings">Configurar</button>
                        <button class="cookie-button cookie-accept" id="cookie-accept">Aceptar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        
        this.banner = document.getElementById('cookie-banner');
        this.acceptButton = document.getElementById('cookie-accept');
        this.rejectButton = document.getElementById('cookie-reject');
        this.settingsButton = document.getElementById('cookie-settings');
    }

    createSettingsModal() {
        // Verificar si el modal ya existe
        if (document.getElementById('cookie-settings-modal')) {
            this.settingsModal = document.getElementById('cookie-settings-modal');
            return;
        }

        const modalHTML = `
            <div id="cookie-settings-modal" class="cookie-modal">
                <div class="cookie-modal-content">
                    <div class="cookie-modal-header">
                        <h3>Configuración de Cookies</h3>
                        <button class="cookie-modal-close" id="cookie-modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="cookie-modal-body">
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h4>Cookies Esenciales</h4>
                                    <p>Son necesarias para el funcionamiento básico del sitio web. No se pueden desactivar.</p>
                                </div>
                                <div class="cookie-toggle">
                                    <input type="checkbox" id="necessary-cookies" checked disabled>
                                    <label for="necessary-cookies" class="toggle-label">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="cookie-category">
                            <div class="cookie-category-header">
                                <div class="cookie-category-info">
                                    <h4>Cookies de Análisis</h4>
                                    <p>Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio. Son opcionales.</p>
                                </div>
                                <div class="cookie-toggle">
                                    <input type="checkbox" id="analytics-cookies">
                                    <label for="analytics-cookies" class="toggle-label">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div class="cookie-note">
                            <p><strong>Nota importante:</strong> Este es un sitio web estático informativo. No vendemos productos ni recopilamos datos personales para marketing. Las únicas cookies que utilizamos son las esenciales para el funcionamiento del sitio y, opcionalmente, cookies de análisis para mejorar la experiencia de navegación.</p>
                        </div>
                    </div>
                    <div class="cookie-modal-footer">
                        <button class="cookie-button cookie-save-settings" id="cookie-save-settings">Guardar Preferencias</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        this.settingsModal = document.getElementById('cookie-settings-modal');
    }

    assignEvents() {
        if (this.acceptButton) {
            this.acceptButton.addEventListener('click', () => this.acceptAll());
        }

        if (this.rejectButton) {
            this.rejectButton.addEventListener('click', () => this.rejectAll());
        }

        if (this.settingsButton) {
            this.settingsButton.addEventListener('click', () => this.showSettings());
        }

        // Eventos del modal
        const modalClose = document.getElementById('cookie-modal-close');
        const saveSettings = document.getElementById('cookie-save-settings');

        if (modalClose) {
            modalClose.addEventListener('click', () => this.hideSettings());
        }

        if (saveSettings) {
            saveSettings.addEventListener('click', () => this.saveSettings());
        }

        // Cerrar modal al hacer clic fuera
        if (this.settingsModal) {
            this.settingsModal.addEventListener('click', (e) => {
                if (e.target === this.settingsModal) {
                    this.hideSettings();
                }
            });
        }

        // Escuchar cambios en localStorage para sincronizar entre pestañas
        window.addEventListener('storage', (e) => {
            if (e.key === this.localStorageKey) {
                const consent = this.getConsent();
                if (consent && this.banner) {
                    this.hideBanner();
                    this.applyConsent(consent);
                }
            }
        });
    }

    showBanner() {
        if (this.banner) {
            setTimeout(() => {
                this.banner.classList.add('show');
            }, 1000);
        }
    }

    hideBanner() {
        if (this.banner) {
            this.banner.classList.remove('show');
        }
    }

    showSettings() {
        if (this.settingsModal) {
            this.settingsModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideSettings() {
        if (this.settingsModal) {
            this.settingsModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    acceptAll() {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: false,
            preferences: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideBanner();
        this.hideSettings();
        
        this.trackConsent('accept_all');
    }

    rejectAll() {
        const consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideBanner();
        this.hideSettings();
        
        this.trackConsent('reject_all');
    }

    saveSettings() {
        const necessaryCheckbox = document.getElementById('necessary-cookies');
        const analyticsCheckbox = document.getElementById('analytics-cookies');
        
        const consent = {
            necessary: true,
            analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
            marketing: false,
            preferences: false,
            timestamp: new Date().toISOString()
        };
        
        this.saveConsent(consent);
        this.applyConsent(consent);
        this.hideBanner();
        this.hideSettings();
        
        this.trackConsent('save_settings');
    }

    applyConsent(consent) {
        if (typeof consent === 'string') {
            try {
                consent = JSON.parse(consent);
            } catch (e) {
                console.error('Error parsing consent:', e);
                return;
            }
        }

        // Aplicar configuración de cookies
        if (consent.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
    }

    enableAnalytics() {
        console.log('Analytics cookies enabled');
        
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
    }

    disableAnalytics() {
        console.log('Analytics cookies disabled');
        
        if (typeof gtag === 'function') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
    }

    trackConsent(action) {
        if (typeof gtag === 'function') {
            gtag('event', 'cookie_consent', {
                'event_category': 'engagement',
                'event_action': action
            });
        }
    }

    setCookie(name, value, days) {
        try {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            
            // Configurar cookie segura para HTTPS
            const secure = window.location.protocol === 'https:' ? '; Secure' : '';
            const sameSite = '; SameSite=Lax'; // Lax es mejor para compatibilidad
            
            document.cookie = name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/" + sameSite + secure;
            
            console.log('Cookie set:', name, 'Value:', value, 'Expires:', expires);
        } catch (e) {
            console.error('Error setting cookie:', e);
        }
    }

    getCookie(name) {
        try {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
                    console.log('Cookie found:', name, 'Value:', value);
                    return value;
                }
            }
        } catch (e) {
            console.error('Error getting cookie:', e);
        }
        return null;
    }

    deleteCookie(name) {
        try {
            document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax' + 
                             (window.location.protocol === 'https:' ? '; Secure' : '');
            console.log('Cookie deleted:', name);
        } catch (e) {
            console.error('Error deleting cookie:', e);
        }
    }
}

// Función de inicialización que se ejecuta solo una vez
let cookieBannerInitialized = false;

function initializeCookieBanner() {
    if (!cookieBannerInitialized) {
        cookieBannerInitialized = true;
        new CookieBanner();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCookieBanner);
} else {
    initializeCookieBanner();
}

// También inicializar cuando la página esté completamente cargada (por si acaso)
window.addEventListener('load', initializeCookieBanner);