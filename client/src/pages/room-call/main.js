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

        // this.myStream = this.mediaFake.fakeMediaStream();
        this.myCurrentMediaStream = await this.startMediaStream();
        
        this.view.onLeaveClicked();
        this.sourceSelected();

        this.view.setCameraOnClick(this.onCameraClicked.bind(this))
        this.view.setMicrophoneOnClick(this.onMicrophoneClicked.bind(this));
        this.view.setScreenShareOnClick(this.onScreenClicked.bind(this));
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

    async startMediaStream() {
        const mediaStream = await this.media.getDevices();
        mediaStream.getVideoTracks()[0].enabled = false
        mediaStream.getAudioTracks()[0].enabled = false        

        this.addStreamToScreen(mediaStream);
        return mediaStream;
    }

    onMicrophoneClicked() {
        const enabled = this.myCurrentMediaStream.getAudioTracks()[0].enabled
        this.myCurrentMediaStream.getAudioTracks()[0].enabled = !enabled
        return enabled;
    }

    onCameraClicked() {
        const enabled = this.myCurrentMediaStream.getVideoTracks()[0].enabled
        this.myCurrentMediaStream.getVideoTracks()[0].enabled = !enabled;
        return enabled;
    }

    onScreenClicked() {
        if (this.isSharingScreen) {
            this.isSharingScreen = false;
            this.myCurrentPeer.destroy();
            this.socket.emit('screen-leaved', this.myCurrentPeerScreenId)
            // Maybe has an better way. Now, the socket handle two peers, so we send the peerID to others sockets to remove from your video grid
            return;
        }
        this.isSharingScreen = true;
        ipcRenderer.send('open-modal');
        // We cant send the sources on ipcRenderer.send cause this throw an exception. It doesnt support to send DOM objects.
    }

    sourceSelected() {
        ipcRenderer.on('screen-source', async (_, {source}) => {
            this.myCurrentMediaScreen = await this.media.getScreenShare(source);
            this.myCurrentPeer = await this.createScreenSharePeer();
            this.addStreamToScreen(this.myCurrentMediaScreen, 'my-video')
            // peerId of the screen is not working. idk why yet
        })
    }

    addStreamToScreen(stream = this.myCurrentMediaStream, peerId = this.myCurrentPeerId) {
        const isCurrentUser = this.myCurrentPeerId == peerId;
        this.view.addCameraToScreen(stream, peerId, isCurrentUser);
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
        this.myCurrentPeerId = userId;
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