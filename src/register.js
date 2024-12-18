import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const auth = getAuth();
const db = getDatabase();

const signupUsername = document.getElementById("signup-username");
const signupUserNick = document.getElementById("signup-usernick");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupButton = document.getElementById("signup-btn");

signupButton.addEventListener("click", async () => {
    const email = signupEmail.value;
    const password = signupPassword.value;
    const username = signupUsername.value;
    const userNick = signupUserNick.value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await set(ref(db, 'users/' + user.uid), {
            userId: user.uid,
            username: username,
            userNick: userNick,
            userEmail: email
        });

        alert("Signup successful! Please log in.");
        window.location.href = "login.html";
    } catch (error) {
        alert(error.message);
    }
});
