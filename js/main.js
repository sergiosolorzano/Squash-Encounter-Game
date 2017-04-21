var canvas, canvasContext,             // draw to this canvas
    drawCanvas, drawContext;        // NOT to this canvas
var canvasFrame = 0;
var canvasStepsPerAnimFrame = 5;//
var canvasFrameTimer = 5;//how quick it changes between frames;
var cheerOn = false;//determines whether the crowd sprite should cheer


var serveBet = true;
var BallClass = new BallClass();
var PlayerClass = new PlayerClass();
var ComputerClass = new ComputerClass();
var playerEntry;

var menuLoop;
var framesPerSecond = 30;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    canvasContext.fillStyle = "black";

    initDrawCanvas();
    loadImages();

    ParticleSystem.init(canvas, 1000 / 30, false);
}

//perspective location for player and ball
function perspectiveLocation(pixelX, pixelY, pixelZ) {
    var visualLocation = { x: 0, y: 0, z: 0 };
    var percTowardNear = pixelY / COURT_L;
    var hereFloorY = (1.0 - percTowardNear) * farBottomLeftY + percTowardNear * nearBottomLeftY;

    var percTowardRight = pixelX / COURT_W;
    var hereBottomLeftX = (1.0 - percTowardNear) * farBottomLeftX + percTowardNear * nearBottomLeftX;
    var hereBottomRightX = (1.0 - percTowardNear) * farBottomRightX + percTowardNear * nearBottomRightX;
    var hereFloorX = (1.0 - percTowardRight) * hereBottomLeftX + percTowardRight * hereBottomRightX;
    visualLocation.x = hereFloorX;
    visualLocation.y = hereFloorY;

    var wallHeightNear = nearBottomLeftY - nearTopLeftY;
    var wallHeightFar = farBottomLeftY - farTopLeftY;
    var wallHeightHere = (1.0 - percTowardNear) * wallHeightFar + percTowardNear * wallHeightNear;
    var courtHeightHere = (pixelZ / COURT_T) * wallHeightHere;
    visualLocation.z = courtHeightHere;

    return visualLocation;
}

function imageLoadingDoneSoStartGame() {

    menuActive = true;
    initInput();
    menuLoop = setInterval(function () {
        drawMenu();
    }, 1000 / framesPerSecond);

}

function loadLevel() {
    playerEntry = true;
    BallClass.Init();
    PlayerClass.Init();
    ComputerClass.Init();
}

function moveAll() {
    if (serveBet) {
        return;
    }
    else if (playerEntry == false) {
        if (ServeHandler.matchStart && ServeHandler.inPlay) {
            BallClass.moveBall();
            ComputerClass.movePlayer();
            PlayerClass.movePlayer();
            moveAllParticles();
        }
    }
}

function clearScreen() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');
}

function drawAll() {
    clearScreen();
    var canvasAnimationFrames = 1600 / 800;

    if (cheerOn) {
        if (canvasFrameTimer-- < 0) {
            canvasFrameTimer = canvasStepsPerAnimFrame;
            canvasFrame++;
        }
        if (canvasFrame >= canvasAnimationFrames) {
            canvasFrame = 0;
            cheerOn = false;
        }
        drawAtBaseSheetSprite(squashcourt_withcheer, canvasFrame, canvas.width / 2, canvas.height / 2, 800, 600);
    } else {
        drawAtBaseSheetSprite(squashcourt_nocheer, 0, canvas.width / 2, canvas.height / 2, 800, 600);
    }

    //drawBitmapCenteredWithRotation(squashcourt, canvas.width / 2, canvas.height / 2, 0);
    drawStaminaBar();
    drawScoreCounter();

    if (serveBet) {
        rightToServe();
    } else {
        if (BallClass.isVisible) {
            BallClass.drawShadow();
            BallClass.drawInAir();
        }
        ParticleSystem.draw();
        GradientShotToFrontWall(PlayerClass.x, PlayerClass.y)

        if (playerEntry) {
            PlayerClass.initDrawPlayer();
            ComputerClass.initDrawPlayer();
        } else if (playerEntry == false) {
            PlayerClass.drawPlayer();
            ComputerClass.drawPlayer();
            ServeHandler.DrawCountDown();
            drawAllParticles();
            Rules.check();
        }
    }
    //PlayerClass.drawTargetFrontWall();
    //PlayerClass.selectBackWall();//shows backwal coords on screen
    //drawUI();
    //colorText(Math.floor(mouseX)+","+Math.floor(mouseY), mouseX,mouseY,'blue');
    //colorRect(0,0,64,97,"orange");//real life court
    //colorRect(BallClass.x,BallClass.y,3,3,"green");////real life ball
    redrawCanvas();
}

function magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
}