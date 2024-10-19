```markdown
# Expense Management System

A web-based application for managing user expenses, splitting bills among participants, tracking balances, and generating balance sheets. The project includes user registration, login, expense tracking, and split calculation based on various methods (equal, percentage, and exact amounts).

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Usage](#usage)
- [Split Methods Explained](#split-methods-explained)
- [Common Issues](#common-issues)

## Features
- User registration and login functionality.
- Splitting expenses among multiple participants based on different methods (equal, percentage, exact amounts).
- Dynamic balance sheet updating.
- Ability to download balance sheets as CSV files.
- Backend built with Node.js, Express, and PostgreSQL.

## Technologies Used
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: PostgreSQL
- API Authentication: JWT

## Prerequisites
- Node.js and npm installed on your system
- PostgreSQL installed and running
- Basic knowledge of setting up environment variables

## Installation

### Step 1: Clone the Repository
Clone the repository to your local machine using:
```bash
git clone <repository_url>
cd <project_folder>
```

### Step 2: Install Required Packages
Run the following command to install the necessary packages:
```bash
npm install express pg dotenv bcryptjs jsonwebtoken
```

### Step 3: Install Development Dependencies for Testing
Install development dependencies using:
```bash
npm install --save-dev mocha chai supertest
```

### Step 4: Install Tools for API Documentation
Install the required tools for API documentation:
```bash
npm install swagger-jsdoc swagger-ui-express
```

### Step 5: Set Up the Database
1. Create a PostgreSQL database (e.g., `expense_management`).
2. Run the SQL script to create the necessary tables (or use a migration tool like `sequelize` or `knex` if provided):
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(100),
       email VARCHAR(100) UNIQUE NOT NULL,
       mobile VARCHAR(15),
       password VARCHAR(100) NOT NULL
   );

   CREATE TABLE expenses (
       id SERIAL PRIMARY KEY,
       payer_id INTEGER REFERENCES users(id),
       description VARCHAR(255),
       total_amount NUMERIC,
       split_method VARCHAR(50),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
3. Set up a `.env` file to configure your database connection and JWT secret:
   ```
   DB_HOST=localhost
   DB_USER=<your_db_user>
   DB_PASSWORD=<your_db_password>
   DB_NAME=expense_management
   JWT_SECRET=<your_secret_key>
   ```

## Running the Project

### Step 6: Start the Backend Server
Run the following command to start the Express server:
```bash
npm start
```
The server should be running at `http://localhost:3000` by default.

### Step 7: Open the Application in a Browser
Navigate to `http://localhost:3000` in your web browser to access the application.

## API Endpoints

### User Authentication
- **Register**: `POST /api/users/register`
- **Login**: `POST /api/users/login`

### Expenses Management
- **Add Expense**: `POST /api/expenses`
- **Get User Expenses**: `GET /api/expenses/user/:userId`
- **Download Balance Sheet**: `GET /api/balance/download/:userId`

### Balance Sheet
- **Get Balance for User**: `GET /api/balance/user/:userId`

## Usage

### Register and Login
1. Register a new user by filling in the registration form.
2. Login with the registered email and password.

### Adding an Expense
1. Navigate to the expense section after logging in.
2. Fill in the expense details, including description, total amount, split method, participants, and amounts (if required).
3. Submit the form to add the expense, which will be split according to the selected method.

### Viewing and Downloading Balance Sheet
1. The balance sheet will be dynamically updated based on the user's expenses.
2. Click on the "Download Balance Sheet" button to download the current balance sheet as a CSV file.

## Split Methods Explained
1. **Equal Split**: The total amount is divided equally among all participants.
2. **Percentage Split**: The total amount is split according to the specified percentages (which should add up to 100%).
3. **Exact Amount Split**: The total amount is divided based on exact amounts provided for each participant.

## Common Issues
1. **Database Connection Error**: Make sure PostgreSQL is running and the credentials in the `.env` file are correct.
2. **Frontend Not Loading**: Ensure the server is running and check for console errors in the browser.
3. **Expense Calculation Error**: Double-check the split method and provided amounts or percentages.

## License
This project is open-source and available under the [MIT License](LICENSE).

## Contributing
Feel free to create issues and submit pull requests if you want to contribute to the project.

```