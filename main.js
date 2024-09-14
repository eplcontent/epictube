import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";
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

// Handle Sign-In
document.addEventListener('DOMContentLoaded', () => {
    const signInBtn = document.getElementById('sign-in');
    const registerBtn = document.getElementById('register');
    const uploadBtn = document.getElementById('upload');
    const signOutBtn = document.getElementById('sign-out');
    const authContainer = document.getElementById('auth-container');
    const uploadContainer = document.getElementById('upload-container');
    const videoList = document.getElementById('video-list');

    if (signInBtn) {
        signInBtn.addEventListener('click', async () => {
            const email = document.getElementById('sign-in-email').value;
            const password = document.getElementById('sign-in-password').value;
            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = 'channel.html';
            } catch (error) {
                console.error('Error signing in:', error);
            }
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', async () => {
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const displayName = document.getElementById('register-name').value;
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                await updateProfile(user, { displayName });
                await setDoc(doc(firestore, 'users', user.uid), {
                    displayName: displayName,
                    email: email
                });
                window.location.href = 'channel.html';
            } catch (error) {
                console.error('Error registering:', error);
            }
        });
    }

    if (signOutBtn) {
        signOutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error signing out:', error);
            }
        });
    }

    if (uploadBtn) {
        uploadBtn.addEventListener('click', () => {
            const file = document.getElementById('video-file').files[0];
            if (file) {
                const user = auth.currentUser;
                if (user) {
                    const videoRef = ref(storage, `videos/${user.uid}/${file.name}`);
                    uploadBytes(videoRef, file).then(() => {
                        getDownloadURL(videoRef).then((url) => {
                            console.log('Video URL:', url);
                            // Save video URL to Firestore
                            setDoc(doc(firestore, 'videos', file.name), {
                                url: url,
                                uid: user.uid
                            });
                        });
                    }).catch(error => console.error('Error uploading video:', error));
                } else {
                    console.log('User not signed in');
                }
            }
        });
    }

    if (window.location.pathname.endsWith('channel.html')) {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collection(firestore, 'videos'), where('uid', '==', user.uid));
                const querySnapshot = await getDocs(q);
                videoList.innerHTML = '';
                querySnapshot.forEach((doc) => {
                    const video = doc.data();
                    const videoElement = document.createElement('div');
                    videoElement.innerHTML = `<a href="${video.url}">${video.url}</a>`;
                    videoList.appendChild(videoElement);
                });
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // Authentication state listener for the index page
    if (authContainer && uploadContainer) {
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
    }
});
