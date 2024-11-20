// Element selection
const menuItems = document.querySelectorAll('.menu a');
const contentSections = document.querySelectorAll('.content-section');
const supportForm = document.getElementById('support-form');
const carForm = document.getElementById('car-form');
const carsTableBody = document.querySelector('#cars-table tbody');
const notificationsBody = document.getElementById('notifications-body');
const notificationsIcon = document.querySelector('.notifications .icon');

// Function to show a section
function showSection(sectionId) {
    contentSections.forEach(section => {
        section.style.display = 'none';
    });

    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
        activeSection.style.display = 'block';
    }

    menuItems.forEach(item => {
        item.classList.remove('active');
    });

    const activeMenuItem = document.querySelector(`#menu-${sectionId.split('-')[1]}`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
}

// Load cars into the cars table
function loadCars() {
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    carsTableBody.innerHTML = '';
    cars.forEach(car => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${car.spz}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${car.mileage}</td>
            <td>${car.status}</td>
            <td>${car.image ? `<img src="${car.image}" alt="Car Image" width="50" height="50">` : 'Není k dispozici'}</td>
        `;
        carsTableBody.appendChild(row);
    });
}

// Handle car form submission
if (carForm) {
    carForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const spz = document.getElementById('spz').value;
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        const mileage = document.getElementById('mileage').value;
        const status = document.getElementById('status').value;
        const imageFile = document.getElementById('image').files[0];

        if (!spz || !brand || !model || !year || !mileage || !status) {
            alert('Vyplňte všechna pole.');
            return;
        }

        let imageUrl = '';
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                imageUrl = reader.result;
                // Save car data along with the image
                saveCarData(spz, brand, model, year, mileage, status, imageUrl);
            };
            reader.readAsDataURL(imageFile);
        } else {
            // If no image is selected, save without the image
            saveCarData(spz, brand, model, year, mileage, status, imageUrl);
        }
    });
}

// Function to save car data
function saveCarData(spz, brand, model, year, mileage, status, imageUrl) {
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    cars.push({ spz, brand, model, year, mileage, status, image: imageUrl });
    localStorage.setItem('cars', JSON.stringify(cars));

    alert('Auto bylo úspěšně přidáno!');
    carForm.reset();

    // Dynamically reload the cars table if visible
    if (document.getElementById('content-tables').style.display !== 'none') {
        loadCars();
    }
}

// Load notifications into the notifications table
function loadNotifications() {
    const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    notificationsBody.innerHTML = '';
    notifications.forEach(notification => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${notification.name}</td>
            <td>${notification.email}</td>
            <td>${notification.message}</td>
            <td>${notification.time}</td>
        `;
        notificationsBody.appendChild(row);
    });
}

// Handle support form submission
if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !message) {
            alert('Vyplňte všechna pole.');
            return;
        }

        const time = new Date().toLocaleString();
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({ name, email, message, time });
        localStorage.setItem('notifications', JSON.stringify(notifications));

        alert(`Děkujeme, ${name}! Vaše zpráva byla odeslána.`);
        supportForm.reset();

        // Dynamically reload notifications if the notifications section is visible
        if (document.getElementById('content-notifications').style.display !== 'none') {
            loadNotifications();
        }
    });
}

// Notification icon click handler
notificationsIcon.addEventListener('click', () => {
    showSection('content-notifications');
    loadNotifications();
});

// Initialize navigation
menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = `content-${item.id.split('-')[1]}`;
        showSection(sectionId);

        // Load data dynamically when switching sections
        if (sectionId === 'content-tables') {
            loadCars();
        } else if (sectionId === 'content-notifications') {
            loadNotifications();
        }
    });
});

// On page load
document.addEventListener('DOMContentLoaded', () => {
    showSection('content-souhrn');
    loadCars();
    loadNotifications();
});



// Výběr modálního okna a tlačítek
const carDetailsModal = document.getElementById('car-details-modal');
const saveChangesButton = document.getElementById('save-changes');
const deleteCarButton = document.getElementById('delete-car');
const closeModalButton = document.getElementById('close-modal');

