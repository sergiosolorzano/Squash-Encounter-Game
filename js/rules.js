var Rules = function Score(){
	var self = {}
	self.check = function(){
		//if ball has bounced twice, reset
		//TODO: figure out if a point needs to be rewarded here.
		if(BallClass.bouncedOnFloor > 1){			
			BallClass.Reset();
			PlayerClass.Reset();
			ComputerClass.Reset();
			playerEntry = true;
		} else {
			//
		}
		
	}

	self.hello = function(){
		console.log("Hello world")
	}
	return self
}()