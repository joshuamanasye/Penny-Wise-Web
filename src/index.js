import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdnUtRQdhGJNPwSy8qWp2p6ronMaxbS_s",
    authDomain: "penny-wise-7849d.firebaseapp.com",
    databaseURL: "https://penny-wise-7849d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "penny-wise-7849d",
    storageBucket: "penny-wise-7849d.appspot.com",
    messagingSenderId: "282339062328",
    appId: "1:282339062328:web:04b1e756f0789001732ccd",
    measurementId: "G-593CEVDB0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Elements
const homeUsername = document.getElementById("home-username");
const transactionList = document.getElementById("transaction-list");
const currentBalance = document.getElementById("current-balance");
const logoutButton = document.getElementById("logout-btn");

const addTransactionLink = document.getElementById("add-transaction-link");
const addTransactionSection = document.getElementById("add-transaction-section");
const addTransactionForm = document.getElementById("add-transaction-form");
const transactionCategory = document.getElementById("transaction-category");
const transactionTypeRadios = document.querySelectorAll('input[name="transaction-type"]');
const categorySelect = document.getElementById('transaction-category');

// Load home
async function loadHome() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    
    if (!userData || isSessionExpired(userData.timestamp)) {
        alert("You are not logged in or your session has expired. Redirecting to login page...");
        logout();
        return;
    }

    const userRef = ref(db, 'users/' + userData.uid);
    const userSnapshot = await get(userRef);

    if (userSnapshot.exists()) {
        const userDetails = userSnapshot.val();
        homeUsername.innerText = userDetails.username || "User";
    }

    const transactionRef = ref(db, 'transactions/' + userData.uid);
    const transactionSnapshot = await get(transactionRef);

    let balance = 0;
    transactionList.innerHTML = "";

    if (transactionSnapshot.exists()) {
        const transactions = transactionSnapshot.val();
        Object.keys(transactions).forEach((id) => {
            const transaction = transactions[id];
            const li = document.createElement("li");
            li.innerText = `${transaction.name}: $${transaction.amount}`;
            transactionList.appendChild(li);

            if (transaction.type === "Income") {
                balance += parseFloat(transaction.amount);
            } else {
                balance -= parseFloat(transaction.amount);
            }
        });
    }

    currentBalance.innerText = `$${balance.toFixed(2)}`;
}

function logout() {
    signOut(auth).then(() => {
        localStorage.removeItem("userData");
        window.location.href = "login.html";
    });
}

function isSessionExpired(timestamp) {
    const oneHour = 60 * 60 * 1000;
    return Date.now() - timestamp > oneHour;
}

logoutButton.addEventListener("click", logout);
loadHome();

// Function to load categories based on the selected type
const loadCategories = (type) => {
    categorySelect.innerHTML = '';  // Clear the dropdown options first

    // Get categories from the Realtime Database
    const categoriesRef = ref(db, 'categories'); // Update this line to use the new modular approach
    get(categoriesRef)
        .then(snapshot => {
            const categories = snapshot.val();
            // Loop through each category list and filter based on type
            Object.keys(categories).forEach(userId => {
                categories[userId].forEach(category => {
                    if (category && category.type === type) {
                        const option = document.createElement('option');
                        option.value = category.categoryName;
                        option.textContent = category.categoryName;
                        categorySelect.appendChild(option);
                    }
                });
            });
        })
        .catch(error => {
            console.error('Error loading categories:', error);
        });
};

// Event listener for transaction type radio buttons
transactionTypeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        loadCategories(selectedType);  // Load categories based on selected type
    });
});

// Safeguard and default selection
document.addEventListener('DOMContentLoaded', () => {
    const checkedRadio = document.querySelector('input[name="transaction-type"]:checked');
    const selectedType = checkedRadio ? checkedRadio.value : 'Expense'; // Default to 'Expense' if none is selected
    loadCategories(selectedType);
});

// Show add transaction section
addTransactionLink.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("home-section").style.display = "none";
    addTransactionSection.style.display = "block";
    const selectedType = document.querySelector('input[name="transaction-type"]:checked').value;
    loadCategories(selectedType); // Load categories based on selected type
});

// Add transaction event
addTransactionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("transaction-amount").value);
    const type = document.querySelector('input[name="transaction-type"]:checked').value;
    const category = transactionCategory.value;
    const name = document.getElementById("transaction-name").value || "Transaction";
    const description = document.getElementById("transaction-description").value;

    const user = auth.currentUser;
    if (!user) return;

    try {
        const transactionRef = ref(db, `transactions/${user.uid}`);
        await push(transactionRef, {
            amount,
            type,
            category,
            name,
            description,
            date: new Date().toISOString()
        });

        alert("Transaction added successfully!");
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert("Failed to add transaction. Try again.");
    }
});

// Elements
const cancelAddTransactionButton = document.getElementById("cancel-add-transaction-btn");

// Back/Cancel button event
cancelAddTransactionButton.addEventListener("click", () => {
    addTransactionSection.style.display = "none";
    document.getElementById("home-section").style.display = "block";
});

// Logout functionality
document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error(error);
        alert("Failed to log out. Try again.");
    }
});
