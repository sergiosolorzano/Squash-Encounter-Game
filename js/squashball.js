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

function BallClass(){
  
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
    this.speedY = -2;
    this.tinHit=false;
    this.ballHitFloorBeforeWall=false;
    this.bouncedOnFrontWall=true;
    this.bouncedOnBackWall=true;
    this.bouncedOnFloor=0;//player can only swing on ball if it has hit the ground once
    this.ballBouncedOnFloor = true;////captures ball bounced 0 or 1 times so player can only swing on ball if it has hit the ground once
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
    drawAtBaseSheetSprite(whichPic, ballFrame, draw.x, draw.y - draw.z,BALL_W,BALL_H);
    }

  this.drawShadow = function() {
      var draw = perspectiveLocation(this.x,this.y,0);
      drawAtBaseSheetSprite(ballShadow, 0, draw.x, draw.y,BALL_W,BALL_H);
      }

  this.moveBall = function(){
    //quadrant from where player swings
    var prevX=this.x-this.speedX;
    var prevY=this.y-this.speedY;
    var quadrantHit;
    var swingTurn;
    
    var herePlayerCollision = ballAtReach(PlayerClass.x,PlayerClass.y,this.x,this.y,PlayerClass.swingTurn);
    var playerSwingTurn=herePlayerCollision.canSwing;

    var hereComputerCollision = ballAtReach(ComputerClass.x,ComputerClass.y,this.x,this.y,ComputerClass.swingTurn);
    var computerSwingTurn=hereComputerCollision.canSwing;

    if(playerSwingTurn){
      quadrantHit=herePlayerCollision.quadrant;
      swingTurn=herePlayerCollision.canSwing;  
    } else {
      quadrantHit=hereComputerCollision.quadrant;
      swingTurn=hereComputerCollision.canSwing;  
    }

    //radians to hit frontwall quadrant
    var targetFrontWallVars=GradientShotToFrontWall(PlayerClass.x,PlayerClass.y);
    var ballAng;
    var playerStandHereQuad=targetFrontWallVars.playerOnThisCourtQuad;
    var targetFrontWallQuadrant=targetFrontWallVars.tgtFrontWall;
    
    if(targetFrontWallQuadrant==TOPRIGHTFRONTWALL && playerStandHereQuad==RIGHTCOURTQUADRANT){
      ballAng=3*Math.PI/2
    }
    if(targetFrontWallQuadrant==BOTTOMRIGHTFRONTWALL && playerStandHereQuad==RIGHTCOURTQUADRANT){
      ballAng=3*Math.PI/2
    }
    if(targetFrontWallQuadrant==TOPLEFTFRONTWALL && playerStandHereQuad==LEFTCOURTQUADRANT){
      ballAng=3*Math.PI/2
    }
    if(targetFrontWallQuadrant==BOTTOMLEFTFRONTWALL && playerStandHereQuad==LEFTCOURTQUADRANT){
      ballAng=3*Math.PI/2
    }
    if (targetFrontWallQuadrant==TOPRIGHTFRONTWALL && playerStandHereQuad==LEFTCOURTQUADRANT){
      ballAng=targetFrontWallVars.ballAng;
    }
    if (targetFrontWallQuadrant==BOTTOMRIGHTFRONTWALL && playerStandHereQuad==LEFTCOURTQUADRANT){
      ballAng=targetFrontWallVars.ballAng;
    }
    if (targetFrontWallQuadrant==TOPLEFTFRONTWALL && playerStandHereQuad==RIGHTCOURTQUADRANT){
      ballAng=targetFrontWallVars.ballAng;
    }
    if (targetFrontWallQuadrant==BOTTOMLEFTFRONTWALL && playerStandHereQuad==RIGHTCOURTQUADRANT){
      ballAng=targetFrontWallVars.ballAng;
    }
    
    //radians to hit backwall quadrant
    var targetBackWallVars=GradientShotToBackWall(PlayerClass.x,PlayerClass.y);
    var ballAng;
    var playerStandHereQuad=targetBackWallVars.playerOnThisCourtQuad;
    var targetBackWallQuadrant=targetBackWallVars.tgtBackWall;
    
    if(targetBackWallQuadrant==RIGHTBACKWALL && playerStandHereQuad==RIGHTCOURTQUADRANT){
      ballAng=Math.PI/2
      //console.log("ballAimRight playerisRight straight back")
    }
    if(targetBackWallQuadrant==LEFTBACKWALL && playerStandHereQuad==LEFTCOURTQUADRANT){
      ballAng=Math.PI/2;
      //console.log("ballAimLeft playerisLeft straight back")
    }
    if (targetBackWallQuadrant==RIGHTBACKWALL && playerStandHereQuad==LEFTCOURTQUADRANT){
      ballAng=targetBackWallVars.ballAng;
      //console.log("ballAimRight playerisLeft ball crossing" + ballAng)
    }
    if (targetBackWallQuadrant==LEFTBACKWALL && playerStandHereQuad==RIGHTCOURTQUADRANT){
      ballAng=targetBackWallVars.ballAng;
      //console.log("ballAimLeft playerisRight ball crossing"+ ballAng)
    }

    //check ball only bounced once or none on floor before swing
    if(this.bouncedOnFloor==1 || this.bouncedOnFloor==0){
      this.ballBouncedOnFloor = true;
    } else {
      this.ballBouncedOnFloor=false;
    }
    
    //check if ball hit the floor before hitting the front wall at swing
    if(this.bouncedOnFloor==1 && this.bouncedOnFrontWall==false){
      this.ballHitFloorBeforeWall=true;  
      console.log("ball hit the floor before hitting the front wall, end of point")
      //TODO: reset? 
    } else {
      this.ballHitFloorBeforeWall=false;  
    }
    
    //check if the ball hit the tin
    Rules.checkTin();

    //swing takes place, target front or back wall

    //console.log("BouncedOnFloor:",this.bouncedOnFloor,"bouncedOnFrontWall:",this.bouncedOnFrontWall,"quadrantHit:",quadrantHit,"swingTurn:",swingTurn)
    //console.log(this.bouncedOnFloor)
    if(this.ballBouncedOnFloor && this.bouncedOnFrontWall && quadrantHit!=0 && swingTurn && this.tinHit==false && this.ballHitFloorBeforeWall==false){          
      
      if(playerSwingTurn){
        PlayerClass.swingTurn=false;  
        ComputerClass.swingTurn=true;  
      }
      if(computerSwingTurn){
        PlayerClass.swingTurn=true;  
        ComputerClass.swingTurn=false;   
      }
      this.bouncedOnFloor=0;
      this.bouncedOnFrontWall=false;
      this.bouncedOnBackWall=false;
      
      //Back Wall is a target swing
      var degreeTarget=ballAng*180/Math.PI;

      //Back Wall Swing
      if(PlayerClass.backWallClicked){
        //console.log("Aiming for back wall")
        PlayerClass.backWallClicked=false;
        var ballSpeed = magnitude(this.speedX,this.speedY);
        this.speedX=Math.cos(ballAng)*ballSpeed;
        this.speedY=Math.sin(ballAng)*ballSpeed;
        if(prevY>this.y){
          //this.speedY*=1;
          this.zv+=1;
          } else {
            this.zv+=1;  
            }
        if(this.zv<1.2){
        this.zv=1.2
        }
            console.log(quadrantHit,this.z,this.zv)

        //Front Wall Swing
        } else if (PlayerClass.frontWallClicked){
            //console.log("Aiming for front wall")
            PlayerClass.frontWallClicked=false;
            var ballSpeed = magnitude(this.speedX,this.speedY);
            this.speedX=Math.cos(ballAng)*ballSpeed;
            this.speedY=Math.sin(ballAng)*ballSpeed;

            //determine where player is on the court
            drawCourtQuadrants()

            //Front wall bottom quadrants targeted
            if(targetFrontWallQuadrant==BOTTOMLEFTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant==RIGHTTOPCOURTQUADRANT){
              this.z=0;
            }
            if(targetFrontWallQuadrant==BOTTOMLEFTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant==LEFTTOPCOURTQUADRANT){
              //done
              this.z=2;
            }
            if(targetFrontWallQuadrant==BOTTOMLEFTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant==RIGHTBOTTOMCOURTQUADRANT){
              //done
              this.z=3;
              //this.zv+=1;
            }
            if(targetFrontWallQuadrant==BOTTOMLEFTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant==LEFTBOTTOMCOURTQUADRANT){
              //done
              this.z=4;
              //this.zv+=1;
            }
            if(targetFrontWallQuadrant==BOTTOMRIGHTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant==RIGHTTOPCOURTQUADRANT){
              this.z=2;
              this.zv+=1;
            }
            if(targetFrontWallQuadrant==BOTTOMRIGHTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant==LEFTTOPCOURTQUADRANT){
              //done
              this.z=0;
            }
            if(targetFrontWallQuadrant==BOTTOMRIGHTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant==RIGHTBOTTOMCOURTQUADRANT){
              //done
              this.z=4;
            }
            if(targetFrontWallQuadrant==BOTTOMRIGHTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant==LEFTBOTTOMCOURTQUADRANT){
              //done
              this.z=5;
            }
            //safety catch to avoid the ball running too low
            if(this.zv<0.75 && PlayerClass.playerStandingOnCourtQuadrant==LEFTBOTTOMCOURTQUADRANT){
            this.zv=0.75
            }
            if(this.zv<0.75 && PlayerClass.playerStandingOnCourtQuadrant==RIGHTBOTTOMCOURTQUADRANT){
            this.zv=0.75
            }
            if(this.zv<0.5 && PlayerClass.playerStandingOnCourtQuadrant==RIGHTTOPCOURTQUADRANT){
            this.zv=0.5
            }
            if(this.zv<0.5 && PlayerClass.playerStandingOnCourtQuadrant==RIGHTTOPCOURTQUADRANT){
            this.zv=0.5
            }

            //Front wall top quadrants targeted
             if(targetFrontWallQuadrant==TOPLEFTFRONTWALL || targetFrontWallQuadrant==TOPRIGHTFRONTWALL){
              this.zv+=0.5;
              if(this.zv<0.5 && PlayerClass.playerStandingOnCourtQuadrant==RIGHTBOTTOMCOURTQUADRANT){
                this.zv=0.5
              }
            }

          } else {
        //No Wall is a target
            //console.log("not aiming for front or back walls")
            //this.z=10;
            //this.zv=0;
            //console.log(this.z)
            switch(quadrantHit){
                  
                  //todo: determine if the speedXY change leads to a different quadrant and if it does, ignore the shot there.
                  case TOPRIGHTQUADRANT:
                    if(prevY<this.y){
                    this.speedY*=-1;
                    this.zv+=1;
                    } else {
                      this.zv+=1;  
                      }
                    //safety catch to avoid the ball running too low
                    if(this.zv<0.75){
                    this.zv=0.75
                    }
                    break;
                  case TOPLEFTQUADRANT:
                    if(prevY<this.y){
                    this.speedY*=-1;
                    this.zv+=1;
                    } else {
                      this.zv+=1;  
                      }
                    //safety catch to avoid the ball running too low
                    if(this.zv<0.75){
                    this.zv=0.75
                    }
                    break;
                  case BOTTOMRIGHTQUADRANT:
                    if(prevY<this.y){
                    this.speedY*=-1;
                    this.zv+=1;
                    } else {
                      this.zv+=1;  
                      }
                    //safety catch to avoid the ball running too low
                    if(this.zv<0.75){
                    this.zv=0.75
                    }
                    break;
                  case BOTTOMLEFTQUADRANT:
                    if(prevY<this.y){
                    this.speedY*=-1;
                    this.zv+=1;
                    } else {
                      this.zv+=1;  
                      }
                    //safety catch to avoid the ball running too low
                    if(this.zv<0.75){
                    this.zv=0.75
                    }
                    break;
                  default: //shouldn't be reached
                  console.log("error, invalid quadrant squashball.js")
                    break;  
            }
        //console.log(quadrantHit,this.z,this.zv)
        }
    }
    
    //wall bouncing mechanics:
    this.zv += -ballSinkRate;
    this.z += this.zv;
    
    if(this.z>COURT_T){//hit ceiling
      this.z=COURT_T;
      this.zv*=-1;
	  Sound.bounce();
    }
    if(this.z <= 0) {
      this.zv*=-0.7;
      this.z = 0;
      this.bouncedOnFloor+=1;
	  Sound.bounce();
    }
    
    this.nextX=this.x+this.speedX;
    this.nextY=this.y+this.speedY;

    if(this.nextX<0)  {
      ComputerClass.ballAngAtBounce();
      this.speedX*=-1;
    }
    if(this.nextX>COURT_W){
      ComputerClass.ballAngAtBounce();
      this.speedX*=-1;
	  Sound.wall();
    }

    if(this.nextY<=0)  {
      ComputerClass.ballAngAtBounce();
      this.speedY*=-1;
      this.bouncedOnFrontWall=true;
	  Sound.wall();
    }
    if(this.nextY>COURT_L-2){//COURT_L reduced by two so the ball doesn't paint black on canvas outside the court
      ComputerClass.ballAngAtBounce();
      this.speedY*=-1;
      this.bouncedOnBackWall=true;
	  Sound.wall();
    }
    this.x += this.speedX;
    this.y += this.speedY;
    
    //console.log(this.y)
  }

}//end BallClass