import { norm, validateEmail } from './utils.js';
import { PROPIEDADES, cardTemplate, detalleTemplate, renderPropiedadesDestacadas } from './propiedades.js';
// ============================
// UTILIDADES
// ============================


const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const showSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return null;

    document.querySelectorAll('main section').forEach(sec => sec.classList.remove('active'));
    target.classList.add('active');
    return target;
};

const ensureRelatedCarouselInit = () => {
    if (typeof initRelatedCarousel === 'function') {
        initRelatedCarousel();
    }
};

// ============================
// DETALLES DE PROPIEDADES + MAPA
// ============================
document.addEventListener("DOMContentLoaded", () => {
    // Toggle detalles con inicialización de mapas
    document.querySelectorAll('.toggle-details').forEach(btn => {
        btn.addEventListener('click', () => {
            const details = btn.closest('.property').querySelector('.property__details');
            const isHidden = details.classList.contains('hidden');

            details.classList.toggle('hidden');
            btn.textContent = isHidden ? "Menos detalles" : "Más detalles";

            // Inicializar mapa si se está mostrando y no existe
            if (isHidden && details.querySelector('#property-map')) {
                initPropertyMap(details.querySelector('#property-map'));
            }
        });
    });

});

// ============================
// MANEJO DE PROPIEDADES RELACIONADAS Y NAVEGACIÓN A DETALLES
// ============================

// Event listener para navegación desde propiedades relacionadas
document.addEventListener("click", (e) => {
    const relatedCard = e.target.closest(".related-card");
    if (!relatedCard) return;

    e.preventDefault();
    const id = relatedCard.dataset.id;
    if (typeof PROPIEDADES === 'undefined') return;

    const propiedad = PROPIEDADES.find(p => p.id === id);
    if (!propiedad) return;

    mostrarDetalle(propiedad);
});

// Función para mostrar el detalle de una propiedad
function mostrarDetalle(propiedad) {
    const detalle = document.getElementById("detalle-contenido");
    if (!detalle || typeof detalleTemplate === 'undefined') return;

    detalle.innerHTML = detalleTemplate(propiedad);

    showSection("detalle-propiedad");

    const slider = document.querySelector("#detalle-propiedad .slider");
    if (slider) initSlider(slider);
    initLightbox(detalle);

    setTimeout(ensureRelatedCarouselInit, 100);


    if (propiedad.coords && typeof L !== 'undefined') {
        setTimeout(() => {
            const mapEl = document.getElementById("detalle-mapa");
            if (mapEl && !mapEl._leaflet_id) {
                const map = L.map(mapEl, {
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    boxZoom: false,
                    keyboard: false
                }).setView(propiedad.coords, 16);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
                L.marker(propiedad.coords).addTo(map);
            }
        }, 200);
    }

    scrollToTop();
}

// Event listener para botón "Volver"
document.addEventListener("click", (e) => {
    if (e.target.id === "volver-listado") {
        showSection('compra');
        scrollToTop();
    }
});

// ============================
// NAVEGACIÓN Y MENÚ
// ============================

/**
 * Menú hamburguesa responsive
 */
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
});

/**
 * Navegación por secciones de página
 */
document.addEventListener("DOMContentLoaded", () => {
    const menuLinks = document.querySelectorAll('.nav__menu a');
    const sections = document.querySelectorAll('main section');
    const menu = document.querySelector('.nav__menu');

    // Mostrar primera sección al cargar
    sections.forEach((sec, i) => {
        sec.classList.toggle('active', i === 0);
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = showSection(targetId);
            if (!targetSection) return;

            // Cerrar menú responsive
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }

            // Scroll al inicio con offset para evitar superposición con header
            scrollToTop();
        });
    });
});

// ============================
// CARRUSELES
// ============================

/**
 * Carrusel principal de la página de inicio
 */
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel__track");
    const slides = document.querySelectorAll(".carousel__slide");
    const indicators = document.querySelectorAll(".carousel__indicators span");
    const prevBtn = document.querySelector(".carousel__btn.prev");
    const nextBtn = document.querySelector(".carousel__btn.next");

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const slideCount = slides.length;

    const showSlide = (index) => {
        track.style.transform = `translateX(-${index * 100}%)`;
        indicators.forEach((dot, i) =>
            dot.classList.toggle("active", i === index)
        );
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % slideCount;
        showSlide(currentIndex);
    };

    const prevSlide = () => {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        showSlide(currentIndex);
    };

    // Eventos de botones
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    // Indicadores clickeables
    indicators.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            currentIndex = i;
            showSlide(currentIndex);
        });
    });

    // Auto-slide cada 4 segundos
    setInterval(nextSlide, 4000);
    showSlide(0);
});

