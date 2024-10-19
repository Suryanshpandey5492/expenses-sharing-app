document.addEventListener('DOMContentLoaded', () => {
    // Store the logged-in user ID globally
    let loggedInUserId;

    // Handle the registration form submission
    document.getElementById('registration-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const mobile = document.getElementById('register-mobile').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, mobile, password }),
            });

            const data = await response.json();
            document.getElementById('registration-message').textContent = data.message;

            if (response.ok) {
                document.getElementById('registration-section').style.display = 'none';
                document.getElementById('login-section').style.display = 'block';
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    });

    // Handle the login form submission
    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            document.getElementById('login-message').textContent = data.message;

            if (response.ok) {
                loggedInUserId = data.userId; // Assuming the API returns the user ID

                // Alert the user ID
                alert(`Logged in successfully! Your user ID is: ${loggedInUserId}`);

                document.getElementById('login-section').style.display = 'none';
                document.getElementById('expense-section').style.display = 'block';

                loadExpenses(loggedInUserId); // Load expenses for the logged-in user
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    });

    // Handle the expense form submission
// Function to calculate split amounts based on the method chosen
// Function to calculate split amounts
function calculateSplitAmounts(totalAmount, splitMethod, participants, amounts) {
    const splitResults = {}; // Object to hold participant ID and their calculated amount

    if (splitMethod === 'equal') {
        const equalAmount = totalAmount / participants.length;
        participants.forEach(participant => {
            splitResults[participant] = equalAmount; // Assign equal amount to each participant
        });
    } else if (splitMethod === 'percentage') {
        let totalPercentage = amounts.reduce((sum, amount) => sum + amount, 0);
        
        if (totalPercentage !== 100) {
            throw new Error('Total percentage must equal 100');
        }

        participants.forEach((participant, index) => {
            const percentageAmount = (amounts[index] / 100) * totalAmount; // Calculate based on percentage
            splitResults[participant] = percentageAmount;
        });
    } else if (splitMethod === 'exact') {
        if (amounts.length !== participants.length) {
            throw new Error('Amounts provided do not match number of participants');
        }

        participants.forEach((participant, index) => {
            splitResults[participant] = amounts[index]; // Assign exact amounts to each participant
        });
    } else {
        throw new Error('Invalid split method');
    }

    return splitResults; // Return the calculated amounts for each participant
}

// Modify the expense form submission to include split calculation
document.getElementById('expense-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const description = document.getElementById('expense-description').value;
    const totalAmount = parseFloat(document.getElementById('expense-amount').value); // Total amount of the expense
    const payer_id = loggedInUserId; // Use logged-in user's ID as payer_id

    // Get split method and participants
    const splitMethod = document.getElementById('split-method').value;
    const participants = document.getElementById('participants').value.split(',').map(p => p.trim());
    let amounts = [];

    // Check if specific amounts are provided for Exact or Percentage methods
    if (splitMethod === 'exact' || splitMethod === 'percentage') {
        const amountsInput = document.getElementById('amounts').value;
        amounts = amountsInput.split(',').map(a => parseFloat(a.trim()));
    }

    // Calculate the split amounts
    let splitAmounts;
    try {
        splitAmounts = calculateSplitAmounts(totalAmount, splitMethod, participants, amounts);
    } catch (error) {
        alert(error.message); // Show error if there's an issue with the split calculation
        return;
    }

    // Send a separate API request for each participant
    for (const participant of participants) {
        const splitAmount = splitAmounts[participant]; // Get the calculated amount for the participant

        // Create a separate payer_id logic if necessary (you can adjust this as needed)
        const participantPayerId = participant; // Assuming participant ID is used as payer ID, change as needed

        try {
            const response = await fetch('/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    payer_id: participantPayerId, // Use participant's ID as payer_id
                    description, // Use the same description
                    total_amount: splitAmount, // Use the calculated split amount
                    split_method: splitMethod, // Include the split method used
                    participants: [participant], // Send the current participant only
                    amounts: { [participant]: splitAmount }, // Send the amount for the current participant
                }),
            });

            const data = await response.json();
            alert(`Expense added for ${participant}: ${data.message}`); // Show success message for each participant

        } catch (error) {
            console.error(`Error adding expense for ${participant}:`, error);
        }
    }

    loadExpenses(loggedInUserId); // Refresh the expenses list for the logged-in user
    updateBalanceSheet(); // Update balance sheet
    document.getElementById('expense-form').reset(); // Clear the form
});

 // Function to load existing expenses for the logged-in user
 async function loadExpenses(userId) {
    try {
        const response = await fetch(`/api/expenses/user/${userId}`); // Fetch expenses for the specific user
        const expenses = await response.json(); // Extract JSON data from the response

        const expenseList = document.getElementById('expense-list');
        expenseList.innerHTML = ''; // Clear existing list

        // Check if expenses are returned and add them to the list
        if (expenses.length === 0) {
            expenseList.innerHTML = '<li>No expenses found.</li>';
        } else {
            expenses.forEach(expense => {
                const li = document.createElement('li');
                li.textContent = `${expense.description} - $${expense.total_amount}`; // Adjust based on your DB field names
                expenseList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}


    // Function to update the balance sheet
    async function updateBalanceSheet() {
        try {
            const response = await fetch(`/api/balance/user/${loggedInUserId}`); // Fetch balance sheet for the specific user
            const balance = await response.json(); // Extract JSON data from the response

            const balanceSheet = document.getElementById('balance-sheet');
            balanceSheet.innerHTML = ''; // Clear existing balance

            // Check if balance data is returned and add it to the sheet
            if (Object.keys(balance).length === 0) {
                balanceSheet.innerHTML = '<p>No balance data found.</p>';
            } else {
                for (const [user, amount] of Object.entries(balance)) {
                    const p = document.createElement('p');
                    p.textContent = `${user}: $${amount.toFixed(2)}`;
                    balanceSheet.appendChild(p);
                }
            }
        } catch (error) {
            console.error('Error loading balance sheet:', error);
        }
    }

    // Switch to login form when link is clicked
    document.getElementById('switch-to-login').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        document.getElementById('registration-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
    });

    // Switch to registration form when link is clicked
    document.getElementById('switch-to-registration').addEventListener('click', (event) => {
        event.preventDefault();
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('registration-section').style.display = 'block';
    });

    // Handle downloading balance sheet
    document.getElementById('download-balance-sheet').addEventListener('click', function() {
        const userId = loggedInUserId; // Replace with actual user ID
        fetch(`/api/balance/download/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob(); // Assuming the server sends a CSV file
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'balance_sheet.csv'; // Default file name
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Error downloading the balance sheet:', error);
            });
    });    
});










