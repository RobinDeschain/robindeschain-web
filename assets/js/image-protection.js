document.addEventListener('DOMContentLoaded', function() {
    class ImageProtection {
        constructor() {
            this.init();
        }

        init() {
            this.disableRightClick();
            this.disableImageDrag();
            this.preventPrint();
            this.addWatermark();
            this.disableDevTools();
            this.disableKeyboardShortcuts();
            this.monitorImageLoading();
        }

        // Deshabilitar clic derecho en imágenes
        disableRightClick() {
            document.addEventListener('contextmenu', function(e) {
                // Verificar si el click es sobre una imagen
                const target = e.target;
                if (target.tagName === 'IMG' || target.closest('img')) {
                    e.preventDefault();
                    this.showProtectionMessage('La protección de imágenes está activada');
                    return false;
                }
            }.bind(this));
        }

        // Bloquear arrastre de imágenes
        disableImageDrag() {
            document.addEventListener('dragstart', function(e) {
                if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                    return false;
                }
            });

            // Bloquear drop de imágenes
            document.addEventListener('drop', function(e) {
                e.preventDefault();
                return false;
            });
        }

        // Prevenir impresión de la página
        preventPrint() {
            // Deshabilitar Ctrl+P
            document.addEventListener('keydown', function(e) {
                if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                    e.preventDefault();
                    this.showProtectionMessage('La impresión está deshabilitada');
                    return false;
                }
            }.bind(this));

            // Interceptar beforeprint
            window.addEventListener('beforeprint', function(e) {
                e.preventDefault();
                this.showProtectionMessage('La impresión está deshabilitada');
                return false;
            }.bind(this));
        }

        // Añadir marca de agua dinámica
        addWatermark() {
            const images = document.querySelectorAll('img');
            
            images.forEach(img => {
                // Esperar a que la imagen se cargue
                img.addEventListener('load', function() {
                    this.addWatermarkToImage(img);
                }.bind(this));
                
                // Si la imagen ya está cargada
                if (img.complete) {
                    this.addWatermarkToImage(img);
                }
            }.bind(this));
        }

        addWatermarkToImage(img) {
            // Crear canvas para la marca de agua
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Obtener dimensiones de la imagen
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            
            // Dibujar la imagen original
            ctx.drawImage(img, 0, 0);
            
            // Añadir marca de agua
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Marca de agua en diagonal
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-45 * Math.PI / 180);
            ctx.fillText('© Robin Deschain', 0, 0);
            ctx.restore();
            
            // Reemplazar la imagen original con la marca de agua
            img.src = canvas.toDataURL('image/jpeg');
        }

        // Deshabilitar herramientas de desarrollo
        disableDevTools() {
            // Detectar si DevTools está abierto
            const devtools = /./;
            let devtoolsOpen = false;

            setInterval(function() {
                if (devtools.open) {
                    devtoolsOpen = true;
                    this.showProtectionMessage('Las herramientas de desarrollo están deshabilitadas');
                }
            }.bind(this), 1000);

            // Intentar bloquear atajos de DevTools
            document.addEventListener('keydown', function(e) {
                // F12, Ctrl+Shift+I, Ctrl+Shift+J
                if (e.keyCode === 123 || 
                    (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74))) {
                    e.preventDefault();
                    this.showProtectionMessage('Las herramientas de desarrollo están deshabilitadas');
                    return false;
                }
            }.bind(this));
        }

        // Deshabilitar atajos de teclado para capturas
        disableKeyboardShortcuts() {
            document.addEventListener('keydown', function(e) {
                // Ctrl+S (Guardar)
                if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
                    e.preventDefault();
                    this.showProtectionMessage('Guardar imagen está deshabilitado');
                    return false;
                }
                
                // Ctrl+Shift+S (Guardar como)
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 83) {
                    e.preventDefault();
                    this.showProtectionMessage('Guardar imagen como está deshabilitado');
                    return false;
                }
                
                // Windows + Shift + S (Captura en Windows)
                if (e.metaKey && e.shiftKey && e.keyCode === 83) {
                    e.preventDefault();
                    this.showProtectionMessage('La captura de pantalla está deshabilitada');
                    return false;
                }
            }.bind(this));
        }

        // Monitorear carga de imágenes y aplicar protección
        monitorImageLoading() {
            // Observer para nuevas imágenes añadidas dinámicamente
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.tagName === 'IMG') {
                            this.addWatermarkToImage(node);
                        }
                    }.bind(this));
                }.bind(this));
            }.bind(this));

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        // Mostrar mensaje de protección
        showProtectionMessage(message) {
            // Crear elemento de mensaje si no existe
            let protectionMsg = document.getElementById('protection-message');
            
            if (!protectionMsg) {
                protectionMsg = document.createElement('div');
                protectionMsg.id = 'protection-message';
                protectionMsg.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    font-family: 'Montserrat', sans-serif;
                    font-size: 14px;
                    z-index: 9999;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: translateY(-20px);
                `;
                
                document.body.appendChild(protectionMsg);
            }

            // Actualizar mensaje
            protectionMsg.textContent = message;
            
            // Mostrar mensaje
            protectionMsg.style.opacity = '1';
            protectionMsg.style.transform = 'translateY(0)';
            
            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                protectionMsg.style.opacity = '0';
                protectionMsg.style.transform = 'translateY(-20px)';
            }, 3000);
        }

        // Método público para añadir protección a imágenes específicas
        static protectImage(imageElement) {
            const protection = new ImageProtection();
            protection.addWatermarkToImage(imageElement);
        }
    }

    // Inicializar protección de imágenes
    const imageProtection = new ImageProtection();

    // Hacer la clase disponible globalmente
    window.ImageProtection = ImageProtection;
});