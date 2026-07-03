const cardsContainer = document.getElementById("cards");
const searchInput = document.getElementById("search");

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
            <h2 style="text-align:center;width:100%;">
                No se encontraron vehículos.
            </h2>
        `;
        return;
    }

    list.forEach(car => {
        cardsContainer.innerHTML += createCard(car);
    });
}

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

renderCars(cars);
