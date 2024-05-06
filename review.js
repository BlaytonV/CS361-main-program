let expenseHistory = [];

document.addEventListener('DOMContentLoaded', function () {
    loadData();
    attachEventListeners();
});

function loadData() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    document.getElementById('updatedMonthlyIncome').value = userData.monthlyIncome || '';
    document.getElementById('savingsGoalPercentage').value = userData.savingsGoalPercentage || 20;

    const expenseContainer = document.getElementById('expenseEntries');
    userData.expenses.forEach(exp => {
        addExpenseEntry(exp.name, exp.amount);
    });
}

function attachEventListeners() {
    document.getElementById('addMoreExpensesButton').addEventListener('click', () => addExpenseEntry());
    document.getElementById('updateFinancialPlanButton').addEventListener('click', calculateResults);
    document.getElementById('printFinancialStatementButton').addEventListener('click', () => window.print());
    document.getElementById('undoButton').addEventListener('click', undoLastAction);
}

function addExpenseEntry(name = '', amount = '') {
    saveCurrentState();
    const expenseContainer = document.getElementById('expenseEntries');
    const expenseEntry = document.createElement('div');
    expenseEntry.classList.add('expenseEntry');
    expenseEntry.innerHTML = `
        <input type="text" placeholder="Name of the expense" class="expense-name" value="${name}">
        <input type="number" placeholder="Amount of the expense" class="expense-amount" value="${amount}">
        <button onclick="removeExpenseEntry(this)">Remove</button>
    `;
    expenseContainer.appendChild(expenseEntry);
}

function removeExpenseEntry(button) {
    saveCurrentState();
    button.parentElement.remove();
}

function saveCurrentState() {
    const expenses = Array.from(document.getElementsByClassName('expenseEntry')).map(entry => ({
        name: entry.querySelector('.expense-name').value,
        amount: entry.querySelector('.expense-amount').value
    }));
    expenseHistory.push(expenses);
}

function undoLastAction() {
    if (expenseHistory.length > 0) {
        const lastState = expenseHistory.pop(); // Remove the last saved state
        const expenseContainer = document.getElementById('expenseEntries');
        expenseContainer.innerHTML = ''; // Clear current entries
        lastState.forEach(exp => {
            addExpenseEntry(exp.name, exp.amount);
        });
    }
}

function calculateResults() {
    const updatedMonthlyIncome = parseFloat(document.getElementById('updatedMonthlyIncome').value || 0);
    const savingsGoalPercentage = parseFloat(document.getElementById('savingsGoalPercentage').value || 0);
    const expenses = Array.from(document.getElementsByClassName('expense-amount')).reduce((sum, input) => sum + parseFloat(input.value || 0), 0);
    const savingsGoal = updatedMonthlyIncome * (savingsGoalPercentage / 100);
    const leftoverAmount = updatedMonthlyIncome - expenses - savingsGoal;

    const financialSummary = document.getElementById('financialSummary');
    financialSummary.innerHTML = `
        <p>Monthly Income: $${updatedMonthlyIncome.toFixed(2)}</p>
        <p>Total Expenses: $${expenses.toFixed(2)}</p>
        <p>Savings Goal at ${savingsGoalPercentage}%: $${savingsGoal.toFixed(2)}</p>
        <p>Leftover Amount: $${leftoverAmount.toFixed(2)}</p>
    `;

    if (leftoverAmount < 0) {
        financialSummary.innerHTML += `<p>With your current expenses and income you don’t have the adequate amount of income to save ${savingsGoalPercentage}% of your income and pay for your total expenses.</p>`;
    } else {
        financialSummary.innerHTML += `<p>With your current expenses and income, you are able to save $${savingsGoal.toFixed(2)} and have a leftover amount of $${leftoverAmount.toFixed(2)}.</p>`;
    }
}

function printFinancialStatement() {
    window.print();
}
