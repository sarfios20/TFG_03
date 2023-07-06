import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"

onAuthStateChanged(auth, async (user) => {
    if (user) {
        numeroAvisosRecibidos()
        numeroAvisosEmitidos()
    }
})

function numeroAvisosRecibidos() {
    let avisosRecibidos = document.getElementById('avisos-recibidos')
    const dbRef = ref(database, '/Alertas/Conductor/'+auth.currentUser.uid) 
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val()
        const numAvisos = Object.keys(data).length;
        avisosRecibidos.innerHTML = `nº avisos recibidos: ${numAvisos}`;
    })
}

function numeroAvisosEmitidos() {
    let avisosRecibidos = document.getElementById('avisos-emitidos')
    const dbRef = ref(database, '/Alertas/Ciclista/'+auth.currentUser.uid) 
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        const numAvisos = Object.keys(data).length;
        avisosRecibidos.innerHTML = `nº avisos emitidos: ${numAvisos}`;
    })
}