import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"

const signinForm = document.getElementById('signin-form')

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = signinForm['signin-email'].value
    const password = signinForm['signin-password'].value

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.log(error)
        //manejo de errores
    }
})