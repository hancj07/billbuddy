const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Create table if not exists
pool.query(`
  CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    amount NUMERIC,
    date TIMESTAMP DEFAULT NOW()
  )
`);

// Add Expense
app.post("/add-expense", async (req, res) => {
  const { name, amount } = req.body;
  await pool.query("INSERT INTO expenses (name, amount) VALUES ($1, $2)", [name, amount]);
  res.json({ message: "Expense saved ✅" });
});

// Get Expenses
app.get("/expenses", async (req, res) => {
  const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
  res.json(result.rows);
});

// Delete Expense
app.delete("/delete-expense/:id", async (req, res) => {
  await pool.query("DELETE FROM expenses WHERE id = $1", [req.params.id]);
  res.json({ message: "Deleted successfully 🗑" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});