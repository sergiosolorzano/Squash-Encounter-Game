var computerStepsPerAnimFrame=2;
var computerFrameTimer=2;
var computerFrame=0;

function ComputerClass(){
  
  this.Init = function(){
    this.Reset();
    this.whichPic = p2_start;
    this.initDrawPlayer();
  }

  this.Reset = function(){
    this.x=COURT_W*0.8;
    this.y=initYPosition;
    this.isSwinging=false;//used so player does not run if gif showing it's swinging the racket
    this.whichPic = p2_standing;
  }

  this.initDrawPlayer = function(){
    var drawLocation = perspectiveLocation(this.x,this.y,0);
    var computerAnimationFrames = this.whichPic.width/PLAYER_W;
    if (computerFrameTimer-- < 0) {
      computerFrameTimer = computerStepsPerAnimFrame;
      computerFrame++;
    }
    if (computerFrame >= computerAnimationFrames) {
          computerFrame = 0;
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
          this.whichPic = p2_standing;
          this.isSwinging=false;
      }
    drawAtBaseSheetSprite(this.whichPic, computerFrame, drawLocation.x, drawLocation.y,PLAYER_W,PLAYER_H);
  }

  this.movePlayer = function(){  
    this.hitGraphicSelection();
    //if computerHit=false can move
  }

  this.hitGraphicSelection=function(){
    var hereCollision = ballAtReach(this.x,this.y,BallClass.x,BallClass.y);
    var quadrantHit = hereCollision.quadrant;
    var playerIsAtReach=playerAtReach(this.x,this.y,PlayerClass.x,PlayerClass.y);

    if(BallClass.bouncedOnFloor && BallClass.bouncedOnFrontWall && quadrantHit!=0){
        switch(quadrantHit){
              case TOPRIGHTQUADRANT:
                this.isSwinging=true;
                Sound.hit();
                //if(playerIsAtReach){
                //  PlayerClass.whichPic = p1_right_hit;
                //}
                this.whichPic = p2_shot_top_right;
                break;
              case TOPLEFTQUADRANT:
                this.isSwinging=true;
                Sound.hit();
                //if(playerIsAtReach){
                //  PlayerClass.whichPic = p1_left_hit;
                //}
                this.whichPic = p2_shot_top_left;
                break;
              case BOTTOMRIGHTQUADRANT:
                this.isSwinging=true;
                Sound.hit();
                //if(playerIsAtReach){
                //  PlayerClass.whichPic = p1_right_hit;
                //}
                this.whichPic = p2_shot_bottom_right;
                break;
              case BOTTOMLEFTQUADRANT:
                this.isSwinging=true;
                Sound.hit();
                //if(playerIsAtReach){
                // PlayerClass.whichPic = p1_left_hit;
                //}
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