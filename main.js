import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, where } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

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
const auth = getAuth();
const firestore = getFirestore();
const storage = getStorage();

// Elements
const registerBtn = document.getElementById('register-btn');
const signInBtn = document.getElementById('sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const uploadBtn = document.getElementById('upload-btn');
const authContainer = document.getElementById('auth-container');
const uploadContainer = document.getElementById('upload-container');
const videoList = document.getElementById('video-list');
const fileInput = document.getElementById('file-input');
const videoTitleInput = document.getElementById('video-title');
const signInEmailInput = document.getElementById('sign-in-email');
const signInPasswordInput = document.getElementById('sign-in-password');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const registerNameInput = document.getElementById('register-name');

// Register Button Event Listener
registerBtn.addEventListener('click', async () => {
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;
    const displayName = registerNameInput.value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName });
        await setDoc(doc(firestore, 'users', user.uid), {
            displayName: displayName,
            email: email
        });
        window.location.href = `congrats.html?id=${user.uid}`;
    } catch (error) {
        console.error('Error registering:', error);
    }
});

// Sign In Button Event Listener
signInBtn.addEventListener('click', async () => {
    const email = signInEmailInput.value;
    const password = signInPasswordInput.value;
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        window.location.href = `channel.html?id=${user.uid}`;
    } catch (error) {
        console.error('Error signing in:', error);
    }
});

// Sign Out Button Event Listener
signOutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Upload Video Button Event Listener
uploadBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    const title = videoTitleInput.value;
    if (file) {
        const user = auth.currentUser;
        if (user) {
            const storageRef = ref(storage, `videos/${user.uid}/${file.name}`);
            try {
                const uploadResult = await uploadBytes(storageRef, file);
                const videoUrl = await getDownloadURL(uploadResult.ref);
                await setDoc(doc(firestore, 'videos', uploadResult.ref.name), {
                    uid: user.uid,
                    title: title,
                    url: videoUrl
                });
                alert('Video uploaded successfully');
            } catch (error) {
                console.error('Error uploading video:', error);
            }
        } else {
            alert('You need to sign in first');
        }
    } else {
        alert('Please select a video file');
    }
});

// Authentication State Change Handler
onAuthStateChanged(auth, (user) => {
    if (user) {
        authContainer.style.display = 'none';
        uploadContainer.style.display = 'block';
        signOutBtn.style.display = 'block';
    } else {
        authContainer.style.display = 'block';
        uploadContainer.style.display = 'none';
        signOutBtn.style.display = 'none';
    }
});

// Channel Page Script
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uid = urlParams.get('id');

    if (uid && uid === auth.currentUser?.uid) {
        const q = query(collection(firestore, 'videos'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        videoList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const video = doc.data();
            const videoElement = document.createElement('div');
            videoElement.innerHTML = `<a href="${video.url}" target="_blank">${video.title}</a>`;
            videoList.appendChild(videoElement);
        });
    } else {
        window.location.href = 'index.html';
    }
});
