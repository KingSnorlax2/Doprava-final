// Najít všechna tlačítka a obsahové sekce
const menuItems = document.querySelectorAll('.menu a');
const contentSections = document.querySelectorAll('.content-section');

// Funkce pro zobrazení správné sekce
function showSection(sectionId) {
    // Skryj všechny sekce
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    // Zobraz požadovanou sekci
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    // Aktualizace aktivního tlačítka
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`#menu-${sectionId.split('-')[1]}`).classList.add('active');
}

// Přidat event listenery na všechna tlačítka
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault(); // Zabraň výchozímu chování odkazu
        const sectionId = `content-${item.id.split('-')[1]}`;
        showSection(sectionId);
    });
});

// Inicializace - zobrazit první sekci
showSection('content-souhrn');

// Najít formulář a tabulku
const carForm = document.getElementById('car-form');
const carsTableBody = document.querySelector('#cars-table tbody');

// Zpracování formuláře
carForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Získání hodnot z formuláře
    const spz = document.getElementById('spz').value;
    const brand = document.getElementById('brand').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const mileage = document.getElementById('mileage').value;
    const status = document.getElementById('status').value;

    // Vytvoření nového řádku tabulky
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${spz}</td>
        <td>${brand}</td>
        <td>${model}</td>
        <td>${year}</td>
        <td>${mileage}</td>
        <td>${status}</td>
    `;

    // Přidání řádku do tabulky
    carsTableBody.appendChild(newRow);

    // Vymazání formuláře
    carForm.reset();
});
