/*
function drawUI(){
	colorText("stamina: " +  PlayerClass.sprintStamina, canvas.width-200, 50, 'red');
	console.log(PlayerClass.sprintStamina);
}
*/

var muteButtonX = 700;
var muteButtonY = 480;
var muteButtonWidth = 50;
var muteButtonHeight = 50;

var pauseButtonX = 750;
var pauseButtonY = 480;
var pauseButtonWidth = 50;
var pauseButtonHeight = 50;
var gamePauseState = 'P';

//board message for rules
var message=0;
var MESSAGEBOARD=0;
var FLOORBOUNCE=1;
var TINHIT=2;
var OUTLINES=3;
var FLOORBOUNCEBEFOREWALL=24;
var BLUESERVES=4;
var REDSERVES=5;
var PRESSSPACE=6;
var MENUUPDOWNSELECTKEYS=25;
var DRAWSERVE=7;
var BLUEWINS=8;
var REDWINS=9;
var NOTHINGHAPPENS1=10;
var NOTHINGHAPPENS2=11;
var NOTHINGHAPPENS3=12;
var NOTHINGHAPPENS4=13;
var NOTHINGHAPPENS5=14;
var NOTHINGHAPPENS6=15;
var NOTHINGHAPPENS7=16;
var NOTHINGHAPPENS8=17;
var NOTHINGHAPPENS9=18;
var NOTHINGHAPPENS10=19;
var NOTHINGHAPPENS11=20;
var NOTHINGHAPPENS12=21;
var NOTHINGHAPPENS13=22;
var NOTHINGHAPPENS14=23;
var messageTip=NOTHINGHAPPENS1;

var spinFrame = 0,
    spinStepsPerAnimFrame = 2,
    spinFrameTimer = 2,
    numFullSpins = 2,
    spinAnimationFrames = null,
    endAnimation = false,
    moreFrames = false,
    drawNow = false,
    uiTimer;
var spinDrawLocation;
const SERVE_W = 330,
        SERVE_H = 365;
var rightToServeOutcomeReady=false;


function muteToggleCheck(x, y){
  if(x > muteButtonX && //if right of left side
    x < muteButtonX + muteButtonWidth && //if left of right side
    y > muteButtonY && //if below top
    y < muteButtonY + muteButtonHeight ){ //if above bottom
    isMuted = !isMuted;
  }
}

function drawMuteState (){
  var muteState = 'U';
  if(isMuted){
    muteState = 'M';
  } else{
    muteState = 'U';
  }
  colorText(muteState, muteButtonX, muteButtonY, 'white');
}

function gamePauseToggleCheck(x, y){
  if(x > pauseButtonX && //if right of left side
    x < pauseButtonX + pauseButtonWidth && //if left of right side
    y > pauseButtonY && //if below top
    y < pauseButtonY + pauseButtonHeight ){ //if above bottom
    gameIsPaused = !gameIsPaused;
  }
}

function drawGamePauseState (){
  if(gameIsPaused){
    gamePauseState = '||';
    } else{
        gamePauseState = 'P';    
    }
  colorText(gamePauseState, pauseButtonX, pauseButtonY, 'red');
}

function drawStaminaBar() {
    //draw bar border
    colorRect(700, canvas.height - 555, 104, 24, 'White');
    //draw bar background
    colorRect(700, canvas.height - 555, 100, 20, 'LightGray');
    //draw current stamina
    //OLD colorRect(633, canvas.height - 560, PlayerClass.sprintStamina * 5, 20, 'red');
    colorRect(665, canvas.height - 555, 30, 20, 'red');
    //draw label
    canvasContext.fillStyle = "white";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 18px Cherry Cream Soda";
    canvasContext.fillText("Stamina", 700, canvas.height - 573);
}

function calculateRightToServe() {
    spinDrawLocation = perspectiveLocation(COURT_W / 2, COURT_L * 0.2, 0),
        titleText = null;

    drawMessageBoard();
    message=7;
    //console.log(numFullSpins)
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
        /*titleText = "";
        canvasContext.fillStyle = "grey";
        canvasContext.textAlign = "center";
        canvasContext.font = "bold 15px Cherry Cream Soda";
        canvasContext.fillText((titleText), canvas.width / 2, 490);*/
    }
    else {
        if (!endAnimation) {
            spinFrame = spinAnimationFrames;
            endAnimation = true;
        }
        rightToServeOutcomeReady=true;
    }
    drawRightToServe();
    //console.log(serve_spin, spinFrame, drawLocation.x, drawLocation.y, SERVE_W, SERVE_H)
}

function drawRightToServe(){
    if (!ServeHandler.bluePicks) drawAtBaseSheetSprite(serve_spin, spinFrame, spinDrawLocation.x, spinDrawLocation.y, SERVE_W, SERVE_H);   
}

