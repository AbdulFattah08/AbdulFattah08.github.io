document.addEventListener("DOMContentLoaded", () => {
    const transactionForm = document.getElementById("transactionForm");
    const transactionsTableBody = document.getElementById("transactionList");
    const expenseElement = document.getElementById("Expense");
    const incomeElement = document.getElementById("Income");
    const saveButton = document.getElementById("saveButton");

    let transactions = [];
    let totalExpenses = 0;
    let totalIncome = 0;

    // Load saved inputs from local storage
    loadSavedInputs();

    // Add Transaction Function
    transactionForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent form submission from refreshing the page

        // Get values from form
        const date = document.getElementById("date").value;
        const category = document.getElementById("category").value;
        const type = document.getElementById("type").value;
        const amount = parseFloat(document.getElementById("amount").value);

        // Validate input
        if (!date || !category || !type || isNaN(amount)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        // Add transaction to the array
        const transaction = { date, category, type, amount };
        transactions.push(transaction);

        // Update the transaction list in the UI
        updateTransactionTable();

        // Update the Expenses and Income
        updateFinancialSummary(transaction);

        // Reset the form fields
        transactionForm.reset();
    });

    // Save Inputs Function
    saveButton.addEventListener("click", () => {
        saveInputs();
    });

    // Function to update the transactions table
    function updateTransactionTable() {
        // Clear existing rows
        transactionsTableBody.innerHTML = "";

        // Populate the table with transactions
        transactions.forEach((transaction, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>${transaction.type}</td>
                <td>£${transaction.amount.toFixed(2)}</td>
                <td>
                    <button onclick="deleteTransaction(${index})">Delete</button>
                </td>
            `;

            transactionsTableBody.appendChild(row);
        });
    }

    // Function to update the Expenses and Income
    function updateFinancialSummary(transaction, isDeleting = false) {
        if (transaction.type === "expense") {
            if (isDeleting) {
                // When deleting, subtract the amount from expenses
                totalExpenses -= transaction.amount;
            } else {
                // When adding, add the amount to expenses
                totalExpenses += transaction.amount;
                totalIncome -= transaction.amount; // Subtract the expense from the income
            }
            expenseElement.textContent = `£${totalExpenses.toFixed(2)}`;
            incomeElement.textContent = `£${totalIncome.toFixed(2)}`;
        } else if (transaction.type === "income") {
            if (isDeleting) {
                // When deleting, subtract the amount from income
                totalIncome -= transaction.amount;
            } else {
                // When adding, add the amount to income
                totalIncome += transaction.amount;
            }
            incomeElement.textContent = `£${totalIncome.toFixed(2)}`;
        }
    }

    // Delete transaction
    window.deleteTransaction = (index) => {
        const deletedTransaction = transactions.splice(index, 1)[0];
        
        // Update financial summary with isDeleting flag set to true
        updateFinancialSummary(deletedTransaction, true);
        
        // Update the transaction table
        updateTransactionTable();
    };

    // Save Inputs Function
    function saveInputs() {
        localStorage.setItem("transactions", JSON.stringify(transactions));
        localStorage.setItem("totalExpenses", totalExpenses);
        localStorage.setItem("totalIncome", totalIncome);
        alert("Inputs saved!");
    }

    // Load Saved Inputs Function
    function loadSavedInputs() {
        const savedTransactions = localStorage.getItem("transactions");
        const savedTotalExpenses = localStorage.getItem("totalExpenses");
        const savedTotalIncome = localStorage.getItem("totalIncome");

        if (savedTransactions) {
            transactions = JSON.parse(savedTransactions);
            updateTransactionTable();
        }

        if (savedTotalExpenses) {
            totalExpenses = parseFloat(savedTotalExpenses);
            expenseElement.textContent = `£${totalExpenses.toFixed(2)}`;
        }

        if (savedTotalIncome) {
            totalIncome = parseFloat(savedTotalIncome);
            incomeElement.textContent = `£${totalIncome.toFixed(2)}`;
        }
    }
});
