// initial class to be called by screen.

const onload = () => {


     // const peer = new Peer();
     const socket = require('socket.io-client');
     const io = socket.connect("http://localhost:3000");

     console.log(io);
     

     const media = new Media();
     const view = new View();
     Main.init({media, view});
     


}

window.onload = onload
