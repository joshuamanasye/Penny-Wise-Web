import {initializeApp} from "firebase/compat/app";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDdnUtRQdhGJNPwSy8qWp2p6ronMaxbS_s",
    authDomain: "penny-wise-7849d.firebaseapp.com",
    projectId: "penny-wise-7849d",
    storageBucket: "penny-wise-7849d.firebasestorage.app",
    messagingSenderId: "282339062328",
    appId: "1:282339062328:web:04b1e756f0789001732ccd",
    measurementId: "G-593CEVDB0R"
  };

firebase.initializeApp(firebaseConfig);

const loginPage = document.getElementById("loginPage");
const homePage = document.getElementById("homePage");
const usernameField = document.getElementById("username");
const balanceField = document.getElementById("balance");
const transactionsList = document.getElementById("transactionsList");

function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("User registered successfully!");
      loadHome(userCredential.user);
    })
    .catch((error) => alert(error.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      loadHome(userCredential.user);
    })
    .catch((error) => alert(error.message));
}

function logout() {
  firebase.auth().signOut().then(() => {
    loginPage.style.display = "block";
    homePage.style.display = "none";
  });
}

function loadHome(user) {
  loginPage.style.display = "none";
  homePage.style.display = "block";

  const userId = user.uid;
  usernameField.innerText = user.email;
  
  fetchTransactions(userId);
}

function fetchTransactions(userId) {
  const transactionsRef = firebase.database().ref("transactions/" + userId);
  transactionsRef.on("value", (snapshot) => {
    let transactions = snapshot.val();
    transactionsList.innerHTML = "";
    let balance = 0;

    for (let key in transactions) {
      const transaction = transactions[key];
      const amount = transaction.transactionAmount;
      
      balance += amount;

      transactionsList.innerHTML += `<li>
        ${transaction.transactionName} - $${amount} - ${transaction.transactionDescription || "No description"}
      </li>`;
    }

    balanceField.innerText = balance;
  });
}

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    loadHome(user);
  } else {
    loginPage.style.display = "block";
    homePage.style.display = "none";
  }
});