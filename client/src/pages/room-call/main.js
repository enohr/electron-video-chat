// class to organize what method will be called.
const { ipcRenderer } = require('electron')
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
        this.myStream.getVideoTracks()[0].enabled = false
        this.myStream.getAudioTracks()[0].enabled = false

        this.addStreamToScreen();
        
        this.view.onLeaveClicked();
        this.onCameraClicked();
        this.onMicrophoneClicked()
        this.screenClicked();
        this.sourceSelected();
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
            const microphone = document.getElementById('microphone-icon')
            const enabled = this.myStream.getAudioTracks()[0].enabled
            this.myStream.getAudioTracks()[0].enabled = !enabled

            if (enabled) {
                microphone.className = 'fa fa-microphone-slash fa-2x';
                return;
            }
            microphone.className = 'fa fa-microphone fa-2x';

        })
    }

    addStreamToScreen(stream = this.myStream, peerId = this.myPeerId) {
        const isCurrentUser = this.myPeerId == peerId;
        this.view.addCameraToScreen(stream, peerId, isCurrentUser);
}

    onCameraClicked() {
        const cameraButton = document.getElementById('camera-button')
        cameraButton.addEventListener('click', () => {
            const camera = document.getElementById('video-icon')
            const enabled = this.myStream.getVideoTracks()[0].enabled
            this.myStream.getVideoTracks()[0].enabled = !enabled;
            if (enabled) {
                camera.className = 'fa fa-video-slash fa-2x';
                return;
            }
            camera.className = 'fa fa-video fa-2x';
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
                this.addStreamToScreen(stream, userId);
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
                this.addStreamToScreen(stream, call.peer);
            })
       })

       return peer;
    }

    screenClicked() {
        const btnScreenShare = document.getElementById('screen-button');
        btnScreenShare.addEventListener('click', async () => {
            ipcRenderer.send('open-modal');
            // We cant send the sources on ipcRenderer.send cause this throw an exception. It doesnt support to send DOM objects.
        })


    }

    sourceSelected() {
        ipcRenderer.on('screen-source', async (_, {source}) => {
            this.myScreen = await this.media.getScreenShare(source);
            this.myScreen.getVideoTracks()[0].enabled = true
            this.addStreamToScreen(this.myScreen)
        })
    }

}