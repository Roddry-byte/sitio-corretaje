import { renderPropiedades, initSlider, initRelatedCarousel } from './app.js';
import { $, norm, CLP } from './utils.js';

/* ============================
DATOS DE PROPIEDADES
   ============================ */
export const PROPIEDADES = [
    {
        id: "AB-0001",
        operacion: "Venta",
        tipo: "Departamento",
        titulo: "Depto 2D/2B — Providencia",
        comuna: "Providencia",
        precio: 165000000,
        superficieUtil: 65,
        terraza: 8,
        dormitorios: 2,
        banos: 2,
        estacionamientos: 1,
        bodegas: 1,
        imagenes: ["./imagenes/casa1.jpeg", "./imagenes/casa22.jpg", "./imagenes/casa33.jpg"],
        descripcion:
            "Depto luminoso a pasos de Metro Los Leones. Living-comedor con salida a terraza, cocina equipada, dormitorio en suite + baño completo. Edificio moderno con conserjería 24/7.",
        detalles: ["Gastos comunes: $120.000", "Año: 2018", "Disponibilidad inmediata"],
        coords: [-33.4258, -70.6162]
    },
    {
        id: "AB-0002",
        operacion: "Venta",
        tipo: "Casa",
        titulo: "Casa 3D/3B — Ñuñoa con patio",
        comuna: "Ñuñoa",
        precio: 320000000,
        superficieUtil: 120,
        terraza: 18,
        dormitorios: 3,
        banos: 3,
        estacionamientos: 2,
        bodegas: 1,
        imagenes: ["./imagenes/casa22.jpg", "./imagenes/casa33.jpg", "./imagenes/casa1.jpeg"],
        descripcion:
            "Casa familiar remodelada, cocina integrada, quincho y patio orientado al norte. Cercana a colegios y áreas verdes.",
        detalles: ["Contribuciones al día", "Recepción final regularizada", "Orientación nor-oriente"],
        coords: [-33.4569, -70.5955]
    },
    {
        id: "AB-0003",
        operacion: "Arriendo",
        tipo: "Oficina",
        titulo: "Oficina 1 privado — Las Condes",
        comuna: "Las Condes",
        precio: 950000, // CLP/mes
        superficieUtil: 42,
        terraza: 0,
        dormitorios: 1,
        banos: 1,
        estacionamientos: 1,
        bodegas: 0,
        destacada: true,
        imagenes: ["./imagenes/casa33.jpg", "./imagenes/casa1.jpeg", "./imagenes/casa22.jpg"],
        descripcion:
            "Oficina equipada en eje Apoquindo, recepción, 1 privado + open space, kitchenette. Edificio con accesos controlados.",
        detalles: ["Gastos comunes aprox. $110.000", "Climatización", "Disponibilidad: inmediata"],
        coords: [-33.4166, -70.5920]
    },
    {
        id: "AB-0004",
        operacion: "Venta",
        tipo: "Departamento",
        titulo: "Depto 1D/1B — Providencia Centro",
        comuna: "Providencia",
        precio: 125000000,
        superficieUtil: 45,
        terraza: 5,
        dormitorios: 1,
        banos: 1,
        estacionamientos: 1,
        bodegas: 0,
        destacada: true,
        imagenes: ["./imagenes/casa1.jpeg", "./imagenes/casa33.jpg", "./imagenes/casa22.jpg"],
        descripcion: "Departamento moderno, ideal para profesionales jóvenes.",
        detalles: ["Gastos comunes: $95.000", "Año: 2020", "Metro Los Leones a 3 cuadras"],
        coords: [-33.4280, -70.6180]
    },
    {
        id: "AB-0005",
        operacion: "Venta",
        tipo: "Departamento",
        titulo: "Depto 3D/2B — Providencia Alto",
        comuna: "Providencia",
        precio: 195000000,
        superficieUtil: 85,
        terraza: 12,
        dormitorios: 3,
        banos: 2,
        estacionamientos: 1,
        bodegas: 1,
        destacada: true,
        imagenes: ["./imagenes/casa22.jpg", "./imagenes/casa1.jpeg", "./imagenes/casa33.jpg"],
        descripcion: "Amplio departamento familiar con vista panorámica.",
        detalles: ["Gastos comunes: $140.000", "Año: 2016", "Terraza con parrilla"],
        coords: [-33.4240, -70.6140]
    }
];

/* ============================
FUNCIONES AUXILIARES
   ============================ */

/* ============================
LÓGICA DE PROPIEDADES RELACIONADAS
   ============================ */

/**
 * Calcula propiedades relacionadas basadas en criterios de similitud
 */
