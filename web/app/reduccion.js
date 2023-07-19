import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"
import { auth, database } from "./firebase.js"

let reduccionGauge = new JustGage({
    id: "reduccion-gauge",
    value: 0,
    min: 0,
    max: 100,
    title: "Reducción de velocidad"
});

let shameGauge = new JustGage({
    id: "shame-gauge",
    value: 0,
    min: 0,
    max: 100,
    title: "Reducción de velocidad"
});

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

        reducciónMedia = Math.round(reducciónMedia/(Object.keys(data).length)*3.6)

        if(elementId == 'reduccion'){
            reduccionGauge.refresh(reducciónMedia)
        }else{
            shameGauge.refresh(reducciónMedia)
        }

        element.innerText = `reducción de velocidad: ${reducciónMedia} km/h`
    });
}
