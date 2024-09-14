import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
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
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

// Handle user authentication
document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('sign-in');
    const registerBtn = document.getElementById('register');
    const uploadBtn = document.getElementById('upload');
    const signOutBtn = document.getElementById('sign-out');
    const authContainer = document.getElementById('auth-container');
    const uploadContainer = document.getElementById('upload-container');

    // Sign In
    signInBtn?.addEventListener('click', async () => {
        const email = document.getElementById('sign-in-email').value;
        const password = document.getElementById('sign-in-password').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    });

    // Register
    registerBtn?.addEventListener('click', async () => {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const displayName = document.getElementById('register-name').value;
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(user, { displayName });
            // Optionally, save user profile information to Firestore
            await setDoc(doc(firestore, 'users', user.uid), {
                displayName: displayName,
                email: email
            });
        } catch (error) {
            console.error('Error registering:', error);
        }
    });

    // Sign Out
    signOutBtn?.addEventListener('click', async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    });

    // Upload Video
    uploadBtn?.addEventListener('click', () => {
        const file = document.getElementById('video-file').files[0];
        if (file) {
            const user = auth.currentUser;
            if (user) {
                const videoRef = ref(storage, `videos/${user.uid}/${file.name}`);
                uploadBytes(videoRef, file).then(() => {
                    alert('Video uploaded successfully!');
                    // Optionally, handle video URL and display or store it
                    getDownloadURL(videoRef).then((url) => {
                        // Save the video URL to Firestore or handle it as needed
                        console.log('Video URL:', url);
                    });
                }).catch(error => console.error('Error uploading video:', error));
            } else {
                alert('You need to sign in to upload videos.');
            }
        }
    });

    // Authentication state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            authContainer.style.display = 'none';
            uploadContainer.style.display = 'block';
        } else {
            authContainer.style.display = 'block';
            uploadContainer.style.display = 'none';
        }
    });
});
