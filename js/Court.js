T_ONCOURT_W=COURT_W*0.54
T_ONCOURT_L=COURT_L*0.3
var nearTargetBackWallX=0;
var nearTargetBackWallY=0;
var farTargetBackWallX=0;
var farTargetBackWallY=0;
var targetWidth=10;
var targetHeight=3;
var nearTargetFrontWallX=0;
var nearTargetFrontWallY=0;
var farTargetFrontWallX=0;
var farTargetFrontWallY=0;

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
var SWINGBUFFER=0;

//back wall sizing
const HITSQUAREBOTTOMW=32;
const HITSQUARECENTERW=42;
const HITSQUAREBOTTOMZ=17;
const BACKWALLCENTERZ=20;

//back wall quadrants
const NOBACKWALLSELECTED=0;
const RIGHTBACKWALL=1;
const LEFTBACKWALL=2;

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

//quadrant where player is standing
const RIGHTCOURTQUADRANT=1;
const LEFTCOURTQUADRANT=2;
const RIGHTTOPCOURTQUADRANT=1;
const RIGHTBOTTOMCOURTQUADRANT=2;
const LEFTTOPCOURTQUADRANT=4;
const LEFTBOTTOMCOURTQUADRANT=3;

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



//draw target variables
var stepsPerAnimation=20
var targetFrameTimer1 = 20;//how quick it changes between colours;
var targetFrameTimer2 = 20;//how quick it changes between colours;

//on mouseclick checks whether backwall is selected as target, (force_this_wall to ignore mouse coords)
function selectBackWall (mouseClickX,mouseClickY,force_this_wall){
  if(ServeHandler.servingPlayer === ServeHandler.RED || ServeHandler.inPlay) {
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

      /*//draw coordinates for backwall
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
      var visualLeftBottomY = drawThisLocation.y;*/

      //mouse selection for back wall
      var centerTopDrawn = perspectiveLocation(centerTopX,centerTopY,0);
      var centerBottomDrawn = perspectiveLocation(centerBottomX,centerBottomY,0);
      var rightTopDrawn =perspectiveLocation(rightTopX,rightTopY,0);
      var rightBottomDrawn = perspectiveLocation(rightBottomX,rightBottomY,0);
      var leftTopDrawn = perspectiveLocation(leftTopX,leftTopY,0);
      var leftBottomDrawn=perspectiveLocation(leftBottomX,leftBottomY,0);

      //perspective coordinates
      var farX;
      var nearX;
      var farY;
      var nearY;

      //determine target wall and its corner coordinates
      if((force_this_wall==RIGHTBACKWALL) ||
        (mouseClickX>=centerTopDrawn.x && mouseClickX<=rightTopDrawn.x && mouseClickY>=centerTopDrawn.y && mouseClickY<=centerBottomDrawn.y)){
        PlayerClass.frontWallClicked=false;
        PlayerClass.backWallClicked=true;
        PlayerClass.targetBackWall=RIGHTBACKWALL;
          farX=rightTopDrawn.x;
          nearX=centerTopDrawn.x;
          farY=centerBottomDrawn.y;
          nearY=centerTopDrawn.y;
      }
      if((force_this_wall==LEFTBACKWALL) ||
        (mouseClickX<centerTopDrawn.x && mouseClickX>=leftTopDrawn.x && mouseClickY>centerTopDrawn.y && mouseClickY<=leftBottomDrawn.y)){
        PlayerClass.frontWallClicked=false;
        PlayerClass.backWallClicked=true;
        PlayerClass.targetBackWall=LEFTBACKWALL;
          farX= leftTopDrawn.x;
          nearX= centerTopDrawn.x;
          farY=leftBottomDrawn.y;
          nearY=centerTopDrawn.y;
      }
	}
  //set coordinates to draw
      var visualAdjustmentX=35;//adjustment so the selected wall rectangle does not draw into canvas
      const visualAdjustmentY=0;//adjustment so selected wall covers to side wall line
      
      nearTargetBackWallX=nearX;
      nearTargetBackWallY=nearY;
      farTargetBackWallX=farX-visualAdjustmentX;
      farTargetBackWallY=farY-visualAdjustmentY;
      redrawCanvas();
  }//end of function to target the back wall

