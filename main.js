import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAyoFfvmHOGh7dWiUsPDMOQuhy9CfjV6Lo",
    authDomain: "epictube-1.firebaseapp.com",
    projectId: "epictube-1",
    storageBucket: "epictube-1.appspot.com",
    messagingSenderId: "776918098004",
    appId: "1:776918098004:web:82ccb74c427f2075334dc1",
    measurementId: "G-C61EL6BVKE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
const analytics = getAnalytics(app);

// Registration logic
document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const channelName = document.getElementById('channel-name').value;
    const channelHandle = document.getElementById('channel-handle').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return updateProfile(user, { displayName: channelName });
        })
        .then(() => {
            setDoc(doc(firestore, 'channels', auth.currentUser.uid), {
                channelName: channelName,
                channelHandle: channelHandle
            });
            window.location.href = 'index.html'; // Redirect after registration
        })
        .catch(error => console.error('Error registering:', error));
});

// Sign-in logic
document.getElementById('sign-in-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('sign-in-email').value;
    const password = document.getElementById('sign-in-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            window.location.href = 'channel.html'; // Redirect after sign-in
        })
        .catch(error => console.error('Error signing in:', error));
});

// Sign-out logic
document.getElementById('sign-out-button')?.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html'; // Redirect after sign-out
    }).catch(error => console.error('Error signing out:', error));
});

// Handle channel page
onAuthStateChanged(auth, async user => {
    if (user) {
        const channelNameElem = document.getElementById('channel-name');
        const videosListElem = document.getElementById('videos-list');
        if (user.displayName) {
            channelNameElem.textContent = user.displayName;
        }

        const channelDoc = await getDoc(doc(firestore, 'channels', user.uid));
        if (channelDoc.exists()) {
            const channelData = channelDoc.data();
            const channelHandle = channelData.channelHandle;

            // Display uploaded videos
            const videosRef = ref(storage, `videos/${user.uid}`);
            // Replace with code to list and display videos
        } else {
            console.error('No channel data found');
        }

        document.getElementById('upload-video')?.addEventListener('click', () => {
            const file = document.getElementById('video-file').files[0];
            if (file) {
                const videoRef = ref(storage, `videos/${user.uid}/${file.name}`);
                uploadBytes(videoRef, file).then(() => {
                    alert('Video uploaded successfully!');
                    // Optionally, handle video URL and display or store it
                }).catch(error => console.error('Error uploading video:', error));
            }
        });
    }
});
