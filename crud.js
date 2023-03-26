// API CRUD Functions

// creates a contact or updates it if id exist
function saveContact(contact) {
    const endpoint = 'http://localhost:8080/api/v1/contact' + (contact.id == '' ? '' : ('/' + contact.id));
    const method = contact.id == '' ? 'POST' : 'PUT';

    makeRequest(endpoint, method, JSON.stringify(contact));
}

function savePhone(phone) {
    phone.contacto = { id: phone.contactId };
    console.log(JSON.stringify(phone));
    const endpoint = 'http://localhost:8080/api/v1/phone' + (phone.id == '' ? '' : ('/' + phone.id));
    const method = phone.id == '' ? 'POST' : 'PUT';

    makeRequest(endpoint, method, JSON.stringify(phone));
}

function deleteContacto(id) {
    if (confirm('¿Está seguro que desea eliminar el contacto?')) {
        makeRequest('http://localhost:8080/api/v1/contact/' + id, 'DELETE')
    }
}

function deleteTelefono(id) {
    if (confirm('¿Está seguro que desea eliminar el telefono?')) {
        makeRequest('http://localhost:8080/api/v1/phone/' + id, 'DELETE')
    }
};

function makeRequest(endpoint, method, body) {
    const response = fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body,
    });

    response.then(response => {
        console.log(response)
    })
        .catch(e => console.log('errorcito' + e));
}
