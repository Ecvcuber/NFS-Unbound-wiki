const cardsContainer = document.getElementById("cards");
const searchInput = document.getElementById("search");
const statsContainer = document.getElementById("stats");
const navMenu = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelectorAll(".nav-link");
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerClose = document.getElementById("drawerClose");
const drawerContent = document.getElementById("drawerContent");

// ========== FUNCIONES AUXILIARES PARA DRAWER ==========

/**
 * Retorna la ruta del logo de la marca
 * Usa placeholder si el archivo no existe
 */
function getBrandLogo(brand) {
    // Normalizar el nombre de la marca para la ruta del archivo
    const brandFileName = brand.replace(/\s+/g, "-").toLowerCase();
    const logoPath = `assets/brands/${brandFileName}.svg`;
    const placeholderPath = `assets/ui/placeholder-logo.svg`;
    
    return { logoPath, placeholderPath };
}

/**
 * Retorna la ruta de la bandera del país
 * Usa placeholder si el archivo no existe
 */
function getCountryFlag(country) {
    // Normalizar el nombre del país para la ruta del archivo
    const countryFileName = country.replace(/\s+/g, "-").toLowerCase();
    const flagPath = `assets/flags/${countryFileName}.svg`;
    const placeholderPath = `assets/ui/placeholder-flag.svg`;
    
    return { flagPath, placeholderPath };
}

/**
 * Crea un elemento <img> con fallback a placeholder
 */
function createImageElement(primaryPath, fallbackPath, altText, className = "") {
    return `<img src="${primaryPath}" alt="${altText}" class="${className}" onerror="this.src='${fallbackPath}'" />`;
}

/**
 * Retorna clase de color según el tipo de tag
 */
function getTagColor(tag) {
    const tagColors = {
        // Colores por palabra clave
        "GT": "color-yellow",
        "NFS": "color-yellow",
        "Legend": "color-yellow",
        "V8": "color-orange",
        "V10": "color-orange",
        "V12": "color-orange",
        "Turbo": "color-orange",
        "Supercharged": "color-orange",
        "JDM": "color-purple",
        "Drift": "color-purple",
        "WRC": "color-green",
        "AWD": "color-cyan",
        "RWD": "color-red",
        "FWD": "color-cyan",
        "Fast & Furious": "color-red",
        "Hypercar": "color-yellow",
        "Muscle": "color-orange",
        "Hybrid": "color-green",
        "Le Mans": "color-green",
        "Alemania": "color-cyan",
        "USA": "color-red",
        "Italia": "color-green",
        "Japón": "color-purple"
    };

    // Buscar coincidencia parcial
    for (const [key, color] of Object.entries(tagColors)) {
        if (tag.includes(key) || key.includes(tag)) {
            return color;
        }
    }
    return "color-cyan"; // Color por defecto
}

/**
 * Crea una tarjeta de información reutilizable
 */
function createDrawerCard(title, content, type = "general") {
    return `
        <div class="drawer-card ${type}">
            <div class="drawer-card-title">${title}</div>
            ${content}
        </div>
    `;
}

// ========== FUNCIONES DE ESTADÍSTICAS ==========
function calculateStats(carList) {
    const totalVehicles = carList.length;
    const uniqueBrands = new Set(carList.map(car => car.brand)).size;
    const uniqueCountries = new Set(carList.map(car => car.country)).size;

    return {
        vehicles: totalVehicles,
        brands: uniqueBrands,
        countries: uniqueCountries
    };
}

function createStatCard(label, number) {
    return `
        <div class="stat-card">
            <div class="stat-number">${number}</div>
            <div class="stat-label">${label}</div>
        </div>
    `;
}

function renderStats(carList) {
    const stats = calculateStats(carList);
    statsContainer.innerHTML = `
        ${createStatCard("Vehículos", stats.vehicles)}
        ${createStatCard("Marcas", stats.brands)}
        ${createStatCard("Países", stats.countries)}
    `;
}

