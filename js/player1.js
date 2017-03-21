var playerStepsPerAnimFrame = 2;
var playerFrame = 0;
var playerFrameTimer = 2;//how quick it changes between frames
const PLAYER_H=55;
const PLAYER_W=55;
var PLAYER_MOVE_SPEED=2;
const SPRINT_MULTIPLER = 3.0;
const PLAYER_MAX_HEIGHT_REACH=15;

const SHIFTTOCENTERX = -3;
const SHIFTTOCENTERY = 3;
const HITSQUAREW=8;
const HITSQUAREH=8;
const SHIFTTORAQUETPOSITIONX=6;
const SHIFTTORAQUETPOSITIONY=-5;

const NOQUADRANTHIT = 0;
const TOPRIGHTQUADRANT=1;
const BOTTOMRIGHTQUADRANT=2;
const BOTTOMLEFTQUADRANT=3;
const TOPLEFTQUADRANT=4;

const NOFRONTWALLSELECTED=0;
const TOPRIGHTFRONTWALL=1;
const BOTTOMRIGHTFRONTWALL=2;
const BOTTOMLEFTFRONTWALL=3;
const TOPLEFTFRONTWALL=4;

const WINDOWXSCALE=0.02;//For Hit Window range: every real life 20% move across the Y axis, the X hit span visually decreases by 4%

var initYPosition=0;
var whichPic;

