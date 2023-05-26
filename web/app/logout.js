import { signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"

const logout = document.getElementById('logout-button')
console.log('aaa')
logout.addEventListener('click', async (e) => {
    await signOut(auth)
})