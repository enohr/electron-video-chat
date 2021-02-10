class Media {
    async getDevices(video = true, audio = true) {
        return navigator.mediaDevices.getUserMedia({video, audio});
    }

    async getScreenShare(displayMediaOptions) {
        return navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    }
}
