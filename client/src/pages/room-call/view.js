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
}