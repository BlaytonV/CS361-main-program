function addExpenseEntry() {
    const container = document.getElementById('expenseEntries');
    const newEntry = document.createElement('div');
    newEntry.classList.add('expenseEntry');

    newEntry.innerHTML = `
        <input type="text" placeholder="Name of the expense" class="expense-name">
        <input type="number" placeholder="Amount" class="expense-amount" style="display: none;">
        <button type="button" class="edit-btn">Edit</button>
        <button type="button" class="remove-btn" style="display: none;" onclick="removeExpenseEntry(this)">Remove</button>
    `;


    const addMoreBtn = document.getElementById('addMoreBtn');
    if (addMoreBtn) {
        container.insertBefore(newEntry, addMoreBtn);
    } else {
        container.appendChild(newEntry);
    }

    newEntry.querySelector('.expense-name').focus();


    newEntry.querySelector('.expense-name').addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleExpenseNameEntry(event, newEntry);
        }
    });
}

function handleExpenseNameEntry(event, newEntry) {
    const nameInput = event.target;
    const amountInput = newEntry.querySelector('.expense-amount');
    const editButton = newEntry.querySelector('.edit-btn');
    const removeButton = newEntry.querySelector('.remove-btn');

    if (nameInput.value.trim() !== "") {
        nameInput.setAttribute('disabled', 'disabled');
        amountInput.style.display = '';
        removeButton.style.display = '';
        editButton.innerText = 'Save';
        amountInput.focus();

        editButton.addEventListener('click', function (e) {
            e.preventDefault();
            toggleFields(nameInput, amountInput, editButton);
        });
    }
}

function toggleFields(nameInput, amountInput, editButton) {
    if (editButton.innerText === 'Save') {
        // Set fields to readonly if saving
        nameInput.setAttribute('readonly', true);
        amountInput.setAttribute('readonly', true);
        editButton.innerText = 'Edit';
    } else {
        // Allow fields to be editable again
        nameInput.removeAttribute('readonly');
        nameInput.removeAttribute('disabled');
        amountInput.removeAttribute('readonly');
        editButton.innerText = 'Save';
    }
}

function removeExpenseEntry(button) {
    button.parentElement.remove();
}

document.getElementById('financeForm').addEventListener('submit', function (event) {
    event.preventDefault();
});

document.getElementById('questionBtn').addEventListener('click', function () {
    var noteContainer = document.getElementById('noteContainer');
    if (noteContainer.classList.contains('hidden')) {
        noteContainer.classList.remove('hidden');
        noteContainer.classList.add('visible');
    } else {
        noteContainer.classList.remove('visible');
        noteContainer.classList.add('hidden');
    }
});

document.getElementById('submitBtn').addEventListener('click', function (event) {
    event.preventDefault();

    const inputs = document.querySelectorAll('.container input');
    const data = {
        monthlyIncome: document.getElementById('monthlyIncome').value,
        expenses: []
    };

    // Collect all expense entries
    document.querySelectorAll('.expenseEntry').forEach(entry => {
        const nameInput = entry.querySelector('.expense-name');
        const amountInput = entry.querySelector('.expense-amount');
        if (nameInput && amountInput && nameInput.value && amountInput.value) {
            data.expenses.push({
                name: nameInput.value,
                amount: amountInput.value
            });
        }
    });

    localStorage.setItem('userData', JSON.stringify(data));
    alert('Data saved successfully to local storage!');
});

document.addEventListener('DOMContentLoaded', function () {
    const userData = localStorage.getItem('userData');
    if (userData) {
        const data = JSON.parse(userData);

        if (data.monthlyIncome) {
            document.getElementById('monthlyIncome').value = data.monthlyIncome;
        }

        if (data.expenses && data.expenses.length > 0) {
            const container = document.getElementById('expenseEntries');
            data.expenses.forEach(exp => {
                const newEntry = document.createElement('div');
                newEntry.classList.add('expenseEntry');
                newEntry.innerHTML = `
                    <input type="text" placeholder="Name of the expense" class="expense-name" value="${exp.name}">
                    <input type="number" placeholder="Amount" class="expense-amount" value="${exp.amount}">
                    <button type="button" class="edit-btn">Edit</button>
                    <button type="button" class="remove-btn" onclick="removeExpenseEntry(this)">Remove</button>
                `;
                container.appendChild(newEntry);
            });
        }
    }
});


function sendFormData(data) {

    fetch('your-endpoint-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
}
