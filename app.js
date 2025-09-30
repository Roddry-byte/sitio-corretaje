import { $, norm, validateEmail } from './utils.js';
import { PROPIEDADES, cardTemplate, detalleTemplate, renderPropiedadesDestacadas } from './propiedades.js';

const LEAFLET_CSS_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_SCRIPT_URL = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet-src.esm.js';

let leafletModulePromise = null;
let leafletCssLoaded = false;

const loadLeafletCSS = () => {
    if (leafletCssLoaded || typeof document === 'undefined') return Promise.resolve();

    const existing = document.querySelector('link[data-leaflet-css]');
    if (existing) {
        leafletCssLoaded = true;
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = LEAFLET_CSS_URL;
        link.dataset.leafletCss = 'true';
        link.setAttribute('data-leaflet-css', 'true');

        link.addEventListener('load', () => {
            leafletCssLoaded = true;
            resolve();
        });

        link.addEventListener('error', () => {
            console.error('No se pudo cargar la hoja de estilos de Leaflet.');
            resolve();
        });

        document.head.appendChild(link);
    });
};

async function loadLeafletModule() {
    if (leafletModulePromise || typeof window === 'undefined') {
        return leafletModulePromise;
    }

    leafletModulePromise = (async () => {
        await loadLeafletCSS();
        const module = await import(LEAFLET_SCRIPT_URL);
        return module?.default ?? module;
    })().catch((error) => {
        leafletModulePromise = null;
        console.error('No se pudo cargar Leaflet:', error);
        throw error;
    });

    return leafletModulePromise;
}

const isElementVisible = (el) => {
    if (!el) return false;
    const rects = el.getClientRects?.();
    return !!(rects && rects.length && (el.offsetWidth || el.offsetHeight));
};

const waitForVisibility = (el, attempts = 10) => new Promise((resolve) => {
    const check = (remaining) => {
        if (!el) {
            resolve(false);
            return;
        }

        if (isElementVisible(el)) {
            resolve(true);
            return;
        }

        if (remaining <= 0) {
            resolve(false);
            return;
        }

        setTimeout(() => check(remaining - 1), 100);
    };

    check(attempts);
});