function PlayerClass(){

  this.sprintMultiplier = 1;
  this.sprintStamina = 50;

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
    initYPosition=COURT_L*0.4
    this.y=initYPosition;
    whichPic = p1_standing;
    this.isSwinging=false;
  }

  this.drawPlayer = function(){
    var drawLocation = perspectiveLocation(this.x,this.y,0);
    //game crashes with this
    //if(this.keyHeld_Gas==false || this.keyHeld_Reverse==false ||  this.keyHeld_TurnLeft== false || this.keyHeld_TurnRight== false || this.keyHeld_Shoot==false){
     // whichPic=BallClass_standing
    //}

    this.playerHitWindowCoords();
    this.frontWallHitWindowCoords();
    var playerAnimationFrames = whichPic.width/PLAYER_W;
    if (playerFrameTimer-- < 0) {
      playerFrameTimer = playerStepsPerAnimFrame;
      playerFrame++;
    }
    if (playerFrame >= playerAnimationFrames) {
          playerFrame = 0;
          whichPic = p1_standing;
          this.isSwinging=false;
      }
    drawAtBaseSheetSprite(whichPic, playerFrame, drawLocation.x, drawLocation.y);
  }

    this.drawTargetFrontWall = function(){
      var frontWallTargeted = this.targetFrontWall(BallClass.x,PlayerClass.y);
      var rectRealLifeAnchorX=frontWallTargeted[1];
      var rectRealLifeAnchorY=frontWallTargeted[2];
      var rectRealLifeWidthPoint=frontWallTargeted[3];
      var rectRealLifeHeightPoint=frontWallTargeted[4];

      var rectDrawnAnchor = perspectiveLocation(rectRealLifeAnchorX,rectRealLifeAnchorY,0);
      var rectDrawnWidthPoint = perspectiveLocation(rectRealLifeWidthPoint,rectRealLifeAnchorY,0);
      var rectDrawnHeightPoint = perspectiveLocation(rectRealLifeAnchorX,rectRealLifeHeightPoint,0);

      var targetWallDrawnWidth = rectDrawnWidthPoint.x-rectDrawnAnchor.x;
      var targetWalltDrawnHeight = rectDrawnAnchor.y-rectDrawnHeightPoint.y;
      //console.log(rectDrawnAnchor.x,rectDrawnAnchor.y)
      colorRect(rectDrawnAnchor.x,rectDrawnAnchor.y,targetWallDrawnWidth,targetWalltDrawnHeight,"blue");
    }

    this.hitGraphicSelection=function(){
    var hereCollision = this.ballAtReach(this.x,this.y,BallClass.x,BallClass.y);
    var quadrantHit = hereCollision.quadrant;

      if(BallClass.bouncedOnFloor && BallClass.bouncedOnFrontWall && quadrantHit!=0){
        switch(quadrantHit){//maybe quadrantHit=0 in which case none called
              case TOPRIGHTQUADRANT:
                whichPic = p1_shot_top_right;
                this.isSwinging=true;
                break;
              case TOPLEFTQUADRANT:
                whichPic = p1_shot_top_left;
                this.isSwinging=true;
                break;
              case BOTTOMRIGHTQUADRANT:
                whichPic = p1_shot_bottom_right;
                this.isSwinging=true;
                break;
              case BOTTOMLEFTQUADRANT:
                whichPic = p1_shot_bottom_left;
                this.isSwinging=true;
                break;
        }
      }
    }
   this.ballAtReach = function(playerPixelX, playerPixelY, ballPixelX,ballPixelY){
      //segments of png to determine ball collision
      if(BallClass.z>PLAYER_MAX_HEIGHT_REACH){
        //console.log(BallClass.z)
        return {
          quadrant:0,
          distToBallX:0,
          distToBallY:0
        }
      }
      var quadrantHit;
      var centerX=playerPixelX+SHIFTTOCENTERX;
      var centerY=playerPixelY+SHIFTTOCENTERY;
      var scaleAdjustmentX = (1-playerPixelY/initYPosition)*100*WINDOWXSCALE;

      centerTopX=centerX;
      centerTopY=centerY-HITSQUAREH;

      centerBottomX=centerX;
      centerBottomY=centerY+HITSQUAREH;

      rightCenterX=centerX+HITSQUAREW+scaleAdjustmentX;
      rightCenterY=centerY;

      rightTopX=centerX+HITSQUAREW+scaleAdjustmentX;
      rightTopY=centerY-HITSQUAREH;

      rightBottomX=centerX+HITSQUAREW+scaleAdjustmentX;
      rightBottomY=centerY+HITSQUAREH;

      leftCenterX=centerX-HITSQUAREW-scaleAdjustmentX;
      leftCenterY=centerY;

      leftTopX=centerX-HITSQUAREW-scaleAdjustmentX;
      leftTopY=centerY-HITSQUAREH;

      leftBottomX=centerX-HITSQUAREW-scaleAdjustmentX;
      leftBottomY=centerY+HITSQUAREH;

      raquetPositionX=centerX+SHIFTTORAQUETPOSITIONX+scaleAdjustmentX;
      raquetPositionY=centerY+SHIFTTORAQUETPOSITIONY;

      if(ballPixelX>=centerX && ballPixelX<=rightCenterX && ballPixelY<=centerY && ballPixelY>=centerTopY){
        quadrantHit=TOPRIGHTQUADRANT;
      }

      if(ballPixelX<centerX && ballPixelX>=leftCenterX && ballPixelY<centerY && ballPixelY>=leftTopY){
        quadrantHit=TOPLEFTQUADRANT;
      }

      if(ballPixelX>centerX && ballPixelX<=rightBottomX && ballPixelY>centerY && ballPixelY<=rightBottomY){
        quadrantHit=BOTTOMRIGHTQUADRANT;
      }

      if(ballPixelX<centerX && ballPixelX >= leftBottomX && ballPixelY>centerY & ballPixelY<= leftBottomY){
        quadrantHit=BOTTOMLEFTQUADRANT;
      }
      if(quadrantHit!=TOPRIGHTQUADRANT && quadrantHit !=TOPLEFTQUADRANT && quadrantHit!=BOTTOMRIGHTQUADRANT && quadrantHit!= BOTTOMLEFTQUADRANT){
        quadrantHit=NOQUADRANTHIT;
      }

      //distance from raquet to ballX,Y
      var distanceRaquetToBallX=BallClass.x-raquetPositionX;
      var distanceRaquetToBallY=BallClass.y-raquetPositionY;

      if(quadrantHit==TOPRIGHTQUADRANT){
      }

      //return [quadrantHit, distanceRaquetToBallX,distanceRaquetToBallY];
      return {
        quadrant:quadrantHit,
        distToBallX:distanceRaquetToBallX,
        distToBallY:distanceRaquetToBallY
      }
    }

  this.movePlayer = function(){
    var nextX = this.x;
    var nextY = this.y;

    this.hitGraphicSelection();
    if(this.isSwinging==false){
      if(this.keyHeld_Sprint){
        this.sprintMultiplier = SPRINT_MULTIPLER;
        this.sprintStamina--;
      } else {
        this.sprintMultiplier = 1;
      }
        //TODO might need to reset this.sprintMultiplier

      if(this.keyHeld_Gas){
                  nextY -= PLAYER_MOVE_SPEED * this.sprintMultiplier;
                  whichPic = p1_running;
      }
      if(this.keyHeld_Reverse){
                  nextY += PLAYER_MOVE_SPEED * this.sprintMultiplier;
                  whichPic = p1_running;
      }
      if(this.keyHeld_TurnLeft){
                  nextX -= PLAYER_MOVE_SPEED * this.sprintMultiplier;
                  whichPic = p1_running;
      }
      if(this.keyHeld_TurnRight){
                  nextX+= PLAYER_MOVE_SPEED * this.sprintMultiplier;
                  whichPic = p1_running;
      }
    }

    //determine if ball is coming from a swingable quadrant. If yes, it would have been swang already and therefore no swing occurs here.
    var prevX=BallClass.x-BallClass.speedX;
    var prevY=BallClass.y-BallClass.speedY;
    var hereCollision = this.ballAtReach(this.x,this.y,BallClass.x,BallClass.y);
    var prevCollision = this.ballAtReach(this.x,this.y,prevX,prevY);
    var quadrantHit=hereCollision.quadrant;
    var prevQuadrantHit=prevCollision.quadrant;

    //Shift the racket pic position to the ball if collision occurs
    var raquetMeetShadowX=hereCollision.distToBallX;
    var raquetMeetShadowY=hereCollision.distToBallY;
    //console.log(quadrantHit,prevQuadrantHit)

    //did the ball leave a playable quadrant? If so it's fair play
    if(prevQuadrantHit == NOQUADRANTHIT){
          prevQuadrantWasAHit=false;
        }


    //check so player doesn't go outside the court
    if(nextX>=0 && nextX<=COURT_W-2)  {//COURT_W reduced by two so the racket doesn't paint black on canvas outside the court
      this.x=nextX;
    }

    if(nextY>=0 && nextY<=COURT_L-8.2)  {//COURT_H reduced by two so the racket doesn't paint black on canvas outside the court
      this.y=nextY;
    }
  }

