import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"

const signupForm =document.getElementById('signup-form')

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = signupForm['signup-email'].value
    const password = signupForm['signup-password'].value

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.log(error)
        //manejo de errores
    }
})