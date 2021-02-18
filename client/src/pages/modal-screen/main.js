const { desktopCapturer } = require('electron')


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
    }
}