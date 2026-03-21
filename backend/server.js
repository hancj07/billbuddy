const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/billbuddy")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Schema
const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model("Expense", expenseSchema);

// Add Expense
app.post("/add-expense", async (req, res) => {
  const { name, amount } = req.body;

  const newExpense = new Expense({ name, amount });
  await newExpense.save();

  res.json({ message: "Expense saved ✅" });
});

// Get Expenses
app.get("/expenses", async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

// Delete Expense
app.delete("/delete-expense/:id", async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully 🗑" });
});

// Start Server
app.listen(3000, () => {
  console.log("Server running on port 3000 🚀");
});