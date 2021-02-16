// class to organize what method will be called.
class Main {

    // constructor will receive all needed objects
    constructor({media, view, socket, roomId}) {
        this.media = media;
        this.view = view;
        this.socket = socket;
        this.peer = null;

        this.roomId = roomId;
        
        this.myStream = null;
        this.myScreen = null;
        this.myPeerId = null;

        this.isMyCameraActive = false;

        this.peers = []
    }


    static init(params) {
        const main = new Main(params);

        return main._init();
    }

    async _init() {
        this.peer = await this.initPeer();

        this.myStream = await this.media.getDevices();
        this.view.addCameraToScreen(this.myStream, this.peer.id);
 
        this.view.onLeaveClicked();
        // this.view.onCameraClicked(this.peer.id);
        this.onMicrophoneClicked()
    }

    async initPeer() {
        const peer = await new Promise(resolve => {
            resolve(new Peer(undefined, {
                host: 'localhost',
                path: '/',
                port: '3001'
            }));
        });

        return this.peerEvents(peer);
    }

    onMicrophoneClicked() {
        const cameraButton = document.getElementById('microphone-button')
        cameraButton.addEventListener('click', () => {
            this.myStream.getAudioTracks()[0].enabled = !this.myStream.getAudioTracks()[0].enabled
        })
    }


    async peerEvents(peer) {
        // Create a peer model in future. testing the api right now
        peer.on('open', (id) => {
            this.myPeerId = id;
            this.socket.emit('join-room', this.roomId, id)
       })
  
       this.socket.on('new-user', userId => {
            const call = peer.call(userId, this.myStream);
            if (this.myScreen !== null) {
                peer.call(userId, this.myScreen);
            }

            call.on('stream', stream => {
                this.view.addCameraToScreen(stream, userId);
            })
       })

       this.socket.on('user-disconnected', (id) => {
           this.view.removeVideo(id);
       })
  
       peer.on('call', call => {
            call.answer(this.myStream);
            call.on('stream', stream => {
                if (!this.peers.indexOf(stream.id)) {
                    console.log("calling again same peer. ignore")
                    return;
                } 
                this.peers.push(stream.id);
                this.view.addCameraToScreen(stream, call.peer);
            })
       })

       return peer;
    }

    // screenClicked() {
    //     const btnScreenShare = document.getElementById('screen-button');
    //     btnScreenShare.addEventListener('click', async () => {
    //             this.myScreen = await this.media.chooseSource();
    //             this.view.addCameraToScreen(this.myScreen, this.myScreen.id);
    //     })
    // }

}