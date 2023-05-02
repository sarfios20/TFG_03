import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";

console.log('Hello world')
// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyAelV_hXHuGRUA9aoGEtZc4_LjWXXlpzQ8",
   authDomain: "tfg-ciclistas.firebaseapp.com",
   databaseURL: "https://tfg-ciclistas-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "tfg-ciclistas",
   storageBucket: "tfg-ciclistas.appspot.com",
   messagingSenderId: "229343237349",
   appId: "1:229343237349:web:b5d6e553799941e7f6f00c"
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);