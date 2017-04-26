var playerFrame = 0;
var playerStepsPerAnimFrame = 2;
var playerFrameTimer = 2;

var initPlayerStepsPerAnimFrame = 5;//for players entry only
var initPlayerFrameTimer = 5;//how quick it changes between frames; for players entry only

const PLAYER_H = 55;
const PLAYER_W = 55;
var PLAYER_MOVE_SPEED = 2;
const SPRINT_MULTIPLER = 2.0;
const PLAYER_MAX_HEIGHT_REACH = 15;

const SPRINT_STAMINA_WHEN_TIRED = 15; // when to trigger sprint_breath sound effect

var initYPosition = COURT_L * 0.4;

var opponentAtReach = false;
var playerHit = false;
var computerHit = false;

function PlayerClass() {
    this.sprintMultiplier = 1;
    this.sprintStamina = 20;
    this.isExhausted = false;
    this.sprintCooldown = 0;

    this.keyHeld_Gas = false;
    this.keyHeld_Reverse = false;
    this.keyHeld_TurnLeft = false;
    this.keyHeld_TurnRight = false;
    //this.keyHeld_Kill = false;
    this.keyHeld_SprintAndKill = false;

    this.controlKeyUp;
    this.controlKeyRight;
    this.controlKeyDown;
    this.controlKeyLeft;
    //this.controlKeyKill;
    this.controlKeySprintAndKill;

    this.initInput = function (upKey, rightKey, downKey, leftKey, sprintAndKillKey) {
        this.controlKeyUp = upKey;
        this.controlKeyRight = rightKey;
        this.controlKeyDown = downKey;
        this.controlKeyLeft = leftKey;
        this.controlKeySprintAndKill = sprintAndKillKey;
        //this.controlKeyKill = killKey;
    }

    this.Init = function () {
        this.x = (ServeHandler.flipPos < 0? ServeHandler.RIGHT_SQUARE: ServeHandler.LEFT_SQUARE);
        this.Reset();
    }

    this.Reset = function () {
        this.y = initYPosition;
        ParticleSystem.remove(this.particles);
        this.particles = ParticleSystem.add(-14, 4, {}, "sweat");
        this.swingTurn = (ServeHandler.servingPlayer === ServeHandler.BLUE ? false : true);
        this.particles.active = false;
        this.isSwinging = false;//used so player does not run if gif showing it's swinging the racket
        this.targetBackWall = NOBACKWALLSELECTED;
        this.targetFrontWall = NOFRONTWALLSELECTED;
        this.backWallClicked = false;
        this.frontWallClicked = false;
        this.playerStandingOnCourtQuadrant = LEFTCOURTQUADRANT;
    }

    this.initDrawPlayer = function () {
        this.whichPic = p1_start;
        var drawLocation = perspectiveLocation(this.x, this.y, 0);
        var playerAnimationFrames = this.whichPic.width / PLAYER_W;

        if (initPlayerFrameTimer-- < 0) {
            initPlayerFrameTimer = initPlayerStepsPerAnimFrame;
            playerFrame++;
        }
        if (playerFrame >= playerAnimationFrames) {
            playerFrame = 0;
            this.whichPic = p1_standing;
            this.isSwinging = false;
        }
        drawAtBaseSheetSprite(this.whichPic, playerFrame, drawLocation.x, drawLocation.y, PLAYER_W, PLAYER_H);
    }

    this.drawPlayer = function () {
        
        var drawLocation = perspectiveLocation(this.x, this.y, 0);
        if (playerEntry == false) {
            var playerAnimationFrames = this.whichPic.width / PLAYER_W;

            if (playerFrameTimer-- < 0) {
                playerFrameTimer = playerStepsPerAnimFrame;
                playerFrame++;
            }
            if (playerFrame >= playerAnimationFrames) {
                playerFrame = 0;
                playerHit = false;
                this.whichPic = p1_standing;
                this.isSwinging = false;
                opponentAtReach = false;
                playerFrameTimer = 2
                playerStepsPerAnimFrame = 2
            }
            drawAtBaseSheetSprite(this.whichPic, playerFrame, drawLocation.x, drawLocation.y, PLAYER_W, PLAYER_H);
        }
    }

    this.hitGraphicSelection = function () {
        //console.log("person player:",this.swingTurn)
        var hereCollision = ballAtReach(this.x, this.y, BallClass.x, BallClass.y, this.swingTurn);
        var quadrantHit = hereCollision.quadrant;
        var computerIsAtReach = playerAtReach(this.x, this.y, ComputerClass.x, ComputerClass.y);//racket accident
        var computerIsAtReachNow = computerIsAtReach.oppAtReach;//racket accident

        //check ball only bounced once or none on floor before swing
        if (BallClass.bouncedOnFloor == 1 || BallClass.bouncedOnFloor == 0) {
            ballBouncedOnFloor = true;
        } else {
            ballBouncedOnFloor = false;
        }

        //kill shot
        if (ballBouncedOnFloor && BallClass.bouncedOnFrontWall && quadrantHit != 0 && this.swingTurn && BallClass.tinHit == false && BallClass.ballHitFloorBeforeWall == false && this.keyHeld_SprintAndKill) {
            if (quadrantHit == TOPRIGHTQUADRANT || quadrantHit == TOPLEFTQUADRANT || quadrantHit == BOTTOMRIGHTQUADRANT || quadrantHit == BOTTOMLEFTQUADRANT) {
                this.isSwinging = true;
                Sound.hit();
                if (computerIsAtReachNow) {
                    
                    if (this.x > ComputerClass.x) {
                        ComputerClass.whichPic = p2_left_hit;
                    } else {
                        ComputerClass.whichPic = p2_right_hit;
                    }
                    ComputerClass.isHit = true;
                    computerFrameTimer = 10;
                    computerStepsPerAnimFrame = 10;
                }
                    if (BallClass.x > this.x) {
                        this.whichPic = p1_kill_shot_right;
                        playerFrameTimer = 1;
                        playerStepsPerAnimFrame = 1;
                    } else {
                        this.whichPic = p1_kill_shot_left;
                        playerFrameTimer = 1;
                        playerStepsPerAnimFrame = 1;
                    }
            }
        }

        //normal automatic shot
        if (ballBouncedOnFloor && BallClass.bouncedOnFrontWall && quadrantHit != 0 && this.swingTurn && BallClass.tinHit == false && BallClass.ballHitFloorBeforeWall == false && this.keyHeld_SprintAndKill == false) {
            //console.log("swingturn:",this.swingTurn,"ballbounced:",ballBouncedOnFloor)
            switch (quadrantHit) {//maybe quadrantHit=0 in which case none called
                case TOPRIGHTQUADRANT:
                    this.isSwinging = true;
                    Sound.hit();
                    if (computerIsAtReachNow) {
                        if (this.x > ComputerClass.x) {
                            ComputerClass.whichPic = p2_left_hit;
                        } else {
                            ComputerClass.whichPic = p2_right_hit;
                        }
                        ComputerClass.isHit = true;
                        computerFrameTimer = 10
                        computerStepsPerAnimFrame = 10
                    }
                    this.whichPic = p1_shot_top_right;
                    break;
                case TOPLEFTQUADRANT:
                    this.isSwinging = true;
                    Sound.hit();
                    if (computerIsAtReachNow) {
                        if (this.x > ComputerClass.x) {
                            ComputerClass.whichPic = p2_left_hit;
                        } else {
                            ComputerClass.whichPic = p2_right_hit;
                        }
                        ComputerClass.isHit = true;
                        computerFrameTimer = 10
                        computerStepsPerAnimFrame = 10
                    }
                    this.whichPic = p1_shot_top_left;
                    break;
                case BOTTOMRIGHTQUADRANT:
                    this.isSwinging = true;
                    Sound.hit();
                    if (computerIsAtReachNow) {
                        if (this.x > ComputerClass.x) {
                            ComputerClass.whichPic = p2_left_hit;
                        } else {
                            ComputerClass.whichPic = p2_right_hit;
                        }
                        ComputerClass.isHit = true;
                        computerFrameTimer = 10
                        computerStepsPerAnimFrame = 10
                    }
                    this.whichPic = p1_shot_bottom_right;
                    break;
                case BOTTOMLEFTQUADRANT:
                    this.isSwinging = true;
                    Sound.hit();
                    if (computerIsAtReachNow) {
                        if (this.x > ComputerClass.x) {
                            ComputerClass.whichPic = p2_left_hit;
                        } else {
                            ComputerClass.whichPic = p2_right_hit;
                        }
                        ComputerClass.isHit = true;
                        computerFrameTimer = 20
                        computerStepsPerAnimFrame = 20
                    }
                    this.whichPic = p1_shot_bottom_left;
                    break;
            }
        }
    }

    this.movePlayer = function () {
        var nextX = this.x;
        var nextY = this.y;
        this.particles.active = false;

        var isPlayerMoving = (this.keyHeld_Gas || this.keyHeld_Reverse || this.keyHeld_TurnLeft || this.keyHeld_TurnRight);
        this.hitGraphicSelection();
        if (this.isSwinging == false && playerHit == false) {

            if (this.sprintCooldown > 0) {
                this.sprintCooldown--;
                this.particles.active = true;
            }
            if (this.keyHeld_SprintAndKill && isPlayerMoving) {
                this.particles.active = true;
                if (this.sprintStamina > 0 && this.sprintCooldown == 0) {
                    this.sprintMultiplier = SPRINT_MULTIPLER;
                    this.sprintStamina--;
                    console.log(this.sprintStamina)
                }
                else if (this.sprintStamina == 0) {
                    this.sprintMultiplier = 1;
                    this.sprintCooldown = 80;
                }
            } else {
                this.sprintMultiplier = 1;
                if (this.sprintStamina < 20) {
                    this.sprintStamina += 0.25;
                }
            }
            //TODO might need to reset this.sprintMultiplier

            if (this.isSwinging == false && playerHit == false) {

                if (this.keyHeld_Gas) {
                    nextY -= PLAYER_MOVE_SPEED * this.sprintMultiplier;
                    if (this.keyHeld_SprintAndKill && this.sprintStamina > 0) {
                        this.whichPic = p1_sprint;
                    } else {
                        this.whichPic = p1_running;
                    }
                }
                if (this.keyHeld_Reverse) {
                    nextY += PLAYER_MOVE_SPEED * this.sprintMultiplier;
                    this.whichPic = p1_running;
                }
                if (this.keyHeld_TurnLeft) {
                    nextX -= PLAYER_MOVE_SPEED * this.sprintMultiplier;
                    this.whichPic = p1_running;
                }
                if (this.keyHeld_TurnRight) {
                    nextX += PLAYER_MOVE_SPEED * this.sprintMultiplier;
                    this.whichPic = p1_running;
                }
                if (this.sprintStamina < SPRINT_STAMINA_WHEN_TIRED) {
                    // we do not have max stamina! we are tired! need more oxygen! =)
                    // console.log("TIRED! My sprintStamin is " + this.sprintStamina); // debug spam
                    if (!Sound.isPlaying("sprint_breath")) {
                        //console.log("Need more oxygen! Breathing!");
                        Sound.play("sprint_breath", false, 0.2);
                    }
                }
            }
        }
        //check so player doesn't go outside the court
        if (nextX >= 0 && nextX <= COURT_W) {
            this.x = nextX;
        }
        if (nextY >= 0 && nextY <= COURT_L-9) {//COURT_L reduced by two so the ball doesn't go outside court. Can't change COURT_L as all front/back wall and court quadrants are measured according to original
            this.y = nextY;
        }
        //console.log("playerX : ",this.x)
        var pLoc = perspectiveLocation(this.x, this.y, 0);
        this.particles.xOffset = pLoc.x;
        this.particles.yOffset = pLoc.y;
    }
}
