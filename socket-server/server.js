const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    console.log("opa")
})


io.on('connection', socket => {
    socket.on('join-room', (roomId, id) => {
        console.log(`Client:${id} joined the room`)
        socket.join(roomId)
        socket.to(roomId).emit('new-user', id)
    })
    
})

http.listen(3000);
