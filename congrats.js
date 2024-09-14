import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

const channelIdElement = document.getElementById('channel-id');
const gotoChannelLink = document.getElementById('goto-channel');

if (userId) {
    channelIdElement.textContent = userId;
    gotoChannelLink.href = `channel.html?id=${userId}`;
} else {
    window.location.href = 'index.html';
}
