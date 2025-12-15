/* ==========================================
   RADIO RYS - FUNCIONES JAVASCRIPT
   100.9 FM / 1040 AM
   ========================================== */

// ==========================================
// VARIABLES GLOBALES
// ==========================================
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
const backToTop = document.getElementById('backToTop');
const playBtn = document.getElementById('playBtn');
const radioPlayer = document.getElementById('radioPlayer');
const volumeSlider = document.getElementById('volumeSlider');
const carousel = document.getElementById('carousel');
const carouselPrev = document.getElementById('carouselPrev');
const carouselNext = document.getElementById('carouselNext');
const contactForm = document.getElementById('contactForm');
const formAlert = document.getElementById('formAlert');
const modal = document.getElementById('comunicadoModal');

// ==========================================
// MENÚ RESPONSIVE
// ==========================================
/**
 * Alterna el menú de navegación móvil
 */
function toggleNav() {
    navToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
}

// Evento click en el botón toggle
navToggle.addEventListener('click', toggleNav);

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            toggleNav();
        }

        // Actualizar enlace activo
        document.querySelectorAll('.nav__link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ==========================================
// HEADER SCROLL
// ==========================================
/**
 * Cambia el estilo del header al hacer scroll
 */
function handleScroll() {
    const scrollY = window.scrollY;

    // Header con fondo al hacer scroll
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    // Mostrar/ocultar botón volver arriba
    if (scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Actualizar navegación activa según la sección visible
    updateActiveNavOnScroll();
}

// Evento scroll
window.addEventListener('scroll', handleScroll);

// ==========================================
// NAVEGACIÓN ACTIVA SEGÚN SCROLL
// ==========================================
/**
 * Actualiza el enlace de navegación activo según la sección visible
 */
function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav__link').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

// ==========================================
// BOTÓN VOLVER ARRIBA
// ==========================================
/**
 * Desplaza la página hacia arriba con animación suave
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

backToTop.addEventListener('click', scrollToTop);

// ==========================================
// REPRODUCTOR DE RADIO EN VIVO
// ==========================================
let isPlaying = false;

/**
 * Alterna la reproducción del audio de la radio
 */
function togglePlay() {
    if (isPlaying) {
        radioPlayer.pause();
        playBtn.classList.remove('playing');
        playBtn.querySelector('.play-icon').textContent = '▶';
        pauseVisualizer();
    } else {
        radioPlayer.play().then(() => {
            playBtn.classList.add('playing');
            playBtn.querySelector('.play-icon').textContent = '❚❚';
            animateVisualizer();
        }).catch(error => {
            console.warn('Error al reproducir audio:', error);
            simulateRadioPlay();
        });
    }
    isPlaying = !isPlaying;
}

/**
 * Simula la reproducción de radio cuando no hay stream real disponible
 */
function simulateRadioPlay() {
    playBtn.classList.add('playing');
    playBtn.querySelector('.play-icon').textContent = '❚❚';
    animateVisualizer();
    isPlaying = true;

    // Mostrar mensaje simulado
    showSimulationMessage();
}

/**
 * Muestra un mensaje indicando que es una simulación
 */
function showSimulationMessage() {
    const statusElement = document.querySelector('.en-vivo__status span:last-child');
    if (statusElement) {
        statusElement.textContent = 'Transmisión simulada';
    }
}

// Evento click en botón de reproducción
playBtn.addEventListener('click', togglePlay);

// Control de volumen
volumeSlider.addEventListener('input', (e) => {
    radioPlayer.volume = e.target.value / 100;
});

// Inicializar volumen
radioPlayer.volume = volumeSlider.value / 100;

// ==========================================
// VISUALIZADOR DE AUDIO
// ==========================================
let visualizerInterval = null;

/**
 * Anima las barras del ecualizador
 */
function animateVisualizer() {
    const bars = document.querySelectorAll('.player__visualizer .bar');

    // Limpiar intervalo anterior si existe
    if (visualizerInterval) {
        clearInterval(visualizerInterval);
    }

    visualizerInterval = setInterval(() => {
        bars.forEach(bar => {
            const height = Math.floor(Math.random() * 25) + 5;
            bar.style.height = `${height}px`;
        });
    }, 150);
}

/**
 * Pausa la animación del visualizador
 */
function pauseVisualizer() {
    if (visualizerInterval) {
        clearInterval(visualizerInterval);
        visualizerInterval = null;
    }

    // Resetear barras a altura mínima
    const bars = document.querySelectorAll('.player__visualizer .bar');
    bars.forEach((bar, index) => {
        bar.style.height = '10px';
        bar.style.animationPlayState = 'paused';
    });
}

// ==========================================
// ACTUALIZAR PROGRAMA ACTUAL
// ==========================================
/**
 * Actualiza el nombre del programa según la hora actual
 */
function updateCurrentShow() {
    const currentShow = document.getElementById('currentShow');
    const now = new Date();
    const hour = now.getHours();

    let showName = '';

    if (hour >= 5 && hour < 8) {
        showName = 'Amanecer RYS con Karla Medina';
    } else if (hour >= 8 && hour < 10) {
        showName = 'Noticias al Día con Equipo RYS';
    } else if (hour >= 10 && hour < 12) {
        showName = 'La Hora del Pueblo con Junior Ramos';
    } else if (hour >= 14 && hour < 17) {
        showName = 'Tardes Musicales con Ariana López';
    } else if (hour >= 19 && hour < 21) {
        showName = 'Noche Informativa con Carlos Huamán';
    } else {
        showName = 'Música Variada - Radio RYS';
    }

    if (currentShow) {
        currentShow.textContent = showName;
    }
}

// Actualizar al cargar y cada minuto
updateCurrentShow();
setInterval(updateCurrentShow, 60000);

// ==========================================
// CARRUSEL DE PUBLICIDAD
// ==========================================
let carouselPosition = 0;
const cardWidth = 320; // Ancho de tarjeta + gap

/**
 * Mueve el carrusel hacia la izquierda
 */
function carouselPrevSlide() {
    if (carouselPosition < 0) {
        carouselPosition += cardWidth;
        carousel.style.transform = `translateX(${carouselPosition}px)`;
    }
}

/**
 * Mueve el carrusel hacia la derecha
 */
function carouselNextSlide() {
    const maxScroll = -(carousel.scrollWidth - carousel.parentElement.offsetWidth + 100);
    if (carouselPosition > maxScroll) {
        carouselPosition -= cardWidth;
        carousel.style.transform = `translateX(${carouselPosition}px)`;
    }
}

// Eventos del carrusel
if (carouselPrev && carouselNext) {
    carouselPrev.addEventListener('click', carouselPrevSlide);
    carouselNext.addEventListener('click', carouselNextSlide);
}

/**
 * Auto-desplazamiento del carrusel
 */
let autoCarouselInterval = null;

function startAutoCarousel() {
    autoCarouselInterval = setInterval(() => {
        const maxScroll = -(carousel.scrollWidth - carousel.parentElement.offsetWidth + 100);

        if (carouselPosition <= maxScroll) {
            carouselPosition = 0;
        } else {
            carouselPosition -= cardWidth;
        }

        carousel.style.transform = `translateX(${carouselPosition}px)`;
    }, 4000);
}

function stopAutoCarousel() {
    if (autoCarouselInterval) {
        clearInterval(autoCarouselInterval);
    }
}

// Iniciar auto-carrusel
startAutoCarousel();

// Pausar al hover
carousel.addEventListener('mouseenter', stopAutoCarousel);
carousel.addEventListener('mouseleave', startAutoCarousel);

// Touch support para el carrusel
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoCarousel();
}, { passive: true });

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoCarousel();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (diff > swipeThreshold) {
        carouselNextSlide();
    } else if (diff < -swipeThreshold) {
        carouselPrevSlide();
    }
}

