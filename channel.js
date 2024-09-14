import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const auth = getAuth();
const firestore = getFirestore();

const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('id');

const videoList = document.getElementById('video-list');

if (uid) {
    const q = query(collection(firestore, 'videos'), where('uid', '==', uid));
    getDocs(q).then(querySnapshot => {
        videoList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const video = doc.data();
            const videoElement = document.createElement('div');
            videoElement.innerHTML = `<a href="${video.url}" target="_blank">${video.title}</a>`;
            videoList.appendChild(videoElement);
        });
    }).catch(error => {
        console.error('Error loading videos:', error);
    });
} else {
    window.location.href = 'index.html';
}
