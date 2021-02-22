// initial class to be called by screen.

const onload = () => {
     const { ipcRenderer } = require('electron')     
     const io = require('socket.io-client');
     const socket = io.connect("http://localhost:3000");
     
     const media = new Media();
     const view = new View();
     const mediaFake = new FakeMedia();
     
     ipcRenderer.on('room-selected', (_, {roomId}) => {
          Main.init({media, mediaFake, view, socket, roomId});
     })


}

window.onload = onload