// ==========================================
// REPRODUCCIÓN DE SPOTS PUBLICITARIOS
// ==========================================
/**
 * Simula la reproducción de un spot publicitario
 */
function playSpot(spotId) {
    const spotMessage = {
        'spot1': '🔊 Reproduciendo spot de Restaurante El Sabor...',
        'spot2': '🔊 Reproduciendo spot de Boutique Fashion...',
        'spot3': '🔊 Reproduciendo spot de AutoMotriz Central...',
        'spot4': '🔊 Reproduciendo spot de Farmacia Salud Plus...',
        'spot5': '🔊 Reproduciendo spot de Grupo Empresarial Norte...',
        'spot6': '🔊 Reproduciendo spot de Academia Saber...'
    };

    // Mostrar alerta con animación
    const message = spotMessage[spotId] || '🔊 Reproduciendo spot...';
    showNotification(message);
}

/**
 * Muestra una notificación temporal
 */
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'spot-notification';
    notification.innerHTML = `
        <div class="spot-notification__content">
            <span class="spot-notification__icon">📻</span>
            <p class="spot-notification__message">${message}</p>
        </div>
    `;

    // Agregar estilos inline
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: linear-gradient(135deg, #E63946 0%, #FFD60A 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(230, 57, 70, 0.3);
        z-index: 1000;
        opacity: 0;
        transition: all 0.3s ease;
    `;

    notification.querySelector('.spot-notification__content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    notification.querySelector('.spot-notification__icon').style.cssText = `
        font-size: 1.5rem;
    `;

    notification.querySelector('.spot-notification__message').style.cssText = `
        margin: 0;
        font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event listeners para botones de spots
document.querySelectorAll('.spot-card__btn, .spot-card__play').forEach(btn => {
    btn.addEventListener('click', () => {
        const spotId = btn.getAttribute('data-audio');
        playSpot(spotId);
    });
});

// ==========================================
// FORMULARIO DE CONTACTO
// ==========================================
/**
 * Maneja el envío del formulario de contacto
 */
function handleFormSubmit(e) {
    e.preventDefault();

    // Obtener datos del formulario
    const formData = new FormData(contactForm);
    const data = {
        nombre: formData.get('nombre'),
        correo: formData.get('correo'),
        telefono: formData.get('telefono'),
        mensaje: formData.get('mensaje')
    };

    // Validar campos
    if (!data.nombre || !data.correo || !data.mensaje) {
        showFormError('Por favor, complete todos los campos requeridos.');
        return;
    }

    // Validar email
    if (!validateEmail(data.correo)) {
        showFormError('Por favor, ingrese un correo electrónico válido.');
        return;
    }

    // Simular envío (aquí iría la lógica real de envío)
    console.log('Datos del formulario:', data);

    // Mostrar mensaje de éxito
    showFormSuccess();

    // Limpiar formulario
    contactForm.reset();
}

/**
 * Valida formato de email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Muestra mensaje de éxito del formulario
 */
function showFormSuccess() {
    formAlert.classList.add('active');

    setTimeout(() => {
        formAlert.classList.remove('active');
    }, 4000);
}

/**
 * Muestra mensaje de error del formulario
 */
function showFormError(message) {
    const alertContent = formAlert.querySelector('.form-alert__content');
    const icon = formAlert.querySelector('.form-alert__icon');
    const messageEl = formAlert.querySelector('.form-alert__message');

    // Cambiar estilos para error
    formAlert.style.borderColor = '#EF4444';
    icon.textContent = '❌';
    messageEl.textContent = message;

    formAlert.classList.add('active');

    setTimeout(() => {
        formAlert.classList.remove('active');
        // Restaurar estilos
        formAlert.style.borderColor = '#10B981';
        icon.textContent = '✅';
        messageEl.textContent = '¡Mensaje enviado correctamente!';
    }, 4000);
}

// Evento submit del formulario
contactForm.addEventListener('submit', handleFormSubmit);

// ==========================================
// MODAL DE COMUNICADOS
// ==========================================
const comunicadosData = {
    modal1: {
        title: 'Nueva Cobertura Regional',
        date: '12 de Diciembre, 2024',
        content: `
            <p>Radio RYS se complace en anunciar la expansión de nuestra cobertura a nuevas regiones del país. Este importante logro representa nuestro compromiso continuo con llevar información de calidad a más peruanos.</p>
            <p>A partir de este mes, nuestra señal llegará a las siguientes localidades:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li>Provincias del norte</li>
                <li>Zonas rurales del centro</li>
                <li>Comunidades de la sierra</li>
            </ul>
            <p>Agradecemos a todos nuestros oyentes por su fidelidad y apoyo incondicional durante estos años. ¡Juntos seguimos creciendo!</p>
        `
    },
    modal2: {
        title: 'Aniversario de Radio RYS',
        date: '10 de Diciembre, 2024',
        content: `
            <p>Con inmensa alegría celebramos un año más de transmisión continua. Desde nuestros inicios, nos hemos comprometido a ser la voz de la comunidad, llevando información veraz y entretenimiento de calidad a todos los hogares.</p>
            <p>Durante este aniversario, realizaremos diversas actividades:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li>Programación especial toda la semana</li>
                <li>Sorteos exclusivos para oyentes</li>
                <li>Entrevistas con artistas locales</li>
                <li>Evento de celebración abierto al público</li>
            </ul>
            <p>¡Gracias por ser parte de la familia Radio RYS!</p>
        `
    },
    modal3: {
        title: 'Nuevos Programas 2025',
        date: '8 de Diciembre, 2024',
        content: `
            <p>Preparamos una programación completamente renovada para el próximo año, con nuevos espacios dedicados especialmente a la juventud y la promoción de nuestra cultura local.</p>
            <p>Entre los nuevos programas destacan:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li><strong>Voces Jóvenes:</strong> Espacio para emprendedores y artistas emergentes</li>
                <li><strong>Raíces Culturales:</strong> Programa dedicado a nuestras tradiciones</li>
                <li><strong>Tecnología al Día:</strong> Novedades del mundo digital</li>
                <li><strong>Deportes en Acción:</strong> Cobertura ampliada de eventos deportivos</li>
            </ul>
            <p>¡Mantente atento a nuestra programación!</p>
        `
    },
    modal4: {
        title: 'Convenio con Instituciones Educativas',
        date: '5 de Diciembre, 2024',
        content: `
            <p>Radio RYS ha firmado importantes convenios con instituciones educativas de la región para promover la participación ciudadana y la educación mediática entre los jóvenes.</p>
            <p>Este convenio incluye:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li>Visitas guiadas a nuestras instalaciones</li>
                <li>Talleres de locución y producción radial</li>
                <li>Pasantías para estudiantes de comunicación</li>
                <li>Espacios para proyectos estudiantiles</li>
            </ul>
            <p>Creemos firmemente en el poder de la educación para formar ciudadanos más informados y participativos.</p>
        `
    },
    modal5: {
        title: 'Modernización de Equipos',
        date: '1 de Diciembre, 2024',
        content: `
            <p>Hemos renovado completamente nuestros equipos de transmisión con tecnología de última generación, garantizando la mejor calidad de audio para todos nuestros oyentes.</p>
            <p>Las mejoras incluyen:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li>Nueva consola de audio digital</li>
                <li>Micrófonos de alta fidelidad</li>
                <li>Sistema de transmisión mejorado</li>
                <li>Plataforma de streaming actualizada</li>
            </ul>
            <p>Todo esto se traduce en una experiencia auditiva superior, tanto en FM, AM como en nuestra señal online.</p>
        `
    },
    modal6: {
        title: 'Campaña Solidaria Navideña',
        date: '28 de Noviembre, 2024',
        content: `
            <p>¡Únete a nuestra campaña solidaria navideña! Juntos podemos hacer la diferencia en nuestra comunidad durante estas fiestas.</p>
            <p>Este año recaudamos:</p>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li>Juguetes para niños de bajos recursos</li>
                <li>Alimentos no perecederos</li>
                <li>Ropa de abrigo</li>
                <li>Útiles escolares</li>
            </ul>
            <p>Los puntos de acopio están ubicados en nuestras instalaciones y en locales aliados. La campaña estará activa hasta el 23 de diciembre.</p>
            <p><strong>¡Tu ayuda puede cambiar la vida de una familia!</strong></p>
        `
    }
};

/**
 * Abre el modal con el contenido del comunicado
 */
function openModal(modalId) {
    const data = comunicadosData[modalId];
    if (!data) return;

    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDate').textContent = `📅 ${data.date}`;
    document.getElementById('modalBody').innerHTML = data.content;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal
 */
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners para abrir modal
document.querySelectorAll('.comunicado-card__btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        openModal(modalId);
    });
});

