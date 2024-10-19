const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/users');
const expenseRoutes = require('./src/routes/expenses');
const balanceRoutes = require('./src/routes/balanceRoutes'); // Corrected the path
const path = require('path'); // Import path module for handling file paths
const pool = require('./src/config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware for JSON body parsing
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Route configuration
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/balance', balanceRoutes);

// Root route to serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve index.html
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Test Database Connection (optional)
// You can uncomment this to test if the database connection works
/*
pool.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
    } else {
        console.log('Connected to the database successfully.');
    }
});
*/
