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
var heightChangePace = 0.04;
var ballSinkRate = 0.03;
var lenghtCourt = 440;
var prevQuadrantWasAHit = false;

function BallClass() {

    this.Init = function () {
        this.Reset();
    }

    this.Reset = function () {
        this.x = (ServeHandler.servingPlayer === ServeHandler.BLUE ? COURT_W * 0.18 : COURT_W * 0.95);
        this.y = COURT_L * 0.4;
        this.z = 0;
        this.zv = 1;//1.5
        this.heightOscillate = 0.0;
        this.speedX = -1;
        this.speedY = -2;
        this.tinHit = false;
        this.ballHitFloorBeforeWall = false;
        this.bouncedOnFrontWall = true;
        this.bouncedOnBackWall = true;
        this.bouncedOnFloor = 0;//player can only swing on ball if it has hit the ground once
        this.ballBouncedOnFloor = true;////captures ball bounced 0 or 1 times so player can only swing on ball if it has hit the ground once
        this.canBeHit = true;
        this.numFramesTouchGround;
        // keeps track of the previous x,y,z coordinates drawn
        this.ballDrawHistory = [];
    }

    this.drawInAir = function () {
        var draw = perspectiveLocation(this.x, this.y, this.z)
        var whichPic = ballPic;
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
        for ( var i = this.ballDrawHistory.length - 1; i >= 0; --i) {

          var trailNode = this.ballDrawHistory[i],
          //setting alpha value based on current iterator %age of max trail length;
              alpha = 1 - (i + 1) / ballTrailMaxLength;

          drawAtBaseSheetSprite(whichPic, ballFrame, trailNode.x, trailNode.y - trailNode.z, BALL_W, BALL_H, alpha);
        }

        /*
          to allow for the for loop to start at max length and decrement
          instead of start at 0 and increment below uses array.unshift
          to add the current draw position to the front of the array.

          array.pop is used to remove the last value from the array
          when its length graws to be that of the specified trailMax.
        */
        this.ballDrawHistory.unshift({x: draw.x, y: draw.y, z: draw.z});
        if ( this.ballDrawHistory.length == ballTrailMaxLength) {
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

        //radians to hit frontwall quadrant
        var targetFrontWallVars = GradientShotToFrontWall(PlayerClass.x, PlayerClass.y);
        var ballAng;
        var playerStandHereQuad = targetFrontWallVars.playerOnThisCourtQuad;
        var targetFrontWallQuadrant = targetFrontWallVars.tgtFrontWall;

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

        //check ball only bounced once or none on floor before swing
        if (this.bouncedOnFloor == 1 || this.bouncedOnFloor == 0) {
            this.ballBouncedOnFloor = true;
        } else {
            this.ballBouncedOnFloor = false;
        }

        //check if ball hit the floor before hitting the front wall at swing
        Rules.checkFirstBounce()

        //check if the ball hit the tin
        Rules.checkTin();

        //swing takes place, target front or back wall

        //console.log("BouncedOnFloor:",this.bouncedOnFloor,"bouncedOnFrontWall:",this.bouncedOnFrontWall,"quadrantHit:",quadrantHit,"swingTurn:",swingTurn)
        //console.log(this.bouncedOnFloor)
        if (this.ballBouncedOnFloor && this.bouncedOnFrontWall && quadrantHit != 0 && swingTurn && this.tinHit == false && this.ballHitFloorBeforeWall == false) {

            if (playerSwingTurn) {
                PlayerClass.swingTurn = false;
                ComputerClass.swingTurn = true;
            }
            if (computerSwingTurn) {
                PlayerClass.swingTurn = true;
                ComputerClass.swingTurn = false;
            }
            this.bouncedOnFloor = 0;
            this.bouncedOnFrontWall = false;
            this.bouncedOnBackWall = false;

            //Back Wall is a target swing
            var degreeTarget = ballAng * 180 / Math.PI;

            //Back Wall Swing
            if (PlayerClass.backWallClicked) {
                //console.log("Aiming for back wall")
                PlayerClass.backWallClicked = false;
                var ballSpeed = magnitude(this.speedX, this.speedY);
                this.speedX = Math.cos(ballAng) * ballSpeed;
                this.speedY = Math.sin(ballAng) * ballSpeed;
                if (prevY > this.y) {
                    //this.speedY*=1;
                    this.zv += 1;
                } else {
                    this.zv += 1;
                }
                if (this.zv < 1.2) {
                    this.zv = 1.2
                }
                //console.log(quadrantHit, this.z, this.zv)

                //Front Wall Swing
            } else if (PlayerClass.frontWallClicked) {
                //console.log("Aiming for front wall")
                PlayerClass.frontWallClicked = false;
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

                //Front wall top quadrants targeted
                if (targetFrontWallQuadrant == TOPLEFTFRONTWALL || targetFrontWallQuadrant == TOPRIGHTFRONTWALL) {
                    this.zv += 0.5;
                    if (this.zv < 0.5 && PlayerClass.playerStandingOnCourtQuadrant == RIGHTBOTTOMCOURTQUADRANT) {
                        this.zv = 0.5
                    }
                }

            } else {
                //No Wall is a target
                //console.log("not aiming for front or back walls")
                //this.z=10;
                //this.zv=0;
                //console.log(this.z)
                switch (quadrantHit) {

                    //todo: determine if the speedXY change leads to a different quadrant and if it does, ignore the shot there.
                    case TOPRIGHTQUADRANT:
                        if (prevY < this.y) {
                            this.speedY *= -1;
                            this.zv += 1;
                        } else {
                            this.zv += 1;
                        }
                        //safety catch to avoid the ball running too low
                        if (this.zv < 0.75) {
                            this.zv = 0.75
                        }
                        break;
                    case TOPLEFTQUADRANT:
                        if (prevY < this.y) {
                            this.speedY *= -1;
                            this.zv += 1;
                        } else {
                            this.zv += 1;
                        }
                        //safety catch to avoid the ball running too low
                        if (this.zv < 0.75) {
                            this.zv = 0.75
                        }
                        break;
                    case BOTTOMRIGHTQUADRANT:
                        if (prevY < this.y) {
                            this.speedY *= -1;
                            this.zv += 1;
                        } else {
                            this.zv += 1;
                        }
                        //safety catch to avoid the ball running too low
                        if (this.zv < 0.75) {
                            this.zv = 0.75
                        }
                        break;
                    case BOTTOMLEFTQUADRANT:
                        if (prevY < this.y) {
                            this.speedY *= -1;
                            this.zv += 1;
                        } else {
                            this.zv += 1;
                        }
                        //safety catch to avoid the ball running too low
                        if (this.zv < 0.75) {
                            this.zv = 0.75
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

        if (this.z > COURT_T) {//hit ceiling
            this.z = COURT_T;
            this.zv *= -1;
            Sound.bounce();
        }
        if (this.z <= 0) {
            this.zv *= -0.7;
            this.z = 0;
            this.bouncedOnFloor += 1;
            Sound.bounce();
        }

        this.nextX = this.x + this.speedX;
        this.nextY = this.y + this.speedY;
        //console.log(this.z,this.zv)
        if (this.nextX < 0) {
            this.speedX *= -1;
            if(this.zv>0){
            this.zv *= -0.03;
            }

            createParticles();
            //console.log("Computer Swing turn: ", ComputerClass.swingTurn)
        }
        if (this.nextX > COURT_W) {
            this.speedX *= -1;
            if(this.zv>0){
            this.zv *= -0.03;
            }
            createParticles();
            Sound.wall();
            //console.log("Computer Swing turn: ", ComputerClass.swingTurn)
        }

        if (this.nextY <= 0) {
            this.speedY *= -1;
            if(this.zv>0){
            this.zv *= -0.03;
            }
            this.bouncedOnFrontWall = true;
            createParticles();
            Sound.wall();
            //delta z to calcluate #frames to touch ground or z=0
            //this.z at n =this.z+this.zv*n+(n*(n+1)/2*ballsink), where (n*(n+1)/2*ballsink derives from the triangular number sequence.
            //This generates a quadratic equation of the form n^2-n*(2*this.zv+1)-2*this.z
            a = 1;//quadratic a value
            b = -2*this.zv-1;//quadratic b value
            c = -2*this.z //quadratic c value
            root=Math.pow(b,2)-4*a*c;
            root1=(-b+Math.sqrt(root))/(2*a);
            root2=(-b-Math.sqrt(root))/(2*a);
            if(root1>0){
            this.numFramesTouchGround=root1;
            } else {
            this.numFramesTouchGround=root2;
            }
            //console.log(this.z,this.zv,root1,root2)
        //    console.log("Computer Swing turn: ", ComputerClass.swingTurn)
        }
        if (this.nextY > COURT_L - 2) {//COURT_L reduced by two so the ball doesn't paint black on canvas outside the court
            this.speedY *= -1;
            if(this.zv>0){
            this.zv *= -0.03;
            }
            this.bouncedOnBackWall = true;
            createParticles();
            Sound.wall();
          //  console.log("Computer Swing turn: ", ComputerClass.swingTurn)
        }
        this.x += this.speedX;
        this.y += this.speedY;
        //console.log(this.y)
    }

}//end BallClass
