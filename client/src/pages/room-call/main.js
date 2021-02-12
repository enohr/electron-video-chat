// class to organize what method will be called.
class Main {

    // constructor will receive all needed objects
    constructor({media, view, socket, roomId}) {
        this.media = media;
        this.view = view;
        this.socket = socket;
        this.roomId = roomId;
        this.myStream = null;
                
        this.peer = null;
        this.isMyCameraActive = false;
    }


    static init(params) {
        const main = new Main(params);

        return main._init();
    }

    async _init() {
        this.myStream = await this.media.getDevices();
        
        // const screen = await this.media.getScreenShare();

        this.view.addCameraToScreen(this.myStream, this.myStream.id);


        this.isMyCameraActive = true;
        this.peerEvents();
        this.view.onLeaveClicked();
        this.view.onCameraClicked();
    }


    peerEvents() {
        // Create a peer model in future. testing the api right now


        this.peer = new Peer(undefined, {
            host: 'localhost',
            path: '/',
            port: '3001'
        });
     
        this.peer.on('open', (id) => {
            this.socket.emit('join-room', this.roomId, id)
       })
  
       this.socket.on('new-user', userId => {
            const call = this.peer.call(userId, this.myStream);
            call.on('stream', stream => {
                this.view.addCameraToScreen(stream, stream.id);
            })
       })
  
       this.peer.on('call', call => {
            console.log("call", call);
            call.answer(this.myStream);
            call.on('stream', stream => {
                this.view.addCameraToScreen(stream, stream.id);
            })
       })
    }

}