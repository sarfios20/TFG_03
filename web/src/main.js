import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { auth } from "./app/firebase.js"

onAuthStateChanged(auth, async (user) => {
    if (user) {
        if (window.location.pathname !== '/src/dashboard.html') {
            window.location.href = "dashboard.html"
        }
    } else {
        if (window.location.pathname !== '/src/index.html') {
            window.location.href = "index.html";
        }
    }
})