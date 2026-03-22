let chart;
// 🌐 This connects your frontend to your live Render backend
const API_URL = "https://billbuddy-k1s6.onrender.com";

// 📅 Format Date for Indian Locale (e.g., 22 Mar 2026)
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

  try {
    await fetch(`${API_URL}/add-expense`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, amount })
    });

    document.getElementById("name").value = "";
    document.getElementById("amount").value = "";

    loadExpenses();
  } catch (err) {
    console.error("Error adding expense:", err);
  }
}

// ❌ Delete Expense (Fixed to use .id for PostgreSQL)
async function deleteExpense(id) {
  try {
    await fetch(`${API_URL}/delete-expense/${id}`, {
      method: "DELETE"
    });
    loadExpenses();
  } catch (err) {
    console.error("Error deleting expense:", err);
  }
}

// 🔄 Load Expenses from Render + Supabase
async function loadExpenses() {
  try {
    const res = await fetch(`${API_URL}/expenses`);
    const data = await res.json();

    const list = document.getElementById("list");
    const totalDiv = document.getElementById("total");

    list.innerHTML = "";
    let total = 0;

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
          <button class="delete-btn" onclick="deleteExpense('${exp.id}')">X</button>
        </div>
      `;
      list.appendChild(li);
    });

    totalDiv.textContent = `Total: ₹${total}`;
    updateChart(data);
  } catch (err) {
    console.error("Error loading expenses:", err);
  }
}

// 📊 Update Chart
function updateChart(data) {
  const labels = data.map(exp => exp.name);
  const amounts = data.map(exp => exp.amount);

  if (chart) chart.destroy();

  const ctx = document.getElementById("expenseChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Expenses (₹)",
        data: amounts,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// 🚀 Run on page load
loadExpenses();