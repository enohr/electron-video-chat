// class to organize what method will be called.
class Main {

    // constructor will receive all needed objects
    constructor({media, view, peer, socket, roomId}) {
        this.media = media;
        this.view = view;
        this.peer = peer;
        this.socket = socket;
        this.roomId = roomId;
        this.myStream = null;
        this.isMyCameraActive = false;
    }


    static init(params) {
        const main = new Main(params);
        main._init();
    }

    async _init() {
        this.myStream = await this.media.getDevices();
        
        // const screen = await this.media.getScreenShare();

        // this.view.addCameraToScreen(this.myStream, "my-id");


        this.isMyCameraActive = true;
        this.events();
        this.view.onLeaveClicked();
        this.view.onCameraClicked();
    }


    events() {
        this.peer.on('open', (id) => {
            // Only one peer enters. why?
            this.socket.emit('join-room', this.roomId, id)
       })
  
       this.socket.on('new-user', userId => {
            console.log("userId", userId);
            const call = this.peer.call(userId, this.myStream);
            console.log(call);
       })
  
       this.peer.on('call', call => {
            console.log("call", call);
            call.answer(this.myStream);
       })
    }

}