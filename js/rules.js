var endPoint=false;
var endGameTimer=150;
var endGameTimerReset=150;
var endGame=false;
var partStart=10;

var Rules = function Score() {
    var self = {}
    
    self.checkBallBouncedOnce = function() {
        //if ball has bounced twice, reset
        if (BallClass.bouncedOnFloor > 1 && endPoint==false) {
            endPoint=true;
            timer=maxTimer;
            endGameTimer=endGameTimerReset;
            //console.log("Ball bounced twice on Floor",BallClass.bouncedOnFloor)
            //console.log("both timers reset",timer, endGameTimer);
            message=1;
            self.givePoint();
            //Game.RallyReset();
        }
//        self.checkRound();

    }

    self.checkTin = function() {
        var tinLowerLimit = 2;
        var tinUpperLimit = 4.4;
        //var drawThisLocation = perspectiveLocation(400,200,tinUpperLimit);
        //colorRect(drawThisLocation.x,drawThisLocation.y-drawThisLocation.z,80,80,"magenta");

        if (BallClass.bouncedOnFrontWall==0 && BallClass.y <= tinLowerLimit && BallClass.z < tinUpperLimit && endPoint==false) {
            endPoint=true;
            timer=maxTimer;
            endGameTimer=endGameTimerReset;
            BallClass.tinHit = true;

            //TODO: menu stuff
            //console.log("HIT TIN")
            message=2;    
            self.givePoint();
            //Game.RallyReset();
            
            
        }
        //self.checkRound();
    }

    self.checkTopRedLineLimits = function() {
            
            if (BallClass.topRedLineLimitBreached && endPoint==false) {
                endPoint=true;
                timer=maxTimer;
                endGameTimer=endGameTimerReset;
                //console.log("Ball Over the Top Red Line")
                message=OUTLINES;  
                self.givePoint();
                //Game.RallyReset();
                  
                
            }
            //self.checkRound();
        }

//ball must hit wall before it hits the floor
    self.checkFirstBounce = function() {
        if (BallClass.bouncedOnFloor == 1 && BallClass.bouncedOnFrontWall == false && endPoint==false) {
            endPoint=true;
            timer=maxTimer;
            BallClass.ballHitFloorBeforeWall = true;
            endGameTimer=endGameTimerReset;
            //console.log("ball hit the floor before hitting the front wall, end of point")
            message=FLOORBOUNCEBEFOREWALL;
            self.givePoint();
            //Game.RallyReset();
        } 
        //self.checkRound();
    }

    self.checkRound = function checkRound() {
        //Players must have scored at least 9 to win
        //clearPuffParticles();
        //clearKillParticles();
        if (self.score.player < 9 && self.score.AI < 9) {
            return;
        }

        //difference between scores must be at lease 1 point
        if (Math.abs(self.score.player - self.score.AI) < 1) {
            return;
        }
        //difference between scores must be at least 2 points, If both have at least 8 points
        if(self.score.player > 7  && self.score.AI > 7 && Math.abs(self.score.player - self.score.AI) < 2){
        	return;
        }

        if (self.score.player > self.score.AI) {
            message=BLUEWINS;
            PlayerClass.whichPic=p1_wins;
            ComputerClass.whichPic=p2_standing;
        } else {
            message=REDWINS;
            PlayerClass.whichPic=p1_standing;
            ComputerClass.whichPic=p2_wins;
        }

        
        //end round
        //TODO: WIN SCREEN
        
        createParticlesEndGame();   
        //console.log(endGame)
        BallClass.Reset();
        //console.log(endGame,endGameTimer)
        if(endGameTimer>0){
            //console.log(PlayerClass.keyHeld_Esc,"ive entered", endGameTimer)
            endGame=true;
            endGameTimer--;
            if(PlayerClass.keyHeld_Esc || PlayerClass.keyHeld_enter){
                self.Reset();
                PlayerClass.Reset();
                ComputerClass.Reset();
                endPoint=false;
                endGame=false;
                clearPuffParticles();
                clearEndGameParticles();
                clearKillParticles();
                //endGameTimer=endGameTimerReset;
                returnToMenu();
            }
            //console.log("end of game at",endGameTimer);
            //createParticles();
            
            //if(partStart--<0){
              //  particleList= [];
                
            //}
            
            
            
            

            /*var drawLocation = perspectiveLocation(this.x, this.y, 0);
            var playerAnimationFrames = this.whichPic.width / PLAYER_W;

            if (playerFrameTimer-- < 0) {
                playerFrameTimer = playerStepsPerAnimFrame;
                playerFrame++;
            }
            if (playerFrame >= playerAnimationFrames) {
                playerFrame = 0;
                this.isHit = false;
                this.isSwinging = false;
                this.whichPic = p1_standing;
                opponentAtReach = false;
                playerFrameTimer = 2
                playerStepsPerAnimFrame = 2
            }
            drawAtBaseSheetSprite(this.whichPic, playerFrame, drawLocation.x, drawLocation.y, PLAYER_W, PLAYER_H);*/
            
        } else {
        //console.log("End Game timer run out",timer, endGameTimer);
        self.Reset();
        PlayerClass.Reset();
        ComputerClass.Reset();
        endPoint=false;
        endGame=false;
        clearPuffParticles();
        clearEndGameParticles();
        clearKillParticles();
        //endGameTimer=endGameTimerReset;
        returnToMenu();
        }
    }

    self.givePoint = function givePoint() {
        //crowd animation cheer
        cheerOn=true;
        timerOnCheer=0;
        Sound.stop("crowd-cheer");
        Sound.play("crowd-cheer", false, 0.1);
        //console.log("sounding from here rules.js")
        //console.log(ServeHandler.servingPlayer)
            if (BallClass.bouncedOnFloor > 1){
                if (ServeHandler.servingPlayer == ServeHandler.RED && PlayerClass.swingTurn) {        
                    self.score.AI += 1;
                    //console.log("scen here1")
                    ServeHandler.nextServingPlayer = ServeHandler.RED;
                }
                if(ServeHandler.servingPlayer == ServeHandler.RED && ComputerClass.swingTurn){
                    //console.log("scen here2")
                    ServeHandler.nextServingPlayer = ServeHandler.BLUE;
                }
                if (ServeHandler.servingPlayer == ServeHandler.BLUE && PlayerClass.swingTurn) {        
                    //console.log("scen here3")
                    ServeHandler.nextServingPlayer = ServeHandler.RED;
                }
                if(ServeHandler.servingPlayer == ServeHandler.BLUE && ComputerClass.swingTurn){
                    //console.log("scen here4")
                    self.score.player += 1;
                    ServeHandler.nextServingPlayer = ServeHandler.BLUE;
                }
            }

            if (BallClass.tinHit || BallClass.topRedLineLimitBreached || BallClass.ballHitFloorBeforeWall){
            
                if (ServeHandler.servingPlayer == ServeHandler.RED && PlayerClass.swingTurn) {        
                    //console.log("scen here5")
                    ServeHandler.nextServingPlayer = ServeHandler.BLUE;  
                }
                if(ServeHandler.servingPlayer == ServeHandler.RED && ComputerClass.swingTurn){
                    //console.log("scen here6")
                    self.score.AI += 1;
                    ServeHandler.nextServingPlayer = ServeHandler.RED;
                }
                if (ServeHandler.servingPlayer == ServeHandler.BLUE && PlayerClass.swingTurn) {        
                    //console.log("scen here7")
                    self.score.player += 1;
                    ServeHandler.nextServingPlayer = ServeHandler.BLUE;
                }
                if(ServeHandler.servingPlayer == ServeHandler.BLUE && ComputerClass.swingTurn){
                    //console.log("scen here8")
                    ServeHandler.nextServingPlayer = ServeHandler.RED;
                }
                
            }
        



        /*if (BallClass.tinHit || BallClass.topRedLineLimitBreached || BallClass.ballHitFloorBeforeWall){
            if (ServeHandler.RED && ) {


        if (BallClass.bouncedOnFloor > 1){
            if (PlayerClass.swingTurn) {
                self.score.AI += 1;
                ServeHandler.nextServingPlayer = ServeHandler.RED;
            } else {
                self.score.player += 1;
                ServeHandler.nextServingPlayer = ServeHandler.BLUE;
            }
        }

        if (BallClass.tinHit || BallClass.topRedLineLimitBreached || BallClass.ballHitFloorBeforeWall){
            if (PlayerClass.swingTurn) {
                self.score.player += 1;
                ServeHandler.nextServingPlayer = ServeHandler.BLUE;
            } else {
                self.score.AI += 1;
                ServeHandler.nextServingPlayer = ServeHandler.RED;
            }
        }*/

        //console.log(self.score);
    }

    self.Reset = function Reset() {
        self.score.player = 0;
        self.score.AI = 0;
    }

    self.score = {
        player: 0,
        AI: 0,
    }
    return self
}()