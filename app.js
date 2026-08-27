import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// আপনার প্রদত্ত Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAeJNdgqRgGQ5swBW7oYnKEkmTa9IFEiMY",
  authDomain: "shanto-7bbe1.firebaseapp.com",
  projectId: "shanto-7bbe1",
  storageBucket: "shanto-7bbe1.firebasestorage.app",
  messagingSenderId: "1026856902118",
  appId: "1:1026856902118:web:f4f25d2673f0eeb1f3ca27",
  measurementId: "G-TWFXY8EYKC"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Elements
const authCard = document.getElementById('auth-card');
const dashboard = document.getElementById('dashboard');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const btnLogout = document.getElementById('btn-logout');
const toggleBtn = document.getElementById('toggle-btn');
const toggleText = document.getElementById('toggle-text');
const authTitle = document.getElementById('auth-title');
const userEmail = document.getElementById('user-email');
const authError = document.getElementById('auth-error');

let isLoginState = true;

// Toggle Login & Signup UI
toggleBtn.addEventListener('click', (e) => {
  e.preventDefault();
  isLoginState = !isLoginState;
  authError.innerText = "";
  
  if (isLoginState) {
    authTitle.innerText = "লগইন করুন";
    btnLogin.style.display = "block";
    btnSignup.style.display = "none";
    toggleText.innerText = "নতুন অ্যাকাউন্ট নেই?";
    toggleBtn.innerText = "নতুন অ্যাকাউন্ট খুলুন";
  } else {
    authTitle.innerText = "নতুন অ্যাকাউন্ট তৈরি";
    btnLogin.style.display = "none";
    btnSignup.style.display = "block";
    toggleText.innerText = "আগে থেকেই অ্যাকাউন্ট আছে?";
    toggleBtn.innerText = "লগইন করুন";
  }
});

// Sign Up
btnSignup.addEventListener('click', async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    alert("অ্যাকাউন্ট তৈরি সফল হয়েছে!");
  } catch (err) {
    authError.innerText = err.message;
  }
});

// Login
btnLogin.addEventListener('click', async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
  } catch (err) {
    authError.innerText = "লগইন ব্যর্থ: " + err.message;
  }
});

// Logout
btnLogout.addEventListener('click', () => signOut(auth));

// Realtime Auth Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    authCard.style.display = "none";
    dashboard.style.display = "block";
    userEmail.innerText = user.email;
  } else {
    authCard.style.display = "block";
    dashboard.style.display = "none";
  }
});
  
