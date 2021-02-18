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
        this.sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
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