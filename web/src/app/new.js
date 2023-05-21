import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"

let map, marker, bounds;
let days = {}

onAuthStateChanged(auth, async (user) => {
    if (user) {
        numeroAvisosRecibidos()
        numeroAvisosEmitidos()
        reducciónMediaCoche()
        calendario()
    }
})

function numeroAvisosRecibidos() {
    let avisosRecibidos = document.getElementById('avisos-recibidos')
    const dbRef = ref(database, '/Alertas/Conductor/'+auth.currentUser.uid) 
    console.log(dbRef)
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        const numAvisos = Object.keys(data).length;
        avisosRecibidos.innerHTML = `nº avisos: ${numAvisos}`;
    })
}

function numeroAvisosEmitidos() {
    let avisosRecibidos = document.getElementById('avisos-emitidos')
    const dbRef = ref(database, '/Alertas/Ciclista/'+auth.currentUser.uid) 
    console.log(dbRef)
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        const numAvisos = Object.keys(data).length;
        avisosRecibidos.innerHTML = `nº avisos: ${numAvisos}`;
    })
}

function reducciónMediaCoche() {
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
        shame.innerText = `reducción de velocidad: ${reducciónMedia * 3.6} km/h`
         // Display the data in the console
    });
}

function calendario(){
    const dbRef = ref(database, '/Historico/'+auth.currentUser.uid) // Use '/' to refer to the root of the database
    // Read all data from Firebase database
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val()
        days = {};
        for (const timestamp of Object.keys(data)) {
            const date = new Date(parseInt(timestamp))
            const day = formatDate(date)
            if (!days[day]) {
                days[day] = [];
            }
            const location = {timestamp, ...data[timestamp]} // include timestamp in the location object
            days[day].push(location)
        }
        var dates = Object.keys(days); // get an array of the date strings
        var validDates = dates.map((date) => new Date(date))
        var picker = flatpickr("#datepicker", {
            inline: true,
            enable: validDates,
            onChange: selected,
        });
    });
}

function formatDate(date) {
    const year = date.getFullYear()
    const month = padZero(date.getMonth() + 1)
    const day = padZero(date.getDate())
    return `${year}-${month}-${day}`
}

function padZero(num) {
    return num < 10 ? `0${num}` : num
}

function selected (selectedDates, dateStr, instance) {
    
    console.log("Selected date: ", dateStr);
    console.log(days[dateStr])
    let positions = []
    positions = days[dateStr].map(num => ({ lat: num['Lat'], lng: num['Lon'] }))
    console.log(positions)

    var polyline = new google.maps.Polyline({
        path: positions,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    })
      
    polyline.setMap(map)


    var count = 0;
    var path = polyline.getPath().getArray();
    var interval = setInterval(function() {
    count = (count + 1) % path.length;
    var newPath = path.slice(0, count);
    polyline.setPath(newPath);
    if (count == 0) {
        clearInterval(interval);
    }
    }, 700);


    // Do something else here with the selected date
}