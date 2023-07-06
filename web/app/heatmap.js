import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onChildAdded, onChildChanged, onChildRemoved, get } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"

console.log('heatmap.js loaded');

let dataCondutor = new Map(); // Create a new Map
let heatmapLayer;
var map;

initMap();
heatMapData();
listenToDatabaseEvents();

function initMap() {
  // Check if the browser supports Geolocation
  if (navigator.geolocation) {
    // Get the user's current position
    navigator.geolocation.getCurrentPosition(function(position) {
      var userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      // Create the map and center it on the user's location
      map = new google.maps.Map(document.getElementById('map'), {
        center: userLatLng,
        zoom: 12, // Adjust the zoom level as desired
        styles: [
          // Apply the provided style array here
          {
            "featureType": "all",
            "elementType": "geometry",
            "stylers": [
              { "color": "#202c3e" }
            ]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [
              { "gamma": 0.01 },
              { "lightness": 20 },
              { "weight": "1.39" },
              { "color": "#ffffff" }
            ]
          },
          {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [
              { "weight": "0.96" },
              { "saturation": "9" },
              { "visibility": "on" },
              { "color": "#000000" }
            ]
          },
          {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [
              { "visibility": "off" }
            ]
          },
          {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [
              { "lightness": 30 },
              { "saturation": "9" },
              { "color": "#29446b" }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
              { "saturation": 20 }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              { "lightness": 20 },
              { "saturation": -20 }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              { "lightness": 10 },
              { "saturation": -30 }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              { "color": "#193a55" }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
              { "saturation": 25 },
              { "lightness": 25 },
              { "weight": "0.01" }
            ]
          },
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
              { "lightness": -20 }
            ]
          }
        ]
      });

      // Add other map markers or layers as needed
      // ...

    }, function() {
      // Handle Geolocation error
      console.log('Error: The Geolocation service failed.');
    });
  } else {
    // Browser doesn't support Geolocation
    console.log('Error: Your browser doesn\'t support geolocation.');
  }
}

document.getElementById("heatmap-selector").addEventListener('change', () => {
  dataCondutor.clear(); // Clears the previous heatmap data
  heatMapData();
});



function heatMapData() {
  let selectedOption = document.getElementById("heatmap-selector").value;
  const dbRef = ref(database, `/${selectedOption}/`);
  get(dbRef).then((snapshot) => {
      const data = snapshot.val();
      for (const zone in data) {
          for (const uid in data[zone]) {
              dataCondutor.set(uid, data[zone][uid]);
          }
      }
      console.log(dataCondutor);
      updateHeatmapData();
  });
}


function createHeatmapLayer(data) {
  // Remove previous data
  if (heatmapLayer) {
    heatmapLayer.setMap(null);
  }

  // Create new heatmap layer
  heatmapLayer = new google.maps.visualization.HeatmapLayer({
    data: data,
    map: map,
  });
  
  heatmapLayer.setMap(map);
}

function updateHeatmapData() {
  const heatmapData = Array.from(dataCondutor.values()).map(item => ({
    location: new google.maps.LatLng(item.Lat, item.Lon),
    weight: 0.25, 
  }));

  createHeatmapLayer(heatmapData);
}

function listenToDatabaseEvents() {
  const dbRef = ref(database, '/Conductor/');

  // Listen for new user additions
  onChildAdded(dbRef, (snapshot) => {
    const zone = snapshot.key;
    const users = snapshot.val();
    for (const uid in users) {
      console.log('New user added:', uid);
      console.log('User data:', users[uid]);
      dataCondutor.set(uid, users[uid]);
    }
    updateHeatmapData();
  });

  // Listen for user location updates
  onChildChanged(dbRef, (snapshot) => {
    const zone = snapshot.key;
    const users = snapshot.val();
    for (const uid in users) {
      console.log('User location updated:', uid);
      console.log('Updated location:', users[uid]);
      dataCondutor.set(uid, users[uid]);
    }
    updateHeatmapData();
  });

  // Listen for user deletions
  onChildRemoved(dbRef, (snapshot) => {
    const zone = snapshot.key;
    const users = snapshot.val();
    for (const uid in users) {
      console.log('User deleted:', uid);
      console.log('Deleted user data:', users[uid]);
      dataCondutor.delete(uid);
    }
    updateHeatmapData();
  });
}