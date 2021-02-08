// class to organize what method will be called.
class Main {

    // constructor will receive all needed objects
    constructor({media, view}) {
        this.media = media;
        this.view = view;
    }


    static init(params) {
        console.log(params);
        const main = new Main(params);
        main._init();
    }

    async _init() {
        const myDevices = await this.media.getDevices();
        // const screen = await this.media.getScreenShare();

        this.view.addCameraToScreen(myDevices);
        
        
        
        this.view.onLeaveClicked();

    }



}