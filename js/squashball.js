const ballStepsPerAnimFrame = 0;
var ballFrame = 0;
var ballFrameTimer=ballStepsPerAnimFrame;
const BALL_H=6;
const BALL_W=6;

const COURT_W=64.0;
const COURT_L=97.0;
const COURT_T=56.0;

var ballHeightNormal = 6;
var heightChangePace = 0.04;
var ballSinkRate = 0.03;
var lenghtCourt=440;
var prevQuadrantWasAHit = false;

function ballClass(){
  
  this.Init = function(){
    this.Reset(); 
  }

  this.Reset = function(){
    this.x=COURT_W/2;
    this.y=COURT_L/2;
    this.z=0;
    this.zv=1;//1.5
    this.heightOscillate=0.0;
    this.speedX = 1;
    this.speedY = 2;
    this.bouncedOnFrontWall=true;
    this.bouncedOnFloor=true;
    this.canBeHit=true;
  }
    
  this.drawInAir = function () {
    var draw=perspectiveLocation(this.x,this.y,this.z)
    var whichPic = ballPic;
    var ballAnimationFrames = whichPic.width/BALL_W;
    
     if (ballFrameTimer-- < 0) {
            ballFrameTimer = ballStepsPerAnimFrame;
            ballFrame++;
            if (ballFrame >= ballAnimationFrames) {
                ballFrame = 0;
            }
        }
    drawBallAtBaseSheetSprite(whichPic, ballFrame, draw.x, draw.y - draw.z);
    }

  this.drawShadow = function() {
      var draw = perspectiveLocation(this.x,this.y,0);
      drawBallAtBaseSheetSprite(ballShadow, 0, draw.x, draw.y);
      }

  this.moveBall = function(){
    //determine if ball is coming from a swingable quadrant. If yes, it would have been swang already and therefore no swing occurs here.
    var prevX=this.x-this.speedX;
    var prevY=this.y-this.speedY;
    var hereCollision = p2.ballAtReach(p2.x,p2.y,this.x,this.y);
    var prevCollision = p2.ballAtReach(p2.x,p2.y,prevX,prevY);
    var quadrantHit=hereCollision.quadrant;
    var prevQuadrantHit=prevCollision.quadrant;
    //console.log(quadrantHit,prevQuadrantHit)
    
    console.log(this.z)
    if(this.bouncedOnFloor && this.bouncedOnFrontWall && quadrantHit!=0){          
      this.bouncedOnFloor=false;
      this.bouncedOnFrontWall=false;
      //prevQuadrantWasAHit=true;
      switch(quadrantHit){
            //todo: determine if the speedXY change leads to a different quadrant and if it does, ignore the shot there.
            case TOPRIGHTQUADRANT:
              this.speedY*=-1;
              this.zv=1;
              break;
            case TOPLEFTQUADRANT:
              this.speedY*=-1;
              this.zv=1;
              break;
            case BOTTOMRIGHTQUADRANT:
              this.speedY*=-1;
              this.zv=1;
              break;
            case BOTTOMLEFTQUADRANT:
              this.speedY*=-1;
              this.zv=1;
              break;
            default: //shouldn't be reached
            console.log("error, invalid quadrant squashball.js")
              break;  
        }
        
        //console.log("this.x",this.x,"prevX", prevX,"this.y",this.y,"prevY",prevY)
        //console.log("quadrantHit", quadrantHit, "prevQuadrantHit", prevQuadrantHit,prevQuadrantWasAHit)  
    }

    //wall bouncing mechanics:
    this.zv += -ballSinkRate;
    this.z += this.zv;
    
    if(this.z>COURT_T){//hit ceiling
      this.z=COURT_T;
      this.zv*=-1;
    }
    if(this.z < 0) {
      this.zv*=-0.7;
      this.z = 0;
    }
    
    this.nextX=this.x+this.speedX;
    this.nextY=this.y+this.speedY;

    if(this.nextX<0)  {
      this.speedX*=-1;
    }
    if(this.nextX>COURT_W){
      this.speedX*=-1;
      this.bouncedOnFloor=true;
    }

    if(this.nextY<0)  {
      this.speedY*=-1;
      this.bouncedOnFrontWall=true;
    }
    if(this.nextY>COURT_L){
      this.speedY*=-1;
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }
}//end ballClass