// API CRUD Functions

// creates a contact or updates it if id exist
function saveContact(contact) {
    const endpoint = 'http://localhost:8080/api/v1/contact' + (contact.id == '' ? '' : ('/' + contact.id));
    const method = contact.id == '' ? 'POST' : 'PUT';

    return makeRequest(endpoint, method, JSON.stringify(contact));
}

// creates a phone or updates it if id exist
function savePhone(phone) {
    phone.contacto = { id: phone.contactId };
    console.log(JSON.stringify(phone));
    const endpoint = 'http://localhost:8080/api/v1/phone' + (phone.id == '' ? '' : ('/' + phone.id));
    const method = phone.id == '' ? 'POST' : 'PUT';

    return makeRequest(endpoint, method, JSON.stringify(phone));
}

function searchContact(searchTerm) {
    return makeRequest('http://localhost:8080/api/v1/search/contact/' + searchTerm, 'GET');
}

async function deleteContacto(id) {
    if (confirm('¿Está seguro que desea eliminar el contacto?')) {
        await makeRequest('http://localhost:8080/api/v1/contact/' + id, 'DELETE');
        fetchInfo();
    }
}

async function deleteTelefono(id) {
    if (confirm('¿Está seguro que desea eliminar el telefono?')) {
        await makeRequest('http://localhost:8080/api/v1/phone/' + id, 'DELETE');
        fetchInfo();
    }
};

function makeRequest(endpoint, method, body) {
    const response = fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: body,
    });

    return response.then(response => response.json())
        .catch(e => console.log('errorcito' + e));
}
