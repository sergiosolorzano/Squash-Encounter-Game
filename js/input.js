var isMuted = false;
var gameIsPaused=false;

const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;
const KEY_M = 77;
const KEY_P = 80;

const KEY_SPACE = 32;
const KEY_LEFT_SHIFT = 16;
const KEY_ENTER = 13;
const KEY_ESC = 27;

const KEY_ARROWUP = 38;
const KEY_ARROWDOWN = 40;
const KEY_ARROWRIGHT = 39;
const KEY_ARROWLEFT = 37;
//const KEY_Q = 81;

var mouseX = 0;
var mouseY = 0;
var mouseClickPos = { x: 0, y: 0 };

function initInput() {
    canvas.addEventListener('mousemove', updateMousePos);
    document.addEventListener('keydown', keyPressed);
    document.addEventListener('keyup', keyReleased);
    document.addEventListener('click', function (evt) {
        var mouseClickPos = updateMousePos(evt);

        muteToggleCheck(mouseClickPos.x, mouseClickPos.y);
        gamePauseToggleCheck(mouseClickPos.x, mouseClickPos.y);

        selectBackWall(mouseClickPos.x, mouseClickPos.y);
        selectFrontWall(mouseClickPos.x, mouseClickPos.y);
        if (ServeHandler.bluePicks) {
            if (mouseY > canvas.height / 2) {
                var halfCourt = canvas.width / 2;
                if (mouseX > halfCourt && mouseX < halfCourt + halfCourt / 2) ServeHandler.flipPos = -1;
                else if (mouseX < halfCourt && mouseX > halfCourt - halfCourt / 2) ServeHandler.flipPos = 1;
            }
        }
    });
    PlayerClass.initInput(KEY_W, KEY_ARROWUP, KEY_D, KEY_ARROWRIGHT, KEY_S, KEY_ARROWDOWN, KEY_A, KEY_ARROWLEFT, KEY_SPACE, KEY_ESC, KEY_ENTER);
}

function updateMousePos(evt) {
    var rect = drawCanvas.getBoundingClientRect();
    var root = document.documentElement;
    var posX = evt.clientX - rect.left - root.scrollLeft,
        posY = evt.clientY - rect.top - root.scrollTop,
        posXY = scaleCoordinates(posX, posY);

    mouseX = posXY.x;
    mouseY = posXY.y;
    return {
        x: mouseX,
        y: mouseY
    };
    // cheat / hack to test car in any position
    /*carX = mouseX;
    carY = mouseY;
    carSpeedX = 4;
    carSpeedY = -4;*/
}

function keySet(keyEvent, whichPlayer, setTo) {
    // FIXME: for better simulation we may need to track
    // previous player direction and velocity and only
    // play shoe squeaks when you turn 180 degrees
    // at high speed. For now, just random shoe noise!
    if (Math.random() > 0.75 && gameIsPaused==false) Sound.shoe();

    if (keyEvent.keyCode == whichPlayer.controlKeyLeft) {
        whichPlayer.keyHeld_TurnLeft = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeyLeft2) {
        whichPlayer.keyHeld_TurnLeft = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeyRight) {
        whichPlayer.keyHeld_TurnRight = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeyRight2) {
        whichPlayer.keyHeld_TurnRight = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeyUp) {
        whichPlayer.keyHeld_Gas = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeyUp2) {
        whichPlayer.keyHeld_Gas = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeyDown) {
        whichPlayer.keyHeld_Reverse = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeyDown2) {
        whichPlayer.keyHeld_Reverse = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeyEsc) {//accelerate serve at end point
        whichPlayer.keyHeld_Esc = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeyEnter) {//accelerate serve at end point
        whichPlayer.keyHeld_Enter = setTo;
    }
    if (keyEvent.keyCode == whichPlayer.controlKeySprintAndKill) {
        whichPlayer.keyHeld_SprintAndKill = setTo;
    }

    if (setTo) { //only detecting when key goes down not held keys
        if (keyEvent.keyCode == KEY_SPACE || keyEvent.keyCode == KEY_ENTER) {//TODO Remove cheat: cheat to avoid waiting for the draw to play, to remove cheat add && drawNow in if condition
            if (serveBet) {
                serveBet = false;
                message = 0;
            }
            else if ((!playerEntry) && ServeHandler.matchStart) ServeHandler.StartAnim();
        }
    }
}

function keyPressed(evt) {
    //console.log("Key pressed: "+evt.keyCode);
    
    if (menuActive) {
        menuInput(evt, true);
        evt.preventDefault();
    }

    else if (ServeHandler.bluePicks) {
        switch (evt.keyCode) {
            case KEY_A:
                ServeHandler.flipPos = 1;
                break;
            case KEY_ARROWLEFT:
                ServeHandler.flipPos = 1;
                break;
            case KEY_D:
                ServeHandler.flipPos = -1;
                break;
            case KEY_ARROWRIGHT:
                ServeHandler.flipPos = -1;
                break;
            case KEY_SPACE:
                ServeHandler.bluePicks = false;
                keySet(evt, PlayerClass, true);
                evt.preventDefault();
                break;
            case KEY_ENTER:
                ServeHandler.bluePicks = false;
                keySet(evt, PlayerClass, true);
                evt.preventDefault();
                break;
        }
    }
    else {
        keySet(evt, PlayerClass, true);
        evt.preventDefault();
    }
    if (evt.keyCode == KEY_M) {
        isMuted = !isMuted;
        Howler.mute(isMuted);
        evt.preventDefault();
    }
    if (evt.keyCode == KEY_P) {
        //isMuted = !isMuted;
        //Howler.mute(isMuted);
        gameIsPaused=!gameIsPaused;
        evt.preventDefault();
        if(cheerOn && gameIsPaused==false && menuActive == false){
            Sound.play("crowd-cheer", false, 0.1);
            console.log("sounding from here input.js")
        } else if (cheerOn && gameIsPaused){
            Sound.pause("crowd-cheer", false, 0.1);
            console.log("sound is paused in input.js")
        }
    }
}

function keyReleased(evt) {
    // console.log("Key pressed: "+evt.keyCode);
    if (menuActive) {

    } else {
        keySet(evt, PlayerClass, false);
        evt.preventDefault();
    }
}
