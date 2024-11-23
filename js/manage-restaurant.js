
const popup = document.getElementById('popup');
const restaurantForm = document.getElementById('restaurant-form');
const restaurantTableBody = document.getElementById('restaurant-table').querySelector('tbody');
let restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
let isEditing = false;
let editingId = null;

function displayRestaurants() {
  restaurantTableBody.innerHTML = '';
  restaurants.forEach((restaurant, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${restaurant.name}</td>
      <td>${restaurant.location}</td>
      <td>
        <button class="btn-edit" onclick="editRestaurant(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteRestaurant(${index})">Delete</button>
      </td>
    `;
    restaurantTableBody.appendChild(row);
  });
}

function showPopup(edit = false) {
  popup.style.display = 'flex';
  if (!edit) {
    restaurantForm.reset();
    isEditing = false;
    editingId = null;
    document.getElementById('popup-title').textContent = 'Add Restaurant';
  }
}

function closePopup() {
  popup.style.display = 'none';
}

restaurantForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('restaurant-name').value;
  const location = document.getElementById('restaurant-location').value;

  if (isEditing) {
    restaurants[editingId] = { name, location };
  } else {
    restaurants.push({ name, location });
  }

  localStorage.setItem('restaurants', JSON.stringify(restaurants));
  displayRestaurants();
  closePopup();
});

function editRestaurant(index) {
  isEditing = true;
  editingId = index;
  const restaurant = restaurants[index];
  document.getElementById('restaurant-name').value = restaurant.name;
  document.getElementById('restaurant-location').value = restaurant.location;
  document.getElementById('popup-title').textContent = 'Edit Restaurant';
  showPopup(true);
}

function deleteRestaurant(index) {
  restaurants.splice(index, 1);
  localStorage.setItem('restaurants', JSON.stringify(restaurants));
  displayRestaurants();
}


displayRestaurants();
