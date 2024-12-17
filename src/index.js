// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, query, orderByChild } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js"; // Updated version here

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdnUtRQdhGJNPwSy8qWp2p6ronMaxbS_s",
    authDomain: "penny-wise-7849d.firebaseapp.com",
    databaseURL: "https://penny-wise-7849d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "penny-wise-7849d",
    storageBucket: "penny-wise-7849d.firebasestorage.app",
    messagingSenderId: "282339062328",
    appId: "1:282339062328:web:04b1e756f0789001732ccd",
    measurementId: "G-593CEVDB0R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);

// Elements
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-btn");

const signupUsername = document.getElementById("signup-username");
const signupUserNick = document.getElementById("signup-usernick");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupButton = document.getElementById("signup-btn");

const homeSection = document.getElementById("home-section");
const homeUsername = document.getElementById("home-username");
const transactionList = document.getElementById("transaction-list");
const currentBalance = document.getElementById("current-balance");

// Sign up event
signupButton.addEventListener("click", async () => {
    const email = signupEmail.value;
    const password = signupPassword.value;
    const username = signupUsername.value;
    const userNick = signupUserNick.value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user data in Realtime Database
        await set(ref(db, 'users/' + user.uid), {
            userId: user.uid,
            username: username,
            userNick: userNick,
            userEmail: email
        });

        alert("Signup successful!");
        loadHome(user.uid);
    } catch (error) {
        alert(error.message);
    }
});

// Login event
loginButton.addEventListener("click", async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert("Login successful!");
        loadHome(user.uid);
    } catch (error) {
        alert(error.message);
    }
});

// Load user data and transactions
async function loadHome(uid) {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("signup-section").style.display = "none";
    homeSection.style.display = "block";
	
    // Use ref to get the user document in the Realtime Database
    const userRef = ref(db, 'users/' + uid);
    const userSnapshot = await get(userRef);
    let userData;

    if (userSnapshot.exists()) {
        userData = userSnapshot.val();
        homeUsername.innerText = userData.username || "User";
    } else {
        console.log("No user data found.");
    }

    // Now, get the transactions for the specific user
    const userTransactionsRef = ref(db, 'transactions/' + uid);
    const transactionSnapshot = await get(userTransactionsRef);

    let balance = 0;
    transactionList.innerHTML = "";

    if (transactionSnapshot.exists()) {
        const transactions = transactionSnapshot.val();
        Object.keys(transactions).forEach((transactionId) => {
            const transaction = transactions[transactionId];
            const li = document.createElement("li");
            li.innerText = `${transaction.name}: $${transaction.amount}`;
            transactionList.appendChild(li);

            // Adjust balance based on transaction type (Expense or Income)
            if (transaction.type === "Income") {
                balance += parseFloat(transaction.amount);
            } else {
                balance -= parseFloat(transaction.amount);
            }
        });
    } else {
        console.log("No transactions found for this user.");
    }

    currentBalance.innerText = `$${balance.toFixed(2)}`;
}
