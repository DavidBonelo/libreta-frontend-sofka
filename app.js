const myButton = document.getElementById('fetch');
myButton.addEventListener('click', fetchInfo);

// gets the list of contacts from the api and calls the rendering of the ui
function fetchInfo() {
    fetch('http://localhost:8080/api/v1')
        .then(response => response.json())
        .then(jsonObj => {
            // the response from the api contains the array of contacts in the field data
            displayUi(jsonObj.data)
        })
        .catch(err => {
            alert('API Could not be reached at this time');
            console.log('Error: ' + err);
        });
}

function displayUi(libreta) {
    let contactosDiv = '';
    for (let i = 0; i < libreta.length; i++) {
        const { id, nombre, apellido, createdAt, updatedAt, telefonos } = libreta[i];

        let telefonosDiv = '';
        for (let j = 0; j < telefonos.length; j++) {
            const { id, telefono, createdAt, updatedAt } = telefonos[j];
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

        const contactoTemplate = `
            <div>
                <h1 id="contacto${id}">
                    ${nombre} ${apellido}
                </h1>
            
                <p><strong>Created at</strong>: ${createdAt}</p>
                <p><strong>Updated at</strong>: ${updatedAt}</p>
                <p><strong>Telefonos:</strong></p>
                ${telefonosDiv}
            </div>
        `;
        contactosDiv += contactoTemplate;
    }

    document.getElementById('template').innerHTML = contactosDiv;
}

