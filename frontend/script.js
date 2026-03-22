let chart;

// 📅 Format Date
function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// ➕ Add Expense
async function addExpense() {
  const name = document.getElementById("name").value;
  const amount = document.getElementById("amount").value;

  if (!name || !amount) return alert("Please fill all fields");

  await fetch("http://localhost:3000/add-expense", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, amount })
  });

  document.getElementById("name").value = "";
  document.getElementById("amount").value = "";

  loadExpenses();
}

// ❌ Delete Expense
async function deleteExpense(id) {
  await fetch(`http://localhost:3000/delete-expense/${id}`, {
    method: "DELETE"
  });

  loadExpenses();
}

// 🔄 Load Expenses
async function loadExpenses() {
  const res = await fetch("http://localhost:3000/expenses");
  const data = await res.json();

  const list = document.getElementById("list");
  const totalDiv = document.getElementById("total");

  list.innerHTML = "";
  let total = 0;

  data.reverse(); // latest first 🔥

  data.forEach(exp => {
    total += Number(exp.amount);

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="expense-item">
        <div>
          <span>${exp.name} - ₹${exp.amount}</span>
          <br>
          <small>${formatDate(exp.date)}</small>
        </div>
        <button class="delete-btn" onclick="deleteExpense('${exp._id}')">X</button>
      </div>
    `;

    list.appendChild(li);
  });

  totalDiv.textContent = `Total: ₹${total}`;

  // 📊 Chart
  const labels = data.map(exp => exp.name);
  const amounts = data.map(exp => exp.amount);

  if (chart) chart.destroy();

  const ctx = document.getElementById("expenseChart").getContext("2d");

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Expenses",
        data: amounts,
        borderWidth: 1
      }]
    }
  });
}

// 🚀 Load on start
loadExpenses();