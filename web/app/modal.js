// Function to show the login modal form
function showLoginModal() {
    document.getElementById('login').style.display = 'block';
}

// Function to show the signup modal form
function showSignupModal() {
    document.getElementById('signup').style.display = 'block';
}

// Add event listeners to the login and signup links
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('login-link').addEventListener('click', showLoginModal);
    document.getElementById('signup-link').addEventListener('click', showSignupModal);
});

// Function to hide the modal when the user clicks outside of it
window.onclick = function(event) {
    if (event.target.className === 'modal-overlay') {
        event.target.parentNode.style.display = 'none';
    }
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
    let backdrop = document.createElement('div');
    backdrop.id = 'modal-backdrop';
    backdrop.classList.add('modal-backdrop');
    document.body.appendChild(backdrop);
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    let backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
        backdrop.parentNode.removeChild(backdrop);
    }
}


