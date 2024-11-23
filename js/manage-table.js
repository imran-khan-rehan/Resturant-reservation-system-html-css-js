const tablePopup = document.getElementById('table-popup');
const tableForm = document.getElementById('table-form');
const tableListBody = document.getElementById('table-list').querySelector('tbody');
const restaurantSelect = document.getElementById('table-restaurant');
let tables = JSON.parse(localStorage.getItem('tables')) || [];
let restaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
let isTableEditing = false;
let editingTableId = null;

function displayTables() {
  tableListBody.innerHTML = '';
  tables.forEach((table, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${table.name}</td>
      <td>${table.price}</td>
      <td>${table.date}</td>
      <td>${table.restaurant}</td>
      <td>
        <button class="btn-edit" onclick="editTable(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteTable(${index})">Delete</button>
      </td>
    `;
    tableListBody.appendChild(row);
  });
}

function populateRestaurants() {
  restaurantSelect.innerHTML = '';
  restaurants.forEach((restaurant) => {
    const option = document.createElement('option');
    option.value = restaurant.name;
    option.textContent = restaurant.name;
    restaurantSelect.appendChild(option);
  });
}

function showTablePopup(edit = false) {
  populateRestaurants();
  tablePopup.style.display = 'flex';
  if (!edit) {
    tableForm.reset();
    isTableEditing = false;
    editingTableId = null;
    document.getElementById('table-popup-title').textContent = 'Add Table';
  }
}

function closeTablePopup() {
  tablePopup.style.display = 'none';
}

tableForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const name = document.getElementById('table-name').value;
  const price = document.getElementById('table-price').value;
  const date = document.getElementById('table-date').value;
  const restaurant = document.getElementById('table-restaurant').value;

  if (isTableEditing) {
    tables[editingTableId] = { name, price, date, restaurant };
  } else {
    tables.push({ name, price, date, restaurant });
  }

  localStorage.setItem('tables', JSON.stringify(tables));
  displayTables();
  closeTablePopup();
});

function editTable(index) {
  isTableEditing = true;
  editingTableId = index;
  const table = tables[index];
  document.getElementById('table-name').value = table.name;
  document.getElementById('table-price').value = table.price;
  document.getElementById('table-date').value = table.date;
  document.getElementById('table-restaurant').value = table.restaurant;
  document.getElementById('table-popup-title').textContent = 'Edit Table';
  showTablePopup(true);
}

function deleteTable(index) {
  tables.splice(index, 1);
  localStorage.setItem('tables', JSON.stringify(tables));
  displayTables();
}

function init() {
  populateRestaurants();
  displayTables();
}

init();
