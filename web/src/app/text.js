import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"
import { database } from "./firebase.js"
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

/*

Overall, your code looks well-structured and easy to read. Here are a few points to consider:

Consider using module syntax instead of importing directly from URLs. Using URLs to import modules can pose security risks and make it harder to cache dependencies. Instead, it's recommended to use a package manager like npm to manage your dependencies and import them using the import statement.

It's good that you're using async/await with Firebase's signOut function. However, you can also consider using try/catch blocks to handle any potential errors that may occur during the sign-out process.

You're using gsap to animate the map markers. While it's a powerful animation library, it may be overkill for this particular use case. You could consider using the setInterval function to loop through the locations array and update the marker position every second.

Your reducciónMedia function is doing multiple things, including calculating the average speed reduction and updating the DOM with the result. It's generally good practice to separate concerns and have functions that do one thing well. Consider breaking up the functionality into separate functions, for example, one to calculate the average speed reduction and another to update the DOM.

Consider adding comments to your code to make it easier for other developers (or your future self) to understand what's going on. While your code is easy to read, adding comments can help clarify any confusing sections or provide context for why certain decisions were made.

Overall, great job! Your code looks well-structured and easy to read, and I'm sure it will be easy to maintain and build upon in the future.

*/




console.log('text.js')
let map, marker, bounds;

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

