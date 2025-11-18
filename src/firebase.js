// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD3YVeoJY_uKf7PHmKoJdx5ittE_04h5b4",
  authDomain: "hotel-supply-7714f.firebaseapp.com",
  projectId: "hotel-supply-7714f",
  storageBucket: "hotel-supply-7714f.firebasestorage.app",
  messagingSenderId: "698411365447",
  appId: "1:698411365447:web:f615e22155d6f75769ad62",
  measurementId: "G-QHL54KXWJT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken(); // ← CRITICAL LINE

    const res = await fetch('https://ndaje-hotel-supply-api.onrender.com/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    alert(`Welcome, ${data.user.name}!`);
    window.location.href = '/ClientDashboard';
  } catch (err) {
    console.error(err);
    alert(err.message || 'Google Sign-In failed');
  }
};