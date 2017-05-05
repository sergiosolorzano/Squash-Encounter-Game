const ballStepsPerAnimFrame = 0;
var ballFrame = 0;
var ballFrameTimer = ballStepsPerAnimFrame;
/*
  Set the desired trail length 5 looked good initially :)
  Corrisponds with BallClass.ballDrawHistory array
*/
var ballTrailMaxLength = 5;
const BALL_H = 6;
const BALL_W = 6;

const COURT_W = 64.0;
const COURT_L = 97.0;
const COURT_T = 56.0;

var ballHeightNormal = 6;
var ballSinkRate = 0.03;
var lenghtCourt = 440;
var prevQuadrantWasAHit = false;

//kill shot particles
var killShotActive = false;//when true ball speed increases
var killShotSpeedMultiple = 2;
var particlesTimer = 0;
var particlesEndTimer = 5;

function BallClass() {

    this.Init = function () {
        this.x = ServeHandler.WhereBall();
        this.Reset();
    }

    this.Reset = function () {
        this.isVisible = false;
        this.y = COURT_L * 0.4;
        this.z = 3;
        this.zv = 1;//1.5
        this.heightOscillate = 0.0;
        this.speedX = (this.x > COURT_W * 0.5 ? -1 : 1);
        this.startSpeedY = -2;
        this.speedY = -2;
        this.backWallOnPlay = false;
        this.tinHit = false;
        this.ballHitFloorBeforeWall = false;
        this.bouncedOnFrontWall = false;
        this.bouncedOnBackWall = false;
        this.bouncedOnFloor = 0;//player can only swing on ball if it has hit the ground once
        this.ballBouncedOnFloor = false;////captures ball bounced 0 or 1 times so player can only swing on ball if it has hit the ground once
        this.topRedLineLimitBreached = false;
        this.canBeHit = true;
        this.numFramesTouchGround;
        // keeps track of the previous x,y,z coordinates drawn
        this.ballDrawHistory = [];
        //kill particles vars
        this.killParticlesActive = false;
        this.isServed = false;
        this.serveVelocityZ = 1.5;
        this.maxServeZ = 15;
    }

    this.moveBallForServe = function () {
        this.z += this.serveVelocityZ;
        if (this.z >= this.maxServeZ) {
            this.serveVelocityZ = -1.5;
        }
        else if (this.serveVelocityZ < 0 && this.z < 6) ServeHandler.ServeBall();
    }

    this.drawInAir = function () {
        var draw = perspectiveLocation(this.x, this.y, this.z)
        
        if(PlayerClass.swingTurn){
            var whichPic = ballPicBlue;    
        } else if (ComputerClass.swingTurn){
            var whichPic = ballPicRed;    
        }
        
        var ballAnimationFrames = whichPic.width / BALL_W;

        if (ballFrameTimer-- < 0) {
            ballFrameTimer = ballStepsPerAnimFrame;
            ballFrame++;
            if (ballFrame >= ballAnimationFrames) {
                ballFrame = 0;
            }
        }
        /*
          intent:
            loop through BallClass.ballDrawHistory to draw previously
            drawn ball positions with decrementing alpha transparency.

          note:
            i = this.ballDrawHistory.length - 1
            allows for only one call to this.ballDrawHistory.length
            it's not neccessary for performance, but it does end up
            being more terse than something like:
            var ballHistoryLength = this.ballDrawHistory.length;
            var i = 0; i < ballHistoryLength; ++i

            When order doesn't matter, or I have simple control of
            I favor the former option used below.
        */
        for (var i = this.ballDrawHistory.length - 1; i >= 0; --i) {

            var trailNode = this.ballDrawHistory[i],
            //setting alpha value based on current iterator %age of max trail length;
                alpha = 1 - (i + 1) / ballTrailMaxLength;
            alpha = Math.min(alpha, 0.1)//hard coding opaque to 0.1

            drawAtBaseSheetSprite(whichPic, ballFrame, trailNode.x, trailNode.y - trailNode.z, BALL_W, BALL_H, alpha);
        }

        /*
          to allow for the for loop to start at max length and decrement
          instead of start at 0 and increment below uses array.unshift
          to add the current draw position to the front of the array.

          array.pop is used to remove the last value from the array
          when its length graws to be that of the specified trailMax.
        */
        this.ballDrawHistory.unshift({ x: draw.x, y: draw.y, z: draw.z });
        if (this.ballDrawHistory.length == ballTrailMaxLength) {
            this.ballDrawHistory.pop();
        }

        drawAtBaseSheetSprite(whichPic, ballFrame, draw.x, draw.y - draw.z, BALL_W, BALL_H);
    }

    this.drawShadow = function () {
        var draw = perspectiveLocation(this.x, this.y, 0);
        drawAtBaseSheetSprite(ballShadow, 0, draw.x, draw.y, BALL_W, BALL_H);
    }

    this.moveBall = function () {
        //quadrant from where player swings
        var prevX = this.x - this.speedX;
        var prevY = this.y - this.speedY;
        var quadrantHit;
        var swingTurn;

        var herePlayerCollision = ballAtReach(PlayerClass.x, PlayerClass.y, this.x, this.y, PlayerClass.swingTurn);
        var playerSwingTurn = herePlayerCollision.canSwing;

        var hereComputerCollision = ballAtReach(ComputerClass.x, ComputerClass.y, this.x, this.y, ComputerClass.swingTurn);
        var computerSwingTurn = hereComputerCollision.canSwing;
       if (playerSwingTurn) {
            quadrantHit = herePlayerCollision.quadrant;
            swingTurn = herePlayerCollision.canSwing;
        } else {
            quadrantHit = hereComputerCollision.quadrant;
            swingTurn = hereComputerCollision.canSwing;
        }

        //check ball only bounced once or none on floor before swing
        if (this.bouncedOnFloor <= 1) {
            this.ballBouncedOnFloor = true;
        } else {
            this.ballBouncedOnFloor = false;
        }

        //run NCP and computer swing animations
        if(PlayerClass.swingTurn){
            PlayerClass.hitGraphicSelection();    
            } else if(ComputerClass.swingTurn){
            ComputerClass.hitGraphicSelection();        
            }
        

        //check ball didn't bounce on floor more than once
        Rules.checkBallBouncedOnce();

        //check if ball hit the floor before hitting the front wall at swing
        Rules.checkFirstBounce();

        //check if the ball hit the tin
        Rules.checkTin();

        //check if ball bounced over top red line
        Rules.checkTopRedLineLimits();

        //check if game over
        Rules.checkRound();

        //point reset
        if (endPoint && endGame==false) {
            //console.log(endPoint)
            Game.RallyReset();
        }

        //swing takes place

        //console.log("BouncedOnFloor:",this.bouncedOnFloor,"bouncedOnFrontWall:",this.bouncedOnFrontWall,"quadrantHit:",quadrantHit,"swingTurn:",swingTurn)
        //console.log(this.bouncedOnFloor)
        //console.log("squashball.js ",quadrantHit)

        if (this.ballBouncedOnFloor && this.bouncedOnFrontWall && quadrantHit != 0 && this.tinHit == false && this.ballHitFloorBeforeWall == false) {

            this.bouncedOnFloor = 0;
            console.log("reset bouncefloor to zero",this.bouncedOnFloor)
            this.bouncedOnFrontWall = false;
            this.bouncedOnBackWall = false;
            this.backWallOnPlay = false;
            if (PlayerClass.keyHeld_SprintAndKill && PlayerClass.swingTurn) {
                killShotActive = true;
                if (quadrantHit == TOPRIGHTQUADRANT || quadrantHit == TOPLEFTQUADRANT || quadrantHit == BOTTOMRIGHTQUADRANT || quadrantHit == BOTTOMLEFTQUADRANT) {
                    this.killParticlesActive = true;
                    particlesTimer = 0;
                    particlesEndTimer = 5;
                }
            }
            createParticles();

            //kill shot speed changes
            if (killShotActive && PlayerClass.swingTurn) {
                if (prevY < this.y) {
                    this.speedY *= -1 * killShotSpeedMultiple;
                } else {
                    this.speedY *= 1 * killShotSpeedMultiple;
                }
            }

            if (killShotActive && ComputerClass.swingTurn) {
                this.speedY = this.speedY / killShotSpeedMultiple;
                killShotActive = false;
            }

            //non-kill shot speed changes
            if (killShotActive == false) {
                if (prevY < this.y) {
                    this.speedY *= -1;
                } else {
                    this.speedY *= 1;
                }
            }

            //var degreeTarget = ballAng * 180 / Math.PI;
            //console.log(PlayerClass.backWallClicked,PlayerClass.frontWallClicked)
            //Back Wall is a target swing
            if (PlayerClass.backWallClicked && PlayerClass.isSwinging) {
                //console.log("Aiming for back wall")
                
                //radians to hit backwall quadrant
                var targetBackWallVars = GradientShotToBackWall(PlayerClass.x, PlayerClass.y);
                var ballAng;
                var playerStandHereQuad = targetBackWallVars.playerOnThisCourtQuad;
                var targetBackWallQuadrant = targetBackWallVars.tgtBackWall;

                if (targetBackWallQuadrant == RIGHTBACKWALL && playerStandHereQuad == RIGHTCOURTQUADRANT) {
                    ballAng = Math.PI / 2
                    //console.log("ballAimRight playerisRight straight back")
                }
                if (targetBackWallQuadrant == LEFTBACKWALL && playerStandHereQuad == LEFTCOURTQUADRANT) {
                    ballAng = Math.PI / 2;
                    //console.log("ballAimLeft playerisLeft straight back")
                }
                if (targetBackWallQuadrant == RIGHTBACKWALL && playerStandHereQuad == LEFTCOURTQUADRANT) {
                    ballAng = targetBackWallVars.ballAng;
                    //console.log("ballAimRight playerisLeft ball crossing" + ballAng)
                }
                if (targetBackWallQuadrant == LEFTBACKWALL && playerStandHereQuad == RIGHTCOURTQUADRANT) {
                    ballAng = targetBackWallVars.ballAng;
                    //console.log("ballAimLeft playerisRight ball crossing"+ ballAng)
                }


                this.backWallOnPlay = true;
                var ballSpeed = magnitude(this.speedX, this.speedY);
                this.speedX = Math.cos(ballAng) * ballSpeed;
                this.speedY = Math.sin(ballAng) * ballSpeed;
                if (prevY > this.y) {
                    //this.speedY*=1;
                    this.zv += 2;
                } else {
                    this.zv += 2;
                }
                if (this.zv < 2) {
                    this.zv = 2
                }
                PlayerClass.backWallClicked = false;

                //Front Wall is a target swing
            } else if (PlayerClass.frontWallClicked && PlayerClass.isSwinging) {
                //console.log("Aiming for front wall")
                //radians to hit frontwall quadrant
                var targetFrontWallVars = GradientShotToFrontWall(PlayerClass.x, PlayerClass.y);
                var ballAng;
                var playerStandHereQuad = targetFrontWallVars.playerOnThisCourtQuad;
                var targetFrontWallQuadrant = targetFrontWallVars.tgtFrontWall;
                //console.log(targetFrontWallQuadrant)

                if (targetFrontWallQuadrant == TOPRIGHTFRONTWALL && playerStandHereQuad == RIGHTCOURTQUADRANT) {
                    ballAng = 3 * Math.PI / 2
                }
                if (targetFrontWallQuadrant == BOTTOMRIGHTFRONTWALL && playerStandHereQuad == RIGHTCOURTQUADRANT) {
                    ballAng = 3 * Math.PI / 2
                }
                if (targetFrontWallQuadrant == TOPLEFTFRONTWALL && playerStandHereQuad == LEFTCOURTQUADRANT) {
                    ballAng = 3 * Math.PI / 2
                }
                if (targetFrontWallQuadrant == BOTTOMLEFTFRONTWALL && playerStandHereQuad == LEFTCOURTQUADRANT) {
                    ballAng = 3 * Math.PI / 2
                }
                if (targetFrontWallQuadrant == TOPRIGHTFRONTWALL && playerStandHereQuad == LEFTCOURTQUADRANT) {
                    ballAng = targetFrontWallVars.ballAng;
                }
                if (targetFrontWallQuadrant == BOTTOMRIGHTFRONTWALL && playerStandHereQuad == LEFTCOURTQUADRANT) {
                    ballAng = targetFrontWallVars.ballAng;
                }
                if (targetFrontWallQuadrant == TOPLEFTFRONTWALL && playerStandHereQuad == RIGHTCOURTQUADRANT) {
                    ballAng = targetFrontWallVars.ballAng;
                }
                if (targetFrontWallQuadrant == BOTTOMLEFTFRONTWALL && playerStandHereQuad == RIGHTCOURTQUADRANT) {
                    ballAng = targetFrontWallVars.ballAng;
                }
      
                var ballSpeed = magnitude(this.speedX, this.speedY);
                this.speedX = Math.cos(ballAng) * ballSpeed;
                this.speedY = Math.sin(ballAng) * ballSpeed;

                //determine where player is on the court
                drawCourtQuadrants()

                //Front wall bottom quadrants targeted
                if (targetFrontWallQuadrant == BOTTOMLEFTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant == RIGHTTOPCOURTQUADRANT) {
                    this.z = 0;
                }
                if (targetFrontWallQuadrant == BOTTOMLEFTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant == LEFTTOPCOURTQUADRANT) {
                    //done
                    this.z = 2;
                }
                if (targetFrontWallQuadrant == BOTTOMLEFTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant == RIGHTBOTTOMCOURTQUADRANT) {
                    //done
                    this.z = 3;
                    //this.zv+=1;
                }
                if (targetFrontWallQuadrant == BOTTOMLEFTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant == LEFTBOTTOMCOURTQUADRANT) {
                    //done
                    this.z = 4;
                    //this.zv+=1;
                }
                if (targetFrontWallQuadrant == BOTTOMRIGHTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant == RIGHTTOPCOURTQUADRANT) {
                    this.z = 2;
                    this.zv += 1;
                }
                if (targetFrontWallQuadrant == BOTTOMRIGHTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant == LEFTTOPCOURTQUADRANT) {
                    //done
                    this.z = 0;
                }
                if (targetFrontWallQuadrant == BOTTOMRIGHTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant == RIGHTBOTTOMCOURTQUADRANT) {
                    //done
                    this.z = 4;
                }
                if (targetFrontWallQuadrant == BOTTOMRIGHTFRONTWALL && PlayerClass.playerStandingOnCourtQuadrant == LEFTBOTTOMCOURTQUADRANT) {
                    //done
                    this.z = 5;
                }
                //safety catch to avoid the ball running too low
                if (this.zv < 0.75 && PlayerClass.playerStandingOnCourtQuadrant == LEFTBOTTOMCOURTQUADRANT) {
                    this.zv = 0.75
                }
                if (this.zv < 0.75 && PlayerClass.playerStandingOnCourtQuadrant == RIGHTBOTTOMCOURTQUADRANT) {
                    this.zv = 0.75
                }
                if (this.zv < 0.5 && PlayerClass.playerStandingOnCourtQuadrant == RIGHTTOPCOURTQUADRANT) {
                    this.zv = 0.5
                }
                if (this.zv < 0.5 && PlayerClass.playerStandingOnCourtQuadrant == RIGHTTOPCOURTQUADRANT) {
                    this.zv = 0.5
                }

                if (targetFrontWallQuadrant == TOPLEFTFRONTWALL || targetFrontWallQuadrant == TOPRIGHTFRONTWALL) {
                    this.zv += 0.5;
                    if (this.zv < 0.5 && PlayerClass.playerStandingOnCourtQuadrant == RIGHTBOTTOMCOURTQUADRANT) {
                        this.zv = 0.5
                    }
                }
                PlayerClass.frontWallClicked = false;

            } else {
                //No Wall is a target
                //console.log("not aiming for front or back walls")
                //console.log("no walls selected",quadrantHit)
                if (quadrantHit == TOPRIGHTQUADRANT || quadrantHit == TOPLEFTQUADRANT || quadrantHit == BOTTOMRIGHTQUADRANT || quadrantHit == BOTTOMLEFTQUADRANT) {
                    if (prevY < this.y) {
                        this.zv += 1;
                    } else {
                        this.zv += 1;
                    }
                }
            }//end last else
            //safety catch to avoid the ball running too low
            if (this.zv < 0.75) {
                this.zv = 0.75
            }

            if (playerSwingTurn) {
                PlayerClass.swingTurn = false;
                ComputerClass.swingTurn = true;
            }
            if (computerSwingTurn) {
                PlayerClass.swingTurn = true;
                ComputerClass.swingTurn = false;
            }
        }//end if ball bounced on the floor, was swing turn etc


        //kill particles on ball at kill shot
        if (this.killParticlesActive) {
            if (particlesTimer++ < particlesEndTimer) {
                createParticleskill();
            } else {
                this.killParticlesActive = false;
            }
        }

        //wall bouncing mechanics:
        this.zv += -ballSinkRate;
        this.z += this.zv;
        if(ComputerClass.swingTurn){
            //console.log("change",this.z,this.zv)    
        }
        
        if (this.z > COURT_T) {//hit ceiling
            this.z = COURT_T;
            this.zv *= -1;
            Sound.bounce();
        }
        if (this.z <= 0) {
            this.zv *= -0.7;
            //console.log("this.zv here before MIN",this.zv,"thisz:",this.z)
            if(PlayerClass.swingTurn){
                if (AI_Difficulty==0 || AI_Difficulty==1){
                    this.z = 2.25;
                    if(this.zv<0.8){
                        this.zv=minZVBounceValue;
                    }    
                }
            }
        
            //console.log("touch floor","speedY",this.speedY)
            if (killShotActive) {
                this.speedY = this.speedY / killShotSpeedMultiple;
                killShotActive = false;
            }
            this.bouncedOnFloor += 1;

            //console.log("bounce on floor", this.bouncedOnFloor, this.z, this.zv)
            Sound.bounce();
            createParticles();
        }

        console.log(zIsActive)
        if(this.z<=zIncreaseBackTrigger || this.z<=zIncreaseFrontTrigger){
            if(ComputerClass.swingTurn && zIsActive){
                console.log("before",this.z,this.zv)
                if(PlayerClass.playerStandingOnCourtQuadrant==RIGHTTOPCOURTQUADRANT || PlayerClass.playerStandingOnCourtQuadrant==LEFTTOPCOURTQUADRANT){
                    this.z=zIncreaseAtFront;
                    this.z=zIncreaseAtBack;
                }
                if(PlayerClass.playerStandingOnCourtQuadrant==RIGHTBOTTOMCOURTQUADRANT || PlayerClass.playerStandingOnCourtQuadrant==LEFTBOTTOMCOURTQUADRANT){
                    this.z=zIncreaseAtFront;
                    this.z=zIncreaseAtBack;
                }
                zIsActive=false;
                console.log("after",this.z)
            }
        }

        this.nextX = this.x + this.speedX;
        this.nextY = this.y + this.speedY;

        //variables to determine if ball bounces above side wall red lines
        var percTowardNear = this.y / COURT_L;
        //calcualted at Court.js checkUpperRedLine() according to visual location and fudged as Z does not account for far front wall inclination
        var farFrontWallZLimit = 42;
        var farSideWallZLimit = 60;
        var nearSideWallZLimit = 40;
        var hereSideWallZLimit = (1.0 - percTowardNear) * farSideWallZLimit + percTowardNear * nearSideWallZLimit;

        //Ball bounces on side walls
        if (this.nextX < 0) {
            createParticles();
            this.speedX *= -1;
            Sound.wall();
            //check if side wall upper red line is breached
            if (this.z > hereSideWallZLimit) {
                this.topRedLineLimitBreached = true;
            }
            if (this.zv > 0) {
                this.zv *= -0.03;//necessary for computer player projection quadratic function
            }
        }
        if (this.nextX > COURT_W) {
            createParticles();
            this.speedX *= -1;
            Sound.wall();
            if (this.z > hereSideWallZLimit) {
                this.topRedLineLimitBreached = true;
            }
            if (this.zv > 0) {
                this.zv *= -0.03;//necessary for computer player projection quadratic function
            }
        }

        if (this.nextY <= 0) {
            this.bouncedOnFrontWall = true;
            interimInterceptWalk=true;
            walkTimer=walkDelay;
            createParticles();
            Sound.wall();
            this.speedY *= -1;
            if (this.z > farFrontWallZLimit) {
                this.topRedLineLimitBreached = true;
                //console.log("ZBreachLeft!","limit: ",hereSideWallZLimit,"ballZ: ",this.z)
            }
            if (this.isServed) {
                this.isServed = false;
                this.zv *= -1.12;
                this.speedX *= 0.65; //can we change speed in one place, at reset
                this.speedY *= 1.5; //can we change speed in one place, at reset
            }
            else if (this.zv > 0) {
                this.zv *= -0.03;//necessary for computer player projection quadratic function
            }
            //delta z to calcluate #frames to touch ground or z=0
            //this.z at n =this.z+this.zv*n+(n*(n+1)/2*ballsink), where (n*(n+1)/2*ballsink derives from the triangular number sequence.
            //This generates a quadratic equation of the form n^2-n*(2*this.zv+1)-2*this.z
            
            //this.calculateLanding();
            //console.log(this.z,this.zv,root1,root2)
            //    console.log("Computer Swing turn: ", ComputerClass.swingTurn)
        }
        if (this.nextY > COURT_L) {
            //console.log("on back wall")
            this.bouncedOnBackWall = true;
            createParticles();
            Sound.wall();
            this.speedY *= -1;
            if (this.zv > 0.8) {
                this.zv *= -0.03;//necessary for computer player projection quadratic function
            } else {
                this.zv *=0.05;
            }

            if (killShotActive && this.backWallOnPlay == false) {
                this.speedY = this.speedY / killShotSpeedMultiple;
                killShotActive = false;
            }
        }

        //when walls are targeted speedXY are adjuted by magnitude and speedY may not be maintained on-going. This ensure speedY does not go below this.startSpeedY
        if (Math.abs(this.speedY) < Math.abs(this.startSpeedY)) {
            if (this.speedY < 0) {
                this.speedY = this.startSpeedY
            } else {
                this.speedY = -this.startSpeedY
            }
        }
        //console.log(this.speedY)
        //console.log(ComputerClass.swingTurn)
        //console.log(this.topRedLineLimitBreached)
        this.x += this.speedX;
        this.y += this.speedY;
    }

    this.calculateLanding = function(){
        a = -ballSinkRate;//quadratic a value
        b = this.zv;//quadratic b value
        c = this.z; //quadratic c value
        root = Math.pow(b, 2) - 4 * a * c;
        root1 = (-b + Math.sqrt(root)) / (2 * a);
        root2 = (-b - Math.sqrt(root)) / (2 * a);
        if (root1 > 0) {
            this.numFramesTouchGround = root1;
        } else {
            this.numFramesTouchGround = root2;
        }
       
        //console.log("squashball diversionX",diversionX)
        this.landingX = (this.x + (this.speedX * this.numFramesTouchGround))*(1+diversionX);
        this.landingY = (this.y + (this.speedY * this.numFramesTouchGround))*(1+diversionY);
        
        // account for wall bounces
        var ballLandingInCourt;
        do {
            ballLandingInCourt = true;
            if (this.landingX < 0) {
                this.landingX = -this.landingX;
                ballLandingInCourt = false;
            }
            if (this.landingX > COURT_W) {
                this.landingX = 2 * COURT_W - this.landingX;
                ballLandingInCourt = false;
            }
            if (this.landingY > COURT_L) {
                this.landingY = 2 * COURT_L - this.landingY;
                ballLandingInCourt = false;
            }
        } while (ballLandingInCourt == false);
    }
}//end BallClass

/*draw side wall lines: visual coordinates
function drawLines(){
    var farSideWallZLimit=60
    var nearSideWallZLimit=40
    var percTowardNear;
    var hereSideWallZLimit;
    var drawLines;
    var i;
    //console.log("helloworld")

    for(i=0;i<COURT_L;i++){
        percTowardNear = i/ COURT_L;
        hereSideWallZLimit = (1.0 - percTowardNear) * farSideWallZLimit + percTowardNear * nearSideWallZLimit;
        drawLines = perspectiveLocation(COURT_W, i, hereSideWallZLimit);
        colorRect(drawLines.x,drawLines.y-drawLines.z,3,3,"blue")
    }
}*/
