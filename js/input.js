const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;

const KEY_SPACE = 32;
var mouseX = 0;
var mouseY = 0;

function initInput() {
  canvas.addEventListener('mousemove', updateMousePos);
  document.addEventListener('keydown', keyPressed);
  document.addEventListener('keyup', keyReleased);
  p2.initInput(KEY_W, KEY_D, KEY_S, KEY_A, KEY_SPACE);
}

function updateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  mouseX = evt.clientX - rect.left - root.scrollLeft;
  mouseY = evt.clientY - rect.top - root.scrollTop;

  // cheat / hack to test car in any position
  /*carX = mouseX;
  carY = mouseY;
  carSpeedX = 4;
  carSpeedY = -4;*/
}

function keySet (keyEvent, whichPlayer, setTo){
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
  }

function keyPressed(evt) {
  //console.log("Key pressed: "+evt.keyCode);
  keySet(evt, p2, true);
  evt.preventDefault();
}

function keyReleased(evt) {
  // console.log("Key pressed: "+evt.keyCode);
  keySet(evt, p2,false);
}