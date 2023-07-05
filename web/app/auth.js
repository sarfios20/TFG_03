import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"
import { auth } from "./firebase.js"

// Sign In function
const signinForm = document.getElementById('signin-form')

signinForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = signinForm['signin-email'].value
    const password = signinForm['signin-password'].value

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password)
        console.log(userCredentials)
        // Optionally redirect to homepage or user dashboard
        // window.location.href = '/index.html';
    } catch (error) {
        console.error(error)
        // Handle errors here.
    }
});

// Sign Up function
const signupForm = document.getElementById('signup-form')

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = signupForm['signup-email'].value
    const password = signupForm['signup-password'].value

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        // Optionally redirect to homepage or user dashboard
        // window.location.href = '/index.html';
    } catch (error) {
        console.error(error)
        // Handle errors here.
    }
});

// Function to switch to sign out
// Function to switch to sign out
function switchToSignOut() {
    document.getElementById('login-link').parentElement.remove();
    document.getElementById('signup-link').parentElement.remove();

    let signoutLi = document.createElement('li');
    let signoutLink = document.createElement('a');
    signoutLink.textContent = "Sign Out";
    signoutLink.id = 'signout-link';
    signoutLink.href = '#';
    signoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            switchToSignInSignUp();
        } catch (error) {
            console.error(error);
            // Handle errors here.
        }
    });
    signoutLi.appendChild(signoutLink);
    document.getElementById('menu-list').appendChild(signoutLi);

    // Show the login modal
    hideModal('login');
}


// Function to switch back to sign in and sign up
function switchToSignInSignUp() {
    document.getElementById('signout-link').parentElement.remove();

    let loginLi = document.createElement('li');
    let loginLink = document.createElement('a');
    loginLink.textContent = "Log In";
    loginLink.id = 'login-link';
    loginLink.href = '#login';
    loginLi.appendChild(loginLink);

    let signupLi = document.createElement('li');
    let signupLink = document.createElement('a');
    signupLink.textContent = "Sign Up";
    signupLink.id = 'signup-link';
    signupLink.href = '#signup';
    signupLi.appendChild(signupLink);

    let menuList = document.getElementById('menu-list');
    menuList.appendChild(loginLi);
    menuList.appendChild(signupLi);

    // Reattach event listeners to the login and signup links
    document.getElementById('login-link').addEventListener('click', showLoginModal);
    document.getElementById('signup-link').addEventListener('click', showSignupModal);
}

// check auth state change
onAuthStateChanged(auth, user => {
    if (user) {
        console.log(user);
        switchToSignOut();
    } else {
        switchToSignInSignUp();
    }
});