/**
 * Carruseles individuales de propiedades
 */
export function initSlider(slider) {
    const slides = slider.querySelector(".slides");
    const imgs = slides ? slides.querySelectorAll("img") : [];
    const prev = slider.querySelector(".prev");
    const next = slider.querySelector(".next");
    let idx = 0;

    if (imgs.length === 0) return;

    const show = (i) => {
        idx = (i + imgs.length) % imgs.length;
        if (slides) {
            slides.style.transform = `translateX(-${idx * 100}%)`;
        }
    };

    prev?.addEventListener("click", (e) => {
        e.stopPropagation();
        show(idx - 1);
    });
    next?.addEventListener("click", (e) => {
        e.stopPropagation();
        show(idx + 1);
    });

    // Configurar el contenedor de slides sin modificar el width
    if (slides) {
        slides.style.display = 'flex';
        slides.style.transition = 'transform 0.3s ease';
        imgs.forEach(img => {
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.flexShrink = '0';
        });
    }

    show(0);
}

/**
 * Carrusel de propiedades relacionadas
 */
export function initRelatedCarousel() {
    const track = document.querySelector(".related-track");
    const cards = document.querySelectorAll(".related-card");
    const prevBtn = document.querySelector(".related-prev");
    const nextBtn = document.querySelector(".related-next");

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const cardWidth = 280;
    const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
    const maxIndex = Math.max(0, cards.length - visibleCards);

    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
    };

    prevBtn?.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    nextBtn?.addEventListener("click", () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    updateCarousel();
}

// ============================
// INICIALIZACIÓN DE MAPAS
// ============================

/**
 * Mapa individual por propiedad con offset para evitar superposición
 */
const initPropertyMap = (mapContainer) => {
    if (!mapContainer || mapContainer._leaflet_id) return;

    const map = L.map(mapContainer, {
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false
    }).setView([-33.4378, -70.6505], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    const polygon = L.polygon([
        [-33.4376, -70.6510],
        [-33.4376, -70.6500],
        [-33.4380, -70.6500],
        [-33.4380, -70.6510]
    ]).addTo(map).bindPopup("Área en venta");

    map.fitBounds(polygon.getBounds());
};

// ============================
// LIGHTBOX PARA IMÁGENES
// ============================

let lightboxEl;
let lightboxImg;
let lightboxPrev;
let lightboxNext;
let lightboxImages = [];
let lightboxIndex = 0;

const updateLightboxImage = () => {
    if (!lightboxImages.length || !lightboxImg) return;
    const current = lightboxImages[lightboxIndex];
    lightboxImg.src = current?.src || "";
    lightboxImg.alt = current?.alt || "";
};

const ensureLightbox = () => {
    if (lightboxEl) return;

    lightboxEl = document.createElement('div');
    lightboxEl.classList.add('lightbox');

    lightboxImg = document.createElement('img');
    lightboxPrev = document.createElement('button');
    lightboxNext = document.createElement('button');

    lightboxPrev.className = 'lb-btn lb-prev';
    lightboxPrev.textContent = '‹';
    lightboxNext.className = 'lb-btn lb-next';
    lightboxNext.textContent = '›';


    lightboxEl.append(lightboxImg, lightboxPrev, lightboxNext);
    document.body.appendChild(lightboxEl);

    const cycle = (step) => {
        if (!lightboxImages.length) return;
        lightboxIndex = (lightboxIndex + step + lightboxImages.length) % lightboxImages.length;
        updateLightboxImage();
    };

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        cycle(-1);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        cycle(1);
    });

    lightboxEl.addEventListener('click', () => {
        lightboxEl.classList.remove('show');
        lightboxImages = [];
    });
};


export function initLightbox(container = document) {
    ensureLightbox();

    const scope = container instanceof Element ? container : document;
    const images = scope.querySelectorAll?.('.property__media img') || [];

    images.forEach((img) => {
        if (img.dataset.lightboxBound === 'true') return;

        img.dataset.lightboxBound = 'true';
        img.style.cursor = 'zoom-in';

        img.addEventListener('click', () => {
            const slider = img.closest('.slider');
            const slides = slider?.querySelectorAll('.slides img');
            if (!slides || !slides.length) return;

            lightboxImages = Array.from(slides);
            lightboxIndex = lightboxImages.indexOf(img);
            if (lightboxIndex < 0) lightboxIndex = 0;

            updateLightboxImage();
            lightboxEl?.classList.add('show');
        });
    });
}

if (typeof window !== 'undefined') {
    window.initLightbox = initLightbox;
}


// ============================
// FORMULARIOS
// ============================

