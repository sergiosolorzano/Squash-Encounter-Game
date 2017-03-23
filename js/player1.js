var playerStepsPerAnimFrame = 2;
var playerFrame = 0;
var playerFrameTimer = 2;//how quick it changes between frames
const PLAYER_H=55;
const PLAYER_W=55;
var PLAYER_MOVE_SPEED=2;
const SPRINT_MULTIPLER = 3.0;
const PLAYER_MAX_HEIGHT_REACH=15;

//player swing-quadrants
const NOQUADRANTHIT = 0;
const TOPRIGHTQUADRANT=1;
const BOTTOMRIGHTQUADRANT=2;
const BOTTOMLEFTQUADRANT=3;
const TOPLEFTQUADRANT=4;

//ballAtReach and playerHitWindowCoords functions constants to determine
//the quadrant where the player swings. 
const WINDOWXSCALE=0.02;//For Hit Window range: every real life 20% move across the Y axis, the X hit span visually decreases by 4%
const SHIFTTOCENTERX = -3;
const SHIFTTOCENTERY = 3;
const HITSQUAREW=8;
const HITSQUAREH=8;
const SHIFTTORAQUETPOSITIONX=6;
const SHIFTTORAQUETPOSITIONY=-5;

//back wall sizing
const HITSQUAREBOTTOMW=32;
const HITSQUARECENTERW=42;
const HITSQUAREBOTTOMZ=17;
const BACKWALLCENTERZ=20;
//back wall quadrants
const NOBACKWALLSELECTED=0;
const RIGHTBACKWALL=1;
const LEFTBACKWALL=2;

//quadrant where player is standing
const RIGHTCOURTQUADRANT=1;
const LEFTCOURTQUADRANT=2;

//front wall quadrants
const NOFRONTWALLSELECTED=0;
const TOPRIGHTFRONTWALL=1;
const BOTTOMRIGHTFRONTWALL=2;
const BOTTOMLEFTFRONTWALL=3;
const TOPLEFTFRONTWALL=4;

//court floor sizing
const WALKTOPSQUAREW=35;
const WALKBOTTOMSQUAREW=35;
const WALKCENTERSQUAREW=35;
const WALKTOPSQUAREY=39;
const WALKBOTTOMSQUAREY=58;

