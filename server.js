const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    socket.on('changeVolume', (data) => {
        socket.broadcast.emit('updateVolume', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
