const { desktopCapturer, remote } = require('electron')
const { Menu } = remote
class Media {
    async getDevices(video = true, audio = true) {
        return navigator.mediaDevices.getUserMedia({video, audio});
    }

    async getScreenShare() {

        const source = await this.chooseSource();
        const displayMediaOptions = {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
              }
            }
        }
        return await navigator.mediaDevices.getUserMedia(displayMediaOptions);
    }

    async getSources() {
        return await desktopCapturer.getSources({ types: ['window', 'screen'] });
    }

    async chooseSource() {
        const sources = await this.getSources();
        // build a menu to choose sources
        const videoOptionsMenu = Menu.buildFromTemplate(
            sources.map(source => {
              return {
                label: source.name,
                click: () => {this.getDevices(source)}
              };
            })
          );
            videoOptionsMenu.popup();
      }
}
