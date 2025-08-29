<<<<<<< HEAD
// ============================
// UTILIDADES
// ============================
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// ============================
// MENÚ HAMBURGUESA RESPONSIVE
// ============================
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
});

// ============================
// CARRUSEL PRINCIPAL
// ============================
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

    // Eventos
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

// ============================
// CARRUSEL DE PROPIEDADES
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

    // Carruseles individuales
    document.querySelectorAll('.slider').forEach(slider => {
        const slides = slider.querySelector('.slides');
        const images = slides.querySelectorAll('img');
        const nextBtn = slider.querySelector('.next');
        const prevBtn = slider.querySelector('.prev');
        let index = 0;

        const showSlide = (i) => {
            index = (i + images.length) % images.length;
            slides.style.transform = `translateX(-${index * 100}%)`;
        };

        if (nextBtn) nextBtn.onclick = () => showSlide(index + 1);
        if (prevBtn) prevBtn.onclick = () => showSlide(index - 1);
    });
});

// ============================
// INICIALIZACIÓN DE MAPAS
// ============================
const initPropertyMap = (mapContainer) => {
    if (!mapContainer || mapContainer._leaflet_id) return;

    const map = L.map(mapContainer).setView([-33.4378, -70.6505], 16);

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
// LIGHTBOX
// ============================
document.addEventListener("DOMContentLoaded", () => {
    // Crear lightbox
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');

    const lbImg = document.createElement('img');
    const lbPrev = document.createElement('button');
    const lbNext = document.createElement('button');

    lbPrev.className = 'lb-btn lb-prev';
    lbPrev.textContent = '‹';
    lbNext.className = 'lb-btn lb-next';
    lbNext.textContent = '›';

    lightbox.append(lbImg, lbPrev, lbNext);
    document.body.appendChild(lightbox);

    let currentImgs = [];
    let lbIndex = 0;

    // Abrir lightbox
    document.querySelectorAll('.property__media img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            const slides = img.closest('.slides').querySelectorAll('img');
            currentImgs = Array.from(slides);
            lbIndex = currentImgs.indexOf(img);
            lbImg.src = currentImgs[lbIndex].src;
            lightbox.classList.add('show');
        });
    });

    // Navegación
    lbPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        lbIndex = (lbIndex - 1 + currentImgs.length) % currentImgs.length;
        lbImg.src = currentImgs[lbIndex].src;
    });

    lbNext.addEventListener('click', (e) => {
        e.stopPropagation();
        lbIndex = (lbIndex + 1) % currentImgs.length;
        lbImg.src = currentImgs[lbIndex].src;
    });

    // Cerrar
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('show');
    });
});

// ============================
// VALIDACIÓN FORMULARIO CONTACTO
// ============================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = form.querySelector("input[type='text']").value.trim();
        const email = form.querySelector("input[type='email']").value.trim();
        const mensaje = form.querySelector("textarea").value.trim();

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

// ============================
// NAVEGACIÓN POR SECCIONES
// ============================
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
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;

            // Cambiar sección activa
            sections.forEach(sec => sec.classList.remove('active'));
            targetSection.classList.add('active');

            // Cerrar menú responsive
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }

            // Scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
});

// ============================
// CTA CONTACTO
// ============================
document.addEventListener("DOMContentLoaded", () => {
    const ctaButton = document.querySelector('.cta-section .btn-primary');

    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();

            // Usar la misma lógica de navegación que ya tienes
            const sections = document.querySelectorAll('main section');
            const targetSection = document.getElementById('contacto');
            const menu = document.querySelector('.nav__menu');

            if (targetSection) {
                // Cambiar sección activa (igual que tu código existente)
                sections.forEach(sec => sec.classList.remove('active'));
                targetSection.classList.add('active');

                // Cerrar menú responsive si está abierto
                if (menu && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                }

                // Scroll al inicio
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Opcional: enfocar el primer campo después de un momento
                setTimeout(() => {
                    const firstInput = targetSection.querySelector('#nombre');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 500);
            }
        });
    }
});

// ============================
// MANEJO DE PROPIEDADES RELACIONADAS Y NAVEGACIÓN A DETALLES
// ============================
function renderPropiedades(lista) {
    const cardsCompra = document.getElementById("cards-compra");
    if (!cardsCompra) return;
    
    cardsCompra.innerHTML = lista.map(cardTemplate).join("");
    document.querySelectorAll(".slider", cardsCompra).forEach(initSlider);
}

