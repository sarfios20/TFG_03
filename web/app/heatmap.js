import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onChildAdded, onChildChanged, onChildRemoved, get } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js"

console.log('heatmap.js loaded');

let dataCondutor = new Map(); // Create a new Map

heatMapData();
listenToDatabaseEvents();

function heatMapData() {
  const dbRef = ref(database, '/Conductor/');
  get(dbRef).then((snapshot) => {
    const data = snapshot.val();
    for (const zone in data) {
      for (const uid in data[zone]) {
        dataCondutor.set(uid, data[zone][uid]); // Set uid as the key in the Map
      }
    }
    
    // Further processing or manipulation of data if needed
    // ...
    
    // Access the data using the dataCondutor Map
    console.log(dataCondutor);
  });
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
    }
  });
  
  // Listen for user location updates
  onChildChanged(dbRef, (snapshot) => {
    const zone = snapshot.key;
    const users = snapshot.val();
    for (const uid in users) {
      console.log('User location updated:', uid);
      console.log('Updated location:', users[uid]);
    }
  });
  
  // Listen for user deletions
  onChildRemoved(dbRef, (snapshot) => {
    const zone = snapshot.key;
    const users = snapshot.val();
    for (const uid in users) {
      console.log('User deleted:', uid);
      console.log('Deleted user data:', users[uid]);
    }
  });
}
