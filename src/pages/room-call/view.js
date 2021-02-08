// class to interact with dom.

class View {
    addCameraToScreen(stream) {
        const video = document.querySelector('video#localVideo');
        video.srcObject = stream;
        video.controls = false;
        video.play();
    }

}