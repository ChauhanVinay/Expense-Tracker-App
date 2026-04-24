let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editId = null;

function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function showError(show) {
    document.getElementById('errorMsg').classList.toggle('d-none', !show);
}

function addExpense() {
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if (!amount || !description || !category) {
        showError(true);
        return;
    }

    showError(false);

    const expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        description,
        category
    };

    expenses.push(expense);
    saveToLocalStorage();
    displayExpenses();
    clearFields();
}

function editExpense(id) {
    const exp = expenses.find(e => e.id === id);
    if (!exp) return;

    document.getElementById('amount').value = exp.amount;
    document.getElementById('description').value = exp.description;
    document.getElementById('category').value = exp.category;

    editId = id;

    document.getElementById('addBtn').classList.add('d-none');
    document.getElementById('updateBtn').classList.remove('d-none');
    document.getElementById('cancelBtn').classList.remove('d-none');

    showError(false);
}

function updateExpense() {
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if (!amount || !description || !category) {
        showError(true);
        return;
    }

    showError(false);

    expenses = expenses.map(exp => {
        if (exp.id === editId) {
            return {
                ...exp,
                amount: parseFloat(amount),
                description,
                category
            };
        }
        return exp;
    });

    saveToLocalStorage();
    displayExpenses();
    cancelEdit();
}

function cancelEdit() {
    editId = null;
    clearFields();
    showError(false);

    document.getElementById('addBtn').classList.remove('d-none');
    document.getElementById('updateBtn').classList.add('d-none');
    document.getElementById('cancelBtn').classList.add('d-none');
}

function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;

    expenses = expenses.filter(exp => exp.id !== id);

    if (editId === id) {
        cancelEdit();
    }

    saveToLocalStorage();
    displayExpenses();
}

function clearFields() {
    document.getElementById('amount').value = '';
    document.getElementById('description').value = '';
    document.getElementById('category').value = '';
}

function displayExpenses() {
    const list = document.getElementById('expenseList');
    const totalDisplay = document.getElementById('total');
    const emptyMsg = document.getElementById('emptyMsg');

    list.innerHTML = '';
    let total = 0;

    if (expenses.length === 0) {
        emptyMsg.classList.remove('d-none');
        totalDisplay.innerText = '0.00';
        return;
    }

    emptyMsg.classList.add('d-none');

    expenses.forEach(exp => {
        total += exp.amount;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <strong>₹${exp.amount.toFixed(2)}</strong> - ${exp.description}
                <span class="badge bg-secondary">${exp.category}</span>
            </div>
            <div>
                <button class="btn btn-sm btn-info" onclick="editExpense(${exp.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${exp.id})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });

    totalDisplay.innerText = total.toFixed(2);
}

displayExpenses();