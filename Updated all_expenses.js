// All Expenses JS – Table Only with Edit/Delete

const expenseTableBody = document.querySelector('#expense-table tbody');
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

// Function to render table
function updateTable() {
    expenseTableBody.innerHTML = '';
    expenses.forEach((e, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${e.date}</td>
            <td>${e.desc}</td>
            <td>${e.category}</td>
            <td>₹${e.amount.toFixed(2)}</td>
            <td>
                <button onclick="editExpense(${index})">Edit</button>
                <button onclick="deleteExpense(${index})">Delete</button>
            </td>
        `;
        expenseTableBody.appendChild(row);
    });
}

// Delete an expense
function deleteExpense(index) {
    if(confirm('Are you sure you want to delete this expense?')) {
        expenses.splice(index, 1);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateTable();
    }
}

// Edit an expense
function editExpense(index) {
    const e = expenses[index];
    const newDate = prompt('Enter date (YYYY-MM-DD):', e.date);
    const newDesc = prompt('Enter description:', e.desc);
    const newCategory = prompt('Enter category:', e.category);
    const newAmount = parseFloat(prompt('Enter amount:', e.amount));

    if(newDate && newDesc && newCategory && !isNaN(newAmount)) {
        expenses[index] = { date: newDate, desc: newDesc, category: newCategory, amount: newAmount };
        localStorage.setItem('expenses', JSON.stringify(expenses));
        updateTable();
    } else {
        alert('Invalid input. Expense not updated.');
    }
}

// Initial render
updateTable();
