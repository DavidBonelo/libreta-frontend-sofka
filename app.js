let libretaData;
// fetchInfo();

const myButton = document.getElementById('fetch');
myButton.addEventListener('click', fetchInfo);

// gets the list of contacts from the api and calls the rendering of the ui
function fetchInfo() {
    fetch('http://localhost:8080/api/v1')
        .then(response => response.json())
        .then(jsonObj => {
            // the response from the api contains the array of contacts in the data field
            libretaData = jsonObj.data;
            displayUi(libretaData);
        })
        .catch(err => {
            alert('API Could not be reached at this time');
            console.log('Error: ' + err);
        });
}

// loads the ui into the html div
function displayUi(libreta) {
    document.getElementById('template').innerHTML = getContactosDiv(libreta)
}

// builds the ui for a contact list
function getContactosDiv(contactosData) {
    let contactosDiv = '';
    for (let i = 0; i < contactosData.length; i++) {
        let { id, nombre, apellido, email, fechaNacimiento, createdAt, updatedAt, telefonos } = contactosData[i];
        createdAt = new Date(createdAt).toLocaleString();
        updatedAt = new Date(updatedAt).toLocaleString();

        let telefonosDiv = getTelefonosDiv(id, telefonos);
        const contactoTemplate = `
          <div
            href="#"
            class="list-group-item list-group-item-action d-flex gap-3 py-3"
            aria-current="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="bi bi-file-person-fill flex-shrink-0"
              viewBox="0 0 16 16"
              width="32"
              height="32"
            >
            <use xlink:href="#file-person" />
            </svg>
            
            <div class="d-flex gap-2 w-100">
                <div>
                    <h6 id="contacto${id}">
                        ${nombre} ${apellido}
                        <button onclick="editContacto(${i})" class="btn btn-outline-warning btn-sm" data-bs-toggle="modal"
                            data-bs-target="#contact-modal">edit</button>
                        <button onclick="deleteContacto(${id})" class="btn btn-outline-danger btn-sm">delete</button>
                    </h6>
                    <p><strong>Created at</strong>: ${createdAt} - <strong>Updated at</strong>: ${updatedAt}</p>
                    ${!fechaNacimiento ? '' : '<p><strong>Fecha de nacimiento</strong>: ' + fechaNacimiento}</p>
                    ${!email ? '' : '<p><strong>E-mail</strong>: ' + email}</p>
                    
                    <p><strong>Telefonos:</strong></p>
                    <button type="button" class="btn btn-outline-primary btn-sm mb-3" data-bs-toggle="modal" data-bs-target="#phone-modal" onclick="editTelefono(${id})">
                        Agregar telefono
                    </button>
                    ${telefonosDiv}
                </div>
            </div>
          </div>
        `;
        contactosDiv += contactoTemplate;
    }
    return contactosDiv;
}
// builds the ui for a contact's phone list
function getTelefonosDiv(contactId, telefonosData) {
    let telefonosDiv = '';
    for (let j = 0; j < telefonosData.length; j++) {
        let { id, telefono, createdAt, updatedAt } = telefonosData[j];
        createdAt = new Date(createdAt).toLocaleString();
        updatedAt = new Date(updatedAt).toLocaleString();
        const telefonoTemplate = `
            <ul>
                <li id="telefono${id}">
                    <strong>${telefono}</strong>
                    <button onclick="editTelefono(${contactId},${id},${telefono})" class="btn btn-outline-warning btn-sm"
                        data-bs-toggle="modal" data-bs-target="#phone-modal">edit</button>
                    <button onclick="deleteTelefono(${id})" class="btn btn-outline-danger btn-sm">delete</button>
                </li>
                <p><strong>Created at</strong>: ${createdAt} - <strong>Updated at</strong>: ${updatedAt}</p>
            </ul>
        `;
        telefonosDiv += telefonoTemplate;
    }
    return telefonosDiv;
}

// forms submit override
window.onload = function () {
    // contact form submit
    const contactForm = document.getElementById('contactForm');
    const contactModal = new bootstrap.Modal(document.getElementById('contact-modal'));

    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault(); // before the code

        const formData = Object.fromEntries(new FormData(contactForm));
        console.log('to save ' + JSON.stringify(formData));

        await saveContact(formData);
        fetchInfo();
        contactForm.reset();
        contactModal.hide();
    });

    // phone form submit
    const phoneForm = document.getElementById('phoneForm');
    const phoneModal = new bootstrap.Modal(document.getElementById('phone-modal'));

    phoneForm.addEventListener("submit", async function (e) {
        e.preventDefault(); // before the code

        const formData = Object.fromEntries(new FormData(phoneForm));
        console.log('to save ' + JSON.stringify(formData));

        await savePhone(formData);
        fetchInfo();
        phoneForm.reset();
        phoneModal.hide();
    });

    // search form submit
    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const searchterm = Object.fromEntries(new FormData(searchForm)).searchterm;
        searchContact(searchterm)
            .then(result => displayUi(result.data));
    });

}

function editContacto(libretaIndex) {
    const contactForm = document.getElementById('contactForm');
    const contact = libretaData[libretaIndex];

    contactForm.elements["id"].value = contact.id ?? '';
    contactForm.elements["nombre"].value = contact.nombre;
    contactForm.elements["apellido"].value = contact.apellido;
    contactForm.elements["email"].value = contact.email;
    contactForm.elements["fechaNacimiento"].value = contact.fechaNacimiento;
}

function editTelefono(contactId, phoneId, telefono) {
    const phoneForm = document.getElementById('phoneForm');

    phoneForm.elements["contactId"].value = contactId ?? '';
    phoneForm.elements["id"].value = phoneId ?? '';
    phoneForm.elements["telefono"].value = telefono ?? '';
}

function resetContactoFormId() {
    document.getElementById('contactForm').elements["id"].value = '';
}
/* 
{
  "error": false,
  "message": "",
  "data": [
    {
      "id": 1,
      "nombre": "string",
      "apellido": "string",
      "createdAt": "2023-03-21T19:53:30Z",
      "updatedAt": "2023-03-21T19:53:30Z",
      "telefonos": [
        {
          "id": 2,
          "telefono": "123",
          "createdAt": "2023-03-21T21:41:52Z",
          "updatedAt": "2023-03-21T21:41:52Z"
        }
      ]
    },
    {
      "id": 2,
      "nombre": "hello",
      "apellido": "string",
      "createdAt": "2023-03-21T19:53:57Z",
      "updatedAt": "2023-03-21T19:53:57Z",
      "telefonos": []
    }
  ]
}
*/