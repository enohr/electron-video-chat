const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
    console.log("opa")
})


io.on('connection', socket => {
    console.log(socket);
})

http.listen(3000);
