const expenseTableBody = document.querySelector('#expense-table tbody');
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

// Render the table
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
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            </td>
        `;
        expenseTableBody.appendChild(row);
    });
}

// Event delegation for Edit/Delete buttons
expenseTableBody.addEventListener('click', function(e) {
    const target = e.target;
    const index = target.dataset.index;
    if(target.classList.contains('delete-btn')) {
        if(confirm('Are you sure you want to delete this expense?')) {
            expenses.splice(index, 1);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            updateTable();
        }
    } else if(target.classList.contains('edit-btn')) {
        const expense = expenses[index];
        const newDate = prompt('Enter date (YYYY-MM-DD):', expense.date);
        const newDesc = prompt('Enter description:', expense.desc);
        const newCategory = prompt('Enter category:', expense.category);
        const newAmount = parseFloat(prompt('Enter amount:', expense.amount));

        if(newDate && newDesc && newCategory && !isNaN(newAmount)) {
            expenses[index] = { date: newDate, desc: newDesc, category: newCategory, amount: newAmount };
            localStorage.setItem('expenses', JSON.stringify(expenses));
            updateTable();
        } else {
            alert('Invalid input. Expense not updated.');
        }
    }
});

// Initial render
updateTable();
