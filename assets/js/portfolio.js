document.addEventListener('DOMContentLoaded', function () {

    // === DATOS DE LAS GALERÍAS ===
    const portfolioData = {
        retratos: {
            images: [
                { thumb: 'assets/img/thumbs/retratos/retrato-01.jpg', full: 'assets/img/portfolio/retratos/retrato-01-full.jpg', alt: 'Retrato expresivo' },
                { thumb: 'assets/img/thumbs/retratos/retrato-02.jpg', full: 'assets/img/portfolio/retratos/retrato-02-full.jpg', alt: 'Retrato estudio' },
                { thumb: 'assets/img/thumbs/retratos/retrato-03.jpg', full: 'assets/img/portfolio/retratos/retrato-03-full.jpg', alt: 'Retrato natural' },
                { thumb: 'assets/img/thumbs/retratos/retrato-04.jpg', full: 'assets/img/portfolio/retratos/retrato-04-full.jpg', alt: 'Retrato urbano' },
                { thumb: 'assets/img/thumbs/retratos/retrato-05.jpg', full: 'assets/img/portfolio/retratos/retrato-05-full.jpg', alt: 'Retrato creativo' },
                { thumb: 'assets/img/thumbs/retratos/retrato-06.jpg', full: 'assets/img/portfolio/retratos/retrato-06-full.jpg', alt: 'Retrato profesional' },
                { thumb: 'assets/img/thumbs/retratos/retrato-07.jpg', full: 'assets/img/portfolio/retratos/retrato-07-full.jpg', alt: 'Retrato artístico' },
                { thumb: 'assets/img/thumbs/retratos/retrato-08.jpg', full: 'assets/img/portfolio/retratos/retrato-08-full.jpg', alt: 'Retrato emocional' },
                { thumb: 'assets/img/thumbs/retratos/retrato-09.jpg', full: 'assets/img/portfolio/retratos/retrato-09-full.jpg', alt: 'Retrato conceptual' }
            ]
        },
        producto: {
            images: [
                { thumb: 'assets/img/thumbs/producto/cerveza-01.jpg', full: 'assets/img/portfolio/producto/cerveza-01-full.jpg', alt: 'Cerveza Artesanal' },
                { thumb: 'assets/img/thumbs/producto/joyas-01.jpg', full: 'assets/img/portfolio/producto/joyas-01-full.jpg', alt: 'Colección de Joyas' },
                { thumb: 'assets/img/thumbs/producto/reloj-01.jpg', full: 'assets/img/portfolio/producto/reloj-01-full.jpg', alt: 'Reloj de Lujo' },
                { thumb: 'assets/img/thumbs/producto/zapatos-01.jpg', full: 'assets/img/portfolio/producto/zapatos-01-full.jpg', alt: 'Zapatos de Diseño' },
                { thumb: 'assets/img/thumbs/producto/gafas-01.jpg', full: 'assets/img/portfolio/producto/gafas-01-full.jpg', alt: 'Gafas de Sol' },
                { thumb: 'assets/img/thumbs/producto/bolso-01.jpg', full: 'assets/img/portfolio/producto/bolso-01-full.jpg', alt: 'Bolso de Cuero' },
                { thumb: 'assets/img/thumbs/producto/reloj-02.jpg', full: 'assets/img/portfolio/producto/reloj-02-full.jpg', alt: 'Reloj Vintage' },
                { thumb: 'assets/img/thumbs/producto/camisa-01.jpg', full: 'assets/img/portfolio/producto/camisa-01-full.jpg', alt: 'Camisa Elegante' },
                { thumb: 'assets/img/thumbs/producto/aneau-01.jpg', full: 'assets/img/portfolio/producto/aneau-01-full.jpg', alt: 'Perfume de Lujo' }
            ]
        },
        sesiones: {
            maria: {
                title: 'Sesión Corporativa - María',
                description: 'Retratos profesionales para equipo de marketing',
                details: 'Duración: 2 horas<br>Lugar: Estudio central<br>Entrega: 15 imágenes editadas',
                images: [
                    'assets/img/portfolio/sesiones/sesion-maria-01.jpg',
                    'assets/img/portfolio/sesiones/sesion-maria-02.jpg',
                    'assets/img/portfolio/sesiones/sesion-maria-03.jpg',
                    'assets/img/portfolio/sesiones/sesion-maria-04.jpg',
                    'assets/img/portfolio/sesiones/sesion-maria-05.jpg'
                ]
            },
            juan: {
                title: 'Sesión Personal - Juan',
                description: 'Retratos artísticos en estudio',
                details: 'Duración: 3 horas<br>Lugar: Estudio con luz natural<br>Entrega: 20 imágenes editadas',
                images: [
                    'assets/img/portfolio/sesiones/sesion-juan-01.jpg',
                    'assets/img/portfolio/sesiones/sesion-juan-02.jpg',
                    'assets/img/portfolio/sesiones/sesion-juan-03.jpg',
                    'assets/img/portfolio/sesiones/sesion-juan-04.jpg'
                ]
            },
            startup: {
                title: 'Sesión Startup - TechCorp',
                description: 'Retratos de equipo para nueva empresa tecnológica',
                details: 'Duración: 4 horas<br>Lugar: Oficinas cliente<br>Entrega: 25 imágenes editadas',
                images: [
                    'assets/img/portfolio/sesiones/sesion-startup-01.jpg',
                    'assets/img/portfolio/sesiones/sesion-startup-02.jpg',
                    'assets/img/portfolio/sesiones/sesion-startup-03.jpg',
                    'assets/img/portfolio/sesiones/sesion-startup-04.jpg',
                    'assets/img/portfolio/sesiones/sesion-startup-05.jpg',
                    'assets/img/portfolio/sesiones/sesion-startup-06.jpg'
                ]
            }
        }
    };

    // === VARIABLES DE ESTADO ===
    const galleryButtons = document.querySelectorAll('.gallery-btn');
    const galleries = document.querySelectorAll('.gallery');
    const modalSimple = document.getElementById('modal-simple');
    const modalComplex = document.getElementById('modal-complex');

    let currentGallery = 'retratos';
    let currentImageIndex = 0;       // índice en portfolioData[currentGallery].images
    let currentVisualPos = 0;        // posición visual (fila→columna)
    let currentSession = null;
    let currentSessionImageIndex = 0;

    // Mapas de orden visual -> índice de datos por galería
    const visualMap = {
        retratos: [],
        producto: []
    };

    // === INICIALIZACIÓN GENERAL ===
    function init() {
        setupGalleryNavigation();
        setupModals();
        setupProjectPages();
        setupKeyboardNavigation();
        setupURLHandling();
        setupMasonry();
        setupProjectGalleryModals();

        // Recalcular orden visual cuando el layout cambie o se carguen imágenes
        refreshVisualOrderDeferred();
        window.addEventListener('load', refreshVisualOrderDeferred);
        window.addEventListener('resize', refreshVisualOrderDeferred);
    }

    // === UTILIDADES DE NORMALIZACIÓN Y MAPEO ===
    function baseKeyFromPath(path) {
        if (!path) return '';
        // quita protocolo/origen y query/hash
        const clean = path.replace(/^https?:\/\/[^/]+/i, '').split('?')[0].split('#')[0];
        const file = clean.split('/').pop() || '';
        // elimina extensión y sufijo -full
        const noExt = file.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
        return noExt.replace(/-full$/i, '').toLowerCase();
    }

    function buildKeyIndexMap(images) {
        const map = new Map();
        images.forEach((img, idx) => {
            const kThumb = baseKeyFromPath(img.thumb);
            const kFull = baseKeyFromPath(img.full);
            const kSrc  = baseKeyFromPath(img.src);
            [kThumb, kFull, kSrc].forEach(k => {
                if (k && !map.has(k)) map.set(k, idx);
            });
        });
        return map;
    }

    function stampAndMap(containerSelector, galleryKey) {
        const container = document.querySelector(containerSelector);
        if (!container) return;

        const items = Array.from(container.querySelectorAll('.masonry-item'));
        if (!items.length) { visualMap[galleryKey] = []; return; }

        // Ordena por fila (top) y después por columna (left)
        const sorted = items
            .map(el => ({ el, rect: el.getBoundingClientRect() }))
            .sort((a, b) => {
                const tol = 5;
                if (Math.abs(a.rect.top - b.rect.top) > tol) return a.rect.top - b.rect.top;
                return a.rect.left - b.rect.left;
            })
            .map(({ el }) => el);

        // Construye mapa baseKey -> índice de datos
        const dataImages = portfolioData[galleryKey].images;
        const keyToIndex = buildKeyIndexMap(dataImages);

        // Para cada item visual, intenta emparejar con el índice del data array
        const mapped = [];
        sorted.forEach((el, visualPos) => {
            el.dataset.visualPos = String(visualPos);
            const img = el.querySelector('img');
            let key = '';
            if (img) {
                // intenta primero por data-full si existiera, sino por src
                key = baseKeyFromPath(img.getAttribute('data-full')) || baseKeyFromPath(img.getAttribute('src'));
            }
            let dataIdx = keyToIndex.get(key);
            if (dataIdx === undefined) {
                // último recurso: intenta leer un data-index (si lo tienes en tu HTML)
                const fallback = parseInt(el.getAttribute('data-index'), 10);
                dataIdx = Number.isInteger(fallback) ? fallback : null;
            }
            // Si no se encuentra, no rompemos: lo omitimos de la navegación
            if (dataIdx != null) mapped.push(dataIdx);
        });

        visualMap[galleryKey] = mapped;
    }

    function refreshVisualOrderDeferred() {
        // Defer para esperar reflow y tamaños finales
        requestAnimationFrame(() => {
            stampAndMap('#gallery-retratos', 'retratos');
            stampAndMap('#gallery-producto', 'producto');
        });
    }

    // === NAVEGACIÓN ENTRE GALERÍAS ===
    function setupGalleryNavigation() {
        galleryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const galleryId = button.getAttribute('data-gallery');
                switchGallery(galleryId);
                updateURL(galleryId);
            });
        });
    }

    function switchGallery(galleryId) {
        galleryButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-gallery') === galleryId) btn.classList.add('active');
        });
        galleries.forEach(gallery => gallery.classList.remove('active'));
        const selectedGallery = document.getElementById(`gallery-${galleryId}`);
        if (selectedGallery) selectedGallery.classList.add('active');
        document.querySelectorAll('.project-page').forEach(page => page.classList.remove('active'));
        currentGallery = galleryId;
        currentVisualPos = 0;
        if (galleryId === 'retratos' || galleryId === 'producto') {
            setTimeout(() => { setupMasonry(); refreshVisualOrderDeferred(); }, 100);
        }
    }

    // === MODALES ===
    function setupModals() {
        // Simple
        const modalClose = modalSimple.querySelector('.modal-close-nav');
        const modalPrev = modalSimple.querySelector('.modal-prev');
        const modalNext = modalSimple.querySelector('.modal-next');
        modalClose.addEventListener('click', closeModalSimple);
        modalSimple.addEventListener('click', e => { if (e.target === modalSimple) closeModalSimple(); });
        modalPrev.addEventListener('click', () => navigateModalSimple(-1));
        modalNext.addEventListener('click', () => navigateModalSimple(1));

        // Complejo
        const complexClose = modalComplex.querySelector('.modal-close-nav');
        const complexPrev = modalComplex.querySelector('.modal-prev');
        const complexNext = modalComplex.querySelector('.modal-next');
        complexClose.addEventListener('click', closeModalComplex);
        modalComplex.addEventListener('click', e => { if (e.target === modalComplex) closeModalComplex(); });
        complexPrev.addEventListener('click', () => navigateModalComplex(-1));
        complexNext.addEventListener('click', () => navigateModalComplex(1));

        setupImageClicks();
        setupSessionButtons();
    }

    // === CLICS EN MINIATURAS (DELEGACIÓN + ORDEN VISUAL ROBUSTO) ===
    function setupImageClicks() {
        const retratosContainer = document.querySelector('#gallery-retratos');
        const productoContainer = document.querySelector('#gallery-producto');

        function onThumbClick(e, galleryKey) {
            const item = e.target.closest('.masonry-item');
            if (!item) return;

            // si no hay mapeo, intenta recalcular
            if (!visualMap[galleryKey] || visualMap[galleryKey].length === 0) {
                refreshVisualOrderDeferred();
            }

            // posición visual sellada
            let vPos = item.dataset.visualPos != null ? parseInt(item.dataset.visualPos, 10) : NaN;
            if (Number.isNaN(vPos)) {
                // fallback: vuelve a calcular y reintenta
                refreshVisualOrderDeferred();
                vPos = item.dataset.visualPos != null ? parseInt(item.dataset.visualPos, 10) : 0;
            }

            const mapped = visualMap[galleryKey];
            if (!mapped || !mapped.length) return;

            // limita vPos al rango
            vPos = Math.max(0, Math.min(vPos, mapped.length - 1));

            currentGallery = galleryKey;
            currentVisualPos = vPos;
            currentImageIndex = mapped[vPos]; // índice del array de datos correspondiente a esa miniatura

            openModalSimple(galleryKey);
        }

        if (retratosContainer) retratosContainer.addEventListener('click', e => onThumbClick(e, 'retratos'));
        if (productoContainer) productoContainer.addEventListener('click', e => onThumbClick(e, 'producto'));
    }

    // === ABRIR Y NAVEGAR MODAL SIMPLE USANDO EL MAPEO VISUAL ===
    function openModalSimple(galleryType) {
        const dataImages = portfolioData[galleryType].images;
        const mapped = visualMap[galleryType];

        // si hay mapeo visual válido, usamos currentVisualPos -> índice de datos
        let dataIndex;
        if (mapped && mapped.length) {
            currentVisualPos = Math.max(0, Math.min(currentVisualPos, mapped.length - 1));
            dataIndex = mapped[currentVisualPos];
        } else {
            // fallback: usa currentImageIndex (orden del array)
            dataIndex = Math.max(0, Math.min(currentImageIndex, dataImages.length - 1));
        }

        const img = dataImages[dataIndex];
        if (!img) return;

        const modalImage = modalSimple.querySelector('.modal-image');
        modalImage.src = img.full || img.src || img.thumb;
        modalImage.alt = img.alt || '';
        modalSimple.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function navigateModalSimple(direction) {
        const mapped = visualMap[currentGallery];
        const dataImages = portfolioData[currentGallery].images;

        if (mapped && mapped.length) {
            currentVisualPos = (currentVisualPos + direction + mapped.length) % mapped.length;
            currentImageIndex = mapped[currentVisualPos];
        } else {
            // sin mapeo, recurre al orden del array de datos
            currentImageIndex = (currentImageIndex + direction + dataImages.length) % dataImages.length;
        }

        const modalImage = modalSimple.querySelector('.modal-image');
        const current = dataImages[currentImageIndex];
        if (!current) return;
        modalImage.src = current.full || current.src || current.thumb;
        modalImage.alt = current.alt || '';
    }

    // === MODAL COMPLEJO (SESIONES) ===
    function setupSessionButtons() {
        const sessionButtons = document.querySelectorAll('.session-btn');
        sessionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const sessionId = button.getAttribute('data-session');
                if (sessionId && portfolioData.sesiones[sessionId]) openModalComplex(sessionId);
            });
        });
    }

    function openModalComplex(sessionId) {
        const session = portfolioData.sesiones[sessionId];
        if (!session) return;
        currentSession = sessionId;
        currentSessionImageIndex = 0;

        const mainImage = modalComplex.querySelector('.modal-main-image');
        const title = modalComplex.querySelector('.modal-session-title');
        const description = modalComplex.querySelector('.modal-session-description');
        const details = modalComplex.querySelector('.modal-session-details');
        const thumbnailsContainer = modalComplex.querySelector('.thumbnails-container');

        mainImage.src = session.images[0];
        title.textContent = session.title;
        description.textContent = session.description;
        details.innerHTML = session.details;

        thumbnailsContainer.innerHTML = '';
        session.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${image}" alt="Miniatura ${index + 1}">`;
            thumbnail.addEventListener('click', () => {
                currentSessionImageIndex = index;
                updateModalComplex();
            });
            thumbnailsContainer.appendChild(thumbnail);
        });

        modalComplex.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function navigateModalComplex(direction) {
        const session = portfolioData.sesiones[currentSession];
        if (!session) return;
        currentSessionImageIndex = (currentSessionImageIndex + direction + session.images.length) % session.images.length;
        updateModalComplex();
    }

    function updateModalComplex() {
        const session = portfolioData.sesiones[currentSession];
        if (!session) return;
        const mainImage = modalComplex.querySelector('.modal-main-image');
        const thumbnails = modalComplex.querySelectorAll('.thumbnail');
        mainImage.src = session.images[currentSessionImageIndex];
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentSessionImageIndex);
        });
    }

    function closeModalSimple() {
        modalSimple.classList.remove('active');
        document.body.style.overflow = '';
    }
    function closeModalComplex() {
        modalComplex.classList.remove('active');
        document.body.style.overflow = '';
    }

    // === TECLADO ===
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (modalSimple.classList.contains('active')) {
                if (e.key === 'Escape') closeModalSimple();
                if (e.key === 'ArrowLeft') navigateModalSimple(-1);
                if (e.key === 'ArrowRight') navigateModalSimple(1);
            }
            if (modalComplex.classList.contains('active')) {
                if (e.key === 'Escape') closeModalComplex();
                if (e.key === 'ArrowLeft') navigateModalComplex(-1);
                if (e.key === 'ArrowRight') navigateModalComplex(1);
            }
        });
    }

    // === URL ===
    function setupURLHandling() {
        const hash = window.location.hash.substring(1);
        if (hash && ['retratos', 'artistico', 'producto', 'sesiones'].includes(hash)) switchGallery(hash);
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && ['retratos', 'artistico', 'producto', 'sesiones'].includes(hash)) switchGallery(hash);
        });
    }

    function updateURL(galleryId) {
        history.pushState(null, null, `#${galleryId}`);
    }

    // === MASONRY ===
    function setupMasonry() {
        const masonryItems = document.querySelectorAll('.masonry-item img');
        masonryItems.forEach(img => {
            img.addEventListener('load', () => {
                const grid = img.closest('.masonry-grid');
                if (grid) {
                    grid.style.display = 'none';
                    grid.offsetHeight; // reflow
                    grid.style.display = 'block';
                }
                refreshVisualOrderDeferred();
            });
        });
    }

    // === PROYECTOS (placeholders si no los usas) ===
    function setupProjectPages() {}
    function setupProjectGalleryModals() {}

    // === INICIALIZAR ===
    init();
});

// === VER PROYECTO (GALERÍA ARTÍSTICA) ===
document.querySelectorAll('#gallery-artistico .view-project').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();

    // Buscar el contenedor del proyecto (el padre más cercano con la clase "project")
    const project = btn.closest('.project');
    if (project) {
      // Destacar el proyecto visualmente (puedes ajustar esta clase en tu CSS)
      project.classList.add('active-project');

      // Hacer scroll hasta el proyecto
      project.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Si quieres abrir un modal o galería, este es el punto para hacerlo:
      // openProjectModal(project.dataset.projectId);
    }
  });
});

