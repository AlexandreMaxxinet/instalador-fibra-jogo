
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let tecnico = {
    x: 50, y: 300, width: 60, height: 60, vy: 0, jumping: false,
    img: new Image()
};
tecnico.img.src = "tecnico.png";

let obstacles = [];
let score = 0;
let gameSpeed = 4;
let gravity = 1.2;
let fireEventTimer = 0;
let fireActive = false;
let fireDelay = 0;
let gameRunning = false;

const barkSound = new Audio("latido.mp3");
const stepSound = new Audio("passos.mp3");
const fireSound = new Audio("faísca.mp3");

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        update();
    }
}

function restartGame() {
    document.location.reload();
}

function shareGame() {
    const msg = "Joguei o Instalador de Internet da MAXXINET! Pulei postes e cachorros conectando fibra! 🚀💥";
    const url = "https://wa.me/?text=" + encodeURIComponent(msg);
    window.open(url, "_blank");
}

function jump() {
    if (!tecnico.jumping && !fireActive && gameRunning) {
        tecnico.vy = -18;
        tecnico.jumping = true;
        stepSound.play();
    }
}

document.addEventListener("touchstart", jump);
document.addEventListener("keydown", function (e) {
    if (e.code === "Space") jump();
});

function spawnObstacle() {
    const type = Math.random() < 0.5 ? "poste" : "cachorro";
    const img = new Image();
    img.src = type === "poste" ? "poste.png" : "cachorro.png";
    const obstacle = {
        x: canvas.width,
        y: 320,
        width: 50,
        height: 50,
        type: type,
        img: img
    };
    obstacles.push(obstacle);
    if (type === "cachorro") barkSound.play();
}

function drawTecnico() {
    ctx.drawImage(tecnico.img, tecnico.x, tecnico.y, tecnico.width, tecnico.height);
}

function drawObstacle(obstacle) {
    ctx.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function drawFireEvent() {
    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.fillText("🔥 Poste pegando fogo! Aguardando companhia elétrica...", 100, 100);
    ctx.fillStyle = "#000";
    ctx.fillRect(600, 320, 80, 40);
    ctx.fillStyle = "#FFF";
    ctx.fillText("🚒", 610, 350);
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "18px Arial";
    ctx.fillText("Cabos conectados: " + score, 10, 20);
}

function update() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTecnico();

    if (!fireActive) {
        tecnico.y += tecnico.vy;
        tecnico.vy += gravity;

        if (tecnico.y > 300) {
            tecnico.y = 300;
            tecnico.vy = 0;
            tecnico.jumping = false;
        }

        obstacles.forEach((obstacle, index) => {
            obstacle.x -= gameSpeed;
            drawObstacle(obstacle);

            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score++;
            }

            if (tecnico.x < obstacle.x + obstacle.width &&
                tecnico.x + tecnico.width > obstacle.x &&
                tecnico.y < obstacle.y + obstacle.height &&
                tecnico.y + tecnico.height > obstacle.y) {
                gameRunning = false;
                ctx.fillStyle = "black";
                ctx.font = "22px Arial";
                ctx.fillText("Você bateu! Pontuação final: " + score, 200, 180);
            }
        });

        if (Math.random() < 0.02) spawnObstacle();
    }

    drawScore();

    fireEventTimer++;
    if (fireEventTimer > 500 && !fireActive && Math.random() < 0.01) {
        fireActive = true;
        fireDelay = 150;
        fireEventTimer = 0;
        fireSound.play();
    }

    if (fireActive) {
        drawFireEvent();
        fireDelay--;
        if (fireDelay <= 0) {
            fireActive = false;
        }
    }

    requestAnimationFrame(update);
}
