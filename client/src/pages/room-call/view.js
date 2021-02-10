// class to interact with dom.

class View {

    createVideoElement(stream) {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.controls = false;
        video.play();
        return video;
    }

    addCameraToScreen(stream, userId) {
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

    // TODO: Toggle camera active / inactive 
    onCameraClicked() {
        const cameraButton = document.getElementById('camera-button')
        cameraButton.addEventListener('click', () => {

            this.removeVideo("my-id");
        })
    }
}