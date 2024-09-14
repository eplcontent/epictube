document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const videoFile = document.getElementById('video-file').files[0];
    if (videoFile) {
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(videoFile);
        videoElement.controls = true;
        videoElement.width = 600;

        document.getElementById('video-list').appendChild(videoElement);
    }
});