// Event listener para navegación a detalles desde tarjetas principales
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".toggle-details");
    if (!btn) return;

    const id = btn.closest(".property").dataset.id;
    if (typeof PROPIEDADES === 'undefined') return;
    
    const propiedad = PROPIEDADES.find(p => p.id === id);
    if (!propiedad) return;

    mostrarDetalle(propiedad);
});

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

    // Mostrar solo la sección de detalle
    document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
    document.getElementById("detalle-propiedad").classList.add("active");

    // Inicializar slider principal
    const slider = document.querySelector("#detalle-propiedad .slider");
    if (slider) initSlider(slider);

    // Inicializar carrusel de propiedades relacionadas
    setTimeout(() => {
        if (typeof initRelatedCarousel === 'function') {
            initRelatedCarousel();
        }
    }, 100);

    // Inicializar mapa
    if (propiedad.coords && typeof L !== 'undefined') {
        setTimeout(() => {
            const mapEl = document.getElementById("detalle-mapa");
            if (mapEl && !mapEl._leaflet_id) {
                const map = L.map(mapEl).setView(propiedad.coords, 16);
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
                L.marker(propiedad.coords).addTo(map);
            }
        }, 200);
    }

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Event listener para botón "Volver"
document.addEventListener("click", (e) => {
    if (e.target.id === "volver-listado") {
        document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
        document.getElementById("compra").classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
=======
// ============================
// UTILIDADES GENERALES
// ============================

/**
 * Valida formato de email
 */
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
            const targetSection = document.getElementById(targetId);
            if (!targetSection) return;

            // Cambiar sección activa
            sections.forEach(sec => sec.classList.remove('active'));
            targetSection.classList.add('active');

            // Cerrar menú responsive
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }

            // Scroll al inicio con offset para evitar superposición con header
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
function initSlider(slider) {
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
function initRelatedCarousel() {
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

/**
 * Sistema de lightbox para ampliar imágenes
 */
document.addEventListener("DOMContentLoaded", () => {
    // Crear elementos del lightbox
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');

    const lbImg = document.createElement('img');
    const lbPrev = document.createElement('button');
    const lbNext = document.createElement('button');

    lbPrev.className = 'lb-btn lb-prev';
    lbPrev.textContent = '‹';
    lbNext.className = 'lb-btn lb-next';
    lbNext.textContent = '›';

    lightbox.append(lbImg, lbPrev, lbNext);
    document.body.appendChild(lightbox);

    let currentImgs = [];
    let lbIndex = 0;

    // Abrir lightbox al hacer click en imagen
    document.querySelectorAll('.property__media img').forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', () => {
            const slides = img.closest('.slides').querySelectorAll('img');
            currentImgs = Array.from(slides);
            lbIndex = currentImgs.indexOf(img);
            lbImg.src = currentImgs[lbIndex].src;
            lightbox.classList.add('show');
        });
    });

    // Navegación del lightbox
    lbPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        lbIndex = (lbIndex - 1 + currentImgs.length) % currentImgs.length;
        lbImg.src = currentImgs[lbIndex].src;
    });

    lbNext.addEventListener('click', (e) => {
        e.stopPropagation();
        lbIndex = (lbIndex + 1) % currentImgs.length;
        lbImg.src = currentImgs[lbIndex].src;
    });

    // Cerrar lightbox
    lightbox.addEventListener('click', () => {
        lightbox.classList.remove('show');
    });
});

// ============================
// FORMULARIOS
// ============================

/**
 * Validación del formulario de contacto
 */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = form.querySelector("input[type='text']").value.trim();
        const email = form.querySelector("input[type='email']").value.trim();
        const mensaje = form.querySelector("textarea").value.trim();

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
function renderPropiedades(lista) {
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
    document.querySelectorAll(".slider", cardsCompra).forEach(initSlider);
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

            const sections = document.querySelectorAll('main section');
            const targetSection = document.getElementById('contacto');
            const menu = document.querySelector('.nav__menu');

            if (targetSection) {
                sections.forEach(sec => sec.classList.remove('active'));
                targetSection.classList.add('active');

                if (menu && menu.classList.contains('active')) {
                    menu.classList.remove('active');
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });

                setTimeout(() => {
                    const firstInput = targetSection.querySelector('#nombre');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 500);
            }
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

    // -----------------------------
    // Cambiar sección: ocultar inicio y mostrar compra
    // -----------------------------
    const sections = document.querySelectorAll('main section');
    const seccionCompra = document.getElementById('compra');
    if (!seccionCompra) return;

    sections.forEach(sec => sec.classList.remove('active')); // ocultar todas
    seccionCompra.classList.add('active'); // mostrar compra

    
    
    const id = btn.closest(".property").dataset.id;
    if (typeof PROPIEDADES === 'undefined') return;
    
    const propiedad = PROPIEDADES.find(p => p.id === id);
    if (!propiedad) return;

    // Mostrar detalles de la propiedad
    mostrarDetalle(propiedad);

    
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
});






/**
 * Navegación desde propiedades relacionadas
 */
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

/**
 * Mostrar vista detallada de una propiedad
 */
function mostrarDetalle(propiedad) {
    const detalle = document.getElementById("detalle-contenido");
    if (!detalle || typeof detalleTemplate === 'undefined') return;
    
    detalle.innerHTML = detalleTemplate(propiedad);

    // Mostrar solo la sección de detalle
    document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
    document.getElementById("detalle-propiedad").classList.add("active");

    // Inicializar slider principal
    const slider = document.querySelector("#detalle-propiedad .slider");
    if (slider) initSlider(slider);

    // Inicializar carrusel de propiedades relacionadas
    setTimeout(() => {
        if (typeof initRelatedCarousel === 'function') {
            initRelatedCarousel();
        }
    }, 100);

    // Inicializar mapa con configuración sin interferencia de scroll
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
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { 
                    maxZoom: 19 
                }).addTo(map);
                L.marker(propiedad.coords).addTo(map);
            }
        }, 200);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Botón volver al listado
 */
document.addEventListener("click", (e) => {
    if (e.target.id === "volver-listado") {
        document.querySelectorAll("main section").forEach(sec => sec.classList.remove("active"));
        document.getElementById("compra").classList.add("active");
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
        
        const sections = document.querySelectorAll('main section');
        const seccionCompra = document.getElementById('compra');
        const menu = document.querySelector('.nav__menu');
        
        if (seccionCompra) {
            // Cambiar a la sección de compra
            sections.forEach(sec => sec.classList.remove('active'));
            seccionCompra.classList.add('active');
            
            // Cerrar menú si está abierto
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
            
            // Scroll al inicio
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
>>>>>>> 05f9213 (subiendo commit)
});