import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const authCard = document.getElementById('auth-card');
const dashboard = document.getElementById('dashboard');
const sellerPanel = document.getElementById('seller-panel');
const navUser = document.getElementById('nav-user');
const userBadge = document.getElementById('user-badge');
const navEmail = document.getElementById('nav-email');
const accTypeGroup = document.getElementById('acc-type-group');

let isLoginMode = true;

// 10% Commission Calculation
window.calculateCommission = () => {
  const basePrice = parseFloat(document.getElementById('p-price').value) || 0;
  const comm = basePrice * 0.10;
  const finalPrice = basePrice + comm;
  document.getElementById('comm-fee').innerText = comm.toFixed(0);
  document.getElementById('final-price').innerText = finalPrice.toFixed(0);
};

// Toggle Sign Up/Login UI
document.getElementById('toggle-btn').addEventListener('click', (e) => {
  e.preventDefault();
  isLoginMode = !isLoginMode;
  if(isLoginMode) {
    document.getElementById('auth-title').innerText = "অ্যাকাউন্টে প্রবেশ করুন";
    document.getElementById('btn-login').style.display = "block";
    document.getElementById('btn-signup').style.display = "none";
    accTypeGroup.style.display = "none";
  } else {
    document.getElementById('auth-title').innerText = "নতুন অ্যাকাউন্ট তৈরি করুন";
    document.getElementById('btn-login').style.display = "none";
    document.getElementById('btn-signup').style.display = "block";
    accTypeGroup.style.display = "block";
  }
});

// Sign Up & Save Account Type in Firestore
document.getElementById('btn-signup').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  const accType = document.querySelector('input[name="accType"]:checked').value;

  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await setDoc(doc(db, "users", res.user.uid), {
      email: email,
      accountType: accType
    });
    alert("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");
  } catch (err) { alert(err.message); }
});

// Login
document.getElementById('btn-login').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const pass = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (err) { alert("লগইন ব্যর্থ: " + err.message); }
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => signOut(auth));

// Post Product (Business Account Only)
document.getElementById('btn-post').addEventListener('click', async () => {
  const title = document.getElementById('p-title').value;
  const basePrice = parseFloat(document.getElementById('p-price').value);
  const img = document.getElementById('p-img').value;

  if(!title || !basePrice || !img) return alert("সব ঘর পুরন করুন");

  const finalPrice = basePrice + (basePrice * 0.10);

  await addDoc(collection(db, "products"), {
    title,
    price: finalPrice,
    seller: auth.currentUser.email,
    img
  });

  alert("পণ্যটি সফলভাবে শপে যুক্ত হয়েছে!");
  loadProducts();
});

// Load Feed
async function loadProducts() {
  const feed = document.getElementById('product-feed');
  feed.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "products"));
  
  querySnapshot.forEach(docSnap => {
    const p = docSnap.data();
    feed.innerHTML += `
      <div class="product-card">
        <img src="${p.img}" class="product-img" alt="${p.title}">
        <div class="product-info">
          <h4>${p.title}</h4>
          <p class="seller-name">বিক্রেতা: ${p.seller}</p>
          <div class="product-price">৳${p.price.toFixed(0)}</div>
          <button class="btn btn-primary btn-sm" style="width:100%">এখনই কিনুন</button>
        </div>
      </div>
    `;
  });
}

// User State Observer
onAuthStateChanged(auth, async (user) => {
  if (user) {
    authCard.style.display = "none";
    dashboard.style.display = "block";
    navUser.style.display = "flex";
    navEmail.innerText = user.email;

    // Fetch account type from DB
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if(userDoc.exists()) {
      const userData = userDoc.data();
      userBadge.innerText = userData.accountType;
      
      // Show Post Panel ONLY for Business Accounts
      if(userData.accountType === "Business") {
        sellerPanel.style.display = "block";
      } else {
        sellerPanel.style.display = "none";
      }
    }
    loadProducts();
  } else {
    authCard.style.display = "block";
    dashboard.style.display = "none";
    navUser.style.display = "none";
  }
});
                                                      
