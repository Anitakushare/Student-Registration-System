//Acess form and tbody for dynamically add ,edit and delete students.
const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTableBody");

//Accesses the input fields for name, ID, contact number, and email.
const nameInput = document.getElementById("studentName");
const idInput = document.getElementById("studentID");
const emailInput = document.getElementById("email");
const contactInput = document.getElementById("contactNumber");

//Links to error message containers to display validation errors for each input field
const nameError = document.getElementById("nameError");
const idError = document.getElementById("idError");
const emailError = document.getElementById("emailError");
const contactError = document.getElementById("contactError");

//Stores a reference to the table row currently being edited. It's null when no editing is happening.
let editingRow = null;

//Initializes the validation process. .
function validateInputs() {
  let isValid = true;
  nameError.textContent = "";
  idError.textContent = "";
  emailError.textContent = "";
  contactError.textContent = "";

  if (!/^[a-zA-Z ]+$/.test(nameInput.value)) {
    nameError.textContent = "Name must contain only letters.";
    isValid = false;
  }

  if (!/^[0-9]+$/.test(idInput.value)) {
    idError.textContent = "ID must contain only numbers.";
    isValid = false;
  }

  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailInput.value)
  ) {
    emailError.textContent = "Invalid email format.Enter valid email";
    isValid = false;
  }

  if (!/^[0-9]+$/.test(contactInput.value)) {
    contactError.textContent = "Contact must contain only numbers.";
    isValid = false;
  }

  return isValid;
}

//Retrieves saved student data from localStorage, parses it, and adds rows to the table for each saved record.
function loadFromLocalStorage() {
  const data = JSON.parse(localStorage.getItem("students")) || [];
  data.forEach((student) => addStudent(student));
}

//Collects all rows from the table,and saves it as a JSON string in localStorage.
function saveToLocalStorage() {
  const rows = Array.from(tableBody.children);
  const data = rows.map((row) => {
    const cells = row.children;
    return {
      name: cells[0].textContent,
      id: cells[1].textContent,
      email: cells[2].textContent,
      contact: cells[3].textContent,
    };
  });
  localStorage.setItem("students", JSON.stringify(data));
}

function addStudent({ name, id, email, contact }) {
  const row = document.createElement("tr");

  row.innerHTML = `
        <td>${name}</td>
        <td>${id}</td>
          <td>${email}</td>
        <td>${contact}</td>
      
        <td class="action-buttons">
          <button class="btn-edit update"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-delete delete"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;

  tableBody.appendChild(row);
  saveToLocalStorage();
//Adds event listeners to the Edit and Delete buttons.
  row
    .querySelector(".btn-edit")
    .addEventListener("click", () => updateStudent(row));
  row
    .querySelector(".btn-delete")
    .addEventListener("click", () => deleteStudent(row));
}

function updateStudent(row) {
  const cells = row.children;
  nameInput.value = cells[0].textContent;
  idInput.value = cells[1].textContent;
  emailInput.value = cells[2].textContent;
  contactInput.value = cells[3].textContent;
  editingRow = row;
}

function deleteStudent(row) {
  if (confirm("You really want to delete this student")) row.remove();
  saveToLocalStorage();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateInputs()) return
   

//Creates a student object with the input values.
  const student = {
    name: nameInput.value.trim(),
    id: idInput.value.trim(),
    email: emailInput.value.trim(),
    contact: contactInput.value.trim(),
  };
  //Updates an existing row.
  if (editingRow) {
    editingRow.children[0].textContent = student.name;
    editingRow.children[1].textContent = student.id;
    editingRow.children[2].textContent = student.email;
    editingRow.children[3].textContent = student.contact;
    editingRow = null;
  } else {
    addStudent(student);
  }

  form.reset();
  saveToLocalStorage();
});
//load data from localStorage
loadFromLocalStorage();
