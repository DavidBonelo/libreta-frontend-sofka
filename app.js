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
        const { id, nombre, apellido, createdAt, updatedAt, telefonos } = contactosData[i];

        // console.log(telefonos[0]);
        let telefonosDiv = getTelefonosDiv(id, telefonos);
        const contactoTemplate = `
            <div>
                <h1 id="contacto${id}">
                    ${nombre} ${apellido}
                    <button onclick="editContacto(${i})" class="btn btn-outline-warning btn-sm">edit</button>
                    <button onclick="deleteContacto(${id})" class="btn btn-outline-danger btn-sm">delete</button>
                </h1>
            
                <p><strong>Created at</strong>: ${createdAt}</p>
                <p><strong>Updated at</strong>: ${updatedAt}</p>
                <p><strong>Telefonos:</strong></p>
                <button type="button" class="btn btn-outline-primary btn-sm mb-3" data-bs-toggle="modal" data-bs-target="#phone-modal" onclick="editTelefono(${id})">
                    Agregar telefono
                </button>
                ${telefonosDiv}
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
        const { id, telefono, createdAt, updatedAt } = telefonosData[j];
        const telefonoTemplate = `
            <ul>
                <li id="telefono${id}">
                    <strong>${telefono}</strong>
                    <button onclick="editTelefono(${contactId},${id},${telefono})" class="btn btn-outline-warning btn-sm" data-bs-toggle="modal" data-bs-target="#phone-modal">edit</button>
                    <button onclick="deleteTelefono(${id})" class="btn btn-outline-danger btn-sm">delete</button>
                </li>
                <p><strong>Created at</strong>: ${createdAt}</p>
                <p><strong>Updated at</strong>: ${updatedAt}</p>
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
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // before the code

        const formData = Object.fromEntries(new FormData(contactForm));
        console.log('to save ' + JSON.stringify(formData));

        saveContact(formData);
        fetchInfo();
        contactForm.reset();
    });

    // phone form submit
    const phoneForm = document.getElementById('phoneForm');
    phoneForm.addEventListener("submit", function (e) {
        e.preventDefault(); // before the code

        const formData = Object.fromEntries(new FormData(phoneForm));
        console.log('to save ' + JSON.stringify(formData));

        savePhone(formData);
        fetchInfo();
        phoneForm.reset();

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
}

function editTelefono(contactId, phoneId, telefono) {
    const phoneForm = document.getElementById('phoneForm');

    phoneForm.elements["contactId"].value = contactId ?? '';
    phoneForm.elements["id"].value = phoneId ?? '';
    phoneForm.elements["telefono"].value = telefono ?? '';
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