function showLogin() {
    document.querySelector('.login-form').style.display = 'block';
    document.querySelector('.signup-form').style.display = 'none';
}

function hideLogin() {
    document.querySelector('.login-form').style.display = 'none';
}

function showSignup() {
    document.querySelector('.signup-form').style.display = 'block';
    document.querySelector('.login-form').style.display = 'none';
}

function hideSignup() {
    document.querySelector('.signup-form').style.display = 'none';
}

function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    if (username && password) {
        localStorage.setItem(username, password);
        alert('Sign Up Successful!');
        hideSignup();
    } else {
        alert('Please fill out all fields.');
    }
}

function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const storedPassword = localStorage.getItem(username);
    if (storedPassword && storedPassword === password) {
        alert('Login Successful!');
        window.location.href = `channel.html?user=${encodeURIComponent(username)}`;
    } else {
        alert('Invalid username or password.');
    }
}