// Funkce pro načtení aut do tabulky
function loadCars() {
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    const carsTableBody = document.getElementById('cars-table-body');
    carsTableBody.innerHTML = ''; // Vyčistí stávající obsah tabulky

    cars.forEach((car, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${car.image}" alt="Car Image" style="width: 50px; height: auto;"></td>
            <td>${car.spz}</td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${car.mileage}</td>
            <td>${car.status}</td>
        `;
        
        // Kliknutí na řádek pro detail auta
        row.onclick = () => showCarDetails(car, index);
        carsTableBody.appendChild(row);
    });
}

// Funkce pro otevření modálního okna s detaily auta a možností změn
function showCarDetails(car, carIndex) {
    // Oprava zobrazování dat v modálním okně
    document.getElementById('car-details-title').innerText = `Detail auta: ${car.brand} ${car.model}`;
    document.getElementById('car-spz').value = car.spz;
    document.getElementById('car-brand').value = car.brand;
    document.getElementById('car-model').value = car.model;
    document.getElementById('car-year').value = car.year;
    document.getElementById('car-mileage').value = car.mileage;
    document.getElementById('car-status').value = car.status;
    document.getElementById('car-image').value = ''; // Vymazání obrázku
    document.getElementById('car-details-image').src = car.image || ''; // Zobrazení obrázku auta

    // Otevře modální okno
    carDetailsModal.style.display = 'block';

// Funkce pro zavření modálního okna
function closeModal() {
    const modal = document.getElementById("car-details-modal");
    modal.style.display = "none"; // Skrytí modálního okna
}

// Zavření modálního okna kliknutím na "x"
document.getElementById("close-modal").addEventListener("click", closeModal);

// Zavření modálního okna stisknutím klávesy Esc
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") { // Kontrola, zda byla stisknuta klávesa Esc
        closeModal();
    }
});


    // Uložit změny
    saveChangesButton.onclick = () => {
        // Získání nových hodnot z formuláře
        const updatedCar = {
            spz: document.getElementById('car-spz').value,
            brand: document.getElementById('car-brand').value,
            model: document.getElementById('car-model').value,
            year: document.getElementById('car-year').value,
            mileage: document.getElementById('car-mileage').value,
            status: document.getElementById('car-status').value,
            image: document.getElementById('car-image').files[0] ? URL.createObjectURL(document.getElementById('car-image').files[0]) : car.image, // Pokud je nový obrázek
        };

        const cars = JSON.parse(localStorage.getItem('cars')) || [];
        cars[carIndex] = updatedCar;  // Aktualizuje auto podle indexu
        localStorage.setItem('cars', JSON.stringify(cars));

        alert('Změny byly uloženy!');
        carDetailsModal.style.display = 'none';
        loadCars(); // Načte znovu auta do tabulky
    };

    // Odstranit auto
    deleteCarButton.onclick = () => {
        const confirmDelete = confirm("Jste si jistý, že chcete toto auto odstranit?");
        if (confirmDelete) {
            const cars = JSON.parse(localStorage.getItem('cars')) || [];
            cars.splice(carIndex, 1); // Odstraní auto na daném indexu
            localStorage.setItem('cars', JSON.stringify(cars));
            alert('Auto bylo úspěšně odstraněno!');
            carDetailsModal.style.display = 'none';
            loadCars(); // Znovu načte auta
        }
    };
}

// Funkce pro přidání nového auta
function addCar() {
    const spz = document.getElementById('new-car-spz').value;
    const brand = document.getElementById('new-car-brand').value;
    const model = document.getElementById('new-car-model').value;
    const year = document.getElementById('new-car-year').value;
    const mileage = document.getElementById('new-car-mileage').value;
    const status = document.getElementById('new-car-status').value;
    const image = document.getElementById('new-car-image').files[0] ? URL.createObjectURL(document.getElementById('new-car-image').files[0]) : '';

    if (!spz || !brand || !model || !year || !mileage || !status) {
        alert("Všechna pole musí být vyplněná!");
        return;
    }

    const newCar = { spz, brand, model, year, mileage, status, image };
    const cars = JSON.parse(localStorage.getItem('cars')) || [];
    cars.push(newCar);
    localStorage.setItem('cars', JSON.stringify(cars));

    alert("Auto bylo přidáno!");
    loadCars(); // Načte nově přidané auto do tabulky

    // Vyčistí formulář pro přidání nového auta
    document.getElementById('new-car-spz').value = '';
    document.getElementById('new-car-brand').value = '';
    document.getElementById('new-car-model').value = '';
    document.getElementById('new-car-year').value = '';
    document.getElementById('new-car-mileage').value = '';
    document.getElementById('new-car-status').value = '';
    document.getElementById('new-car-image').value = '';
}

// Funkce pro zavření modálního okna při kliknutí mimo
window.onclick = function(event) {
    if (event.target === carDetailsModal) {
        carDetailsModal.style.display = 'none';
    }
}



// Načítání aut při načtení stránky
document.addEventListener('DOMContentLoaded', () => {
    loadCars(); // Načítá auta při načtení stránky
    const addCarButton = document.getElementById('add-car-button');
    addCarButton.addEventListener('click', addCar);
});


// Example transaction data (this would typically come from a server or local storage)
let transactions = [
    { type: 'palivo', description: 'Nákup paliva na čerpací stanici', amount: '500 Kč', date: '2024-11-15' },
    { type: 'auto', description: 'Koupě nového nákladního vozu', amount: '500,000 Kč', date: '2024-11-10' },
    { type: 'job', description: 'Splnění zakázky pro zákazníka ABC', amount: '30,000 Kč', date: '2024-11-05' },
    { type: 'palivo', description: 'Nákup paliva pro nákladní vozidla', amount: '350 Kč', date: '2024-11-18' },
    { type: 'auto', description: 'Prodej starého osobního vozu', amount: '120,000 Kč', date: '2024-11-12' },
];

// Funkce pro načtení transakcí a zobrazení
function loadTransactions() {
    const fuelTransactions = transactions.filter(transaction => transaction.type === 'palivo');
    const carTransactions = transactions.filter(transaction => transaction.type === 'auto');
    const jobTransactions = transactions.filter(transaction => transaction.type === 'job');

    // Add fuel transactions
    const fuelList = document.getElementById('fuel-transactions');
    fuelTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `${transaction.description} <span>${transaction.amount}</span><div class="transaction-date">${transaction.date}</div>`;
        fuelList.appendChild(li);
    });

    // Add car transactions
    const carList = document.getElementById('car-transactions');
    carTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `${transaction.description} <span>${transaction.amount}</span><div class="transaction-date">${transaction.date}</div>`;
        carList.appendChild(li);
    });

    // Add job transactions
    const jobList = document.getElementById('job-transactions');
    jobTransactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `${transaction.description} <span>${transaction.amount}</span><div class="transaction-date">${transaction.date}</div>`;
        jobList.appendChild(li);
    });
}

// Funkce pro přidání nové transakce
function addTransaction(event) {
    event.preventDefault();

    const type = document.getElementById('transaction-type').value;
    const description = document.getElementById('transaction-description').value;
    const amount = document.getElementById('transaction-amount').value;
    const date = document.getElementById('transaction-date').value;

    const newTransaction = {
        type,
        description,
        amount,
        date,
    };

    // Přidání nové transakce do pole transakcí
    transactions.push(newTransaction);

    // Načtení transakcí znovu (aby se zobrazila nová transakce)
    clearTransactions();
    loadTransactions();

    // Vyprázdnění formuláře
    document.getElementById('transaction-form').reset();
}

// Funkce pro vymazání stávajících transakcí z DOMu
function clearTransactions() {
    document.getElementById('fuel-transactions').innerHTML = '';
    document.getElementById('car-transactions').innerHTML = '';
    document.getElementById('job-transactions').innerHTML = '';
}

// Přidání události pro odeslání formuláře
document.getElementById('transaction-form').addEventListener('submit', addTransaction);

// Načtení transakcí při načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    loadTransactions();
});