//on mouse target front wall
this.targetFrontWall = function(ballPixelX,ballPixelY){
      var targetFrontWall;
      const HITSQUARETOPW=71;
      const HITSQUAREBOTTOMW=34;
      const HITSQUARECENTERW=39;
      const HITSQUARETOPZ=28;
      const HITSQUAREBOTTOMZ=8;
      const centerZ=14;

      var centerX=COURT_W/2;
      var centerY=0-centerZ;

      centerTopX=centerX;
      centerTopY=centerY-HITSQUARETOPZ;

      centerBottomX=centerX;
      centerBottomY=centerY+HITSQUAREBOTTOMZ;

      rightCenterX=centerX+HITSQUARECENTERW;
      rightCenterY=centerY;

      rightTopX=centerX+HITSQUARETOPW;
      rightTopY=centerY-HITSQUARETOPZ;

      rightBottomX=centerX+HITSQUAREBOTTOMW;
      rightBottomY=centerY+HITSQUAREBOTTOMZ;

      leftCenterX=centerX-HITSQUARECENTERW;
      leftCenterY=centerY;

      leftTopX=centerX-HITSQUARETOPW;
      leftTopY=centerY-HITSQUARETOPZ;

      leftBottomX=centerX-HITSQUAREBOTTOMW;
      leftBottomY=centerY+HITSQUAREBOTTOMZ;

      var centerDrawn = perspectiveLocation(centerX,centerY,0);
      var centerTopDrawn = perspectiveLocation(centerTopX,centerTopY,0);
      var centerBottomDrawn = perspectiveLocation(centerBottomX,centerBottomY,0);
      var rightCenterDrawn = perspectiveLocation(rightCenterX,rightCenterY,0);
      var rightTopDrawn =perspectiveLocation(rightTopX,rightTopY,0);
      var rightBottomDrawn = perspectiveLocation(rightBottomX,rightBottomY,0);
      var leftCenterDrawn = perspectiveLocation(leftCenterX,leftCenterY,0);
      var leftTopDrawn = perspectiveLocation(leftTopX,leftTopY,0);
      var leftBottomDrawn=perspectiveLocation(leftBottomX,leftBottomY,0);

      //determine target wall
      if(mouseX>=centerDrawn.x && mouseX<=rightCenterDrawn.x && mouseY<=centerDrawn.y && mouseY>=centerTopDrawn.y){
        targetFrontWall=TOPRIGHTFRONTWALL;
        return [targetFrontWall, centerDrawn.x, centerDrawn.y, rightCenterDrawn.x, centerTopDrawn.y];
      }

      if(mouseX<centerDrawn.x && mouseX>=leftCenterDrawn.x && mouseY<centerDrawn.y && mouseY>=leftTopDrawn.y){
        targetFrontWall=TOPLEFTFRONTWALL;
        return [targetFrontWall,centerDrawn.x, centerDrawn.y, leftCenterDrawn.x,leftTopDrawn.y];
      }

      if(mouseX>centerDrawn.x && mouseX<=rightBottomDrawn.x && mouseY>centerDrawn.y && mouseY<=rightBottomDrawn.y){
        targetFrontWall=BOTTOMRIGHTFRONTWALL;
        return [targetFrontWall,centerDrawn.x,centerDrawn.y,rightBottomDrawn.x,rightBottomDrawn.y];
      }

      if(mouseX<centerDrawn.x && mouseX >= leftBottomDrawn.x && mouseY>centerDrawn.y & mouseY<= leftBottomDrawn.y){
        targetFrontWall=BOTTOMLEFTFRONTWALL;
        return  [targetFrontWall,centerDrawn.x,centerDrawn.y,leftBottomDrawn.x,leftBottomDrawn.y]
      }
      if(targetFrontWall!=TOPRIGHTQUADRANT && targetFrontWall !=TOPLEFTQUADRANT && targetFrontWall!=BOTTOMRIGHTQUADRANT && targetFrontWall!= BOTTOMLEFTQUADRANT){
        targetFrontWall=NOFRONTWALLSELECTED;
        return targetFrontWall;
      }
  }//end of function to target the front wall





