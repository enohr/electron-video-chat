// initial class to be called by screen.

const onload = () => {


     const peer = new Peer(undefined, {
          host: 'localhost',
          path: '/',
          port: '3001'
     });
     const io = require('socket.io-client');
     const socket = io.connect("http://localhost:3000");
     const roomId = '1';


     const media = new Media();
     const view = new View();
     Main.init({media, view, peer, socket, roomId});
     


}

window.onload = onload
