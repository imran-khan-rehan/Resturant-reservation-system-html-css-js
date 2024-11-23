const bookingPopup = document.getElementById('booking-popup');
const bookingForm = document.getElementById('booking-form');
const bookedTablesBody = document.getElementById('booked-tables').querySelector('tbody');
const availableTablesDiv = document.getElementById('available-tables');
let bookedTables = JSON.parse(localStorage.getItem('bookedTables')) || [];
let tables = JSON.parse(localStorage.getItem('tables')) || [];
let isBookingEditing = false;
let editingBookingId = null;

function displayBookedTables() {
  bookedTablesBody.innerHTML = '';
  bookedTables.forEach((booking, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${booking.tableName}</td>
      <td>${booking.date}</td>
      <td>${booking.customerName}</td>
      <td>
        <button class="btn-edit" onclick="editBooking(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteBooking(${index})">Delete</button>
      </td>
    `;
    bookedTablesBody.appendChild(row);
  });
}

function showBookingPopup(edit = false) {
  bookingPopup.style.display = 'flex';
  if (!edit) {
    bookingForm.reset();
    availableTablesDiv.innerHTML = '';
    isBookingEditing = false;
    editingBookingId = null;
    document.getElementById('popup-title').textContent = 'Book Table';
  }
}

function closeBookingPopup() {
  bookingPopup.style.display = 'none';
}

function showAvailableTables() {
  const selectedDate = document.getElementById('booking-date').value;
  if (!selectedDate) {
    alert('Please select a date first.');
    return;
  }

  const bookedTableNames = bookedTables
    .filter((booking) => booking.date === selectedDate)
    .map((booking) => booking.tableName);

  const availableTables = tables.filter(
    (table) => !bookedTableNames.includes(table.name)
  );

  availableTablesDiv.innerHTML = availableTables.length
    ? availableTables.map(
      (table) => `
          <div class="table-item">
            <input type="radio" name="selected-table" value="${table.name}" id="table-${table.name}" required />
            <label for="table-${table.name}">${table.name}</label>
          </div>
        `
    ).join('')
    : '<p>No tables available for the selected date.</p>';
}

bookingForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const selectedTable = document.querySelector('input[name="selected-table"]:checked');
  if (!selectedTable) {
    alert('Please select a table.');
    return;
  }

  const date = document.getElementById('booking-date').value;
  const customerName = document.getElementById('customer-name').value;

  const bookingData = {
    tableName: selectedTable.value,
    date,
    customerName,
  };

  if (isBookingEditing) {
    bookedTables[editingBookingId] = bookingData;
  } else {
    bookedTables.push(bookingData);
  }

  localStorage.setItem('bookedTables', JSON.stringify(bookedTables));
  displayBookedTables();
  closeBookingPopup();
});

function editBooking(index) {
  isBookingEditing = true;
  editingBookingId = index;

  const booking = bookedTables[index];
  document.getElementById('booking-date').value = booking.date;
  document.getElementById('customer-name').value = booking.customerName;
document.getElementById('showtable').style.display='none';
  showAvailableTables2();

  setTimeout(() => {
    const selectedTableName = booking.tableName;
    const tableInput = document.querySelector(`input[name="selected-table"][value="${selectedTableName}"]`);
    if (tableInput) {
      tableInput.checked = true;
    }
  }, 100);

  document.getElementById('popup-title').textContent = 'Edit Booking';
  showBookingPopup(true);
}

function showAvailableTables2() {
  const selectedDate = document.getElementById('booking-date').value;

  availableTablesDiv.innerHTML = tables.length
    ? tables.map(
      (table) => `
            <div class="table-item">
              <input type="radio" name="selected-table" value="${table.name}" id="table-${table.name}" required />
              <label for="table-${table.name}">${table.name}</label>
            </div>
          `
    ).join('')
    : '<p>No tables available.</p>';
}






function deleteBooking(index) {
  bookedTables.splice(index, 1);
  localStorage.setItem('bookedTables', JSON.stringify(bookedTables));
  displayBookedTables();
}

function init() {
  displayBookedTables();
}

init();
