var playerStepsPerAnimFrame = 2;
var playerFrame = 0;
var playerFrameTimer = 2;//how quick it changes between frames
const PLAYER_H=55;
const PLAYER_W=55;
var PLAYER_MOVE_SPEED=2;
const SPRINT_MULTIPLER = 3.0;
const PLAYER_MAX_HEIGHT_REACH=15;

var initYPosition=COURT_L*0.4;

function PlayerClass(){
  this.sprintMultiplier = 1;
  this.sprintStamina = 20;
  this.isExhausted = false;
  this.sprintCooldown = 0;

  this.keyHeld_Gas = false;
  this.keyHeld_Reverse = false;
  this.keyHeld_TurnLeft = false;
  this.keyHeld_TurnRight = false;
  this.keyHeld_Shoot = false;
  this.keyHeld_Sprint = false;

  this.controlKeyUp;
  this.controlKeyRight;
  this.controlKeyDown;
  this.controlKeyLeft;
  this.controlKeyShoot;
  this.controlKeySprint;

  this.initInput = function (upKey, rightKey, downKey, leftKey,shootKey, sprintKey){
  this.controlKeyUp = upKey;
  this.controlKeyRight = rightKey;
  this.controlKeyDown= downKey;
  this.controlKeyLeft = leftKey;
  this.controlKeyShoot = shootKey;
  this.controlKeySprint = sprintKey;
  }

  this.Init = function(){
    this.Reset();
  }

  this.Reset = function(){
    this.x=COURT_W*0.2;
    this.y=initYPosition;
    this.whichPic = p1_standing;
    this.isSwinging=false;//used so player does not run if gif showing it's swinging the racket
    this.targetBackWall=NOBACKWALLSELECTED;
    this.backWallClicked = false;
    this.playerStandingOnCourtQuadrant=LEFTCOURTQUADRANT;
  }

  this.drawPlayer = function(){
    var drawLocation = perspectiveLocation(this.x,this.y,0);

    //this.playerHitWindowCoords();//shows swing quadrants of player
    //this.frontWallHitWindowCoords();//shows quadrants of the front wall
    var playerAnimationFrames = this.whichPic.width/PLAYER_W;
    if (playerFrameTimer-- < 0) {
      playerFrameTimer = playerStepsPerAnimFrame;
      playerFrame++;
    }
    if (playerFrame >= playerAnimationFrames) {
          playerFrame = 0;
          this.whichPic = p1_standing;
          this.isSwinging=false;
      }
    drawAtBaseSheetSprite(this.whichPic, playerFrame, drawLocation.x, drawLocation.y);
  }

    this.hitGraphicSelection=function(){
    var hereCollision = ballAtReach(this.x,this.y,BallClass.x,BallClass.y);
    var quadrantHit = hereCollision.quadrant;

    if(BallClass.bouncedOnFloor && BallClass.bouncedOnFrontWall && quadrantHit!=0){
        switch(quadrantHit){//maybe quadrantHit=0 in which case none called
              case TOPRIGHTQUADRANT:
                this.whichPic = p1_shot_top_right;
                this.isSwinging=true;
				Sound.hit();
                break;
              case TOPLEFTQUADRANT:
                this.whichPic = p1_shot_top_left;
                this.isSwinging=true;
				Sound.hit();
                break;
              case BOTTOMRIGHTQUADRANT:
                this.whichPic = p1_shot_bottom_right;
                this.isSwinging=true;
				Sound.hit();
                break;
              case BOTTOMLEFTQUADRANT:
                this.whichPic = p1_shot_bottom_left;
                this.isSwinging=true;
				Sound.hit();
                break;
        }
      }
    }
   
  this.movePlayer = function(){
    var nextX = this.x;
    var nextY = this.y;

    var isPlayerMoving = (this.keyHeld_Gas || this.keyHeld_Reverse || this.keyHeld_TurnLeft || this.keyHeld_TurnRight);

    this.hitGraphicSelection();
    if(this.isSwinging==false){

      if(this.sprintCooldown > 0){
        this.sprintCooldown--;
        console.log(this.sprintCooldown);
      }

      if(this.keyHeld_Sprint && isPlayerMoving){
        if(this.sprintStamina > 0 && this.sprintCooldown == 0){
          this.sprintMultiplier = SPRINT_MULTIPLER;
          this.sprintStamina--;
        }
        else if (this.sprintStamina == 0){
          this.sprintMultiplier = 1;
          this.isExhausted = true;
          this.sprintCooldown = 50;
        }
      } else {
        this.sprintMultiplier = 1;
        if(this.sprintStamina < 100){
          this.sprintStamina++
        }
      }
        //TODO might need to reset this.sprintMultiplier

    if(this.isSwinging==false){
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
      }
    }
  }
    //check so player doesn't go outside the court
    if(nextX>=0 && nextX<=COURT_W-2)  {//COURT_W reduced by two so the racket doesn't paint black on canvas outside the court
      this.x=nextX;
    }
    if(nextY>=0 && nextY<=COURT_L-8.2)  {//COURT_H reduced by two so the racket doesn't paint black on canvas outside the court
      this.y=nextY;
    }
  }
}


 