var initYPosition=COURT_L*0.4;
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
    this.y=initYPosition;
    whichPic = p1_standing;
    this.isSwinging=false;//used so player does not run if gif showing it's swinging the racket
    this.targetBackWall=NOBACKWALLSELECTED;
    this.backWallClicked = false;
    this.playerStandingOnCourtQuadrant=LEFTCOURTQUADRANT;
  }

  this.drawPlayer = function(){
    var drawLocation = perspectiveLocation(this.x,this.y,0);
    
    //this.playerHitWindowCoords();//shows swing quadrants of player
    //this.frontWallHitWindowCoords();//shows quadrants of the front wall
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

    this.drawTargetBackWall = function(nearX,farX,nearY,farY){
      var visualAdjustmentX=40;//adjustment so the selected wall rectangle does not draw into canvas
      const visualAdjustmentY=5;//adjustment so selected wall covers to side wall line
      if(this.targetBackWall==LEFTBACKWALL){
        visualAdjustmentX*=-1;
      }
      var targetWallDrawnWidth = farX-nearX-visualAdjustmentX;
      var targetWalltDrawnHeight = farY-nearY+visualAdjustmentY;
      colorRect(nearX,nearY,targetWallDrawnWidth,targetWalltDrawnHeight,"blue");  
    }

    //on mouseclick checks whether backwall is selected as target
    this.selectBackWall = function(mouseClickX,mouseClickY){
      var centerTopX=COURT_W/2;
      var centerTopY=COURT_L-BACKWALLCENTERZ;

      centerBottomX=centerTopX;
      centerBottomY=centerTopY+HITSQUAREBOTTOMZ;

      rightTopX=centerTopX+HITSQUARECENTERW;
      rightTopY=centerTopY;

      rightBottomX=centerTopX+HITSQUAREBOTTOMW;
      rightBottomY=centerTopY+HITSQUAREBOTTOMZ;

      leftTopX=centerTopX-HITSQUARECENTERW;
      leftTopY=centerTopY;

      leftBottomX=centerTopX-HITSQUAREBOTTOMW;
      leftBottomY=centerTopY+HITSQUAREBOTTOMZ;

      //draw coordinates for backwall
      var drawThisLocation = perspectiveLocation(centerTopX,centerTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualCenterTopX = drawThisLocation.x
      var visualCenterTopY = drawThisLocation.y
      
      var drawThisLocation = perspectiveLocation(centerBottomX,centerBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualcenterBottomX = drawThisLocation.x;
      var visualcenterBottomY = drawThisLocation.y;      

      var drawThisLocation = perspectiveLocation(rightTopX,rightTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualRightTopX = drawThisLocation.x;
      var visualRightTopY = drawThisLocation.y;

      var drawThisLocation = perspectiveLocation(leftTopX,leftTopY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualRightTopX = drawThisLocation.x;
      var visualRightTopY = drawThisLocation.y;

      var drawThisLocation = perspectiveLocation(rightBottomX,rightBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualLeftBottomX = drawThisLocation.x;
      var visualLeftBottomY = drawThisLocation.y;      

      var drawThisLocation = perspectiveLocation(leftBottomX,leftBottomY,0);
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");
      var visualLeftBottomX = drawThisLocation.x;
      var visualLeftBottomY = drawThisLocation.y;      

      //mouse selection for back wall
      var centerTopDrawn = perspectiveLocation(centerTopX,centerTopY,0);
      var centerBottomDrawn = perspectiveLocation(centerBottomX,centerBottomY,0);
      var rightTopDrawn =perspectiveLocation(rightTopX,rightTopY,0);
      var rightBottomDrawn = perspectiveLocation(rightBottomX,rightBottomY,0);
      var leftTopDrawn = perspectiveLocation(leftTopX,leftTopY,0);
      var leftBottomDrawn=perspectiveLocation(leftBottomX,leftBottomY,0);

      //determine target wall and its corner coordinates
      if(mouseClickX>=centerTopDrawn.x && mouseClickX<=rightTopDrawn.x && mouseClickY>=centerTopDrawn.y && mouseClickY<=centerBottomDrawn.y){
        this.targetBackWall=RIGHTBACKWALL;
          var farX=rightTopDrawn.x;
          var nearX=centerTopDrawn.x;
          var farY=centerBottomDrawn.y;
          var nearY=centerTopDrawn.y;
      }
      if(mouseClickX<centerTopDrawn.x && mouseClickX>=leftTopDrawn.x && mouseClickY>centerTopDrawn.y && mouseClickY<=leftBottomDrawn.y){
        this.targetBackWall=LEFTBACKWALL;
          farX= leftTopDrawn.x;
          nearX= centerTopDrawn.x;
          farY=leftBottomDrawn.y;
          nearY=centerTopDrawn.y;
      }
      //call function to draw the target wall
      this.drawTargetBackWall(nearX,farX,nearY,farY);
  }//end of function to target the back wall

    this.hitGraphicSelection=function(){
    var hereCollision = this.ballAtReach(this.x,this.y,BallClass.x,BallClass.y);
    var quadrantHit = hereCollision.quadrant;
    
    if(BallClass.bouncedOnFloor && BallClass.bouncedOnFrontWall && quadrantHit!=0){
        switch(quadrantHit){//maybe quadrantHit=0 in which case none called
              case TOPRIGHTQUADRANT:
                whichPic = p1_shot_top_right;
                this.isSwinging=true;
				Sound.hit();
                break;
              case TOPLEFTQUADRANT:
                whichPic = p1_shot_top_left;
                this.isSwinging=true;
				Sound.hit();
                break;
              case BOTTOMRIGHTQUADRANT:
                whichPic = p1_shot_bottom_right;
                this.isSwinging=true;
				Sound.hit();
                break;
              case BOTTOMLEFTQUADRANT:
                whichPic = p1_shot_bottom_left;
                this.isSwinging=true;
				Sound.hit();
                break;
        }
      }
    }
   this.ballAtReach = function(playerPixelX, playerPixelY, ballPixelX,ballPixelY){
      if(BallClass.z>PLAYER_MAX_HEIGHT_REACH){
        //console.log(BallClass.z)
        return {
          quadrant:0,
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
      return {
        quadrant:quadrantHit,
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

    if(this.isSwinging==false){
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
  }
    //check so player doesn't go outside the court
    if(nextX>=0 && nextX<=COURT_W-2)  {//COURT_W reduced by two so the racket doesn't paint black on canvas outside the court
      this.x=nextX;
    }
    if(nextY>=0 && nextY<=COURT_L-8.2)  {//COURT_H reduced by two so the racket doesn't paint black on canvas outside the court
      this.y=nextY;
    }
  }

//Playing court coordinates to located floor-quadrant where the player is swinging
 this.GradientShotToBackWall = function(){
      var centerX=COURT_W/2;
      var centerY=COURT_L*0.38;

      centerTopX=centerX;
      centerTopY=centerY-WALKTOPSQUAREY;

      centerBottomX=centerX;
      centerBottomY=centerY+WALKBOTTOMSQUAREY;

      rightCenterX=centerX+WALKCENTERSQUAREW;
      rightCenterY=centerY;

      rightTopX=centerX+WALKTOPSQUAREW;
      rightTopY=centerY-WALKTOPSQUAREY;

      rightBottomX=centerX+WALKBOTTOMSQUAREW;
      rightBottomY=centerY+WALKBOTTOMSQUAREY;

      leftCenterX=centerX-WALKCENTERSQUAREW;
      leftCenterY=centerY;

      leftTopX=centerX-WALKTOPSQUAREW;
      leftTopY=centerY-WALKTOPSQUAREY;

      leftBottomX=centerX-WALKBOTTOMSQUAREW;
      leftBottomY=centerY+WALKBOTTOMSQUAREY;

      /*//draw coordinates of court quadrants on the screen
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
      colorRect(drawThisLocation.x,drawThisLocation.y,3,3,"blue");*/

      //determine X point target and radiants to shoot to backwall on swing
      //what court quadrant is player standing:
      
      var targetXOnBackWall;
        if(this.targetBackWall==RIGHTBACKWALL){
            targetXOnBackWall=centerBottomX+(rightBottomX-this.x)/2;
            distPlayerToTargetX=targetXOnBackWall-this.x;//opposite side of triangle
            distPlayerToBackWallY=centerBottomY-this.y;//adjacent side of triangle
            var atanResult=Math.atan(distPlayerToTargetX/distPlayerToBackWallY);//radians
            var degreeTarget=atanResult*180/Math.PI;
            //console.log(atanResult,degreeTarget);
            var ballAng=atanResult;
        }
        if(this.targetBackWall==LEFTBACKWALL){
            targetXOnBackWall=centerBottomX-(this.x-leftBottomX)/2;
            distPlayerToTargetX=this.x-targetXOnBackWall;
            distPlayerToBackWallY=centerBottomY-this.y;
            var atanResult=Math.atan(distPlayerToTargetX/distPlayerToBackWallY);//radians
            var degreeTarget=atanResult*180/Math.PI;
            var ballAng=atanResult;
        }
        //what quadrant is player standing
        if(this.x>=centerX){
          this.playerStandingOnCourtQuadrant=RIGHTCOURTQUADRANT;
        } else {
          this.playerStandingOnCourtQuadrant=LEFTCOURTQUADRANT;
        }
        
      return {
        ballAng:ballAng,
        playerOnThisCourtQuad:this.playerStandingOnCourtQuadrant,
        tgtBackWall:this.targetBackWall
      };
      
  }//end of function

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


//Possibly delete: function determines where the squash racket is so it can be shifted at swing
//to make the swing transition visually less glitchy

/*this.playerHitWindowCoords = function(){
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
  }*/