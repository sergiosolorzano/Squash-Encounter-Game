var computerStepsPerAnimFrame = 2;
var computerFrameTimer = 2;
var computerFrame = 0;

var initComputerStepsPerAnimFrame = 5;//for players entry only
var initComputerFrameTimer = 5;//how quick it changes between frames; for players entry only
var COMPUTER_MOVE_SPEED;
var zIsActive=false;

//computer AI level variables
var interimInterceptWalk=false;//computer AI does not intercept straight line
var walkDelay;
var walkTimer=walkDelay;
//interim step to intercept
var diversionX;
var diversionY;
var runningToT=false;
var minZVBounceValue;//increase of zv when ball too low for player only
var zIncreaseAtFront;//increase of z when ball too low for player only at front court quadrants
var zIncreaseAtBack;//increase of z when ball too low for player only at back court quadrants
var staminaRecharge;
var runToTActive=true;
var PLAYERSWINGBUFFER;
var COMPUTERSWINGREDUCTION;
var minZandZV=false;
var minZ;
var zSafety=false;


function ComputerClass() {

    this.Init = function () {
        this.x = (ServeHandler.flipPos < 0 ? ServeHandler.LEFT_SQUARE : ServeHandler.RIGHT_SQUARE);
        this.Reset();
        //this.initDrawPlayer();
    }

    this.Reset = function () {
        this.prevX = 0;
        this.prevY = 0;
        this.y = initYPosition;
        this.isSwinging = false;//used so player does not run if gif showing it's swinging the racket
        this.swingTurn = (ServeHandler.servingPlayer === ServeHandler.RED ? false : true);
        this.speedX = 0;
        this.speedY = 0;
        this.playerStandingOnCourtQuadrant=CPURIGHTBOTTOMCOURTQUADRANT;
        this.isHit = false;

        if(AI_Difficulty == 0){
            COMPUTER_MOVE_SPEED=1.75;
            walkDelay=15;
            diversionLevelX=0.2;
            diversionLevelY=0.2;
            minZandZV=true;
            minZVBounceValue=0.8;
            minZ=2.25;
            PLAYERSWINGBUFFER=6;//HITSQUAREW*.5
            COMPUTERSWINGREDUCTION=2;
            zIncreaseBackTrigger=5;
            zIncreaseAtBack=6.5;
            zIncreaseFrontTrigger=2;
            zIncreaseAtFront=5.5;
            staminaRecharge=0.5;
            runToTActive=false;
        }
        if(AI_Difficulty == 1){
            COMPUTER_MOVE_SPEED=2;
            walkDelay=12;
            diversionLevelX=0.2;
            diversionLevelY=0.2;
            minZandZV=true;
            minZVBounceValue=0.8;
            minZ=2.25;
            PLAYERSWINGBUFFER=3;//HITSQUAREW*.3
            COMPUTERSWINGREDUCTION=1;
            zIncreaseBackTrigger=5;
            zIncreaseAtBack=6.5;
            zIncreaseFrontTrigger=2;
            zIncreaseAtFront=5.5;
            staminaRecharge=0.4;
            runToTActive=true;
        }
        if(AI_Difficulty == 2){
            COMPUTER_MOVE_SPEED=2.5;
            walkDelay=0;
            diversionLevelX=0.0;
            diversionLevelY=0.0;
            minZandZV=false;
            minZVBounceValue=0.8;
            minZ=2.25;
            PLAYERSWINGBUFFER=0;//HITSQUAREW*0
            COMPUTERSWINGREDUCTION=0;
            staminaRecharge=0.25;
            zIncreaseBackTrigger=0.01;
            zIncreaseAtBack=8;
            zIncreaseFrontTrigger=0.01;
            zIncreaseAtFront=5.5;
            runToTActive=true;
        }
    }

    this.initDrawPlayer = function () {
        this.whichPic = p2_start;
        var drawLocation = perspectiveLocation(this.x, this.y, 0);
        var computerAnimationFrames = this.whichPic.width / PLAYER_W;
        //console.log(computerFrameTimer)

        if (initComputerFrameTimer-- < 0) {
            initComputerFrameTimer = initComputerStepsPerAnimFrame;
            computerFrame++;
        }
        if (computerFrame >= computerAnimationFrames) {
            computerFrame = 0;
            playerEntry = false;
            ServeHandler.matchStart = true;
            ServeHandler.RedServes();
            this.whichPic = p2_standing;
            this.isSwinging = false;
        }
        drawAtBaseSheetSprite(this.whichPic, computerFrame, drawLocation.x, drawLocation.y, PLAYER_W, PLAYER_H);
    }

    this.drawPlayer = function () {
        var drawLocation = perspectiveLocation(this.x, this.y, 0);
        var computerAnimationFrames = this.whichPic.width / PLAYER_W;

        if (computerFrameTimer-- < 0) {
            computerFrameTimer = computerStepsPerAnimFrame;
            computerFrame++;
        }
        if (computerFrame >= computerAnimationFrames) {
            computerFrame = 0;
            this.isHit = false;
            if(endGame==false){
            this.whichPic = p2_standing;
            }
            opponentAtReach = false;
            this.isSwinging = false;
            computerFrameTimer = 2;
            computerStepsPerAnimFrame = 2;
        }
        drawAtBaseSheetSprite(this.whichPic, computerFrame, drawLocation.x, drawLocation.y, PLAYER_W, PLAYER_H);
        
        /*var debugColor;
        if(interimInterceptWalk){
            debugColor="green"
        } else {
            debugColor="magenta"
        }
        
        if (debugTarget)
            colorCircle(debugTarget.x, debugTarget.y - debugTarget.z, 3, debugColor)
        

        if (debugTarget)
            colorCircle(debugTarget.x, debugTarget.y - debugTarget.z, 3, "green")*/
    }
//var debugTarget=false;
    
    this.movePlayer = function () {
        var nextX = this.x;
        var nextY = this.y;
        var computerSpeed;
        var playerGotoX;
        var playerGotoY;
        var computerRunning = false;

        if (this.isSwinging || this.isHit) {
            return;
        }

        if(interimInterceptWalk && this.swingTurn && runningToT==false){
            diversionX=diversionLevelX;
            diversionY=diversionLevelY;
        } else {
            diversionX=0.0;
            diversionY=0.0;
            BallClass.calculateLanding();
        } 

        //console.log(COMPUTER_MOVE_SPEED,walkDelay,diversionX,diversionY)
        
        if (this.swingTurn && BallClass.bouncedOnFrontWall) {
            runningToT=false;
            if(walkTimer--<0){
                BallClass.calculateLanding();
                playerGotoX = BallClass.landingX;
                playerGotoY = BallClass.landingY;
                //console.log("im not targeting T")
            } else {
                
            }
        } else { // run to T
            runningToT=true;
            if(runToTActive){
                playerGotoX = T_ONCOURT_W;
                playerGotoY = T_ONCOURT_L;    
            } else {
                playerGotoX=this.x;
                playerGotoY=this.y;
            }
            
            //console.log("Target T")
        }

        debugTarget = perspectiveLocation(playerGotoX, playerGotoY, 0)
        //console.log("diversionX",diversionX,"runningToT",runningToT,"interimInterceptWalk",interimInterceptWalk,"this.swingTurn",this.swingTurn,"BouncedFrontWall",BallClass.bouncedOnFrontWall)
        var distToGoX = playerGotoX - this.x;
        var distToGoY = playerGotoY - this.y;
        var atanResult = Math.atan2(distToGoY, distToGoX);//radians
        var distToGoal = magnitude(distToGoX, distToGoY);
        //console.log(interimInterceptWalk)
        if (distToGoal <= COMPUTER_MOVE_SPEED) {
            this.speedX = 0;
            this.speedY = 0;
            if(runningToT==false){
                interimInterceptWalk=false;
            }
            
            //console.log("dist < Speed",interimInterceptWalk,diversionX,BallClass.landingX,distToGoX,distToGoal)
        } else {
            this.speedX = Math.cos(atanResult) * COMPUTER_MOVE_SPEED;
            this.speedY = Math.sin(atanResult) * COMPUTER_MOVE_SPEED;
            //console.log("dist > Speed",interimInterceptWalk,diversionX,BallClass.landingX,playerGotoX,this.swingTurn,BallClass.bouncedOnFrontWall,walkTimer,distToGoX,distToGoal,playerGotoX)
        }

        if (!BallClass.isServed && walkTimer<0) {
            nextX += this.speedX;
            nextY += this.speedY;

            computerRunning = (nextX != this.x);
        }

        if (computerRunning && this.isSwinging == false) {
            this.whichPic = p2_running;
        }

        if (nextX >= 0 && nextX <= COURT_W) {
            this.x = nextX;
          //  console.log("im walkingW")
        }
        if (nextY >= 0 && nextY <= COURT_L - 9) {//COURT_L reduced by two so the ball doesn't go outside court. Can't change COURT_L as all front/back wall and court quadrants are measured according to original
            this.y = nextY;
        //console.log("im walkingL")
            //console.log(this.y)
        }
    }

    this.hitGraphicSelection = function () {
        var hereCollision = ballAtReach(this.x, this.y, BallClass.x, BallClass.y);
        var quadrantHit = hereCollision.quadrant;
        var player1IsAtReach = playerAtReach(this.x, this.y, PlayerClass.x, PlayerClass.y);
        var player1IsAtReachNow = player1IsAtReach.oppAtReach;

        //check ball only bounced once or none on floor before swing
        if (BallClass.bouncedOnFloor == 1 || BallClass.bouncedOnFloor == 0) {
            ballBouncedOnFloor = true;
        } else {
            ballBouncedOnFloor = false;
        }

        if (ballBouncedOnFloor && BallClass.bouncedOnFrontWall && quadrantHit != 0 && this.swingTurn && BallClass.tinHit == false && BallClass.ballHitFloorBeforeWall == false && this.isHit==false) {
            this.isSwinging = true;
            computerFrameTimer = 2;
            if(AI_Difficulty==0 || AI_Difficulty==1){
                zIsActive=true;    
            }
            zSafety=true;    
            switch (quadrantHit) {
                case TOPRIGHTQUADRANT:
                    Sound.hit();
                    if (player1IsAtReachNow) {
                        PlayerClass.isHit=true;
                        if (this.x > PlayerClass.x) {
                            PlayerClass.whichPic = p1_left_hit;
                        } else {
                            PlayerClass.whichPic = p1_right_hit;
                        }
                        playerFrameTimer = 10;
                        playerStepsPerAnimFrame = 10;
                    }
                    this.whichPic = p2_shot_top_right;
                    break;
                case TOPLEFTQUADRANT:
                    Sound.hit();
                    if (player1IsAtReachNow) {
                        PlayerClass.isHit=true;
                        if (this.x > PlayerClass.x) {
                            PlayerClass.whichPic = p1_left_hit;
                        } else {
                            PlayerClass.whichPic = p1_right_hit;
                        }
                        playerFrameTimer = 10;
                        playerStepsPerAnimFrame = 10;
                    }
                    this.whichPic = p2_shot_top_left;
                    break;
                case BOTTOMRIGHTQUADRANT:
                    Sound.hit();
                    if (player1IsAtReachNow) {
                        PlayerClass.isHit=true;
                        if (this.x > PlayerClass.x) {
                            PlayerClass.whichPic = p1_left_hit;
                        } else {
                            PlayerClass.whichPic = p1_right_hit;
                        }
                        playerFrameTimer = 10;
                        playerStepsPerAnimFrame = 10;
                    }
                    this.whichPic = p2_shot_bottom_right;
                    break;
                case BOTTOMLEFTQUADRANT:
                    Sound.hit();
                    if (player1IsAtReachNow) {
                        PlayerClass.isHit=true;
                        if (this.x > PlayerClass.x) {
                            PlayerClass.whichPic = p1_left_hit;
                        } else {
                            PlayerClass.whichPic = p1_right_hit;
                        }
                        playerFrameTimer = 10;
                        playerStepsPerAnimFrame = 10;
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

