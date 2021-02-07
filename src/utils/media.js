class Media {
    async getDevices(video = true, audio = true) {
        return navigator.mediaDevices.getUserMedia({video, audio});
    }
}
