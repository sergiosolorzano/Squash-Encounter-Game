var endPoint=false;
var endGameTimer=100;
var endGameTimerReset=100;

var Rules = function Score() {
    var self = {}
    
    self.checkBallBouncedOnce = function() {
        //if ball has bounced twice, reset
        if (BallClass.bouncedOnFloor > 1 && endPoint==false) {
            endPoint=true;
            console.log("Ball bounced twice on Floor",BallClass.bouncedOnFloor)
            self.givePoint();
            //Game.RallyReset();
            message=1;
        }

        self.checkRound();

    }

    self.checkTin = function() {
        var tinLowerLimit = 2;
        var tinUpperLimit = 5;

        if (BallClass.y <= tinLowerLimit && BallClass.z < tinUpperLimit && endPoint==false) {
            endPoint=true;
            BallClass.tinHit = true;

            //TODO: menu stuff
            console.log("HIT TIN")

            self.givePoint();
            //Game.RallyReset();
            message=2;    
            
        }
        self.checkRound();
    }

    self.checkTopRedLineLimits = function() {
            
            if (BallClass.topRedLineLimitBreached && endPoint==false) {
                endPoint=true;
                console.log("Ball Over the Top Red Line")

                self.givePoint();
                //Game.RallyReset();
                message=3;    
                
            }
            self.checkRound();
        }

//ball must hit wall before it hits the floor
    self.checkFirstBounce = function() {
        if (BallClass.bouncedOnFloor == 1 && BallClass.bouncedOnFrontWall == false && endPoint==false) {
            endPoint=true;
            BallClass.ballHitFloorBeforeWall = true;
            console.log("ball hit the floor before hitting the front wall, end of point")

            self.givePoint();
            //Game.RallyReset();
        } 
        self.checkRound();
    }

    self.checkRound = function checkRound() {
        //Players must have scored at least 9 to win
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

        if (self.player > self.score.AI) {
            message=BLUEWINS;
        } else {
            message=REDWINS;
        }
        //end round
        //TODO: WIN SCREEN
        
        if(endGameTimer>0){
            endGameTimer--;
        //    console.log("end of game at",timer);
        } else {
        self.Reset();
        BallClass.Reset();
        PlayerClass.Reset();
        ComputerClass.Reset();
        endPoint=false;
        endGameTimer=endGameTimerReset;
        returnToMenu();
        }
    }

    self.givePoint = function givePoint() {
        //crowd animation cheer
        cheerOn=true;
        timerOnCheer=0;
        
        Sound.play("crowd-cheer", false, 0.1);

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
        }

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