// ========== FUNCIONES DEL DRAWER ==========
function createDrawerContent(car) {
    const { logoPath, placeholderPath: logoPH } = getBrandLogo(car.brand);
    const { flagPath, placeholderPath: flagPH } = getCountryFlag(car.country);

    // Tarjeta de Información General
    const generalCard = createDrawerCard(
        "📋 Información General",
        `
        <div class="drawer-row">
            <div class="drawer-item">
                <span class="drawer-item-label">Año</span>
                <span class="drawer-item-value highlight">${car.year}</span>
            </div>
            <div class="drawer-item">
                <span class="drawer-item-label">Categoría</span>
                <span class="drawer-item-value">${car.category}</span>
            </div>
        </div>
        <div class="drawer-row">
            <div class="drawer-item">
                <span class="drawer-item-label">Tracción</span>
                <span class="drawer-item-value highlight">${car.drivetrain}</span>
            </div>
            <div class="drawer-item">
                <span class="drawer-item-label">País</span>
                <span class="drawer-item-value">${car.country}</span>
            </div>
        </div>
        `,
        "general"
    );

    // Tarjeta de Motor
    const motorCard = createDrawerCard(
        "⚙️ Motor",
        `
        <div class="drawer-row full">
            <div class="drawer-item">
                <span class="drawer-item-label">Tipo de Potencia</span>
                <span class="drawer-item-value highlight-yellow">${car.engine}</span>
            </div>
        </div>
        <div class="drawer-row">
            <div class="drawer-item">
                <span class="drawer-item-label">Cilindrada</span>
                <span class="drawer-item-value">${car.engine.split(" ")[0]}</span>
            </div>
        </div>
        `,
        "motor"
    );

    // Tarjeta de Rendimiento
    const performanceCard = createDrawerCard(
        "⚡ Rendimiento",
        `
        <div class="drawer-row">
            <div class="drawer-item">
                <span class="drawer-item-label">Potencia Máxima</span>
                <span class="drawer-item-value highlight">${car.horsepower} HP</span>
            </div>
        </div>
        `,
        "performance"
    );

    // Tarjeta de Versión Legendaria
    const legendaryCard = createDrawerCard(
        "⭐ Versión Legendaria",
        `
        <div class="drawer-row full">
            <div class="drawer-item">
                <span class="drawer-item-label">Nombre</span>
                <span class="drawer-item-value highlight-yellow">${car.legendary}</span>
            </div>
        </div>
        `,
        "legendary"
    );

    // Tarjeta de Apariciones
    const appearancesCard = createDrawerCard(
        "🎮 Apariciones",
        `
        <div class="drawer-row full">
            <div class="drawer-item">
                <span class="drawer-item-label">Conocido Por</span>
                <span class="drawer-item-value">${car.famousFor}</span>
            </div>
        </div>
        `,
        "appearances"
    );

    // Tarjeta de Etiquetas
    const tagsHTML = car.tags.map(tag => {
        const color = getTagColor(tag);
        return `<span class="drawer-tag ${color}">${tag}</span>`;
    }).join("");

    const tagCard = createDrawerCard(
        "🏷️ Etiquetas",
        `
        <div class="drawer-row full">
            <div class="drawer-tags">${tagsHTML}</div>
        </div>
        `,
        "curiosities"
    );

    // Retornar estructura completa del drawer
    return `
        <!-- IMAGEN DEL VEHÍCULO -->
        <div class="drawer-image">
            <div class="drawer-image-icon">${createImageElement(logoPath, logoPH, car.brand, "drawer-logo-image")}</div>
            <div class="drawer-image-placeholder">Imagen del vehículo</div>
        </div>

        <!-- ENCABEZADO DE INFORMACIÓN -->
        <div class="drawer-info-header">
            <div class="drawer-title-section">
                <div class="drawer-brand-logo">
                    ${createImageElement(logoPath, logoPH, car.brand, "drawer-header-logo")}
                </div>
                <div>
                    <div class="drawer-title">${car.name}</div>
                    <div class="drawer-brand">${car.brand}</div>
                </div>
            </div>
            <div class="drawer-country">
                <span class="drawer-country-flag">
                    ${createImageElement(flagPath, flagPH, car.country, "drawer-flag-image")}
                </span>
                <span>${car.country}</span>
            </div>
        </div>

        <!-- BODY CON TARJETAS -->
        <div class="drawer-body">
            ${generalCard}
            ${motorCard}
            ${performanceCard}
            ${legendaryCard}
            ${appearancesCard}
            ${tagCard}

            <!-- SECCIÓN PREPARADA PARA FUTURAS EXPANSIONES -->
            <div style="padding-top: 20px; border-top: 2px solid var(--panel2); margin-top: 20px; color: var(--muted); font-size: 0.9rem; text-align: center;">
                <p>🔄 Próximas características:</p>
                <p style="font-size: 0.85rem;">📸 Galería • 🎥 Videos • 📊 Especificaciones • ⚖️ Comparador</p>
            </div>
        </div>
    `;
}

