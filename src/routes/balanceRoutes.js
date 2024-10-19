// routes/balanceRoutes.js
const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');

// Define routes for balance operations
router.get('/user/:userId', balanceController.getBalanceSheet);
router.get('/download/:userId', balanceController.downloadBalanceSheet);

module.exports = router;
