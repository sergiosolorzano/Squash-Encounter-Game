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
var timerOnCheer = 0;
var music1On=true;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    canvasContext.fillStyle = "black";

    initDrawCanvas();
    loadImages();

    ParticleSystem.init(canvas, 1000 / 30, false);
    //Sound.stop("menu3_music");
    //Sound.stop("menu4_music");
    Sound.play("menu3_music",true,0.5);    
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
    initInput();
    menuLoop = setInterval(function () {
        drawMenu();
    }, 1000 / framesPerSecond);
}

function loadLevel() {
    Sound.stop("menu3_music");
    Sound.stop("menu4_music");
    playerEntry = true;
    BallClass.Init();
    PlayerClass.Init();
    ComputerClass.Init();
}

function moveAll() {
    if (serveBet) {
        calculateRightToServe();
        //return;
    }
    else if (ServeHandler.inServe) BallClass.moveBallForServe();
    else if (playerEntry == false) {
        if (ServeHandler.matchStart && ServeHandler.inPlay) {
            BallClass.moveBall();
            ComputerClass.movePlayer();
            PlayerClass.movePlayer();
            moveAllPuffParticles();
            moveAllKillParticles();
            moveAllEndGameParticles();
        }
    }
}

function clearScreen() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');
}

function drawAll() {
    clearScreen();
    const CHEER_LOOP = 20;

    var canvasAnimationFrames = squashcourt_withcheer.width / 800;
    //console.log(timerOnCheer)
    if (cheerOn) {
        if (canvasFrameTimer-- < 0) {
            canvasFrameTimer = canvasStepsPerAnimFrame;
            canvasFrame++;
        }
        if (canvasFrame >= canvasAnimationFrames) {
            if (timerOnCheer < CHEER_LOOP) {
                canvasFrame = 0;
                timerOnCheer++;
            } else {
                canvasFrame = 0;
                timerOnCheer = 0;
                cheerOn = false;
            }
        }
        drawAtBaseSheetSprite(squashcourt_withcheer, canvasFrame, canvas.width / 2, canvas.height / 2, 800, 600);

    } else {
        drawAtBaseSheetSprite(squashcourt_nocheer, 0, canvas.width / 2, canvas.height / 2, 800, 600);
    }

    drawGamePauseState();
    drawMuteState();
    drawStaminaBar();
    drawScoreCounter();
    //drawCourtQuadrants();

    if (serveBet) {
        drawRightToServe();
        if(rightToServeOutcomeReady){
            rightToServeOutcome();
        }
    Rules.score.AI=8;//to test end of game
    } else {
        if (BallClass.isVisible) {
            BallClass.drawShadow();
            BallClass.drawInAir();
        }
        
        ParticleSystem.draw();
        GradientShotToFrontWall(PlayerClass.x, PlayerClass.y)
        //console.log(ServeHandler.inPlay)
        //console.log(ServeHandler.servingPlayer,ServeHandler.inPlay)
        if(ServeHandler.servingPlayer==ServeHandler.BLUE && ServeHandler.inPlay==false){//1=blueplayer
            
            //console.log("im here")
            message=BLUESERVES;
            messageTip=Math.floor(Math.random() * 5) + 1
        } else if (ServeHandler.servingPlayer==ServeHandler.RED && ServeHandler.inPlay==false ){//1=blueplayer
                //console.log("im here")
            message=REDSERVES;
            messageTip=Math.floor(Math.random() * 14) + 1
        } else if (endPoint==false){
            //console.log(messageTip)
            switch (messageTip) {//maybe quadrantHit=0 in which case none called
                case 1:
                    message=NOTHINGHAPPENS1;
                    break;
                case 2:
                    message=NOTHINGHAPPENS2;
                    break;
                case 3:
                    message=NOTHINGHAPPENS3;
                    break;
                case 4:
                    message=NOTHINGHAPPENS4;
                    break;
                case 5:
                    message=NOTHINGHAPPENS5;
                    break;
                case 6:
                    message=NOTHINGHAPPENS6;
                    break;
                case 7:
                    message=NOTHINGHAPPENS7;
                    break;
                case 8:
                    message=NOTHINGHAPPENS8;
                    break;
                case 9:
                    message=NOTHINGHAPPENS9;
                    break;
                case 10:
                    message=NOTHINGHAPPENS10;
                    break;
                case 11:
                    message=NOTHINGHAPPENS11;
                    break;
                case 12:
                    message=NOTHINGHAPPENS12;
                    break;
                case 13:
                    message=NOTHINGHAPPENS13;
                    break;
                case 14:
                    message=NOTHINGHAPPENS14;
                    break;
            }
        }
        
        if (playerEntry) {
            PlayerClass.initDrawPlayer();
            ComputerClass.initDrawPlayer();
        } else if (playerEntry == false) {
            drawTargets();
            PlayerClass.drawPlayer();
            ComputerClass.drawPlayer();
            ServeHandler.DrawCountDown();
            drawAllPuffParticles();
            drawAllEndGameParticles();
            drawAllKillParticles();
            drawMessageBoard();
            //drawLines();
            if(escPress==1){
                drawText("Press Esc to Return to Game", 425);
                drawText("Press Enter to Exit Game", 475); 
            }
        }
    
}
    redrawCanvas();
}

function magnitude(x, y) {
    return Math.sqrt(x * x + y * y);
}
