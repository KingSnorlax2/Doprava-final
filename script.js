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
