/*
function drawUI(){
	colorText("stamina: " +  PlayerClass.sprintStamina, canvas.width-200, 50, 'red');
	console.log(PlayerClass.sprintStamina);
}
*/
var spinFrame = 0;
var spinStepsPerAnimFrame = 2;
var spinFrameTimer = 2;
var numFullSpins = 2;
var spinAnimationFrames;
var endAnimation = false;

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
    const SERVE_W = 330;
    const SERVE_H = 365;
    var drawLocation = perspectiveLocation(COURT_W / 2, COURT_L * 0.2, 0);

    if (numFullSpins > 0) {
        spinAnimationFrames = serve_spin.width / SERVE_W;
    } else {
        drawNow = true;
        if (Math.random() >= 0.5) {
            spinAnimationFrames = 0;
        } else {
            spinAnimationFrames = 5;
        }
    }

    if (spinFrameTimer-- < 0 && drawNow == false) {
        spinFrameTimer = spinStepsPerAnimFrame;
        spinFrame++;
    }
    if (!drawNow) {
        if (spinFrame >= spinAnimationFrames) {
            spinFrame = 0;
            numFullSpins--;
        }
        var titleText = "Drawing Right To Serve, please hold";
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
    var drawLocationPlayer = perspectiveLocation(COURT_W * 0.3, COURT_L * 0.8, 0);
    var subText = "Press Enter to continue";
    canvasContext.fillStyle = "black";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 15px verdana";
    canvasContext.fillText((subText), canvas.width / 2, 515);


    if (spinFrame == 5) {
        drawAtBaseSheetSprite(p1_standing, 0, drawLocationPlayer.x, drawLocationPlayer.y, PLAYER_W, PLAYER_H);
        var titleText = "Blue Player Has  Right To Serve !";
        canvasContext.fillStyle = "blue";
    } else {
        var titleText = "Red Player Has Right To Serve !";
        canvasContext.fillStyle = "red";
    }

    canvasContext.font = "bold 20px verdana";
    canvasContext.fillText((titleText), canvas.width / 2, 485);
}
