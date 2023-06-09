import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"

let map
let days = {}

console.log("rutas.js is loaded")
initMapRoute()

function initMapRoute() {
  // Check if the browser supports Geolocation
  if (navigator.geolocation) {
    // Get the user's current position
    navigator.geolocation.getCurrentPosition(function(position) {
      var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      // Create the map and center it on the user's location
      map = new google.maps.Map(document.getElementById('mapRuta'), {
        center: userLatLng,
        zoom: 14, // Adjust the zoom level as desired
      });


    }, function() {
      // Handle Geolocation error
      console.log('Error: The Geolocation service failed.');
    });
  } else {
    // Browser doesn't support Geolocation
    console.log('Error: Your browser doesn\'t support geolocation.');
  }
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

function selected(selectedDates, dateStr, instance) {
    console.log("Selected date: ", dateStr);
    
    const positions = days[dateStr].map(num => ({ lat: num['Lat'], lng: num['Lon'] }));
    console.log(positions);
    
    const polyline = new google.maps.Polyline({
      path: positions,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    
    polyline.setMap(map);
    
    const path = polyline.getPath();
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % path.getLength();
      const newPath = path.getArray().slice(0, count);
      polyline.setPath(newPath);
      
      if (count === 0) {
        clearInterval(interval);
      }
    }, 700);
  }
const logout = document.getElementById('logout-button')

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log('-------------');
    calendario()
  }
})