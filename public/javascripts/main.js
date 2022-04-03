const serverUrl = document.baseURI + 'words/';

const createViewElement = (word) => {
    return`<td>${word.word}</td>
    <td>${new Date(word.createdAt).toLocaleString()}</td>
    <td>${new Date(word.updatedAt).toLocaleString()}</td>
    <td>
        <button class="btn btn-primary btn-sm" onclick="editItem('${word._id}')" id="edit-${word._id}">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('${word._id}', '${word.word}')" id="delete-${word._id}">Delete</button>
    </td>`;
};

const createEditElement = (word) => {
    return `<td>
        <form id="form-${word._id}" onsubmit="updateWord(event, '${word._id}')">
            <input type="text" class="form-control" id="wordInput-${word._id}" placeholder="Enter Word Here"
                required pattern="[A-Z]?[a-z]*" title="Please enter only single word!"
                autocomplete="off" value="${word.word}" data-value="${word.word}" />
        </form>
    </td>
    <td>${new Date(word.createdAt).toLocaleString()}</td>
    <td>${new Date(word.updatedAt).toLocaleString()}</td>
    <td>
        <input class="btn btn-success btn-sm" type="submit" form="form-${word._id}" id="submit-button-${word._id}" value="Update" />
        <button class="btn btn-secondary btn-sm" onClick="cancelEdit('${word._id}')">Cancel</button>
    </td>`;
};

const submitWord = (event) => {
    event.preventDefault();
    document.getElementById('submit-button').disabled = true;

    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            word: document.getElementById('wordInput').value
        })
    }).then(response => response.json())
    .then(wordJson => {
        const body = document.getElementById('main-table-body');
        const viewNode = document.createElement('tr');
        viewNode.setAttribute('id', wordJson._id + '-view');

        const editNode = document.createElement('tr');
        editNode.setAttribute('id', wordJson._id + '-edit');
        editNode.setAttribute('class', 'd-none');

        if(!body.childElementCount) {
            body.appendChild(editNode);
        } else {
            body.insertBefore(editNode, body.firstElementChild);
        }
        body.insertBefore(viewNode, body.firstElementChild);
        document.getElementById(wordJson._id+'-view').innerHTML = createViewElement(wordJson);
        document.getElementById(wordJson._id+'-edit').innerHTML = createEditElement(wordJson);
        document.getElementById('submit-button').disabled = false;
        document.getElementById('wordInput').value = '';
    }).catch(error => {
        alert('Someting Went Wrong!');
    });
}

const deleteItem = (wordId, wordName) => {
    if(confirm(`Are you sure you want to delete ${wordName}!`)) {
        document.getElementById('edit-'+wordId).disabled = true;
        document.getElementById('delete-'+wordId).disabled = true;

        fetch(serverUrl + '/'+wordId, {
            method: 'DELETE'
        }).then(response => response.json())
        .then(response => {
            const viewNode = document.getElementById(wordId+'-view');
            const editNode = document.getElementById(wordId+'-edit');
            viewNode.parentNode.removeChild(viewNode);
            editNode.parentNode.removeChild(editNode);
        }).catch(error => {
            alert('Someting Went Wrong!');
            document.getElementById('edit-'+wordId).disabled = false;
            document.getElementById('delete-'+wordId).disabled = false;
        });
    }
};

const editItem = (wordId) => {
    document.getElementById(wordId+'-view').classList.add('d-none');
    document.getElementById(wordId+'-edit').classList.remove('d-none');
};

const cancelEdit = (wordId) => {
    const wordInput = document.getElementById('wordInput-'+wordId);
    wordInput.value = wordInput.dataset.value;
    document.getElementById(wordId+'-edit').classList.add('d-none');
    document.getElementById(wordId+'-view').classList.remove('d-none');
};

const updateWord = (event, wordId) => {
    event.preventDefault();
    const newWord = document.getElementById('wordInput-'+wordId).value;
    const viewNode = document.getElementById(wordId+'-view');
    const editNode = document.getElementById(wordId+'-edit');
    if(newWord === document.getElementById('wordInput-'+wordId).dataset.value) {
        editNode.classList.add('d-none');
        viewNode.classList.remove('d-none');
        return;
    }
    document.getElementById('submit-button-'+wordId).disabled = true;

    fetch(serverUrl + '/'+wordId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            word: document.getElementById('wordInput-'+wordId).value
        })
    }).then(response => response.json())
    .then(wordJson => {
        viewNode.innerHTML = createViewElement(wordJson);
        editNode.innerHTML = createEditElement(wordJson);
        editNode.classList.add('d-none');
        viewNode.classList.remove('d-none');
    }).catch(error => {
        alert('Someting Went Wrong!');
    });
};

const bodyOnload = () => {
    fetch(serverUrl)
    .then(response => response.json())
    .then(wordsList => {
        console.log(wordsList);
        document.getElementById('main-table-body').innerHTML = wordsList.map(word => {
            return `<tr id="${word._id}-view">
                ${createViewElement(word)}
            </tr>
            <tr id="${word._id}-edit" class="d-none">
                ${createEditElement(word)}
            </tr>`
        }).join('\n');
    }).catch(error => {
        alert('Someting Went Wrong!');
    });
};