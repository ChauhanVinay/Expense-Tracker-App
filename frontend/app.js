const API_URL = 'http://localhost:3000/expenses';
let expenses = [];
let editId = null;

function showError(show) {
    document.getElementById('errorMsg').classList.toggle('d-none', !show);
}

// 1. Fetch expenses from Backend on page load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get(API_URL);
        expenses = response.data.expenses;
        displayExpenses();
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
});

// 2. Add Expense (POST to Backend)
async function addExpense() {
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if (!amount || !description || !category) {
        showError(true);
        return;
    }

    showError(false);

    try {
        const response = await axios.post(API_URL, {
            amount: parseFloat(amount),
            description,
            category
        });

        expenses.push(response.data.expense);
        displayExpenses();
        clearFields();
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

// 3. Edit Expense UI setup
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

// 4. Update Expense (PUT to Backend)
async function updateExpense() {
    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if (!amount || !description || !category) {
        showError(true);
        return;
    }

    showError(false);

    try {
        const response = await axios.put(`${API_URL}/${editId}`, {
            amount: parseFloat(amount),
            description,
            category
        });

        expenses = expenses.map(exp => (exp.id === editId ? response.data.expense : exp));
        displayExpenses();
        cancelEdit();
    } catch (error) {
        console.error('Error updating expense:', error);
    }
}

function cancelEdit() {
    editId = null;
    clearFields();
    showError(false);

    document.getElementById('addBtn').classList.remove('d-none');
    document.getElementById('updateBtn').classList.add('d-none');
    document.getElementById('cancelBtn').classList.add('d-none');
}

// 5. Delete Expense (DELETE to Backend)
async function deleteExpense(id) {
    if (!confirm('Delete this expense?')) return;

    try {
        await axios.delete(`${API_URL}/${id}`);
        expenses = expenses.filter(exp => exp.id !== id);

        if (editId === id) {
            cancelEdit();
        }

        displayExpenses();
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
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
                <strong>₹${Number(exp.amount).toFixed(2)}</strong> - ${exp.description}
                <span class="badge bg-secondary">${exp.category}</span>
            </div>
            <div>
                <button class="btn btn-sm btn-info text-white" onclick="editExpense(${exp.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteExpense(${exp.id})">Delete</button>
            </div>
        `;
        list.appendChild(li);
    });

    totalDisplay.innerText = total.toFixed(2);
}