function rightToServeOutcome() {
    var drawLocationPlayer1 = (ServeHandler.flipPos > 0 ? perspectiveLocation(COURT_W * 0.3, COURT_L * 0.65, 0) : perspectiveLocation(COURT_W * 0.8, COURT_L * 0.65, 0));
    var drawLocationPlayer2 = perspectiveLocation(COURT_W * 0.8, COURT_L * 0.65, 0);
    var subText = "Press Space to Continue";
    var chooseLeft = "",
        chooseRight = "",
        setChoice = "",
        titleText = null;

        //console.log(serveBet)
    if (ServeHandler.bluePicks) {
        window.clearTimeout(timer);
        drawAtBaseSheetSprite(p1_standing, 0, drawLocationPlayer1.x, drawLocationPlayer1.y, PLAYER_W, PLAYER_H);
        titleText = "Choose Your Starting Side:";
        subText = "";
        canvasContext.fillStyle = "blue";
        chooseLeft = "A for Left";
        chooseRight = "D for Right"
        setChoice = "Press Space to Continue"
        ServeHandler.WhoServes();
    }
    else if (spinFrame == 5) {
        
        drawAtBaseSheetSprite(p1_standing, 0, drawLocationPlayer1.x, drawLocationPlayer1.y, PLAYER_W, PLAYER_H);
        titleText = "Blue Player Has Right To Serve !";
        canvasContext.fillStyle = "blue";
        ServeHandler.servingPlayer = ServeHandler.BLUE;
        ServeHandler.nextServingPlayer = ServeHandler.BLUE;
        BallClass.x = ServeHandler.LEFT_SQUASHBALL;
        ComputerClass.swingTurn = true;
        PlayerClass.swingTurn = false;
        subText = "";
        timer = window.setTimeout(function () { ServeHandler.bluePicks = true; }, 1200);
    } else {
        drawAtBaseSheetSprite(p2_standing, 0, drawLocationPlayer2.x, drawLocationPlayer2.y, PLAYER_W, PLAYER_H);
        titleText = "Red Player Has Right To Serve !";
        canvasContext.fillStyle = "red";
        ServeHandler.servingPlayer = ServeHandler.RED;
        ComputerClass.swingTurn = false;
        PlayerClass.swingTurn = true;
    }

    canvasContext.font = "bold 20px Cherry Cream Soda";
    canvasContext.fillText((titleText), canvas.width / 2, 485);

    canvasContext.fillStyle = "black";
    canvasContext.textAlign = "center";
    //canvasContext.fillText(setChoice, canvas.width / 2, canvas.height / 2);
    //message player
    message=PRESSSPACE;
    drawMessageBoard();

    canvasContext.font = "bold 15px Cherry Cream Soda";
    //canvasContext.fillText((subText), canvas.width / 2, 515);
    canvasContext.fillStyle = "blue";
    canvasContext.fillText(chooseLeft, canvas.width * 2 / 5, 515);
    canvasContext.fillText(chooseRight, canvas.width * 3 / 5, 515);
}

function drawMessageBoard(){
    var messageBoardW=412;
    var messageBoardH=54;
    drawAtBaseSheetSprite(messageboard, 0, canvas.width/2, canvas.height-35, messageBoardW, messageBoardH);
    switch (message) {
                case BLUESERVES:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Blue Serves, press Space.", canvas.width/2, canvas.height-30 );
                    break;
                case REDSERVES:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Red Serves, press Space.", canvas.width/2, canvas.height-30 );
                    break;
                case FLOORBOUNCE:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Excess Ball Bounce On Floor! Press Esc", canvas.width/2, canvas.height-30 );
                    break;
                case FLOORBOUNCEBEFOREWALL:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Floor bounce before the wall! Press Esc", canvas.width/2, canvas.height-30 );
                    break;
                case TINHIT:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Down ! Ball Hit The Tin. Press Esc.", canvas.width/2, canvas.height-30 );
                    break;
                case OUTLINES:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Out ! Ball Over Outside Lines. Press Esc", canvas.width/2, canvas.height-30 );
                    break;
                case MESSAGEBOARD:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Welcome to Squash Encounter !", canvas.width/2, canvas.height-30 );
                    break;
                case PRESSSPACE:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Press Space To Continue", canvas.width/2, canvas.height-30 );
                    break;
                case DRAWSERVE:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Drawing Right To Serve, please hold", canvas.width/2, canvas.height-30 );
                    break;
                case BLUEWINS:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Blue Player Wins !", canvas.width/2, canvas.height-30 );
                    break;                    
                case REDWINS:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Red Player Wins !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS1:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Constantly hydrate during your game !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS2:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Stretch before your game !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS3:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Stay fit to play Squash !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS3:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Don't play Squash to stay fit !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS4:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Stretch your goals !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS5:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Don't appeal lets you don't believe !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS6:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Insist on precise tight drives !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS7:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Don't hit yourself !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS8:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Control the T !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS9:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Get that drive into the nick !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS10:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Target wall quadrants to gain control !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS11:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Pace yourself in a Rally !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS12:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Eat carbs the night before your game !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS13:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Eat fruit on the day !", canvas.width/2, canvas.height-30 );
                    break;
                case NOTHINGHAPPENS14:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Gloria Hallelujah";
                    canvasContext.fillText("Target your wall shots !", canvas.width/2, canvas.height-30 );
                    break;
                case MENUUPDOWNSELECTKEYS:
                    canvasContext.fillStyle = "white";
                    canvasContext.textAlign = "center";
                    canvasContext.font = "18px Cherry Cream Soda";
                    canvasContext.fillText("Up (W), Down (S), Confirm (Space Bar)", canvas.width/2, canvas.height-30 );
                    break;
                    
                }
}