const initializeDetailMap = (propiedad, scope) => {
    if (!propiedad?.coords) return;

    const container = scope?.querySelector?.('.property-map')
        || document.querySelector('.property-map')
        || scope?.querySelector?.('#detalle-mapa')
        || document.getElementById('detalle-mapa');

    if (!container || container._leaflet_id) return;

    waitForVisibility(container).then((visible) => {
        if (!visible || container._leaflet_id) return;

        loadLeafletModule()
            ?.then((Leaflet) => {
                if (!Leaflet || container._leaflet_id) return;

                const map = Leaflet.map(container, {
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    boxZoom: false,
                    keyboard: false
                }).setView(propiedad.coords, 16);

                Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
                Leaflet.marker(propiedad.coords).addTo(map);
            })
            .catch((error) => {
                console.error('Error al inicializar el mapa de la propiedad:', error);
            });
    });
};
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

    const detalleSection = showSection("detalle-propiedad");

    const slider = document.querySelector("#detalle-propiedad .slider");
    if (slider) initSlider(slider);
    initLightbox(detalle);

    setTimeout(ensureRelatedCarouselInit, 100);

    if (detalleSection) {
        initializeDetailMap(propiedad, detalleSection);
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
    const carousel = document.querySelector(".carousel");
    const track = document.querySelector(".carousel__track");
    const slides = document.querySelectorAll(".carousel__slide");
    const indicators = document.querySelectorAll(".carousel__indicators button");
    const prevBtn = document.querySelector(".carousel__btn.prev");
    const nextBtn = document.querySelector(".carousel__btn.next");

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    const slideCount = slides.length;
    let autoSlideInterval = null;

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

        const stopAutoSlide = () => {
        if (autoSlideInterval !== null) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    };

    const startAutoSlide = () => {
        if (autoSlideInterval === null) {
            autoSlideInterval = setInterval(nextSlide, 4000);
        }
    };

    const isCarouselVisible = () => {
        if (!carousel) return false;
        const rect = carousel.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < innerHeight &&
            rect.left < innerWidth
        );
    };

    if (carousel && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startAutoSlide();
                } else {
                    stopAutoSlide();
                }
            });
        }, { threshold: 0.1 });

        observer.observe(carousel);

        if (isCarouselVisible()) {
            startAutoSlide();
        }
    } else {
        startAutoSlide();
    }

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
    let autoSlideTimer = null;

    if (imgs.length === 0) return;

    const show = (i) => {
        idx = (i + imgs.length) % imgs.length;
        if (slides) {
            slides.style.transform = `translateX(-${idx * 100}%)`;
        }
    };

    const stopAutoSlide = () => {
        if (autoSlideTimer !== null) {
            clearInterval(autoSlideTimer);
            autoSlideTimer = null;
        }
    };

    const startAutoSlide = () => {
        if (imgs.length <= 1 || autoSlideTimer !== null) return;
        autoSlideTimer = setInterval(() => {
            show(idx + 1);
        }, 4000);
    };

    const restartAutoSlide = () => {
        stopAutoSlide();
        startAutoSlide();
    };

    prev?.addEventListener("click", (e) => {
        e.stopPropagation();
        show(idx - 1);
        restartAutoSlide();
    });
    next?.addEventListener("click", (e) => {
        e.stopPropagation();
        show(idx + 1);
        restartAutoSlide();
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

    const handleVisibility = (isVisible) => {
        if (isVisible) {
            startAutoSlide();
        } else {
            stopAutoSlide();
        }
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => handleVisibility(entry.isIntersecting));
        }, { threshold: 0.25 });

        observer.observe(slider);
    } else {
        startAutoSlide();
    }

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);
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

    waitForVisibility(mapContainer).then((visible) => {
        if (!visible || mapContainer._leaflet_id) return;

        loadLeafletModule()
            ?.then((Leaflet) => {
                if (!Leaflet || mapContainer._leaflet_id) return;

                const map = Leaflet.map(mapContainer, {
                    scrollWheelZoom: false,
                    doubleClickZoom: false,
                    boxZoom: false,
                    keyboard: false
                }).setView([-33.4378, -70.6505], 16);

                Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                }).addTo(map);

                const polygon = Leaflet.polygon([
                    [-33.4376, -70.6510],
                    [-33.4376, -70.6500],
                    [-33.4380, -70.6500],
                    [-33.4380, -70.6510]
                ]).addTo(map).bindPopup("Área en venta");

                map.fitBounds(polygon.getBounds());
            })
            .catch((error) => {
                console.error('Error al inicializar el mapa de la ficha:', error);
            });
    });
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

    cardsCompra.setAttribute('aria-busy', 'true');
    
    if (!lista.length) {
        cardsCompra.innerHTML =
            `<p style="padding:1rem;text-align:center;color:#6b7280">
                No encontramos resultados. Ajusta los filtros y vuelve a intentar.
            </p>`;
            cardsCompra.setAttribute('data-results-count', '0');
            cardsCompra.setAttribute('aria-busy', 'false');
        return;
    }

    cardsCompra.innerHTML = lista.map(cardTemplate).join("");
    cardsCompra.querySelectorAll(".slider").forEach(initSlider);
    initLightbox(cardsCompra);
    cardsCompra.setAttribute('data-results-count', String(lista.length));
    cardsCompra.setAttribute('aria-busy', 'false');
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
    const btn = e.target.closest(".btn-mas-detalles");
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
    if (!form) return;

    const q = $("#q", form);
    const operacion = $("select[name='operacion']", form);
    const tipo = $("select[name='tipo']", form);

    const readFilters = () => ({
        q: q?.value?.trim() || "",
        operacion: operacion?.value || "",
        tipo: tipo?.value || ""
    });

    const updateQueryParams = (filters) => {
        if (typeof history?.replaceState !== "function") return;

        const params = new URLSearchParams();
        if (filters.q) params.set("q", filters.q);
        if (filters.operacion) params.set("operacion", filters.operacion);
        if (filters.tipo) params.set("tipo", filters.tipo);

        const { pathname, hash, search } = window.location;
        const newSearch = params.toString();
        const newUrl = `${pathname}${newSearch ? `?${newSearch}` : ""}${hash || ""}`;

        if (`${pathname}${search}${hash || ""}` !== newUrl) {
            history.replaceState(history.state, "", newUrl);
        }
    };

    const aplicarFiltros = (e, { skipHistory } = {}) => {
        e?.preventDefault();
        const filters = readFilters();
        const query = norm(filters.q);

        const resultados = PROPIEDADES.filter((p) => {
            const matchQ =
                !query ||
                norm(`${p.titulo} ${p.comuna} ${p.tipo} ${p.id}`).includes(query);
            const matchOp = !filters.operacion || p.operacion === filters.operacion;
            const matchTipo = !filters.tipo || p.tipo === filters.tipo;
            return matchQ && matchOp && matchTipo;
        });

        renderPropiedades(resultados);

        if (!skipHistory) {
            updateQueryParams(filters);
        }
    };

    const setControlValue = (control, value) => {
        if (!control) return;
        if (control.tagName === "SELECT") {
            const hasOption = Array.from(control.options || []).some((option) => option.value === value);
            control.value = hasOption ? value : "";
        } else {
            control.value = value || "";
        }
    };

    const params = new URLSearchParams(window.location.search);
    setControlValue(q, params.get("q") || "");
    setControlValue(operacion, params.get("operacion") || "");
    setControlValue(tipo, params.get("tipo") || "");

    form.addEventListener("submit", (event) => aplicarFiltros(event));
    [q, operacion, tipo].forEach((el) => el?.addEventListener("change", aplicarFiltros));

    aplicarFiltros(null, { skipHistory: true });
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