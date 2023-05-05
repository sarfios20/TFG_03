import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

console.log('text.js')

onAuthStateChanged(auth, async (user) => {
    if (user) {
        reducciónMedia()
    }
})

function everything() {

}

const logout = document.getElementById('logout-button')

logout.addEventListener('click', async (e) => {
    console.log('logout');
    await signOut(auth)
})


console.log(database);



const test = document.getElementById('test')


test.addEventListener('click', async (e) => {
    console.log('test');

    const dbRef = ref(database, '/Historico/'+auth.currentUser.uid) // Use '/' to refer to the root of the database
    // Read all data from Firebase database
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val()
        const days = {};
        for (const timestamp of Object.keys(data)) {
            const day = Math.floor(timestamp / 86400000)
            if (!days[day]) {
              days[day] = [];
            }
            const location = {timestamp, ...data[timestamp]} // include timestamp in the location object
            days[day].push(location)
            
        }
        console.log(days);
    });
})

window.initMap = function initMap() {
    console.log('initMap');
    var center = {lat: 40.73877, lng: -3.8235};

    // Create a new Google Map instance
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: center
    });
}
//esto es temporal
function reducciónMedia() {
    const shame = document.getElementById('shame')
    const dbRef = ref(database, '/Alcance/Conductores/'+auth.currentUser.uid) 
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val()
        let reducciónMedia = 0
        for (const timestamp in data) {
            let speed_alcance = data[timestamp]['speed_alcance']
            let speed_alerta = data[timestamp]['speed_alerta']

            reducciónMedia = reducciónMedia + speed_alerta - speed_alcance;           
        }
        reducciónMedia = Math.round(reducciónMedia/(Object.keys(data).length))
        //cool chart
        shame.innerText = `Average Speed Reduction: ${reducciónMedia * 3.6} km/h`
         // Display the data in the console
    });
}

