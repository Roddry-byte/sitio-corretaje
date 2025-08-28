/* ============================
   LISTADO + BUSCADOR (SECCIÓN COMPRA)
   ============================ */

// 1) Datos de ejemplo (añade más objetos siguiendo este formato)
const PROPIEDADES = [
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
        imagenes: ["./imagenes/casa33.jpg", "./imagenes/casa1.jpeg", "./imagenes/casa22.jpg"],
        descripcion:
            "Oficina equipada en eje Apoquindo, recepción, 1 privado + open space, kitchenette. Edificio con accesos controlados.",
        detalles: ["Gastos comunes aprox. $110.000", "Climatización", "Disponibilidad: inmediata"],
        coords: [-33.4166, -70.5920]
    },
    // Añadamos más propiedades para el ejemplo de relacionadas
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
        imagenes: ["./imagenes/casa22.jpg", "./imagenes/casa1.jpeg", "./imagenes/casa33.jpg"],
        descripcion: "Amplio departamento familiar con vista panorámica.",
        detalles: ["Gastos comunes: $140.000", "Año: 2016", "Terraza con parrilla"],
        coords: [-33.4240, -70.6140]
    }
];

// 2) Helpers
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const norm = (s = "") =>
    s.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const CLP = (n) => n.toLocaleString("es-CL");

// 3) Función para calcular propiedades relacionadas
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

// 4) Plantilla para propiedades relacionadas
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

// 5) Render de tarjetas
const cardsCompra = $("#cards-compra");

function cardTemplate(p) {
    // Genera el HTML de una propiedad
    const imgs = p.imagenes
        .map((src) => `<img src="${src}" alt="${p.titulo}" loading="lazy" />`)
        .join("");

    const detalles = (p.detalles || []).map((d) => `<li>${d}</li>`).join("");

    return `
  <article class="card property" data-lat="${p.coords?.[0] || ""}" data-lng="${p.coords?.[1] || ""}">
    <div class="property__media slider">
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

function renderPropiedades(lista) {
    if (!cardsCompra) return;
    if (!lista.length) {
        cardsCompra.innerHTML =
            `<p style="padding:1rem;text-align:center;color:#6b7280">No encontramos resultados. Ajusta los filtros y vuelve a intentar.</p>`;
        return;
    }
    // Render
    cardsCompra.innerHTML = lista.map(cardTemplate).join("");

    // Inicializa carruseles por tarjeta
    $$(".slider", cardsCompra).forEach(initSlider);
}

// 6) Slider por tarjeta (independiente del slider que ya tienes para las existentes)
function initSlider(slider) {
    const slides = $(".slides", slider);
    const imgs = $$("img", slides);
    const prev = $(".prev", slider);
    const next = $(".next", slider);
    let idx = 0;

    const show = (i) => {
        idx = (i + imgs.length) % imgs.length;
        slides.style.transform = `translateX(-${idx * 100}%)`;
    };

    prev?.addEventListener("click", (e) => { e.stopPropagation(); show(idx - 1); });
    next?.addEventListener("click", (e) => { e.stopPropagation(); show(idx + 1); });
    show(0);
}

// 7) Delegación para "Más detalles" + mapa por tarjeta
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

// 8) Filtros del buscador (usa el form existente del hero en #compra)
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

// 9) Plantilla de detalle actualizada con propiedades relacionadas
function detalleTemplate(p) {
    const relacionadas = getPropiedadesRelacionadas(p);
    const relacionadasHtml = relacionadas.length > 0 ? `
        <div class="related-properties">
            <h3>Propiedades relacionadas</h3>
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
    <div class="detalle-header">
        <h2>${p.titulo}</h2>
        <p>${p.tipo} en <strong>${p.comuna}</strong> · Código ${p.id}</p>
    </div>
    <div class="detalle-gallery slider">
        <div class="slides">
            ${p.imagenes.map(src => `<img src="${src}" alt="${p.titulo}" />`).join("")}
        </div>
        <button class="prev">‹</button>
        <button class="next">›</button>
    </div>
    <div class="detalle-info">
        <p>${p.descripcion}</p>
        <ul class="list list--check">
            ${p.detalles.map(d => `<li>${d}</li>`).join("")}
        </ul>
        <dl class="kv">
            <div><dt>Precio</dt><dd>$${CLP(p.precio)} CLP</dd></div>
            <div><dt>Superficie útil</dt><dd>${p.superficieUtil} m²</dd></div>
            <div><dt>Terraza</dt><dd>${p.terraza} m²</dd></div>
            <div><dt>Dormitorios</dt><dd>${p.dormitorios}</dd></div>
            <div><dt>Baños</dt><dd>${p.banos}</dd></div>
            <div><dt>Estacionamientos</dt><dd>${p.estacionamientos}</dd></div>
            <div><dt>Bodegas</dt><dd>${p.bodegas}</dd></div>
        </dl>
    </div>
    <div class="detalle-mapa">
        <h3>Ubicación</h3>
        <div id="detalle-mapa" class="property-map"></div>
    </div>
    ${relacionadasHtml}
    `;
}

// 10) Inicializar carrusel de propiedades relacionadas
function initRelatedCarousel() {
    const track = $(".related-track");
    const cards = $$(".related-card");
    const prevBtn = $(".related-prev");
    const nextBtn = $(".related-next");

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    const cardWidth = 280; // ancho de cada tarjeta + gap
    const visibleCards = Math.floor(track.parentElement.offsetWidth / cardWidth);
    const maxIndex = Math.max(0, cards.length - visibleCards);

    const updateCarousel = () => {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        // Actualizar estado de botones
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

// --- Plantilla de tarjeta (listado) ---
function cardTemplate(p) {
    const imgs = p.imagenes.map(src => `<img src="${src}" alt="${p.titulo}" />`).join("");
    return `
    <article class="card property" data-id="${p.id}">
    <div class="property__media slider">
        <div class="slides">${imgs}</div>
        <button class="prev">‹</button>
        <button class="next">›</button>
        <span class="badge">${p.operacion}</span>
    </div>
    <div class="property__body">
        <h3>${p.titulo}</h3>
        <p>${p.tipo} · ${p.comuna} · Código ${p.id}</p>
        <p><strong>$${CLP(p.precio)} CLP</strong></p>
        <div class="property__cta">
        <button class="btn btn--outline toggle-details">Más detalles</button>
        <a class="btn btn--primary" href="#contacto">Agendar visita</a>
        </div>
    </div>
    </article>
`;
}



