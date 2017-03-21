var canvas, canvasContext, scaledContext;

var p1 = new ballClass();
var p2 = new playerOneClass();

// x,y pixel coordinates on the render of the near 'wall' (opening) corners
var nearTopLeftX=3;
var nearTopLeftY=248;
var nearTopRightX=798;
var nearTopRightY=248;
var nearBottomLeftX=198;
var nearBottomLeftY=535;
var nearBottomRightX=612;
var nearBottomRightY=535;
// x,y pixel coordinates on the render of the far wall corners
var farTopLeftX=272;
var farTopLeftY=0;
var farTopRightX=537;
var farTopRightY=0;
var farBottomLeftX=304;
var farBottomLeftY=200;
var farBottomRightX=505;
var farBottomRightY=200;

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
	p1.Init();
	p2.Init();
	}

function updateAll() {
	moveAll();
	//drawAll();
}

function moveAll() {
	p1.moveBall();
  p2.movePlayer();
	}

function clearScreen() {
	colorRect(0,0, canvas.width,canvas.height, 'black');
}

function drawAll() {
	drawBitmapCenteredWithRotation(squashcourt, canvas.width/2, canvas.height/2, 0);
	p1.drawShadow();
  p1.drawInAir();
	p2.drawPlayer();
  p2.drawTargetFrontWall();
	drawUI();
  //colorRect(0,0,64,97,"orange");//real life court
  //colorRect(p1.x,p1.y,3,3,"green");////real life ball
}
