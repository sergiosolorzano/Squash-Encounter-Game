/*
function drawUI(){
	colorText("stamina: " +  PlayerClass.sprintStamina, canvas.width-200, 50, 'red');
	console.log(PlayerClass.sprintStamina);
}
*/

function drawStaminaBar(){
	//draw bar background
	colorRect(canvas.width-100,0, 100, 20, 'LightGray');
	//draw current stamina
	colorRect(canvas.width-100,0, PlayerClass.sprintStamina, 20, 'red');
}

function rightToServe(){
	const SERVE_W=330;
	const SERVE_H=365;
	var spinFrame = 0;
	var spinStepsPerAnimFrame = 2;
	var spinFrameTimer=2;

    var drawLocation = perspectiveLocation(COURT_W/2,COURT_L*0.2,0);

    var spinAnimationFrames = serve_spin.width/SERVE_W;

    if (spinFrameTimer-- < 0) {
      spinFrameTimer = spinStepsPerAnimFrame;
      spinFrame++;
    }
    console.log(spinFrame)
    if (spinFrame >= spinAnimationFrames) {
          spinFrame = 0;
          serveBet=false;
    }
    drawAtBaseSheetSprite(serve_spin, spinFrame, drawLocation.x, drawLocation.y,SERVE_W,SERVE_H);
  }