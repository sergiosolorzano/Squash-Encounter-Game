var playerStepsPerAnimFrame = 0;
var playerFrame = 0;
var playerFrameTimer = 0;//how quick it changes between frames
const PLAYER_H=55;
const PLAYER_W=55;
var PLAYER_MOVE_SPEED=2;

var quadrantHit=0;
const TOPRIGHTQUADRANT=1;
const BOTTOMRIGHTQUADRANT=2;
const BOTTOMLEFTQUADRANT=3;
const TOPLEFTQUADRANT=4;

const WINDOWXSCALE=0.036;//For Hit Window range: every real life 20% move across the Y axis, the X hit span visually decreases by 7%

var initYPosition=0;
var whichPic;

function playerOneClass(){
  this.keyHeld_Gas = false;
  this.keyHeld_Reverse = false;
  this.keyHeld_TurnLeft = false;
  this.keyHeld_TurnRight = false;
  this.keyHeld_Shoot = false;
  
  this.controlKeyUp;
  this.controlKeyRight;
  this.controlKeyDown;
  this.controlKeyLeft;
  this.controlKeyShoot;
  
  this.initInput = function (upKey, rightKey, downKey, leftKey,shootKey){
  this.controlKeyUp = upKey;
  this.controlKeyRight = rightKey;
  this.controlKeyDown= downKey;
  this.controlKeyLeft = leftKey;
  this.controlKeyShoot = shootKey;
  }

  this.Init = function(){
    this.Reset(); 
  }

  this.Reset = function(){
    this.x=COURT_W/7;
    initYPosition=COURT_L/2
    this.y=initYPosition;
    whichPic = p1_standing;  
  }
    
  this.drawPlayer = function(){
    var drawLocation = perspectiveLocation(this.x,this.y,0);
    
    //game crashes with this
    //if(this.keyHeld_Gas==false || this.keyHeld_Reverse==false ||  this.keyHeld_TurnLeft== false || this.keyHeld_TurnRight== false || this.keyHeld_Shoot==false){
     // whichPic=p1_standing
    //}
    
    var playerAnimationFrames = whichPic.width/PLAYER_W;
   if (playerFrameTimer-- < 0) {
            playerFrameTimer = playerStepsPerAnimFrame;
            playerFrame++;
            if (playerFrame >= playerAnimationFrames) {
                playerFrame = 0;
            }
        }
  drawAtBaseSheetSprite(whichPic, playerFrame, drawLocation.x, drawLocation.y);
  }

    this.hitGraphicSelection=function(){
    switch(quadrantHit){
          case TOPRIGHTQUADRANT:
            whichPic = p1_shot_top_right;
            playerAnimationFrames = whichPic.width/PLAYER_W;
            break;
          case TOPLEFTQUADRANT:
            whichPic = p1_shot_top_left;
            playerAnimationFrames = whichPic.width/PLAYER_W;
            break;
          case BOTTOMRIGHTQUADRANT:
            whichPic = p1_shot_bottom_right;
            playerAnimationFrames = whichPic.width/PLAYER_W;    
            break;
          case BOTTOMLEFTQUADRANT:
            whichPic = p1_shot_bottom_left;
            playerAnimationFrames = whichPic.width/PLAYER_W;
            break;
        }
    }

   this.ballAtReach = function(){
      //segments of png to determine ball collision
      const SHIFTTOCENTERX = -2;
      const SHIFTTOCENTERY = -3;
      const HITSQUAREW=10;
      const HITSQUAREH=10;
      
      var centreX=this.x+SHIFTTOCENTERX;
      var centreY=this.y+SHIFTTOCENTERY;
      var scaleAdjustmentX = (1-this.y/initYPosition)*100*WINDOWXSCALE;

      centreTopX=centreX;
      centreTopY=centreY-HITSQUAREH;

      centreBottomX=centreX;
      centreBottomY=centreY+HITSQUAREH;
      
      rightCentreX=centreX+HITSQUAREW+scaleAdjustmentX;
      rightCentreY=centreY;

      rightTopX=centreX+HITSQUAREW+scaleAdjustmentX;
      rightTopY=centreY-HITSQUAREH;

      rightBottomX=centreX+HITSQUAREW+scaleAdjustmentX;
      rightBottomY=centreY+HITSQUAREH;

      leftCentreX=centreX-HITSQUAREW-scaleAdjustmentX;
      leftCentreY=centreY;
      
      leftTopX=centreX-HITSQUAREW-scaleAdjustmentX;
      leftTopY=centreY-HITSQUAREH;

      leftBottomX=centreX-HITSQUAREW-scaleAdjustmentX;
      leftBottomY=centreY+HITSQUAREH;

      if(p1.x>=centreX && p1.x<=rightCentreX && p1.y<=centreY && p1.y>=centreTopY){
        quadrantHit=TOPRIGHTQUADRANT;
      }

      if(p1.x<centreX && p1.x>=leftCentreX && p1.y<centreY && p1.y>=leftTopY){
        quadrantHit=TOPLEFTQUADRANT;
      }

      if(p1.x>centreX && p1.x<=rightBottomX && p1.y>centreY && p1.y<=rightBottomY){
        quadrantHit=BOTTOMRIGHTQUADRANT;
      }

      if(p1.x<centreX && p1.x >= leftBottomX && p1.y>centreY & p1.y<= leftBottomY){
        quadrantHit=BOTTOMLEFTQUADRANT;
      }

      //console.log(centreX, rightCentreX, centreY, centreTopY)
      //console.log(p1.x,p1.y)
      //console.log(topRightQuadrant, bottomRightQuadrant,bottomLeftQuadrant,topLeftQuadrant)
      //console.log(this.x,this.y)
    }

  this.movePlayer = function(){
    quadrantHit=0;
    var nextX = this.x;
    var nextY = this.y;
    whichPic = p1_standing;  
    
    if(this.keyHeld_Gas){
                nextY -= PLAYER_MOVE_SPEED;
                whichPic = p1_running;
                playerAnimationFrames = whichPic.width/PLAYER_W;
    }
    if(this.keyHeld_Reverse){
                nextY += PLAYER_MOVE_SPEED;
                whichPic = p1_running;
                playerAnimationFrames = whichPic.width/PLAYER_W;
    }
    if(this.keyHeld_TurnLeft){
                nextX -= PLAYER_MOVE_SPEED;
                whichPic = p1_running;
                playerAnimationFrames = whichPic.width/PLAYER_W;
    }
    if(this.keyHeld_TurnRight){
                nextX+= PLAYER_MOVE_SPEED
                whichPic = p1_running;
                playerAnimationFrames = whichPic.width/PLAYER_W;
    }

    this.ballAtReach();
    this.hitGraphicSelection();
    
    //not achieving desired used
    //if(whichPic!=undefined){
    //whichPic = p1_standing;  
   // }
    
    if(nextX>=0 && nextX<=COURT_W-2)  {//COURT_W reduced by two so the racket doesn't paint black canvas outside the court
      this.x=nextX;
    }

    if(nextY>=0 && nextY<=COURT_L)  {
      this.y=nextY;
    }   
  }

  //function to determine window range for racket hit
  this.hitWindowCoords = function(){
      const SHIFTTOCENTERX = 0;
      const SHIFTTOCENTERY = -7;
      const HITSQUAREW=15;
      const HITSQUAREH=15;
      
      var centreX=this.x+SHIFTTOCENTERX;
      var centreY=this.y+SHIFTTOCENTERY;
      var scaleAdjustmentX = (1-this.y/initYPosition)*100*WINDOWXSCALE;

      centreTopX=centreX;
      centreTopY=centreY-HITSQUAREH;

      centreBottomX=centreX;
      centreBottomY=centreY+HITSQUAREH;
      
      rightCentreX=centreX+HITSQUAREW+scaleAdjustmentX;
      rightCentreY=centreY;

      rightTopX=centreX+HITSQUAREW+scaleAdjustmentX;
      rightTopY=centreY-HITSQUAREH;

      rightBottomX=centreX+HITSQUAREW+scaleAdjustmentX;
      rightBottomY=centreY+HITSQUAREH;

      leftCentreX=centreX-HITSQUAREW-scaleAdjustmentX;
      leftCentreY=centreY;
      
      leftTopX=centreX-HITSQUAREW-scaleAdjustmentX;
      leftTopY=centreY-HITSQUAREH;

      leftBottomX=centreX-HITSQUAREW-scaleAdjustmentX;
      leftBottomY=centreY+HITSQUAREH;


      var drawThisLocation = perspectiveLocation(centreX,centreY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var visualCentreX = drawThisLocation.x
      var visualCentreY = drawThisLocation.y

      var drawThisLocation = perspectiveLocation(centreTopX,centreTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var visualCentreTopY = drawThisLocation.y

      var drawThisLocation = perspectiveLocation(rightTopX,rightTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var visualRightTopX = drawThisLocation.x

      var drawThisLocation = perspectiveLocation(rightCentreX,rightCentreY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var visualRightCentreX = drawThisLocation.x

      var drawThisLocation = perspectiveLocation(rightBottomX,rightBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var drawThisLocation = perspectiveLocation(centreBottomX,centreBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var drawThisLocation = perspectiveLocation(leftCentreX,leftCentreY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var drawThisLocation = perspectiveLocation(leftTopX,leftTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");
      var drawThisLocation = perspectiveLocation(leftBottomX,leftBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"orange");

      var distanceCentreXToRightCentreX= visualRightCentreX- visualCentreX
      var distanceCentreYToCentreTopY= visualCentreTopY-visualCentreY
      //console.log(distanceCentreXToRightCentreX,this.y)
      //console.log(distanceCentreYToCentreTopY)
      //end of function to determine window of racket hit
  }

}//end playerClass

