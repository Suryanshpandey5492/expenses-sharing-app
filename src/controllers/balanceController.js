// src/controllers/balanceController.js
const pool = require('../config/db'); // Import the database connection
const { Parser } = require('json2csv'); // JSON to CSV parser
const fs = require('fs'); // File system module
const path = require('path'); // Path module

// Fetch balance sheet for a specific user
exports.getBalanceSheet = async (req, res) => {
    try {
        const loggedInUserId = req.params.userId; // Get the user ID from the request
        const query = 'SELECT * FROM balance WHERE user_id = $1'; // Your SQL query
        const values = [loggedInUserId]; // Values to replace in the query

        const result = await pool.query(query, values); // Execute the query

        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'No balance data found for this user.' });
        }

        // Send the balance sheet data back in response
        res.send({ balanceData: result.rows }); 
    } catch (error) {
        console.error('Error fetching balance sheet:', error);
        res.status(500).send({ error: 'Error fetching balance sheet' });
    }
};

// Download balance sheet for a specific user
exports.downloadBalanceSheet = async (req, res) => {
    try {
        const loggedInUserId = req.params.userId; // Get the user ID from the request
        const query = 'SELECT * FROM expenses WHERE payer_id = $1'; // Updated SQL query to fetch from expenses table
        const values = [loggedInUserId]; // Values to replace in the query

        const result = await pool.query(query, values); // Execute the query

        if (result.rows.length === 0) {
            return res.status(404).send({ error: 'No expense data found for this user.' });
        }

        // Create CSV from result.rows
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(result.rows);

        // Set response headers for file download
        res.header('Content-Type', 'text/csv');
        res.attachment('expenses.csv'); // Name the file
        res.send(csv); // Send CSV data as response
    } catch (error) {
        console.error('Error generating balance sheet:', error);
        res.status(500).send({ error: 'Error generating balance sheet' });
    }
};

