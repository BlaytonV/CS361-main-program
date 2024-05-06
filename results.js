document.addEventListener('DOMContentLoaded', function () {
    const userData = localStorage.getItem('userData');
    const data = JSON.parse(userData);
    const container = document.getElementById('resultsContainer');

    if (data) {
        let totalExpenses = 0;
        const income = parseFloat(data.monthlyIncome || 0);
        container.innerHTML += `<div>Monthly Income: $${income.toFixed(2)}</div>`;

        if (data.expenses && data.expenses.length > 0) {
            data.expenses.forEach(exp => {
                totalExpenses += parseFloat(exp.amount);
            });
            container.innerHTML += `<div>Total Expenses: $${totalExpenses.toFixed(2)}</div>`;
        }

        // Calculate the leftover amount
        const leftoverAmount = income - totalExpenses;
        container.innerHTML += `<div>Leftover Amount: $${leftoverAmount.toFixed(2)}</div>`;

        // Set up savings calculation area
        const savingsInput = document.getElementById('savingsPercentage');
        const savingsResult = document.getElementById('savingsResult');
        const netSavingsResult = document.getElementById('netSavingsResult');
        const advice = document.getElementById('financialAdvice'); 
        if (savingsInput) {
            savingsInput.addEventListener('input', function () {
                const savingsPercentage = parseFloat(savingsInput.value) || 0;
                const savingsAmount = income * (savingsPercentage / 100);
                const netSavings = leftoverAmount - savingsAmount;  // Calculate the difference after trying to save

                savingsResult.textContent = `Planned Savings: $${savingsAmount.toFixed(2)}`;
                netSavingsResult.textContent = `Amount After Savings $${netSavings.toFixed(2)}`;

                if (netSavings > 0) {
                    advice.textContent = 'You have a positive balance after saving! Consider contributing more to your savings or invest it.';
                } else if (netSavings < 0) {
                    advice.textContent = 'You have a negative balance after saving. Consider cutting costs on some of your expenses.';
                } else {
                    advice.textContent = 'Your budget is perfectly balanced after saving. Great job!';
                }
            });
        }
    } else {
        container.textContent = "No data available. Please ensure you have entered data on the main page.";
    }
});
