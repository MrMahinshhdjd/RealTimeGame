const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public"))); // Serve frontend files

let players = [];

io.on("connection", (socket) => {
    console.log("A player connected:", socket.id);

    if (players.length < 2) {
        players.push(socket.id);
        io.emit("playerJoined", players.length);
    }

    if (players.length === 2) {
        io.emit("startGame");
    }

    socket.on("placeBlock", (block) => {
        io.emit("updateBlocks", block);
    });

    socket.on("disconnect", () => {
        console.log("A player disconnected:", socket.id);
        players = players.filter((id) => id !== socket.id);
        io.emit("playerLeft", players.length);
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});