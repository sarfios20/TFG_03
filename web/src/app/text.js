import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"

console.log('text.js')
let map, marker, bounds;

function selected (selectedDates, dateStr, instance) {
    console.log("Selected date: ", dateStr);
    // Do something else here with the selected date
  }




onAuthStateChanged(auth, async (user) => {
    if (user) {
        reducciónMedia()
        chavo()
    }
})



const logout = document.getElementById('logout-button')

logout.addEventListener('click', async (e) => {
    console.log('logout');
    await signOut(auth)
})


function chavo(){
    const dbRef = ref(database, '/Historico/'+auth.currentUser.uid) // Use '/' to refer to the root of the database
    // Read all data from Firebase database
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val()
        const days = {};
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


const test = document.getElementById('test')


test.addEventListener('click', async (e) => {
    console.log('test');

    const dbRef = ref(database, '/Historico/'+auth.currentUser.uid) // Use '/' to refer to the root of the database
    // Read all data from Firebase database
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        const locations = [];
        for (const timestamp of Object.keys(data)) {
            const location = {timestamp, ...data[timestamp]};
            locations.push(location);
        }
        // Sort locations by timestamp
        locations.sort((a, b) => a.timestamp - b.timestamp);

        gsap.to({}, {
            duration: 1,
            repeat: locations.length,
            onRepeat: () => {
                const location = locations.shift();
                if (location) {
                    const latLng = new google.maps.LatLng(location.Lat, location.Lon);
                    if (!marker) {
                        marker = new google.maps.Marker({
                            position: latLng,
                            map: map
                        });
                    } else {
                        marker.setPosition(latLng);
                    }
                    bounds.extend(latLng);
                    map.fitBounds(bounds);
                }
            }
        });
    });
})

window.initMap = function initMap() {
    console.log('initMap');
    var center = {lat: 40.73877, lng: -3.8235};

    // Create a new Google Map instance
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: center
    });
    bounds = new google.maps.LatLngBounds();
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

function formatDate(date) {
    const year = date.getFullYear()
    const month = padZero(date.getMonth() + 1)
    const day = padZero(date.getDate())
    return `${year}-${month}-${day}`
}

function padZero(num) {
    return num < 10 ? `0${num}` : num
}