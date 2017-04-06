var computerStepsPerAnimFrame=2;
var computerFrameTimer=2;
var computerFrame=0;

var initComputerStepsPerAnimFrame = 5;//for players entry only
var initComputerFrameTimer = 5;//how quick it changes between frames; for players entry only
var COMPUTER_MOVE_SPEED=2;


function ComputerClass(){
  
  this.Init = function(){
    this.Reset();
    //this.initDrawPlayer();
  }

  this.Reset = function(){
    this.prevX=0;
    this.prevY=0;
    this.x=COURT_W*0.8;
    this.y=initYPosition;
    this.isSwinging=false;//used so player does not run if gif showing it's swinging the racket
    this.swingTurn=false;
    this.speedX=COMPUTER_MOVE_SPEED;
    this.speedY=COMPUTER_MOVE_SPEED;
  }

  this.initDrawPlayer = function(){
    this.whichPic = p2_start;
    var drawLocation = perspectiveLocation(this.x,this.y,0);
    var computerAnimationFrames = this.whichPic.width/PLAYER_W;
    //console.log(computerFrameTimer)

    if (initComputerFrameTimer-- < 0) {
      initComputerFrameTimer = initComputerStepsPerAnimFrame;
      computerFrame++;
    }
    if (computerFrame >= computerAnimationFrames) {
          computerFrame = 0;
          playerEntryRunning=false;
          this.whichPic = p2_standing;
          this.isSwinging=false;
      }
    drawAtBaseSheetSprite(this.whichPic, computerFrame, drawLocation.x, drawLocation.y,PLAYER_W,PLAYER_H);
  }

  this.drawPlayer = function(){
    var drawLocation = perspectiveLocation(this.x,this.y,0);
    var computerAnimationFrames = this.whichPic.width/PLAYER_W;
    
    if (computerFrameTimer-- < 0) {
      computerFrameTimer = computerStepsPerAnimFrame;
      computerFrame++;
    }
    if (computerFrame >= computerAnimationFrames) {
          computerFrame = 0;
          //computerHit=false;
          this.whichPic = p2_standing;
          this.isSwinging=false;
          computerFrameTimer =2
          computerStepsPerAnimFrame=2
      }
    drawAtBaseSheetSprite(this.whichPic, computerFrame, drawLocation.x, drawLocation.y,PLAYER_W,PLAYER_H);
    //draw debug ball
    if(debugBall)
      colorCircle(debugBall.x, debugBall.y, 3, "white")
    
    if(debugTarget)
      colorCircle(debugTarget.x, debugTarget.y, 3, "green")
  }
  var debugBall;
  var debugTarget;
  this.movePlayer = function(){  
    this.hitGraphicSelection();
    var nextX=this.x;
    var nextY=this.y;
    var computerSpeed;
    var distPlayerToTX;
    var distPlayerToTY;
    
    //run to T
    if(this.swingTurn==false){
      distPlayerToTX=T_ONCOURT_W-this.x;
      distPlayerToTY=T_ONCOURT_L-this.y;
      atanResult=Math.atan2(distPlayerToTY,distPlayerToTX);//radians

      computerSpeed = magnitude(this.speedX,this.speedY);
      this.speedX=Math.cos(atanResult)*computerSpeed;
      this.speedY=Math.sin(atanResult)*computerSpeed;
    } else if(BallClass.speedY > 0){
      //i need to take trig </3
      var m = (BallClass.y - (BallClass.y +BallClass.speedY)) / (BallClass.x - (BallClass.x +BallClass.speedX)); //slope
      //var b = BallClass.y - (-1 * m) * BallClass.x //y intercept
      var b = ((BallClass.x +BallClass.speedX)*BallClass.y-BallClass.x*(BallClass.y +BallClass.speedY))/((BallClass.x +BallClass.speedX)-BallClass.x)
      //var y = m(this.x) + b
      var x = (this.y/m) - (b/m) //solve for x
      var direction = this.x - x
      if(this.x - x > 0){
        direction = -COMPUTER_MOVE_SPEED
      } else {
        direction = COMPUTER_MOVE_SPEED
      }

      this.speedX = direction
      if(this.y - BallClass.y < 0){
        this.speedY=0;
        this.speedX=0
      }
      debugBall = perspectiveLocation(BallClass.x +BallClass.speedX, BallClass.y +BallClass.speedY, BallClass.z)
      debugTarget = perspectiveLocation(x, this.y, 10)
      
    } else {
      this.speedX = 0
      this.speedY = 0
    }
      nextX+= this.speedX;
      nextY+= this.speedY;
    //console.log(this.x,T_ONCOURT_W,this.y,T_ONCOURT_L)    
    //console.log(distPlayerToTX,distPlayerToTY)
    this.x=nextX;
    this.y=nextY;
  }

  this.ballAngAtBounce = function(){
    //calculate angle of ball trajectory as it bounces off the wall
    
    ballPrevX=BallClass.x-BallClass.speedX;
    ballPrevY=BallClass.y-BallClass.speedY;

    distBallPrevXThisX=BallClass.x-ballPrevX;
    distBallPrevYThisY=BallClass.y-ballPrevY;

    //normalize vectors
    var length = magnitude(this.speedX,this.speedY);
    distBallPrevXThisX/=length;
    distBallPrevYThisY/=length;

    atanResult=Math.atan2(distBallPrevYThisY,distBallPrevXThisX);//radians    
    degrees=atanResult*180/Math.PI;
    console.log("radians: ",atanResult,"degrees: ",degrees);

    adjacent=ComputerClass.y-BallClass.y;
    opposite=atanResult*adjacent;
    console.log("x to go to is : ",opposite)
  }

  this.hitGraphicSelection=function(){
    var hereCollision = ballAtReach(this.x,this.y,BallClass.x,BallClass.y);
    var quadrantHit = hereCollision.quadrant;
    var player1IsAtReach=playerAtReach(this.x,this.y,PlayerClass.x,PlayerClass.y);
    var player1IsAtReachNow=player1IsAtReach.oppAtReach;
    
    //check ball only bounced once or none on floor before swing
    if(BallClass.bouncedOnFloor==1 || BallClass.bouncedOnFloor==0){
      ballBouncedOnFloor = true;
    }  else {
      ballBouncedOnFloor=false;
    }

    if(ballBouncedOnFloor && BallClass.bouncedOnFrontWall && quadrantHit!=0 && this.swingTurn){
        switch(quadrantHit){
              case TOPRIGHTQUADRANT:
                this.isSwinging=true;
                Sound.hit();
                if(player1IsAtReachNow){
                    if(this.x>PlayerClass.x){
                      PlayerClass.whichPic = p2_left_hit;
                      } else {
                        PlayerClass.whichPic = p2_right_hit;
                        }
                  playerFrameTimer=10
                  playerStepsPerAnimFrame=10
                }
                this.whichPic = p2_shot_top_right;
                break;
              case TOPLEFTQUADRANT:
                this.isSwinging=true;
                Sound.hit();
                if(player1IsAtReachNow){
                  if(this.x>PlayerClass.x){
                      PlayerClass.whichPic = p1_left_hit;
                      } else {
                        PlayerClass.whichPic = p1_right_hit;
                        }
                  playerHit=true;
                  playerFrameTimer=10
                  playerStepsPerAnimFrame=10
                }
                this.whichPic = p2_shot_top_left;
                break;
              case BOTTOMRIGHTQUADRANT:
                this.isSwinging=true;
                Sound.hit();
                if(player1IsAtReachNow){
                  if(this.x>PlayerClass.x){
                      PlayerClass.whichPic = p1_left_hit;
                      } else {
                        PlayerClass.whichPic = p1_right_hit;
                        }
                  playerHit=true;
                  playerFrameTimer=10
                  playerStepsPerAnimFrame=10
                }
                this.whichPic = p2_shot_bottom_right;
                break;
              case BOTTOMLEFTQUADRANT:
                this.isSwinging=true;
                Sound.hit();
                if(player1IsAtReachNow){
                 if(this.x>PlayerClass.x){
                      PlayerClass.whichPic = p1_left_hit;
                      } else {
                        PlayerClass.whichPic = p1_right_hit;
                        }
                  playerHit=true;
                  playerFrameTimer=10
                  playerStepsPerAnimFrame=10
                }
                this.whichPic = p2_shot_bottom_left;
                break;
        }
      }
      /*if(this.isSwinging==false){
      if(this.keyHeld_Gas){
                  nextY -= PLAYER_MOVE_SPEED * this.sprintMultiplier;
                  this.whichPic = p1_running;
      }
      if(this.keyHeld_Reverse){
                  nextY += PLAYER_MOVE_SPEED * this.sprintMultiplier;
                  this.whichPic = p1_running;
      }
      if(this.keyHeld_TurnLeft){
                  nextX -= PLAYER_MOVE_SPEED * this.sprintMultiplier;
                  this.whichPic = p1_running;
      }
      if(this.keyHeld_TurnRight){
                  nextX+= PLAYER_MOVE_SPEED * this.sprintMultiplier;
                  this.whichPic = p1_running;
      }*/
    }
}

