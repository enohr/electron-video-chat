const { desktopCapturer, remote } = require('electron')
const { Menu } = remote
class Media {
    async getDevices(video = true, audio = true) {
        return navigator.mediaDevices.getUserMedia({video, audio});
    }

    async getScreenShare(source) {
        const displayMediaOptions = {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
              }
            }
        }
        return await navigator.mediaDevices.getUserMedia(displayMediaOptions);
    }
}