//on mouse target front wall (force_this_wall to ignore mouse coords)
function selectFrontWall (ballPixelX,ballPixelY,force_this_wall){
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

      var farX;
      var nearX;
      var farY;
      var nearY;

      //determine target wall
      if((force_this_wall==TOPRIGHTFRONTWALL) ||
        (mouseX>=centerDrawn.x && mouseX<=rightCenterDrawn.x && mouseY<=centerDrawn.y && mouseY>=centerTopDrawn.y)){
        PlayerClass.backWallClicked=false;
        PlayerClass.frontWallClicked=true;
        PlayerClass.targetFrontWall=TOPRIGHTFRONTWALL;
        farX=rightTopDrawn.x;
        nearX=centerTopDrawn.x;
        farY=centerTopDrawn.y;
        nearY=centerDrawn.y;
      }

      if((force_this_wall==TOPLEFTFRONTWALL) ||
        (mouseX<centerDrawn.x && mouseX>=leftCenterDrawn.x && mouseY<centerDrawn.y && mouseY>=leftTopDrawn.y)){
        PlayerClass.backWallClicked=false;
        PlayerClass.frontWallClicked=true;
        PlayerClass.targetFrontWall=TOPLEFTFRONTWALL;
        farX=leftTopDrawn.x;
        nearX=centerTopDrawn.x;
        farY=centerTopDrawn.y;
        nearY=centerDrawn.y;
      }

	if(ServeHandler.servingPlayer === ServeHandler.RED || ServeHandler.inPlay) {
      		if((force_this_wall==BOTTOMRIGHTFRONTWALL) ||
            (mouseX>centerDrawn.x && mouseX<=rightBottomDrawn.x && mouseY>centerDrawn.y && mouseY<=rightBottomDrawn.y)){
        		PlayerClass.backWallClicked=false;
            PlayerClass.frontWallClicked=true;
        		PlayerClass.targetFrontWall=BOTTOMRIGHTFRONTWALL;
        		farX=rightBottomDrawn.x;
        		nearX=centerBottomDrawn.x;
        		farY=centerBottomDrawn.y;
        		nearY=centerDrawn.y;
      		}

      		if((force_this_wall==BOTTOMLEFTFRONTWALL) ||
            (mouseX<centerDrawn.x && mouseX >= leftBottomDrawn.x && mouseY>centerDrawn.y & mouseY<= leftBottomDrawn.y)){
        		PlayerClass.backWallClicked=false;
            PlayerClass.frontWallClicked=true;
        		PlayerClass.targetFrontWall=BOTTOMLEFTFRONTWALL;
        		farX=leftBottomDrawn.x;
        		nearX=centerDrawn.x;
        		farY=centerBottomDrawn.y;
        		nearY=centerDrawn.y;
      		}
	}
      if(PlayerClass.targetFrontWall!=TOPRIGHTQUADRANT && PlayerClass.targetFrontWall !=TOPLEFTQUADRANT && PlayerClass.targetFrontWall!=BOTTOMRIGHTQUADRANT && PlayerClass.targetFrontWall!= BOTTOMLEFTQUADRANT){
        PlayerClass.targetFrontWall=NOFRONTWALLSELECTED;
      }
      //set coordinates to draw
      nearTargetFrontWallX=nearX;
      nearTargetFrontWallY=nearY;
      farTargetFrontWallX=farX;
      farTargetFrontWallY=farY;
  }//end of function to target the front wall

