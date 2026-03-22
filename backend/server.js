const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

// Use the PORT provided by Render, or default to 3000 for local testing
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root Route: This fixes the "Not Found" message on the main URL
app.get("/", (req, res) => {
  res.send("BillBuddy API is live! 🚀");
});

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
  try {
    const { name, amount } = req.body;
    await pool.query("INSERT INTO expenses (name, amount) VALUES ($1, $2)", [name, amount]);
    res.json({ message: "Expense saved ✅" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get Expenses
app.get("/expenses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete Expense
app.delete("/delete-expense/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM expenses WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted successfully 🗑" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Listen on the dynamic PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});