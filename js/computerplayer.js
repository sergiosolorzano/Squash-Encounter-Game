var computerStepsPerAnimFrame = 2;
var computerFrameTimer = 2;
var computerFrame = 0;

var initComputerStepsPerAnimFrame = 5;//for players entry only
var initComputerFrameTimer = 5;//how quick it changes between frames; for players entry only
var COMPUTER_MOVE_SPEED = 2.8;


function ComputerClass() {

    this.Init = function () {
        this.Reset();
        //this.initDrawPlayer();
    }

    this.Reset = function () {
        this.prevX = 0;
        this.prevY = 0;
        this.x = COURT_W * 0.84;
        this.y = initYPosition;
        this.isSwinging = false;//used so player does not run if gif showing it's swinging the racket
        this.swingTurn = (ServeHandler.servingPlayer === ServeHandler.RED ? false : true);
        this.speedX = 0;
        this.speedY = 0;
        this.isHit = false;
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
            ServeHandler.WhoServes();
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
            this.whichPic = p2_standing;
            this.isSwinging = false;
            computerFrameTimer = 2
            computerStepsPerAnimFrame = 2
        }
        drawAtBaseSheetSprite(this.whichPic, computerFrame, drawLocation.x, drawLocation.y, PLAYER_W, PLAYER_H);
        if(debugTarget)
            colorCircle(debugTarget.x, debugTarget.y - debugTarget.z, 3, "green")
    }
    var debugTarget;
    this.movePlayer = function () {
        var nextX = this.x;
        var nextY = this.y;
        var computerSpeed;
        var playerGotoX;
        var playerGotoY;

        this.hitGraphicSelection();
        if (this.isHit) {
            return;
        }

        if (this.swingTurn && BallClass.bouncedOnFrontWall) {
            playerGotoX = BallClass.landingX;
            playerGotoY = BallClass.landingY;
        } else { // run to T
            playerGotoX = T_ONCOURT_W;
            playerGotoY = T_ONCOURT_L;
        }

        debugTarget = perspectiveLocation(playerGotoX, playerGotoY, 0)

        var distToGoX = playerGotoX-this.x;
        var distToGoY = playerGotoY-this.y;
        var atanResult = Math.atan2(distToGoY, distToGoX);//radians
        var distToGoal = magnitude(distToGoX, distToGoY);

        if (distToGoal <= COMPUTER_MOVE_SPEED) {
            this.speedX = 0;
            this.speedY = 0;
        } else {
            this.speedX = Math.cos(atanResult) * COMPUTER_MOVE_SPEED;
            this.speedY = Math.sin(atanResult) * COMPUTER_MOVE_SPEED;
        }

        nextX += this.speedX;
        nextY += this.speedY;
        //console.log("where it goes:",this.speedX)

        this.x = nextX;
        this.y = nextY;
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

        if (ballBouncedOnFloor && BallClass.bouncedOnFrontWall && quadrantHit != 0 && this.swingTurn && BallClass.tinHit == false && BallClass.ballHitFloorBeforeWall == false) {
            switch (quadrantHit) {
                case TOPRIGHTQUADRANT:
                    this.isSwinging = true;
                    Sound.hit();
                    if (player1IsAtReachNow) {
                        if (this.x > PlayerClass.x) {
                            PlayerClass.whichPic = p1_left_hit;
                        } else {
                            PlayerClass.whichPic = p1_right_hit;
                        }
                        playerFrameTimer = 10
                        playerStepsPerAnimFrame = 10
                    }
                    this.whichPic = p2_shot_top_right;
                    break;
                case TOPLEFTQUADRANT:
                    this.isSwinging = true;
                    Sound.hit();
                    if (player1IsAtReachNow) {
                        if (this.x > PlayerClass.x) {
                            PlayerClass.whichPic = p1_left_hit;
                        } else {
                            PlayerClass.whichPic = p1_right_hit;
                        }
                        playerHit = true;
                        playerFrameTimer = 10
                        playerStepsPerAnimFrame = 10
                    }
                    this.whichPic = p2_shot_top_left;
                    break;
                case BOTTOMRIGHTQUADRANT:
                    this.isSwinging = true;
                    Sound.hit();
                    if (player1IsAtReachNow) {
                        if (this.x > PlayerClass.x) {
                            PlayerClass.whichPic = p1_left_hit;
                        } else {
                            PlayerClass.whichPic = p1_right_hit;
                        }
                        playerHit = true;
                        playerFrameTimer = 10
                        playerStepsPerAnimFrame = 10
                    }
                    this.whichPic = p2_shot_bottom_right;
                    break;
                case BOTTOMLEFTQUADRANT:
                    this.isSwinging = true;
                    Sound.hit();
                    if (player1IsAtReachNow) {
                        if (this.x > PlayerClass.x) {
                            PlayerClass.whichPic = p1_left_hit;
                        } else {
                            PlayerClass.whichPic = p1_right_hit;
                        }
                        playerHit = true;
                        playerFrameTimer = 10
                        playerStepsPerAnimFrame = 10
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

