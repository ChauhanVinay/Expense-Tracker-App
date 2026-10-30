const express = require('express');
const router = express.Router();

const expenseController = require('../controllers/ExpenseController');

router.post('/expenses', expenseController.addExpense);
router.get('/expenses', expenseController.getAllExpenses);
router.delete('/expenses/:id', expenseController.deleteExpense);
router.put('/expenses/:id', expenseController.updateExpense);

module.exports = router;