function getPropiedadesRelacionadas(propiedadActual, limite = 6) {
    return PROPIEDADES
        .filter(p => p.id !== propiedadActual.id) // Excluir la propiedad actual
        .filter(p => {
            // Priorizar misma comuna
            if (p.comuna === propiedadActual.comuna) return true;

            // Si no hay de la misma comuna, incluir tipos similares
            if (p.tipo === propiedadActual.tipo) return true;

            // Incluir propiedades con precio similar (±30%)
            const rangoMin = propiedadActual.precio * 0.7;
            const rangoMax = propiedadActual.precio * 1.3;
            return p.precio >= rangoMin && p.precio <= rangoMax;
        })
        .sort((a, b) => {
            // Ordenar por relevancia: misma comuna > mismo tipo > precio similar
            const scoreA = (a.comuna === propiedadActual.comuna ? 3 : 0) +
                (a.tipo === propiedadActual.tipo ? 2 : 0);
            const scoreB = (b.comuna === propiedadActual.comuna ? 3 : 0) +
                (b.tipo === propiedadActual.tipo ? 2 : 0);
            return scoreB - scoreA;
        })
        .slice(0, limite);
}

/**
 * Obtiene las propiedades destacadas
 */
function getPropiedadesDestacadas(limite = 3) {
    return PROPIEDADES.filter(p => p.destacada === true).slice(0, limite);
}

/* ============================
PLANTILLAS HTML
   ============================ */

/**
 * Plantilla para tarjetas de propiedades relacionadas
 */
function relacionadaTemplate(p) {
    return `
    <div class="related-card" data-id="${p.id}">
        <div class="related-card__image">
            <img src="${p.imagenes[0]}" alt="${p.titulo}" loading="lazy">
            <span class="related-badge">${p.operacion}</span>
        </div>
        <div class="related-card__content">
            <h4 class="related-card__title">${p.titulo}</h4>
            <p class="related-card__location">${p.comuna} • ${p.tipo}</p>
            <p class="related-card__price">$${CLP(p.precio)} CLP</p>
            <p class="related-card__specs">${p.dormitorios}D • ${p.banos}B • ${p.superficieUtil}m²</p>
            <button class="related-card__btn">Ver detalles</button>
        </div>
    </div>`;
}

/**
 * Plantilla principal para tarjetas de propiedades en el listado
 */
export function cardTemplate(p) {
    const imgs = p.imagenes
        .map((src) => `<img src="${src}" alt="${p.titulo}" loading="lazy" />`)
        .join("");

    const detalles = (p.detalles || []).map((d) => `<li>${d}</li>`).join("");

    return `
    <article class="card property" 
            data-lat="${p.coords?.[0] || ""}" 
            data-lng="${p.coords?.[1] || ""}"
            data-id="${p.id}">
        
        <div class="property__media slider" data-count="${p.imagenes.length}">
            <div class="slides">
                ${imgs}
            </div>
            <button class="prev" type="button">‹</button>
            <button class="next" type="button">›</button>
            <span class="badge">${p.operacion}</span>
        </div>

        <div class="property__body">
            <h3 class="property__title">${p.titulo}</h3>
            <p class="property__meta">${p.tipo} · ${p.comuna} · Código ${p.id}</p>
            <p><strong>$${CLP(p.precio)} CLP</strong> · ${p.dormitorios}D / ${p.banos}B · ${p.superficieUtil} m² útiles</p>
            
            <div class="property__specs">
                <div class="spec-item">
                    <span class="spec-value">${p.dormitorios}</span>
                    <span class="spec-label">Dorm.</span>
                </div>
                <div class="spec-item">
                    <span class="spec-value">${p.banos}</span>
                    <span class="spec-label">Baños</span>
                </div>
                <div class="spec-item">
                    <span class="spec-value">${p.superficieUtil}</span>
                    <span class="spec-label">m² útil</span>
                </div>
                <div class="spec-item">
                    <span class="spec-value">${p.estacionamientos || 0}</span>
                    <span class="spec-label">Est.</span>
                </div>
            </div>

            <div class="property__cta">
                <button class="btn btn--outline toggle-details" type="button">Más detalles</button>
                <a class="btn btn--primary" href="#contacto">Agendar visita</a>
            </div>
        </div>

        <div class="property__details hidden">
            <div class="sheet">
                <div class="sheet__grid">
                    <div class="sheet__content">
                        <p>${p.descripcion}</p>
                        ${detalles ? `<ul class="list list--check">${detalles}</ul>` : ""}
                        <div class="kv" style="margin-top:.75rem">
                            <div><dt>Superficie útil</dt><dd>${p.superficieUtil} m²</dd></div>
                            <div><dt>Terraza</dt><dd>${p.terraza || 0} m²</dd></div>
                            <div><dt>Estac.</dt><dd>${p.estacionamientos || 0}</dd></div>
                            <div><dt>Bodega</dt><dd>${p.bodegas || 0}</dd></div>
                        </div>
                    </div>
                    <aside class="sheet__aside">
                        <h3>Ubicación</h3>
                        <div class="property-map" style="width:100%;height:210px;border-radius:8px"></div>
                    </aside>
                </div>
            </div>
        </div>
    </article>`;
}

