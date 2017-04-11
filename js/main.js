var canvas, canvasContext, scaledContext;

var serveBet = true;
var BallClass = new BallClass();
var PlayerClass = new PlayerClass();
var ComputerClass = new ComputerClass();
var playerEntry;

var menuLoop;
var framesPerSecond = 30;

window.addEventListener("resize", ResizeGame, false);

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    scaledCanvas = document.getElementById('gameCanvas');
    scaledContext = scaledCanvas.getContext('2d');
    scaledContext.fillStyle = "black";
    loadImages();
    ParticleSystem.init(scaledCanvas, 1000 / 30, false);
    ResizeGame();
}

function ResizeGame() {
    var width = window.innerWidth,
        height = window.innerHeight,
        newVal = 100,
        ratio = width / height;

    if (ratio > 4 / 3) {
        newVal = (height * 4 / 3) / width * 100;
        canvas.style.width =  newVal + "vw";
        canvas.style.height = "100vh";
        canvas.style.left = (100 - newVal) / 2 + "%";
    }
    else if (ratio < 4 / 3) {
        canvas.style.width = "100vw";
        newVal = (width * 3 / 4) / height * 100;
        canvas.style.height = newVal + "vh";
    }
    else {
        canvas.style.width = "100vw";
        canvas.style.height = "100vh";
    }
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
    createParticles();
}

function moveAll() {
    if (serveBet) {
        return;
    } else if (playerEntry == false) {
        BallClass.moveBall();
        PlayerClass.movePlayer();
        ComputerClass.movePlayer();
        //moveAllParticles();
    }
}

function clearScreen() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');
}


function drawAll() {
    //console.log(playerEntry)
    clearScreen();
    drawBitmapCenteredWithRotation(squashcourt, canvas.width / 2, canvas.height / 2, 0);
    drawStaminaBar();
    drawScoreCounter();

    if (serveBet) {
        rightToServe();
    } else {

        BallClass.drawShadow();
        BallClass.drawInAir();
        ParticleSystem.draw();
        GradientShotToFrontWall(PlayerClass.x, PlayerClass.y)


        if (playerEntry) {
            PlayerClass.initDrawPlayer();
            ComputerClass.initDrawPlayer();
        } else if (playerEntry == false) {
            PlayerClass.drawPlayer();
            ComputerClass.drawPlayer();
            //drawAllParticles();
            Rules.check();
        }
    }
    //PlayerClass.drawTargetFrontWall();
    //PlayerClass.selectBackWall();//shows backwal coords on screen
    //drawUI();
    //colorText(Math.floor(mouseX)+","+Math.floor(mouseY), mouseX,mouseY,'blue');
    //colorRect(0,0,64,97,"orange");//real life court
    //colorRect(BallClass.x,BallClass.y,3,3,"green");////real life ball   
}

function magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
}