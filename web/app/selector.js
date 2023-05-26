const signupDiv = document.getElementById('signup-div')
signupDiv.style.display = 'none'

const signinDiv = document.getElementById('signin-div')
signinDiv.style.display = 'block'

const signinSelect = document.getElementById('singin-select')
const signupSelect = document.getElementById('singup-select')

signinSelect.addEventListener('click', async (e) => {
    console.log('signinDiv clicked')
    signupDiv.style.display = 'none'
    signinDiv.style.display = 'block'
});

signupSelect.addEventListener('click', async (e) => {
    console.log('signupDiv clicked')
    signinDiv.style.display = 'none'
    signupDiv.style.display = 'block'
});