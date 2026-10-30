const Expense = require('../models/Expense');

// 1. POST /expenses - Add new expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    if (!amount || !description || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const expense = await Expense.create({
      amount: parseFloat(amount),
      description,
      category
    });

    res.status(201).json({ message: 'Expense added successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. GET /expenses - Retrieve all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. DELETE /expenses/:id - Delete expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ error: `Expense with ID ${id} not found` });
    }

    await expense.destroy();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. PUT /expenses/:id - [Bonus] Edit expense by ID
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category } = req.body;

    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ error: `Expense with ID ${id} not found` });
    }

    if (amount) expense.amount = parseFloat(amount);
    if (description) expense.description = description;
    if (category) expense.category = category;

    await expense.save();
    res.status(200).json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};