/**
 * Plantilla para vista detallada individual de propiedad
 */
export function detalleTemplate(p) {
    const relacionadas = getPropiedadesRelacionadas(p);
    const relacionadasHtml = relacionadas.length > 0 ? `
        <div class="related-properties">
            <h3>Propiedades que también te pueden interesar</h3>
            <div class="related-carousel">
                <div class="related-track">
                    ${relacionadas.map(relacionadaTemplate).join("")}
                </div>
                <button class="related-nav related-prev">‹</button>
                <button class="related-nav related-next">›</button>
            </div>
        </div>
    ` : "";

    return `
    <div class="property-detail">
        <!-- Header de la propiedad -->
        <div class="detail-header">
            <div class="detail-header__content">
                <div class="detail-breadcrumb">
                    <span>${p.tipo}</span> → <span>${p.comuna}</span> → <span class="current">${p.titulo}</span>
                </div>
                <h1 class="detail-title">${p.titulo}</h1>
                <div class="detail-meta">
                    <div class="meta-item">
                        <span class="meta-label">Código</span>
                        <span class="meta-value">${p.id}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Tipo</span>
                        <span class="meta-value">${p.tipo}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Ubicación</span>
                        <span class="meta-value">${p.comuna}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Operación</span>
                        <span class="meta-value operational">${p.operacion}</span>
                    </div>
                </div>
            </div>
            <div class="detail-header__price">
                <div class="price-main">${CLP(p.precio)} CLP</div>
                <div class="price-sub">${p.operacion === 'Arriendo' ? 'por mes' : 'precio total'}</div>
                <div class="price-actions">
                    <button class="btn-favorite" title="Agregar a favoritos">♡</button>
                    <button class="btn-share" title="Compartir propiedad">🔤</button>
                </div>
            </div>
        </div>

        <!-- Galería principal -->
        <div class="detail-gallery">
            <div class="gallery-main">
                <div class="detail-slider slider">
                    <div class="slides">
                        ${p.imagenes.map(src => `<img src="${src}" alt="${p.titulo}" />`).join("")}
                    </div>
                    <button class="prev">‹</button>
                    <button class="next">›</button>
                    <div class="gallery-counter">
                        <span class="current">1</span> / <span class="total">${p.imagenes.length}</span>
                    </div>
                </div>
            </div>
            <div class="gallery-thumbnails">
                ${p.imagenes.map((src, index) => `
                    <div class="thumbnail ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <img src="${src}" alt="Imagen ${index + 1}" />
                    </div>
                `).join("")}
            </div>
        </div>

        <!-- Información principal -->
        <div class="detail-content">
            <div class="detail-main">
                <!-- Especificaciones rápidas -->
                <div class="quick-specs">
                    <div class="spec-card">
                        <div class="spec-icon">🏠</div>
                        <div class="spec-info">
                            <span class="spec-number">${p.superficieUtil}</span>
                            <span class="spec-label">m² útiles</span>
                        </div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-icon">🛏️</div>
                        <div class="spec-info">
                            <span class="spec-number">${p.dormitorios}</span>
                            <span class="spec-label">Dormitorios</span>
                        </div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-icon">🚿</div>
                        <div class="spec-info">
                            <span class="spec-number">${p.banos}</span>
                            <span class="spec-label">Baños</span>
                        </div>
                    </div>
                    <div class="spec-card">
                        <div class="spec-icon">🚗</div>
                        <div class="spec-info">
                            <span class="spec-number">${p.estacionamientos || 0}</span>
                            <span class="spec-label">Estacion.</span>
                        </div>
                    </div>
                    ${p.terraza ? `
                    <div class="spec-card">
                        <div class="spec-icon">🌿</div>
                        <div class="spec-info">
                            <span class="spec-number">${p.terraza}</span>
                            <span class="spec-label">m² terraza</span>
                        </div>
                    </div>
                    ` : ''}
                </div>

                <!-- Descripción -->
                <div class="detail-section">
                    <h2 class="section-title">Descripción de la propiedad</h2>
                    <div class="section-content">
                        <p class="property-description">${p.descripcion}</p>
                    </div>
                </div>

                <!-- Características -->
                <div class="detail-section">
                    <h2 class="section-title">Características destacadas</h2>
                    <div class="section-content">
                        <div class="features-grid">
                            ${p.detalles.map(detalle => `
                                <div class="feature-item">
                                    <span class="feature-check">✓</span>
                                    <span class="feature-text">${detalle}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>

                <!-- Especificaciones completas -->
                <div class="detail-section">
                    <h2 class="section-title">Especificaciones técnicas</h2>
                    <div class="section-content">
                        <div class="specs-table">
                            <div class="specs-row">
                                <span class="spec-key">Superficie útil:</span>
                                <span class="spec-val">${p.superficieUtil} m²</span>
                            </div>
                            <div class="specs-row">
                                <span class="spec-key">Superficie terraza:</span>
                                <span class="spec-val">${p.terraza || 0} m²</span>
                            </div>
                            <div class="specs-row">
                                <span class="spec-key">Dormitorios:</span>
                                <span class="spec-val">${p.dormitorios}</span>
                            </div>
                            <div class="specs-row">
                                <span class="spec-key">Baños:</span>
                                <span class="spec-val">${p.banos}</span>
                            </div>
                            <div class="specs-row">
                                <span class="spec-key">Estacionamientos:</span>
                                <span class="spec-val">${p.estacionamientos || 0}</span>
                            </div>
                            <div class="specs-row">
                                <span class="spec-key">Bodegas:</span>
                                <span class="spec-val">${p.bodegas || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sidebar de contacto -->
            <div class="detail-sidebar">
                <div class="contact-card">
                    <h3>¿Te interesa esta propiedad?</h3>
                    <p>Contacta con uno de nuestros asesores especializados</p>
                    
                    <div class="contact-actions">
                        <a href="#contacto" class="btn btn-primary">
                            📞 Contactar asesor
                        </a>
                        <button class="btn btn-secondary" onclick="window.open('https://wa.me/56942356717', '_blank')">
                            💬 WhatsApp
                        </button>
                    </div>
                </div>

                <!-- Mapa -->
                <div class="location-card">
                    <h3>Ubicación</h3>
                    <div id="detalle-mapa" class="detail-map"></div>
                    <div class="location-info">
                        <p><strong>Comuna:</strong> ${p.comuna}</p>
                        <p><strong>Dirección:</strong> Disponible al contactar</p>
                    </div>
                </div>
            </div>
        </div>

        ${relacionadasHtml}
    </div>`;
}

/* ============================
RENDERIZADO DE PROPIEDADES
   ============================ */

const cardsCompra = $("#cards-compra");

/**
 * Renderizar propiedades destacadas en la sección de inicio
 */
export function renderPropiedadesDestacadas() {
    const container = document.getElementById("propiedades-destacadas");
    if (!container) return;

    const destacadas = getPropiedadesDestacadas(3); // Mostrar 3 propiedades

    if (!destacadas.length) {
        container.innerHTML = `<p style="text-align:center;color:#6b7280">No hay propiedades destacadas disponibles.</p>`;
        return;
    }

    container.innerHTML = destacadas.map(cardTemplate).join("");

    // Inicializar sliders de las tarjetas
    container.querySelectorAll(".slider").forEach(initSlider);
}

/* ============================
EVENT LISTENERS
   ============================ */

// Delegación para "Más detalles" + mapa por tarjeta
cardsCompra?.addEventListener("click", (e) => {
    const btn = e.target.closest(".toggle-details");
    if (!btn) return;

    const card = btn.closest(".property");
    const details = $(".property__details", card);
    const wasHidden = details.classList.contains("hidden");

    details.classList.toggle("hidden");
    btn.textContent = wasHidden ? "Menos detalles" : "Más detalles";

    // Carga perezosa del mapa cuando se abre
    if (wasHidden) {
        const lat = parseFloat(card.dataset.lat);
        const lng = parseFloat(card.dataset.lng);
        const mapEl = $(".property-map", details);
        if (mapEl && typeof L !== "undefined" && !mapEl._leaflet_id && !Number.isNaN(lat) && !Number.isNaN(lng)) {
            const map = L.map(mapEl).setView([lat, lng], 16);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
            L.marker([lat, lng]).addTo(map);
        }
    }
});

// Filtros del buscador
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

document.addEventListener("DOMContentLoaded", () => {
    initRelatedCarousel();
});