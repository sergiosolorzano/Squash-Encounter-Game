const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;

const KEY_SPACE = 32;
const KEY_LEFT_SHIFT = 16;

var mouseX = 0;
var mouseY = 0;
var mouseClickPos = {x:0,y:0};

function initInput() {
  canvas.addEventListener('mousemove', updateMousePos);
  document.addEventListener('keydown', keyPressed);
  document.addEventListener('keyup', keyReleased);
  document.addEventListener('click', function(evt){
    var mouseClickPos=updateMousePos(evt);
    PlayerClass.selectBackWall(mouseClickPos.x,mouseClickPos.y);
    PlayerClass.backWallClicked=true;
  });
  PlayerClass.initInput(KEY_W, KEY_D, KEY_S, KEY_A, KEY_SPACE, KEY_LEFT_SHIFT);
}

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
  // cheat / hack to test car in any position
  /*carX = mouseX;
  carY = mouseY;
  carSpeedX = 4;
  carSpeedY = -4;*/
}

function keySet (keyEvent, whichPlayer, setTo){

	// FIXME: for better simulation we may need to track
	// previous player direction and velocity and only
	// play shoe squeaks when you turn 180 degrees
	// at high speed. For now, just random shoe noise!
	if (Math.random() > 0.75) Sound.shoe();

if(keyEvent.keyCode == whichPlayer.controlKeyLeft) {
    whichPlayer.keyHeld_TurnLeft = setTo;
  }
  if(keyEvent.keyCode == whichPlayer.controlKeyRight) {
    whichPlayer.keyHeld_TurnRight = setTo;
  }
  if(keyEvent.keyCode == whichPlayer.controlKeyUp) {
    whichPlayer.keyHeld_Gas = setTo;
  }
  if(keyEvent.keyCode == whichPlayer.controlKeyDown) {
    whichPlayer.keyHeld_Reverse = setTo;
  }
  if(keyEvent.keyCode == whichPlayer.controlKeyShoot) {
    whichPlayer.keyHeld_Shoot = setTo;
  }
  if(keyEvent.keyCode == whichPlayer.controlKeySprint) {
    whichPlayer.keyHeld_Sprint = setTo;
  }
  }

function keyPressed(evt) {
  //console.log("Key pressed: "+evt.keyCode);
  keySet(evt, PlayerClass, true);
  evt.preventDefault();
}

function keyReleased(evt) {
  // console.log("Key pressed: "+evt.keyCode);
  keySet(evt, PlayerClass,false);
}