const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const host = '192.168.3.187';
const port = process.env.PORT || 3000;

let images = [];
let currentImageIndex = -1;

io.on('connection', (socket) => {
    socket.on('changeVolume', (data) => {
        socket.broadcast.emit('updateVolume', data);
    });

    socket.on('addImage', (image) => {
        images.push(image);
        io.emit('updateImages', images);
    });

    socket.on('deleteImage', (index) => {
        if (index >= 0 && index < images.length) {
            images.splice(index, 1);
            if (images.length === 0) {
                currentImageIndex = -1;
            } else if (index <= currentImageIndex) {
                currentImageIndex = Math.max(currentImageIndex - 1, 0);
            }
            io.emit('updateImages', images);
            io.emit('updateCurrentImage', currentImageIndex);
        }
    });

    socket.on('changeImage', (index) => {
        currentImageIndex = index;
        io.emit('updateCurrentImage', currentImageIndex);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado:', socket.id);
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});

server.listen(port, host, () => {
    console.log(`Servidor escuchando en el host ${host} y puerto ${port}`);
});

