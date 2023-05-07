import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"

console.log('text.js')
let map, marker, bounds;


var validDates = ["2023-05-10", "2023-05-12", "2023-05-15", "2023-05-17"]
flatpickr("#test", {
    inline: true,
    enable: validDates
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        reducciónMedia()
    }
})

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

