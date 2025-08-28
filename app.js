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
});