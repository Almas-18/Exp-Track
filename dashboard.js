// Dashboard JS – Cards + Charts + Navigation + Logout

// Get DOM elements
const firstDateEl = document.getElementById('first-date');
const lastDateEl = document.getElementById('last-date');
const numExpensesEl = document.getElementById('num-expenses');
const totalAmountEl = document.getElementById('total-amount');
const addExpenseBtn = document.getElementById('add-expense');
const viewAllBtn = document.getElementById('view-all');
const logoutBtn = document.getElementById('logout');

// Redirect to login if not logged in
if(!localStorage.getItem('loggedInUser')){
    window.location.href = 'login.html';
}

// Load expenses from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');

// Charts setup
const ctxCategory = document.getElementById('categoryChart').getContext('2d');
const ctxMonthly = document.getElementById('monthlyChart').getContext('2d');

let categoryChart = new Chart(ctxCategory, {
    type: 'pie',
    data: { labels: [], datasets: [{ data: [], backgroundColor: ['#ce4c6cff', '#66bb6a', '#ffa726', '#42a5f5', '#ab47bc'] }] },
    options: { responsive: true, plugins: { legend: { position: 'right' } } }
});

let monthlyChart = new Chart(ctxMonthly, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: { responsive: true, plugins: { legend: { position: 'top' } }, scales: { y: { beginAtZero: true } } }
});

// Navigation buttons
addExpenseBtn.addEventListener('click', () => {
    window.location.href = 'add_expense.html';
});

viewAllBtn.addEventListener('click', () => {
    window.location.href = 'all_expenses.html';
});

// Logout button
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
});

// Update dashboard cards
function updateDashboard() {
    if(expenses.length === 0){
        firstDateEl.textContent = '-';
        lastDateEl.textContent = '-';
        numExpensesEl.textContent = '0';
        totalAmountEl.textContent = '₹0';
        return;
    }
    const sorted = expenses.slice().sort((a,b)=> new Date(a.date) - new Date(b.date));
    firstDateEl.textContent = sorted[0].date;
    lastDateEl.textContent = sorted[sorted.length-1].date;
    numExpensesEl.textContent = expenses.length;
    totalAmountEl.textContent = '₹' + expenses.reduce((sum,e)=> sum + e.amount,0).toFixed(2);
}

// Update charts
function updateCharts() {
    // Category Pie Chart
    const categoryData = {};
    expenses.forEach(e => categoryData[e.category] = (categoryData[e.category] || 0) + e.amount);
    categoryChart.data.labels = Object.keys(categoryData);
    categoryChart.data.datasets[0].data = Object.values(categoryData);
    categoryChart.update();

    // Monthly Bar Chart (Separate Bars per Category)
    const monthlyData = {};
    const categories = [...new Set(expenses.map(e => e.category))];
    expenses.forEach(e => {
        const month = new Date(e.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyData[month]) monthlyData[month] = {};
        monthlyData[month][e.category] = (monthlyData[month][e.category] || 0) + e.amount;
    });

    const months = Object.keys(monthlyData);
    const datasets = categories.map((cat, index) => ({
        label: cat,
        data: months.map(month => monthlyData[month][cat] || 0),
        backgroundColor: ['#ce4c6cff', '#66bb6a', '#ffa726', '#42a5f5', '#ab47bc'][index % 5]
    }));

    monthlyChart.data.labels = months;
    monthlyChart.data.datasets = datasets;
    monthlyChart.update();
}

// Initial load
updateDashboard();
updateCharts();
