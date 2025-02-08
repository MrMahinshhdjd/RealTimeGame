const socket = io("http://localhost:3000");
let gameStarted = false;
let blocks = [];

// UI Buttons
document.getElementById("startBtn").addEventListener("click", () => {
    alert("Single-player mode coming soon!");
});

document.getElementById("multiplayerBtn").addEventListener("click", () => {
    document.getElementById("multiplayerMenu").style.display = "block";
});

document.getElementById("joinServer").addEventListener("click", () => {
    socket.emit("playerJoined");
    document.getElementById("playerCount").innerText = "Waiting for another player...";
});

socket.on("playerJoined", (count) => {
    document.getElementById("playerCount").innerText = `Players: ${count}/2`;
});

socket.on("startGame", () => {
    document.getElementById("multiplayerMenu").style.display = "none";
    document.getElementById("gameCanvas").style.display = "block";
    startGame();
});

// Update blocks when another player places one
socket.on("updateBlocks", (block) => {
    blocks.push(block);
    drawBlocks();
});

function startGame() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 500;
    gameStarted = true;

    canvas.addEventListener("click", (e) => {
        if (!gameStarted) return;

        let block = { x: e.offsetX, y: e.offsetY, size: 20, color: "blue" };
        blocks.push(block);
        socket.emit("placeBlock", block);
        drawBlocks();
    });
}

function drawBlocks() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    blocks.forEach((block) => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.size, block.size);
    });
}