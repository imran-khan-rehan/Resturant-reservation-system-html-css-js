// Local Storage Keys
const STORAGE_KEYS = {
    RESTAURANTS: 'restaurants',
    ROOMS: 'rooms',
    RESERVATIONS: 'reservations'
};

let restaurants = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESTAURANTS)) || [];
let rooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.ROOMS)) || [];
let reservations = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) || [];


function initRouter() {
    const routes = {
        '/': 'home',
        '/restaurants': 'restaurants',
        '/rooms': 'rooms',
        '/reservations': 'reservations'
    };

    function updateContent(path) {
        const sectionId = routes[path] || routes['/'];
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(sectionId).style.display = 'block';
    }


    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const path = e.target.closest('a').getAttribute('href');
            history.pushState(null, '', path);
            updateContent(path);
        });
    });


    window.addEventListener('popstate', () => {
        updateContent(window.location.pathname);
    });


    updateContent(window.location.pathname);
}


function updateLocalStorage() {
    localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
    localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(rooms));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
}

function resetForm(formId) {
    document.getElementById(formId).reset();
    document.querySelector(`#${formId} input[type="hidden"]`).value = '';
    const submitBtn = document.querySelector(`#${formId} button[type="submit"]`);
    submitBtn.innerHTML = `<i class="fas fa-plus"></i> ${submitBtn.textContent.includes('Save') ? 'Add' : 'Book'} ${formId.split('-')[0].charAt(0).toUpperCase() + formId.split('-')[0].slice(1)}`;
}


document.getElementById('restaurant-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const restaurantId = document.getElementById('restaurant-id').value;
    const restaurantName = document.getElementById('restaurant-name').value;

    if (restaurantId) {
        const index = restaurants.findIndex(r => r.id === parseInt(restaurantId));
        if (index !== -1) {
            restaurants[index].name = restaurantName;
        }
    } else {
        restaurants.push({
            id: Date.now(),
            name: restaurantName
        });
    }

    updateLocalStorage();
    renderRestaurants();
    updateRestaurantDropdowns();
    resetForm('restaurant-form');
});

function renderRestaurants() {
    const tableBody = document.getElementById('restaurants-list');
    tableBody.innerHTML = '';

    restaurants.forEach(restaurant => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${restaurant.name}</td>
            <td class="action-buttons">
                <button onclick="editRestaurant(${restaurant.id})" class="edit-button">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteRestaurant(${restaurant.id})" class="delete-button">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editRestaurant(id) {
    const restaurant = restaurants.find(r => r.id === id);
    if (restaurant) {
        document.getElementById('restaurant-id').value = restaurant.id;
        document.getElementById('restaurant-name').value = restaurant.name;
        const submitBtn = document.querySelector('#restaurant-form button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Restaurant';
    }
}

function deleteRestaurant(id) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
        restaurants = restaurants.filter(r => r.id !== id);
        rooms = rooms.filter(r => r.restaurantId !== id);
        updateLocalStorage();
        renderRestaurants();
        renderRooms();
        updateRestaurantDropdowns();
    }
}

function updateRestaurantDropdowns() {
    const restaurantSelects = document.querySelectorAll('#restaurant-select, #filter-restaurant');
    restaurantSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Restaurant</option>';
        restaurants.forEach(restaurant => {
            const option = document.createElement('option');
            option.value = restaurant.id;
            option.textContent = restaurant.name;
            select.appendChild(option);
        });
    });
}

document.getElementById('room-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const roomId = document.getElementById('room-id').value;
    const restaurantId = document.getElementById('restaurant-select').value;
    const roomName = document.getElementById('room-name').value;
    const roomPrice = document.getElementById('room-price').value;

    if (roomId) {

        const index = rooms.findIndex(r => r.id === parseInt(roomId));
        if (index !== -1) {
            rooms[index] = {
                ...rooms[index],
                restaurantId: parseInt(restaurantId),
                name: roomName,
                price: parseFloat(roomPrice)
            };
        }
    } else {
        rooms.push({
            id: Date.now(),
            restaurantId: parseInt(restaurantId),
            name: roomName,
            price: parseFloat(roomPrice)
        });
    }

    updateLocalStorage();
    renderRooms();
    resetForm('room-form');
});

