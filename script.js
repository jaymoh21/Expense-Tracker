//Get HTML elements
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const totalincome = document.getElementById("total-income");
const totalexpenses = document.getElementById("total-expenses");
const balanceDisplay = document.getElementById("balance");
const transactionList = document.getElementById("transaction-list");

// load saved transactions
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
// add a new transaction
transactionForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;
  const date = dateInput.value;

  if (
    !description ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    !type ||
    !category ||
    !date
  ) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const transaction = {
    id: Date.now(),
    description: description,
    amount: amount,
    type: type,
    category: category,
    date: date,
  };
  transactions.push(transaction);
  saveTransactions();
  displayTransactions();
  updateDashboard();

  transactionForm.reset();
});

//save transactions to local storage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}
//display transactions
function displayTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach(function (transaction) {
    const row = document.createElement("tr");
    row.innerHTML = ` 
         <td>${escapeHTML(transaction.description)}</td>
         <td>${escapeHTML(transaction.category)}</td>
         <td>${escapeHTML(transaction.date)}</td>
            <td class="${transaction.type}">${transaction.type}</td>
            <td>${transaction.type === "expense" ? "-" : "+"} ksh ${transaction.amount.toFixed(2)}</td>
            <td><button class="delete-btn"
            onclick="deleteTransaction(${transaction.id})">Delete</button></td>
        `;
    transactionList.appendChild(row);
  });
}
// safely display user-entered text
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[character];
  });
}
//update dashboard calculations
function updateDashboard() {
  let income = 0;
  let expenses = 0;

  transactions.forEach(function (transaction) {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expenses += transaction.amount;
    }
  });

  const balance = income - expenses;
  totalincome.textContent = `ksh ${income.toFixed(2)}`;
  totalexpenses.textContent = `ksh ${expenses.toFixed(2)}`;
  balanceDisplay.textContent = `ksh ${balance.toFixed(2)}`;
}
//delete a transaction
function deleteTransaction(id) {
  transactions = transactions.filter(function (transaction) {
    return transaction.id !== id;
  });
  saveTransactions();
  displayTransactions();
  updateDashboard();
}
//initial display
displayTransactions();
updateDashboard();
