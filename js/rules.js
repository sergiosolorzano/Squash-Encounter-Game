

var Rules = function Score() {
    var self = {}
    self.check = function() {
        //if ball has bounced twice, reset
        //TODO: figure out if a point needs to be rewarded here.
        if (BallClass.bouncedOnFloor > 1) {
            self.givePoint();
            Game.RallyReset();
        } else {
            //
        }

        self.checkRound();

    }

    self.checkTin = function() {
        var tinLowerLimit = 2;
        var tinUpperLimit = 5;

        if (BallClass.y <= tinLowerLimit && BallClass.z < tinUpperLimit) {
            BallClass.tinHit = true;

            //TODO: menu stuff
            //console.log("HIT TIN")

            self.givePoint();
            Game.RallyReset();
        }
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
            //player won
        } else {
            //AI won
        }


        //end round
        //TODO: WIN SCREEN
        self.Reset();
        returnToMenu();


    }

    //ball must hit wall before it hits the floor
    self.checkFirstBounce = function() {
        if (BallClass.bouncedOnFloor == 1 && BallClass.bouncedOnFrontWall == false) {
            BallClass.ballHitFloorBeforeWall = true;
            //console.log("ball hit the floor before hitting the front wall, end of point")

            self.givePoint();
            Game.RallyReset();
        } else {
            BallClass.ballHitFloorBeforeWall = false;
        }
    }

    self.givePoint = function givePoint() {
        cheerOn=true;
        Sound.play("crowd-cheer", false, 0.1);
        if (PlayerClass.swingTurn) {
            self.score.AI += 1;
            ServeHandler.nextServingPlayer = ServeHandler.RED;
        } else {
            self.score.player += 1;
            ServeHandler.nextServingPlayer = ServeHandler.BLUE;
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
