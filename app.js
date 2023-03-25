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
                    <button">edit</button>
                    <button onclick="deleteContacto(${id})">delete</button>
                </h1>
            
                <p><strong>Created at</strong>: ${createdAt}</p>
                <p><strong>Updated at</strong>: ${updatedAt}</p>
                <p><strong>Telefonos:</strong></p>
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
                </li>
                <p><strong>Created at</strong>: ${createdAt}</p>
                <p><strong>Updated at</strong>: ${updatedAt}</p>
            </ul>
        `;
        telefonosDiv += telefonoTemplate;
    }
    return telefonosDiv;
}

// form submit override
window.onload = function () {
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener("submit", function (e) {
        e.preventDefault(); // before the code

        const formData = Object.fromEntries(new FormData(contactForm));
        console.log('to save ' + JSON.stringify(formData));


        fetch('http://localhost:8080/api/v1/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: formData,
        }).then(response => {
            console.log(response);
        })
            .catch(e => console.log('errorcito' + e));

        contactForm.reset();
    });
}

function deleteContacto(id) {
    fetch('http://localhost:8080/api/v1/contact/' + id, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }).then(response => {
        console.log(response);
    })
        .catch(e => console.log('errorcito' + e));
}