function drawTargets(){

      // console.log('drawTargets frontWallClicked='+PlayerClass.frontWallClicked+' backWallClicked=' + PlayerClass.backWallClicked);

      if (PlayerClass.backWallClicked || PlayerClass.frontWallClicked) {
        if(targetFrameTimer1>0){
        targetColor="#0000A0"; 
        targetFrameTimer2=stepsPerAnimation; 
        }
        if (targetFrameTimer1-- < 0) {
          targetColor="#000000"
          if (targetFrameTimer2-- < 0) {
            targetFrameTimer1 = stepsPerAnimation;
          } 
        }
        //console.log(targetFrameTimer1, targetFrameTimer2)
  
  if(PlayerClass.frontWallClicked && PlayerClass.targetFrontWall==TOPLEFTFRONTWALL){
    colorRect(nearTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI);
    colorRect(nearTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
    colorRect(farTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor);
    colorRect(farTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
    colorRect(farTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
    colorRect(farTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
    colorRect(nearTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI);
    colorRect(nearTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
  }

  if(PlayerClass.frontWallClicked && PlayerClass.targetFrontWall==BOTTOMRIGHTFRONTWALL){
    colorRect(nearTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
    colorRect(nearTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
    colorRect(farTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI);
    colorRect(farTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
    colorRect(farTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI);
    colorRect(farTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
    colorRect(nearTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
    colorRect(nearTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
   }

   if(PlayerClass.frontWallClicked && PlayerClass.targetFrontWall==TOPRIGHTFRONTWALL){
    colorRect(nearTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
    colorRect(nearTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
    colorRect(farTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI);
    colorRect(farTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
    colorRect(farTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI);
    colorRect(farTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
    colorRect(nearTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
    colorRect(nearTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
  }

if(PlayerClass.frontWallClicked && PlayerClass.targetFrontWall==BOTTOMLEFTFRONTWALL){
  colorRect(nearTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI);
  colorRect(nearTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
  colorRect(farTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
  colorRect(farTargetFrontWallX, nearTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
  colorRect(farTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
  colorRect(farTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
  colorRect(nearTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,Math.PI);
  colorRect(nearTargetFrontWallX, farTargetFrontWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
  }
       
  if(PlayerClass.backWallClicked && PlayerClass.targetBackWall==RIGHTBACKWALL){
  colorRect(nearTargetBackWallX, nearTargetBackWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
  colorRect(nearTargetBackWallX, nearTargetBackWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
  colorRect(farTargetBackWallX, nearTargetBackWallY, targetWidth, targetHeight, targetColor,Math.PI);
  colorRect(farTargetBackWallX, nearTargetBackWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
  colorRect(farTargetBackWallX, farTargetBackWallY, targetWidth, targetHeight, targetColor,Math.PI);
  colorRect(farTargetBackWallX, farTargetBackWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
  colorRect(nearTargetBackWallX, farTargetBackWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
  colorRect(nearTargetBackWallX, farTargetBackWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
  }

const ADJUSTX=70
  if(PlayerClass.backWallClicked && PlayerClass.targetBackWall==LEFTBACKWALL){
  colorRect(nearTargetBackWallX, nearTargetBackWallY, targetWidth, targetHeight, targetColor,Math.PI);
  colorRect(nearTargetBackWallX, nearTargetBackWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
  colorRect(farTargetBackWallX+ADJUSTX, nearTargetBackWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
  colorRect(farTargetBackWallX+ADJUSTX, nearTargetBackWallY, targetWidth, targetHeight, targetColor,Math.PI/2);
  colorRect(farTargetBackWallX+ADJUSTX, farTargetBackWallY, targetWidth, targetHeight, targetColor,2*Math.PI);
  colorRect(farTargetBackWallX+ADJUSTX, farTargetBackWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
  colorRect(nearTargetBackWallX, farTargetBackWallY, targetWidth, targetHeight, targetColor,Math.PI);
  colorRect(nearTargetBackWallX, farTargetBackWallY, targetWidth, targetHeight, targetColor,3/2*Math.PI);
  }
  //drawAtBaseSheetSprite(blue_tgt_topleft, targetFrame, nearTargetBackWallX, nearTargetBackWallY, PLAYER_W, PLAYER_W);
    } 
}

function ballAtReach (playerPixelX, playerPixelY, ballPixelX,ballPixelY, swingTurn){
      if(BallClass.z>PLAYER_MAX_HEIGHT_REACH){
        //console.log(BallClass.z)
        return {
          quadrant:0,
          canSwing:swingTurn,
        }
      }
      var quadrantHit;
      var centerX=playerPixelX+SHIFTTOCENTERX;
      var centerY=playerPixelY+SHIFTTOCENTERY;
      var scaleAdjustmentX = (1-playerPixelY/initYPosition)*100*WINDOWXSCALE;

      centerTopX=centerX;
      centerTopY=centerY-HITSQUAREH-SWINGBUFFER;

      centerBottomX=centerX;
      centerBottomY=centerY+HITSQUAREH+SWINGBUFFER;

      rightCenterX=centerX+HITSQUAREW+scaleAdjustmentX+SWINGBUFFER;
      rightCenterY=centerY;

      rightTopX=centerX+HITSQUAREW+scaleAdjustmentX+SWINGBUFFER;
      rightTopY=centerY-HITSQUAREH-SWINGBUFFER;

      rightBottomX=centerX+HITSQUAREW+scaleAdjustmentX+SWINGBUFFER;
      rightBottomY=centerY+HITSQUAREH+SWINGBUFFER;

      leftCenterX=centerX-HITSQUAREW-scaleAdjustmentX-SWINGBUFFER;
      leftCenterY=centerY;

      leftTopX=centerX-HITSQUAREW-scaleAdjustmentX-SWINGBUFFER;
      leftTopY=centerY-HITSQUAREH-SWINGBUFFER;

      leftBottomX=centerX-HITSQUAREW-scaleAdjustmentX-SWINGBUFFER;
      leftBottomY=centerY+HITSQUAREH+SWINGBUFFER;

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
        canSwing:swingTurn,
      }
    }

function GradientShotToBackWall (playerX,playerY){
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
      var ballAng;
      var atanResult;
      var degreeTarget;
      var targetXOnBackWall;
      
        if(PlayerClass.targetBackWall==RIGHTBACKWALL){
            targetXOnBackWall=(rightBottomX+playerX)/2;
            //console.log("rightwall");
        }
        if(PlayerClass.targetBackWall==LEFTBACKWALL){
            targetXOnBackWall=(leftBottomX+playerX)/2;
            //console.log("leftwall");
        }
        //radian calculation if player standing in the opposite quadrant of the backwall target
            distPlayerToTargetX=targetXOnBackWall-playerX;
            distPlayerToBackWallY=centerBottomY-playerY;
            atanResult=Math.atan2(distPlayerToBackWallY,distPlayerToTargetX);//radians
            degreeTarget=atanResult*180/Math.PI;
            ballAng=atanResult;
        
        //what quadrant is player standing
        if(playerX>=centerX){
          PlayerClass.playerStandingOnCourtQuadrant=RIGHTCOURTQUADRANT;
          //console.log("playerright")
        } else {
          PlayerClass.playerStandingOnCourtQuadrant=LEFTCOURTQUADRANT;
          //console.log("playerleft")
        }
      return {
        ballAng:ballAng,
        playerOnThisCourtQuad:PlayerClass.playerStandingOnCourtQuadrant,
        tgtBackWall:PlayerClass.targetBackWall
      };
  }//end of function

  function GradientShotToFrontWall (playerX,playerY){
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

      /*//draw coordinates at front wall
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
*/
      //determine court quadrant is player standing, X point target on the wall and radiants to shoot to frontwall on swing
      var ballAng;
      var atanResult;
      var degreeTarget;
      var targetXOnFrontWall;
      var targetYOnFrontWall;
      
      //radian calculation if player standing in the opposite quadrant of the backwall target
        if(PlayerClass.targetFrontWall==TOPRIGHTFRONTWALL){
            targetXOnFrontWall=(rightTopX+playerX)/2;
            targetYOnFrontWall=centerTopY;
            //console.log("toprightwall");
        }
        if(PlayerClass.targetFrontWall==TOPLEFTFRONTWALL){
            targetXOnFrontWall=(leftTopX+playerX)/2;
            targetYOnFrontWall=centerTopY;
            //console.log("topleftwall");
        }
        if(PlayerClass.targetFrontWall==BOTTOMRIGHTFRONTWALL){
            targetXOnFrontWall=(rightBottomX+playerX)/2;
            targetYOnFrontWall=centerY;
            //console.log("bottomrightwall");
        }
        if(PlayerClass.targetFrontWall==BOTTOMLEFTFRONTWALL){
            targetXOnFrontWall=(leftBottomX+playerX)/2;
            targetYOnFrontWall=centerY;
            //console.log("bottomleftwall");
        }

        distPlayerToTargetX=targetXOnFrontWall-playerX;
        distPlayerToFrontWallY=targetYOnFrontWall-playerY;
        atanResult=Math.atan2(distPlayerToFrontWallY,distPlayerToTargetX);//radians
        degreeTarget=atanResult*180/Math.PI;
        ballAng=atanResult;

        //what quadrant is player standing
        
        if(playerX>=centerX){
          PlayerClass.playerStandingOnCourtQuadrant=RIGHTCOURTQUADRANT;
          //console.log("playerright")
        } else {
          PlayerClass.playerStandingOnCourtQuadrant=LEFTCOURTQUADRANT;
          //console.log("playerleft")
        }
      return {
        ballAng:ballAng,
        playerOnThisCourtQuad:PlayerClass.playerStandingOnCourtQuadrant,
        tgtFrontWall:PlayerClass.targetFrontWall
      };
  }//end of function

//player is at racket reach by other player's racket at swing
function playerAtReach (playerPixelX, playerPixelY, opponentPixelX,opponentPixelY){
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

      if(opponentPixelX>=centerX && opponentPixelX<=rightCenterX && opponentPixelY<=centerY && opponentPixelY>=centerTopY){
        opponentAtReach=true;
      }
      if(opponentPixelX<centerX && opponentPixelX>=leftCenterX && opponentPixelY<centerY && opponentPixelY>=leftTopY){
        opponentAtReach=true;
      }
      if(opponentPixelX>centerX && opponentPixelX<=rightBottomX && opponentPixelY>centerY && opponentPixelY<=rightBottomY){
        opponentAtReach=true;
      }

      if(opponentPixelX<centerX && opponentPixelX >= leftBottomX && opponentPixelY>centerY & opponentPixelY<= leftBottomY){
        opponentAtReach=true;
      }
      return {
        oppAtReach:opponentAtReach,
      }
    }

function drawCourtQuadrants (){
      var centerX=COURT_W/2;
      var centerY=COURT_L*0.38;

      centerTopX=centerX;
      centerTopY=centerY-WALKTOPSQUAREY;
      //console.log(centerTopX,centerTopY)

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

      //draw coordinates of court quadrants on the screen
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

      if(PlayerClass.x>=centerX && PlayerClass.x<=rightCenterX && PlayerClass.y<=centerY && PlayerClass.y>=centerTopY){
        PlayerClass.playerStandingOnCourtQuadrant=RIGHTTOPCOURTQUADRANT;
      }
      if(PlayerClass.x<centerX && PlayerClass.x>=leftCenterX && PlayerClass.y<centerY && PlayerClass.y>=leftTopY){
        PlayerClass.playerStandingOnCourtQuadrant=LEFTTOPCOURTQUADRANT;
      }
      if(PlayerClass.x>centerX && PlayerClass.x<=rightBottomX && PlayerClass.y>centerY && PlayerClass.y<=rightBottomY){
        PlayerClass.playerStandingOnCourtQuadrant=RIGHTBOTTOMCOURTQUADRANT;
      }

      if(PlayerClass.x<centerX && PlayerClass.x >= leftBottomX && PlayerClass.y>centerY & PlayerClass.y<= leftBottomY){
        PlayerClass.playerStandingOnCourtQuadrant=LEFTBOTTOMCOURTQUADRANT;
      }
      //console.log("PlayerStanding ",PlayerClass.playerStandingOnCourtQuadrant)
    }

    /*function checkUpperRedLine(){
      const WALKTOPSQUAREW=35;
      const WALKBOTTOMSQUAREW=35;
      const WALKCENTERSQUAREW=35;
      const WALKTOPSQUAREY=39;
      const WALKBOTTOMSQUAREY=58;

      var centerX=COURT_W/2;
      var centerY=COURT_L*0.38;

      var leftCenterX=centerX-WALKCENTERSQUAREW;
      var leftCenterY=centerY;
      var leftCenterZ=42

      var leftTopX=centerX-WALKTOPSQUAREW;
      var leftTopY=centerY-WALKTOPSQUAREY;
      var leftTopZ=42

      var leftBottomX=centerX-WALKBOTTOMSQUAREW;
      var leftBottomY=centerY+WALKBOTTOMSQUAREY;
      var leftBottomZ=30

      var drawThisLocation = perspectiveLocation(leftCenterX,leftCenterY,leftCenterZ);
      colorRect(drawThisLocation.x,drawThisLocation.y-drawThisLocation.z,8,8,"magenta");
      var drawThisLocation = perspectiveLocation(leftTopX,leftTopY,leftTopZ);
      colorRect(drawThisLocation.x,drawThisLocation.y-drawThisLocation.z,8,8,"magenta");
      var drawThisLocation = perspectiveLocation(leftBottomX,leftBottomY,leftBottomZ);
      colorRect(drawThisLocation.x,drawThisLocation.y-drawThisLocation.z,8,8,"magenta");

      var rightCenterX=centerX+WALKCENTERSQUAREW;
      var rightCenterY=centerY;
      var rightCenterZ=42

      var rightTopX=centerX+WALKTOPSQUAREW;
      var rightTopY=centerY-WALKTOPSQUAREY;
      var rightTopZ=42

      var rightBottomX=centerX+WALKBOTTOMSQUAREW;
      var rightBottomY=centerY+WALKBOTTOMSQUAREY;
      var rightBottomZ=30

      //draw coordinates of side wall red lines      
      var drawThisLocation = perspectiveLocation(rightTopX,rightTopY,rightTopZ);
      colorRect(drawThisLocation.x,drawThisLocation.y-drawThisLocation.z,8,8,"magenta");
      var visualRightTopX = drawThisLocation.x
      var drawThisLocation = perspectiveLocation(rightCenterX,rightCenterY,rightCenterZ);
      colorRect(drawThisLocation.x,drawThisLocation.y-drawThisLocation.z,8,8,"magenta");
      var visualRightCenterX = drawThisLocation.x
      var drawThisLocation = perspectiveLocation(rightBottomX,rightBottomY,rightBottomZ);
      colorRect(drawThisLocation.x,drawThisLocation.y-drawThisLocation.z,8,8,"magenta");
    }*/

//Drawing calculations
  //determine window range for racket hit: Draw only
  
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