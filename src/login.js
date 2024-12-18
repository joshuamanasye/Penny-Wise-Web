import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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

// Login functionality
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-btn");

loginButton.addEventListener("click", async () => {
    const email = loginEmail.value;
    const password = loginPassword.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user data locally for 1 hour
        const userData = {
            uid: user.uid,
            email: user.email,
            timestamp: Date.now()
        };
        localStorage.setItem("userData", JSON.stringify(userData));

        alert("Login successful!");
        window.location.href = "index.html";
    } catch (error) {
        alert(error.message);
    }
});
