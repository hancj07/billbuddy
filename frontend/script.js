let chart;

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

async function deleteExpense(id) {
  await fetch(`http://localhost:3000/delete-expense/${id}`, {
    method: "DELETE"
  });

  loadExpenses();
}

async function loadExpenses() {
  const res = await fetch("http://localhost:3000/expenses");
  const data = await res.json();

  const list = document.getElementById("list");
  const totalDiv = document.getElementById("total");

  list.innerHTML = "";
  let total = 0;

  data.forEach(exp => {
    total += Number(exp.amount);

    const li = document.createElement("li");

    li.innerHTML = `
      <span>${exp.name} - ₹${exp.amount}</span>
      <button class="delete-btn" onclick="deleteExpense('${exp._id}')">X</button>
    `;

    list.appendChild(li);
  });

  totalDiv.textContent = `Total: ₹${total}`;

  // 📊 Chart Data
  const labels = data.map(exp => exp.name);
  const amounts = data.map(exp => exp.amount);

  // Destroy old chart
  if (chart) {
    chart.destroy();
  }

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

// Load on start
loadExpenses();