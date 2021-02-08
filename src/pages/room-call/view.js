// class to interact with dom.

class View {

    createVideoElement(stream) {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.controls = false;
        video.play();
        return video;
    }

    addCameraToScreen(stream) {
        const div = document.createElement("div");
        const video = this.createVideoElement(stream);
        const video_grid = document.querySelector(".video-grid");

        div.classList.add("video-wrapper");
        div.append(video);
        video_grid.append(div);
    }


    onLeaveClicked() {
        const leaveButton = document.getElementById("leave")
        console.log(leaveButton);
        leaveButton.addEventListener('click', () => {
            window.close();
        })
    }

}