// Cerrar modal con botón X
document.querySelector('.modal__close').addEventListener('click', closeModal);

// Cerrar modal al hacer click en el overlay
document.querySelector('.modal__overlay').addEventListener('click', closeModal);

// Cerrar modal con tecla Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ==========================================
// ANIMACIONES AL SCROLL (INTERSECTION OBSERVER)
// ==========================================
/**
 * Configura animaciones al hacer scroll
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.programa-card, .comunicado-card, .info-card, .spot-card'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// ==========================================
// EFECTO PARALLAX EN HERO
// ==========================================
function setupParallax() {
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });
}

// ==========================================
// SMOOTH SCROLL PARA ENLACES INTERNOS
// ==========================================
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// INICIALIZACIÓN
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎙️ Radio RYS - 100.9 FM / 1040 AM');
    console.log('Sitio web inicializado correctamente');

    // Inicializar animaciones de scroll
    setupScrollAnimations();

    // Inicializar parallax
    setupParallax();

    // Inicializar smooth scroll
    setupSmoothScroll();

    // Verificar estado inicial del scroll
    handleScroll();
});

// ==========================================
// EASTER EGG - KONAMI CODE
// ==========================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            showNotification('🎉 ¡Has desbloqueado el modo secreto de Radio RYS!');
            document.body.style.animation = 'rainbow 2s infinite';
            konamiIndex = 0;

            // Agregar efecto rainbow temporal
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);

            setTimeout(() => {
                document.body.style.animation = '';
                style.remove();
            }, 5000);
        }
    } else {
        konamiIndex = 0;
    }
});
