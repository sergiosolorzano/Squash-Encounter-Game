var Rules = function Score(){
	var self = {}
	self.check = function(){
		//if ball has bounced twice, reset
		//TODO: figure out if a point needs to be rewarded here.
		if(BallClass.bouncedOnFloor > 1){	
			self.givePoint();
			Game.RallyReset();
		} else {
			//
		}
		
	}

  	self.checkTin = function(){
	   var tinLowerLimit=2;
	   var tinUpperLimit=5;
	    
	    if (BallClass.y<=tinLowerLimit && BallClass.z<tinUpperLimit){
	      BallClass.tinHit=true;

	      //TODO: menu stuff
	      //console.log("HIT TIN")

	      self.givePoint();
	      Game.RallyReset();
	    }
	}

	//ball must hit wall before it hits the floor
	self.checkFirstBounce = function(){
		if (BallClass.bouncedOnFloor == 1 && BallClass.bouncedOnFrontWall == false) {
            BallClass.ballHitFloorBeforeWall = true;
            //console.log("ball hit the floor before hitting the front wall, end of point")

            self.givePoint();
	      	Game.RallyReset();            
        } else {
            BallClass.ballHitFloorBeforeWall = false;
        }
	}

	self.givePoint = function givePoint(){
		if(PlayerClass.swingTurn){
			self.score.AI += 1;	
		} else {
			self.score.player += 1;
		}
		//console.log(self.score);
	}

	self.Reset = function Reset(){
		self.score.player = 0;
		self.score.AI = 0;
	}

	self.score = {
		player: 0,
		AI: 0,
	}
	return self
}()