//Drawing calculations
  //determine window range for racket hit: Draw only
  this.playerHitWindowCoords = function(){
      var centerX=this.x+SHIFTTOCENTERX;
      var centerY=this.y+SHIFTTOCENTERY;
      var scaleAdjustmentX = (1-this.y/initYPosition)*100*WINDOWXSCALE;

      centerTopX=centerX;
      centerTopY=centerY-HITSQUAREH;

      centerBottomX=centerX;
      centerBottomY=centerY+HITSQUAREH;

      rightCenterX=centerX+HITSQUAREW+scaleAdjustmentX;
      rightCenterY=centerY;

      rightTopX=centerX+HITSQUAREW+scaleAdjustmentX;
      rightTopY=centerY-HITSQUAREH;

      rightBottomX=centerX+HITSQUAREW+scaleAdjustmentX;
      rightBottomY=centerY+HITSQUAREH;

      leftCenterX=centerX-HITSQUAREW-scaleAdjustmentX;
      leftCenterY=centerY;

      leftTopX=centerX-HITSQUAREW-scaleAdjustmentX;
      leftTopY=centerY-HITSQUAREH;

      leftBottomX=centerX-HITSQUAREW-scaleAdjustmentX;
      leftBottomY=centerY+HITSQUAREH;

      raquetPositionX=centerX+SHIFTTORAQUETPOSITIONX+scaleAdjustmentX;
      raquetPositionY=centerY+SHIFTTORAQUETPOSITIONY;

      var drawThisLocation = perspectiveLocation(centerX,centerY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var visualCenterX = drawThisLocation.x
      var visualCenterY = drawThisLocation.y

      var drawThisLocation = perspectiveLocation(centerTopX,centerTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var visualCenterTopY = drawThisLocation.y

      var drawThisLocation = perspectiveLocation(rightTopX,rightTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var visualRightTopX = drawThisLocation.x

      var drawThisLocation = perspectiveLocation(rightCenterX,rightCenterY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var visualRightCenterX = drawThisLocation.x

      var drawThisLocation = perspectiveLocation(rightBottomX,rightBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var drawThisLocation = perspectiveLocation(centerBottomX,centerBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var drawThisLocation = perspectiveLocation(leftCenterX,leftCenterY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var drawThisLocation = perspectiveLocation(leftTopX,leftTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var drawThisLocation = perspectiveLocation(leftBottomX,leftBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");

      var distanceCenterXToRightCenterX= visualRightCenterX- visualCenterX
      var distanceCenterYToCenterTopY= visualCenterTopY-visualCenterY

      var drawThisLocation = perspectiveLocation(raquetPositionX,raquetPositionY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"red");
      var visualraquetPositionX = drawThisLocation.x
      var visualraquetPositionY = drawThisLocation.y

      var drawThisLocation = perspectiveLocation(this.x,this.y,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualThisX = drawThisLocation.x
      var visualThisY = drawThisLocation.y
      //end of function to determine window of racket hit
  }

  //draws real life coordinates of front wall: Draw only
  this.frontWallHitWindowCoords = function(){
      const HITSQUARETOPW=71;
      const HITSQUAREBOTTOMW=34;
      const HITSQUARECENTERW=39;
      const HITSQUARETOPZ=28;
      const HITSQUAREBOTTOMZ=8;
      const centerZ=14;

      var centerX=COURT_W/2;
      var centerY=0-centerZ;

      centerTopX=centerX;
      centerTopY=centerY-HITSQUARETOPZ;

      centerBottomX=centerX;
      centerBottomY=centerY+HITSQUAREBOTTOMZ;

      rightCenterX=centerX+HITSQUARECENTERW;
      rightCenterY=centerY;

      rightTopX=centerX+HITSQUARETOPW;
      rightTopY=centerY-HITSQUARETOPZ;

      rightBottomX=centerX+HITSQUAREBOTTOMW;
      rightBottomY=centerY+HITSQUAREBOTTOMZ;

      leftCenterX=centerX-HITSQUARECENTERW;
      leftCenterY=centerY;

      leftTopX=centerX-HITSQUARETOPW;
      leftTopY=centerY-HITSQUARETOPZ;

      leftBottomX=centerX-HITSQUAREBOTTOMW;
      leftBottomY=centerY+HITSQUAREBOTTOMZ;

      var drawThisLocation = perspectiveLocation(centerX,centerY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualCenterX = drawThisLocation.x
      var visualCenterY = drawThisLocation.y

      var drawThisLocation = perspectiveLocation(centerTopX,centerTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualCenterTopY = drawThisLocation.y

      var drawThisLocation = perspectiveLocation(rightTopX,rightTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualRightTopX = drawThisLocation.x

      var drawThisLocation = perspectiveLocation(rightCenterX,rightCenterY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualRightCenterX = drawThisLocation.x

      var drawThisLocation = perspectiveLocation(rightBottomX,rightBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var drawThisLocation = perspectiveLocation(centerBottomX,centerBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var drawThisLocation = perspectiveLocation(leftCenterX,leftCenterY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var drawThisLocation = perspectiveLocation(leftTopX,leftTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var drawThisLocation = perspectiveLocation(leftBottomX,leftBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");

      var distanceCenterXToRightCenterX= visualRightCenterX- visualCenterX
      var distanceCenterYToCenterTopY= visualCenterTopY-visualCenterY
  }//end function to build front wall coords
}//end PlayerClass
