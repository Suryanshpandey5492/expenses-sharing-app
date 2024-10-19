// src/controllers/expenseController.js
const pool = require('../config/db');

// Function to add an expense
// const addExpense = async (req, res) => {
//     const { payer_id, description, total_amount } = req.body;

//     // Check if all required fields are provided
//     if (!payer_id || !description || !total_amount) {
//         return res.status(400).send({ message: 'All fields are required' });
//     }

//     try {
//         // Insert expense into the database
//         const result = await pool.query('INSERT INTO expenses (payer_id, description, total_amount) VALUES ($1, $2, $3) RETURNING *', [payer_id, description, total_amount]);
//         const newExpense = result.rows[0];
//         res.status(201).send({ message: 'Expense added successfully', expense: newExpense });
//     } catch (error) {
//         console.error('Error adding expense:', error);
//         res.status(500).send({ message: 'Internal server error' });
//     }
// };
const addExpense = async (req, res) => {
    const { payer_id, description, total_amount, split_method, participants, amounts } = req.body;

    // Check if all required fields are provided
    if (!payer_id || !description || !total_amount || !participants || !amounts) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    try {
        // Loop through each participant and add their expense entry
        const expenses = []; // Array to hold all expense records to insert

        participants.forEach((participant) => {
            const amount = amounts[participant]; // Get the amount for the current participant
            expenses.push({ payer_id: participant, description, total_amount: amount });
        });

        // Prepare query and values for bulk insertion
        const insertQueries = expenses.map(expense => 
            pool.query('INSERT INTO expenses (payer_id, description, total_amount) VALUES ($1, $2, $3) RETURNING *', 
            [expense.payer_id, expense.description, expense.total_amount])
        );

        // Execute all insert queries concurrently
        const results = await Promise.all(insertQueries);
        
        // Collect the newly added expenses
        const newExpenses = results.map(result => result.rows[0]);

        res.status(201).send({ message: 'Expenses added successfully', expenses: newExpenses });
    } catch (error) {
        console.error('Error adding expenses:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

// Function to get expenses for a specific user
// src/controllers/expenseController.js
const getUserExpenses = async (req, res) => {
    const userId = req.params.userId; // Extract the user ID from the request parameters

    try {
        const results = await pool.query('SELECT * FROM expenses WHERE payer_id = $1', [userId]); // Fetch expenses for the specific user
        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};




module.exports = { addExpense, getUserExpenses };
