// class to interact with dom.

class View {

    createVideoElement(stream) {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.controls = false;
        video.play();
        return video;
    }

    addCameraToScreen(stream, userId, isCurrentUser) {
        const div = document.createElement("div");
        const h1 = document.createElement("h1");
        const video = this.createVideoElement(stream);
        const video_grid = document.querySelector(".video-grid");

        h1.innerText = userId;
        div.classList.add("video-wrapper");
        div.id = `userid-${userId}`
        div.append(video);
        div.append(h1);
        video_grid.append(div);

        if (isCurrentUser) {
            video.muted = true;
            h1.id = 'current-user';
        }
    }


    onLeaveClicked() {
        const leaveButton = document.getElementById("leave-button")
        console.log(leaveButton);
        leaveButton.addEventListener('click', () => {
            window.close();
        })
    }

    removeVideo(userId) {
        const video_wrapper = document.getElementById(`userid-${userId}`);
        video_wrapper.remove();
    }

    setScreenShareOnClick(fn) {
        const btnScreenShare = document.getElementById('screen-button');
        btnScreenShare.addEventListener('click', this.screenShareClicked(fn));
    }

    screenShareClicked(fn) {
        return () => {
            fn();
        }
    }


    setCameraOnClick(fn) {
        const cameraButton = document.getElementById('camera-button')
        cameraButton.addEventListener('click', this.cameraClicked(fn));
    }

    cameraClicked(fn) {
        return () => {
            const enabled = fn();
            this.toggleCameraSlash(enabled);
        }
    }

    toggleCameraSlash(enabled) {
        const camera = document.getElementById('video-icon')
        if (enabled) {
            camera.className = 'fa fa-video-slash fa-2x';
            return;
        }
        camera.className = 'fa fa-video fa-2x';
    }


    setMicrophoneOnClick(fn) {
        const cameraButton = document.getElementById('microphone-button')
        cameraButton.addEventListener('click', this.microphoneClicked(fn));
    }

    microphoneClicked(fn) {
        return () => {
            const enabled = fn();
            this.toggleMicrophoneSlash(enabled);
        }
    }

    toggleMicrophoneSlash(enabled) {
        const microphone = document.getElementById('microphone-icon')
        if (enabled) {
            microphone.className = 'fa fa-microphone-slash fa-2x';
            return;
        }
        microphone.className = 'fa fa-microphone fa-2x';
    }
}