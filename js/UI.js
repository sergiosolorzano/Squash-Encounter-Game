/*
function drawUI(){
	colorText("stamina: " +  PlayerClass.sprintStamina, canvas.width-200, 50, 'red');
	console.log(PlayerClass.sprintStamina);
}
*/
var spinFrame = 0,
    spinStepsPerAnimFrame = 2,
    spinFrameTimer = 2,
    numFullSpins = 2,
    spinAnimationFrames = null,
    endAnimation = false,
    moreFrames = false,
    drawNow = false;

function drawStaminaBar() {
    //draw bar background
    colorRect(0, canvas.height - 20, 100, 20, 'LightGray');
    //draw current stamina
    colorRect(0, canvas.height - 20, PlayerClass.sprintStamina * 5, 20, 'red');
    //draw label
    colorText('STAMINA', 100, canvas.height - 30, 'white');
}

function rightToServe() {
    const SERVE_W = 330,
        SERVE_H = 365;
    var drawLocation = perspectiveLocation(COURT_W / 2, COURT_L * 0.2, 0),
        titleText = null;

    if (numFullSpins > 0) {
        spinAnimationFrames = serve_spin.width / SERVE_W;
    } else if (!moreFrames) {
        if (Math.random() >= 0.5) {
            spinAnimationFrames = 0;
            drawNow = true;
        } else {
            spinAnimationFrames = 5;
            moreFrames = true;
        }
    }

    if (spinFrameTimer-- < 0 && drawNow == false) {
        spinFrameTimer = spinStepsPerAnimFrame;
        spinFrame++;

        if (moreFrames && spinFrame == 5) {
            moreFrames = false;
            drawNow = true;
        }
    }
    if (!drawNow) {
        if (spinFrame >= spinAnimationFrames) {
            spinFrame = 0;
            numFullSpins--;
        }
        titleText = "Drawing Right To Serve, please hold";
        canvasContext.fillStyle = "grey";
        canvasContext.textAlign = "center";
        canvasContext.font = "bold 15px verdana";
        canvasContext.fillText((titleText), canvas.width / 2, 490);
    }
    else {
        if (!endAnimation) {
            spinFrame = spinAnimationFrames;
            endAnimation = true;
        }
        rightToServeOutcome();
    }
    drawAtBaseSheetSprite(serve_spin, spinFrame, drawLocation.x, drawLocation.y, SERVE_W, SERVE_H);
}

function rightToServeOutcome() {
    var drawLocationPlayer = perspectiveLocation(COURT_W * 0.3, COURT_L * 0.8, 0),
        subText = "Press Enter to continue",
        titleText = null;

    canvasContext.fillStyle = "black";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 15px verdana";
    canvasContext.fillText((subText), canvas.width / 2, 515);

    if (spinFrame == 5) {
        drawAtBaseSheetSprite(p1_standing, 0, drawLocationPlayer.x, drawLocationPlayer.y, PLAYER_W, PLAYER_H);
        titleText = "Blue Player Has  Right To Serve !";
        canvasContext.fillStyle = "blue";
        ServeClass.servingPlayer = ServeClass.BLUE;
        ComputerClass.swingTurn = true;
        PlayerClass.swingTurn = false;
        BallClass.x = COURT_W * 0.18;
    } else {
        titleText = "Red Player Has Right To Serve !";
        canvasContext.fillStyle = "red";
        ServeClass.servingPlayer = ServeClass.RED;
        ComputerClass.swingTurn = false;
        PlayerClass.swingTurn = true;
    }

    canvasContext.font = "bold 20px verdana";
    canvasContext.fillText((titleText), canvas.width / 2, 485);
}