function openDrawer(carId) {
    const car = cars.find(c => c.id === carId);
    if (car) {
        drawerContent.innerHTML = createDrawerContent(car);
        drawer.classList.add("active");
        drawerOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeDrawer() {
    drawer.classList.remove("active");
    drawerOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
}

// ========== EVENT LISTENERS DEL DRAWER ==========
drawerClose.addEventListener("click", closeDrawer);
drawerOverlay.addEventListener("click", closeDrawer);

// Cerrar drawer con tecla Escape
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("active")) {
        closeDrawer();
    }
});

// ========== FUNCIONES DE VEHÍCULOS ==========
function createCard(car) {
    return `
        <div class="card" data-car-id="${car.id}" style="cursor: pointer;">
            <h2>${car.name}</h2>

            <p class="brand">${car.brand}</p>

            <p><strong>Año:</strong> ${car.year}</p>
            <p><strong>País:</strong> ${car.country}</p>
            <p><strong>Motor:</strong> ${car.engine}</p>
            <p><strong>Potencia:</strong> ${car.horsepower} HP</p>

            <p class="legend">
                ⭐ <strong>Versión famosa:</strong><br>
                ${car.legendary}
            </p>

            <p>
                🎮 <strong>Conocido por:</strong><br>
                ${car.famousFor}
            </p>

            <div class="tags">
                ${car.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
            </div>
        </div>
    `;
}

function renderCars(list) {
    cardsContainer.innerHTML = "";

    if (list.length === 0) {
        cardsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center;">
                <h2 style="color: var(--yellow); padding: 40px 20px;">
                    No se encontraron vehículos.
                </h2>
            </div>
        `;
        return;
    }

    list.forEach(car => {
        cardsContainer.innerHTML += createCard(car);
    });

    // Agregar event listeners a las tarjetas
    document.querySelectorAll(".card[data-car-id]").forEach(card => {
        card.addEventListener("click", () => {
            const carId = parseInt(card.getAttribute("data-car-id"));
            openDrawer(carId);
        });
    });
}

// ========== BÚSQUEDA ==========
searchInput.addEventListener("input", () => {
    const text = searchInput.value.toLowerCase();

    const filtered = cars.filter(car =>
        car.name.toLowerCase().includes(text) ||
        car.brand.toLowerCase().includes(text) ||
        car.legendary.toLowerCase().includes(text) ||
        car.country.toLowerCase().includes(text) ||
        car.tags.join(" ").toLowerCase().includes(text)
    );

    renderCars(filtered);
});

// ========== NAVEGACIÓN ==========
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        closeMenu();
    }
}

function updateActiveNavLink(sectionId) {
    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("data-section") === sectionId) {
            link.classList.add("active");
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute("data-section");
        updateActiveNavLink(sectionId);
        scrollToSection(sectionId);
    });
});

// ========== MENÚ MÓVIL ==========
function toggleMenu() {
    navMenu.classList.toggle("active");
}

function closeMenu() {
    navMenu.classList.remove("active");
}

menuToggle.addEventListener("click", toggleMenu);

// Cerrar menú al hacer click fuera
document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar-container")) {
        closeMenu();
    }
});

// Cerrar menú al cambiar de tamaño la ventana
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

// ========== INICIALIZACIÓN ==========
renderCars(cars);
renderStats(cars);
