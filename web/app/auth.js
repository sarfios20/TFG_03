import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"

// Sign In function
const signinForm = document.getElementById('signin-form')

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = signinForm['signin-email'].value
    const password = signinForm['signin-password'].value

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        console.log(userCredentials)
        // Optionally redirect to homepage or user dashboard
        // window.location.href = '/index.html';
    } catch (error) {
        console.error(error)
        // Handle errors here.
    }
});

// Sign Up function
const signupForm = document.getElementById('signup-form')

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = signupForm['signup-email'].value
    const password = signupForm['signup-password'].value

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        // Optionally redirect to homepage or user dashboard
        // window.location.href = '/index.html';
    } catch (error) {
        console.error(error)
        // Handle errors here.
    }
});
