// initial class to be called by screen.

const onload = () => {


     const io = require('socket.io-client');
     const socket = io.connect("http://localhost:3000");
     const roomId = '1';



     const media = new Media();
     const view = new View();
     Main.init({media, view, socket, roomId});
     


}

window.onload = onload
