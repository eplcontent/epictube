import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage, ref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAyoFfvmHOGh7dWiUsPDMOQuhy9CfjV6Lo",
    authDomain: "epictube-1.firebaseapp.com",
    projectId: "epictube-1",
    storageBucket: "epictube-1.appspot.com",
    messagingSenderId: "776918098004",
    appId: "1:776918098004:web:82ccb74c427f2075334dc1",
    measurementId: "G-C61EL6BVKE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

// Handle authentication state
onAuthStateChanged(auth, user => {
    const authContainer = document.getElementById('auth-container');
    const uploadContainer = document.getElementById('upload-container');

    if (user) {
        // User is signed in
        authContainer.innerHTML = `
            <h2>Hello, ${user.email}</h2>
            <button id="sign-out-button">Sign Out</button>
        `;
        uploadContainer.style.display = 'block';

        document.getElementById('sign-out-button').addEventListener('click', () => {
            signOut(auth).then(() => {
                window.location.reload();
            });
        });
    } else {
        // No user is signed in
        authContainer.innerHTML = `
            <h2>Please Sign In or Register</h2>
            <input type="email" id="email" placeholder="Email">
            <input type="password" id="password" placeholder="Password">
            <button id="sign-in-button">Sign In</button>
            <button id="register-button">Register</button>
        `;

        document.getElementById('sign-in-button').addEventListener('click', () => {
            signInWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('password').value)
                .catch(error => console.error('Error signing in:', error));
        });

        document.getElementById('register-button').addEventListener('click', () => {
            createUserWithEmailAndPassword(auth, document.getElementById('email').value, document.getElementById('password').value)
                .catch(error => console.error('Error registering:', error));
        });
    }
});

// Handle video upload
document.getElementById('upload-button')?.addEventListener('click', () => {
    const file = document.getElementById('video-file').files[0];
    if (file) {
        const videoRef = ref(storage, 'videos/' + file.name);
        uploadBytes(videoRef, file).then(() => {
            alert('Video uploaded successfully!');
            // Optionally, handle video URL and display or store it
        }).catch(error => console.error('Error uploading video:', error));
    }
});
