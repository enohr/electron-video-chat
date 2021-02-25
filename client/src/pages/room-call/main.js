// class to organize what method will be called.
const { ipcRenderer } = require('electron')
class Main {

    // constructor will receive all needed objects
    constructor({media, mediaFake, view, socket, roomId}) {
        this.media = media;
        this.mediaFake = mediaFake;
        this.view = view;
        this.socket = socket;
        
        this.roomId = roomId;
        
        this.myCurrentMediaStream = null;
        this.myCurrentPeer = null;
        this.myCurrentPeerId = null;

        this.myCurrentMediaScreen = null;
        this.myCurrentPeerScreen = null;
        this.myCurrentPeerScreenId = null;

        this.isMyCameraActive = false;
        this.isSharingScreen = false;

        this.allPeersList = []
    }


    static init(params) {
        const main = new Main(params);

        return main._init();
    }

    async _init() {
        this.myCurrentPeer = await this.initPeer();

        this.myCurrentMediaStream = await this.media.getDevices();
        // this.myStream = this.mediaFake.fakeMediaStream();

        this.myCurrentMediaStream.getVideoTracks()[0].enabled = false
        this.myCurrentMediaStream.getAudioTracks()[0].enabled = false        

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
            const enabled = this.myCurrentMediaStream.getAudioTracks()[0].enabled
            this.myCurrentMediaStream.getAudioTracks()[0].enabled = !enabled

            if (enabled) {
                microphone.className = 'fa fa-microphone-slash fa-2x';
                return;
            }
            microphone.className = 'fa fa-microphone fa-2x';

        })
    }

    addStreamToScreen(stream = this.myCurrentMediaStream, peerId = this.myCurrentPeerId) {
        const isCurrentUser = this.myCurrentPeerId == peerId;
        this.view.addCameraToScreen(stream, peerId, isCurrentUser);
    }

    onCameraClicked() {
        const cameraButton = document.getElementById('camera-button')
        cameraButton.addEventListener('click', () => {
            const camera = document.getElementById('video-icon')
            const enabled = this.myCurrentMediaStream.getVideoTracks()[0].enabled
            this.myCurrentMediaStream.getVideoTracks()[0].enabled = !enabled;
            if (enabled) {
                camera.className = 'fa fa-video-slash fa-2x';
                return;
            }
            camera.className = 'fa fa-video fa-2x';
        })
    }



    screenClicked() {
        const btnScreenShare = document.getElementById('screen-button');
        btnScreenShare.addEventListener('click', async () => {
            if (this.isSharingScreen) {
                console.log(this.socket);
                this.isSharingScreen = false;
                this.myCurrentPeer.destroy();
                this.socket.emit('screen-leaved', this.myCurrentPeerScreenId)
                // Maybe has an better way. Now, the socket handle two peers, so we send the peerID to others sockets to remove from your video grid
                return;
            }
            this.isSharingScreen = true;
            ipcRenderer.send('open-modal');
            // We cant send the sources on ipcRenderer.send cause this throw an exception. It doesnt support to send DOM objects.
        })


    }

    sourceSelected() {
        ipcRenderer.on('screen-source', async (_, {source}) => {
            this.myCurrentMediaScreen = await this.media.getScreenShare(source);
            this.myCurrentPeer = await this.createScreenSharePeer();
            this.addStreamToScreen(this.myCurrentMediaScreen, 'my-video')
            // peerId of the screen is not working. idk why yet
        })
    }

    async createScreenSharePeer() {
        const peer = await new Promise(resolve => {
            resolve(new Peer(undefined, {
                host: 'localhost',
                path: '/',
                port: '3001'
            }));
        });

        peer.on('open', (id) => {
            this.onPeerOpen(id);
       })

        peer.on('call', call => {
            call.answer(this.myCurrentMediaScreen);
        })

        this.socket.on('new-user', userId => {
            peer.call(userId, this.myCurrentMediaScreen);
        })

        peer.on('close', () => {
            this.view.removeVideo('my-video');
        })

        return peer;
    }

    async peerEvents(peer) {
        // Create a peer model in future. testing the api right now
        peer.on('open', userId => {
            this.onPeerOpen(userId);
        });
  
       this.socket.on('new-user', userId => {
           this.onSocketNewUser(userId);
       })

       this.socket.on('user-disconnected', (id) => {
           this.view.removeVideo(id);
       })
  
       peer.on('call', call => {
            this.onPeerOnCall(call);
       })

       this.socket.on('screen-share-leave', id => {
           this.view.removeVideo(id);
       })

       return peer;
    }

    // Events 
    onPeerOpen(userId) {
        this.socket.emit('join-room', this.roomId, userId)
        this.myCurrentPeerId = id;
    }

    onSocketNewUser(userId) {
        const call = peer.call(userId, this.myCurrentMediaStream);

        if (call) {
            call.on('stream', stream => {
                if (!this.allPeersList.indexOf(stream.id)) {
                    console.log("calling again same peer. ignore")
                    return;
                } 
                this.allPeersList.push(stream.id);
                this.addStreamToScreen(stream, userId);
            })
        }
    }

    onPeerOnCall(call){
        call.answer(this.myCurrentMediaStream);
        call.on('stream', stream => {
            if (!this.allPeersList.indexOf(stream.id)) {
                console.log("calling again same peer. ignore")
                return;
            } 
            this.allPeersList.push(stream.id);
            this.addStreamToScreen(stream, call.peer);
        })
    }

}