/**
 * Validación del formulario de contacto
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#contact-form");
    if (!form) return;

    const nombreInput = form.querySelector("#nombre");
    const emailInput = form.querySelector("#email");
    const mensajeInput = form.querySelector("#mensaje");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = nombreInput?.value.trim() ?? "";
        const email = emailInput?.value.trim() ?? "";
        const mensaje = mensajeInput?.value.trim() ?? "";

        // Validaciones
        if (nombre.length < 3) {
            alert("El nombre debe tener al menos 3 caracteres.");
            return;
        }

        if (!validateEmail(email)) {
            alert("Por favor, ingresa un correo electrónico válido.");
            return;
        }

        if (mensaje.length < 10) {
            alert("El mensaje debe tener al menos 10 caracteres.");
            return;
        }

        alert("Formulario enviado con éxito. ¡Nos pondremos en contacto contigo pronto!");
        form.reset();
    });
});

/**
 * Renderizar propiedades en el listado
 */
export function renderPropiedades(lista) {
    const cardsCompra = document.getElementById("cards-compra");
    if (!cardsCompra) return;

    if (!lista.length) {
        cardsCompra.innerHTML =
            `<p style="padding:1rem;text-align:center;color:#6b7280">
                No encontramos resultados. Ajusta los filtros y vuelve a intentar.
            </p>`;
        return;
    }

    cardsCompra.innerHTML = lista.map(cardTemplate).join("");
    cardsCompra.querySelectorAll(".slider").forEach(initSlider);
    initLightbox(cardsCompra);
}

// ============================
// NAVEGACIÓN ENTRE VISTAS
// ============================

/**
 * CTA para ir a sección de contacto
 */
document.addEventListener("DOMContentLoaded", () => {
    const ctaButton = document.querySelector('.cta-section .btn-primary');

    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();

            const targetSection = showSection('contacto');
            const menu = document.querySelector('.nav__menu');

            if (targetSection && menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
            if (!targetSection) return;

            scrollToTop();

            setTimeout(() => {
                const firstInput = targetSection.querySelector('#nombre');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 500);
        });
    }
});




/**
 * Navegación a detalles desde tarjetas principales - CORREGIDO
 */
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".toggle-details");
    if (!btn) return;

    e.preventDefault();

    const propertyEl = btn.closest(".property");
    const id = propertyEl?.dataset.id;
    if (!id || typeof PROPIEDADES === 'undefined') return;

    const propiedad = PROPIEDADES.find(p => p.id === id);
    if (!propiedad) return;

    mostrarDetalle(propiedad);
});

// ============================
// FUNCIONES UTILITARIAS
// ============================

/**
 * Gestión de favoritos
 */
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('property__favorite')) {
        e.target.classList.toggle('active');
        console.log('Propiedad agregada/removida de favoritos');
    }
});

// ============================
// INICIALIZACIÓN Y FILTROS
// ============================

/**
 * Inicialización del sistema de filtros y búsqueda
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#compra form.search");
    const q = $("#q", form);
    const operacion = $("select[name='operacion']", form);
    const tipo = $("select[name='tipo']", form);

    if (!form) return;

    const aplicarFiltros = (e) => {
        e?.preventDefault();
        const qv = norm(q?.value || "");
        const ov = operacion?.value || "";
        const tv = tipo?.value || "";

        const resultados = PROPIEDADES.filter((p) => {
            const matchQ =
                !qv ||
                norm(`${p.titulo} ${p.comuna} ${p.tipo} ${p.id}`).includes(qv);
            const matchOp = !ov || p.operacion === ov;
            const matchTipo = !tv || p.tipo === tv;
            return matchQ && matchOp && matchTipo;
        });

        renderPropiedades(resultados);
    };

    form.addEventListener("submit", aplicarFiltros);
    [q, operacion, tipo].forEach((el) => el?.addEventListener("change", aplicarFiltros));

    // Render inicial
    renderPropiedades(PROPIEDADES);
});

// ============================
// INICIALIZACIÓN PROPIEDADES DESTACADAS
// ============================

/**
 * Inicialización de propiedades destacadas en la sección inicio
 */
document.addEventListener("DOMContentLoaded", () => {
    // Renderizar propiedades destacadas cuando se carga la página
    if (typeof renderPropiedadesDestacadas === 'function') {
        renderPropiedadesDestacadas();
    }
});

/**
 * Navegación del botón "Ver todas las propiedades"
 */
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-ver-todas")) {
        e.preventDefault();

        const seccionCompra = showSection('compra');
        const menu = document.querySelector('.nav__menu');

        if (seccionCompra) {

            // Cerrar menú si está abierto
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
            scrollToTop();
        }
    }
});