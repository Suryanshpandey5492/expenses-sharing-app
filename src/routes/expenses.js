const express = require('express');
const { addExpense, getUserExpenses } = require('../controllers/expenseController');
const router = express.Router();

// Route to add an expense
router.post('/', addExpense);

// Route to get expenses for a specific user
router.get('/user/:userId', getUserExpenses); // Change to :userId

module.exports = router;