function renderRooms() {
    const tableBody = document.getElementById('rooms-list');
    tableBody.innerHTML = '';

    rooms.forEach(room => {
        const restaurant = restaurants.find(r => r.id === room.restaurantId);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${restaurant ? restaurant.name : 'Unknown'}</td>
            <td>${room.name}</td>
            <td>$${room.price.toFixed(2)}</td>
            <td class="action-buttons">
                <button onclick="editRoom(${room.id})" class="edit-button">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteRoom(${room.id})" class="delete-button">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editRoom(id) {
    const room = rooms.find(r => r.id === id);
    if (room) {
        document.getElementById('room-id').value = room.id;
        document.getElementById('restaurant-select').value = room.restaurantId;
        document.getElementById('room-name').value = room.name;
        document.getElementById('room-price').value = room.price;
        const submitBtn = document.querySelector('#room-form button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Room';
    }
}

function deleteRoom(id) {
    if (confirm('Are you sure you want to delete this room?')) {
        rooms = rooms.filter(r => r.id !== id);
        updateLocalStorage();
        renderRooms();
    }
}

function showAvailableRooms() {
    const dateInput = document.getElementById('reservation-date');
    const availableRoomsSelect = document.getElementById('available-rooms');
    const availableRoomsContainer = document.getElementById('available-rooms-container');

    if (dateInput.value) {
        const reservedRoomIds = reservations
            .filter(res => res.date === dateInput.value)
            .map(res => res.roomId);

        availableRoomsSelect.innerHTML = '<option value="">Select Room</option>';
        
        rooms.forEach(room => {
            if (!reservedRoomIds.includes(room.id)) {
                const restaurant = restaurants.find(r => r.id === room.restaurantId);
                const option = document.createElement('option');
                option.value = room.id;
                option.textContent = `${restaurant.name} - ${room.name} ($${room.price.toFixed(2)})`;
                availableRoomsSelect.appendChild(option);
            }
        });

        availableRoomsContainer.classList.remove('hidden');
    }
}

document.getElementById('reservation-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const reservationId = document.getElementById('reservation-id').value;
    const date = document.getElementById('reservation-date').value;
    const roomId = document.getElementById('available-rooms').value;
    const guestName = document.getElementById('guest-name').value;

    const room = rooms.find(r => r.id === parseInt(roomId));
    const restaurant = restaurants.find(r => r.id === room.restaurantId);

    if (reservationId) {
        const index = reservations.findIndex(r => r.id === parseInt(reservationId));
        if (index !== -1) {
            reservations[index] = {
                ...reservations[index],
                date,
                roomId: parseInt(roomId),
                guestName,
                restaurantName: restaurant.name,
                roomName: room.name
            };
        }
    } else {
        reservations.push({
            id: Date.now(),
            date,
            roomId: parseInt(roomId),
            guestName,
            restaurantName: restaurant.name,
            roomName: room.name
        });
    }

    updateLocalStorage();
    renderReservations();
    resetForm('reservation-form');
    document.getElementById('available-rooms-container').classList.add('hidden');
});

function renderReservations() {
    const tableBody = document.getElementById('reservations-list');
    tableBody.innerHTML = '';

    reservations.forEach(reservation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reservation.date}</td>
            <td>${reservation.restaurantName} - ${reservation.roomName}</td>
            <td>${reservation.guestName}</td>
            <td class="action-buttons">
                <button onclick="editReservation(${reservation.id})" class="edit-button">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteReservation(${reservation.id})" class="delete-button">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function editReservation(id) {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
        document.getElementById('reservation-id').value = reservation.id;
        document.getElementById('reservation-date').value = reservation.date;
        document.getElementById('guest-name').value = reservation.guestName;
        
        showAvailableRooms();
        document.getElementById('available-rooms').value = reservation.roomId;
        document.getElementById('available-rooms-container').classList.remove('hidden');
        
        const submitBtn = document.querySelector('#reservation-form button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Save Reservation';
    }
}

function deleteReservation(id) {
    if (confirm('Are you sure you want to delete this reservation?')) {
        reservations = reservations.filter(r => r.id !== id);
        updateLocalStorage();
        renderReservations();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initRouter();
    renderRestaurants();
    renderRooms();
    renderReservations();
    updateRestaurantDropdowns();
});
