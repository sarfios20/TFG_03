import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"
import { auth, database } from "./firebase.js"

onAuthStateChanged(auth, async (user) => {
    if (user) {
        calculateReduction('/Alcance/Conductores/', 'shame')
        calculateReduction('/Alcance/Ciclistas/', 'reduccion')
    }
})

function calculateReduction(path, elementId) {
    const element = document.getElementById(elementId)
    const dbRef = ref(database, `${path}${auth.currentUser.uid}`) 

    onValue(dbRef, (snapshot) => {
        const data = snapshot.val()
        let reducciónMedia = 0
        for (const timestamp in data) {
            let speed_alcance = data[timestamp]['speed_alcance']
            let speed_alerta = data[timestamp]['speed_alerta']
            reducciónMedia = reducciónMedia + speed_alerta - speed_alcance;           
        }

        reducciónMedia = Math.round(reducciónMedia/(Object.keys(data).length))
        element.innerText = `reducción de velocidad: ${reducciónMedia * 3.6} km/h`
    });
}
