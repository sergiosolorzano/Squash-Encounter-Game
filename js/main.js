var canvas, canvasContext, scaledContext;

var serveBet=false;
var BallClass = new BallClass();
var PlayerClass = new PlayerClass();
var ComputerClass = new ComputerClass();

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	colorRect(0,0,canvas.width, canvas.height,'black');

	scaledCanvas = document.getElementById('gameCanvas');
	scaledContext = scaledCanvas.getContext('2d');
  scaledContext.fillStyle = "black";
	loadImages();
}
	//perspective location for player and ball
  function perspectiveLocation(pixelX,pixelY,pixelZ){
    var visualLocation = {x:0,y:0,z:0};
    var percTowardNear = pixelY/COURT_L;
    var hereFloorY = (1.0-percTowardNear) * farBottomLeftY + percTowardNear * nearBottomLeftY;

    var percTowardRight = pixelX/COURT_W;
    var hereBottomLeftX = (1.0-percTowardNear) * farBottomLeftX + percTowardNear * nearBottomLeftX;
    var hereBottomRightX = (1.0-percTowardNear) * farBottomRightX + percTowardNear * nearBottomRightX;
    var hereFloorX=(1.0-percTowardRight) * hereBottomLeftX + percTowardRight * hereBottomRightX;
    visualLocation.x=hereFloorX;
    visualLocation.y=hereFloorY;

    var wallHeightNear=nearBottomLeftY-nearTopLeftY;
    var wallHeightFar =farBottomLeftY-farTopLeftY;
    var wallHeightHere = (1.0-percTowardNear) * wallHeightFar + percTowardNear * wallHeightNear;
    var courtHeightHere = (pixelZ/COURT_T)*wallHeightHere;
    visualLocation.z=courtHeightHere;

    return visualLocation;
  }

function imageLoadingDoneSoStartGame() {
  var framesPerSecond = 30;
  setInterval(function() {
      moveAll();
      drawAll();
    }, 1000/framesPerSecond);
  loadLevel();
  initInput();
}

function loadLevel() {
  BallClass.Init();
	PlayerClass.Init();
  ComputerClass.Init();
	}

function moveAll() {
  if(serveBet){
  return;  
  } else {
    BallClass.moveBall();
    PlayerClass.movePlayer();
    ComputerClass.movePlayer();
    }
	}

function clearScreen() {
	colorRect(0,0, canvas.width,canvas.height, 'black');
}

function drawAll() {
    drawBitmapCenteredWithRotation(squashcourt, canvas.width/2, canvas.height/2, 0);
    if(serveBet){
    rightToServe();  
    } else {
    	BallClass.drawShadow();
      BallClass.drawInAir();
    	PlayerClass.drawPlayer();
      ComputerClass.drawPlayer();
      //PlayerClass.drawTargetFrontWall();
      //PlayerClass.selectBackWall();//shows backwal coords on screen
    	drawStaminaBar();
    	//drawUI();
      drawScoreCounter();
      //colorText(Math.floor(mouseX)+","+Math.floor(mouseY), mouseX,mouseY,'blue');
      //colorRect(0,0,64,97,"orange");//real life court
      //colorRect(BallClass.x,BallClass.y,3,3,"green");////real life ball
    }
}