const cardsContainer = document.getElementById("cards");
const searchInput = document.getElementById("search");
const statsContainer = document.getElementById("stats");
const navMenu = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelectorAll(".nav-link");

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

// ========== FUNCIONES DE VEHÍCULOS ==========
function createCard(car) {
    return `
        <div class="card">
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
