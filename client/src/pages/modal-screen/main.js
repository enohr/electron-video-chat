const { desktopCapturer, ipcRenderer } = require('electron')


class Main {
    constructor() {
        this.sources = []
        this.view = new View();
    }


    static init() {
        const main = new Main();
        return main._init();
    }

    async _init() {
        this.sources = await desktopCapturer.getSources({
            types: ['window', 'screen'],
            thumbnailSize: {
                height: 1080,
                width: 1920
            }  
        });
        this.sources = this.sources.filter(source => {
            console.log(source.name);
            // return !((source.name !== 'Video Chat - Room') || (source.name !== 'Share Window'))
            return source.name !== 'Video Chat - Room' && source.name !== 'Home' && source.name !== 'Share Window'
        })
        this.view.renderList(this.sources);
        this.clickEvent();
    }

    clickEvent() {
        const div_wrapper = document.querySelectorAll('.image-wrapper')
        div_wrapper.forEach(item => {
            item.addEventListener('click', this.onClickDiv())
        })
    }

    onClickDiv() {
        return e => {
            e.preventDefault()
            const source = e.target.id
            ipcRenderer.send('source-selected', {source})
        }
    }
}