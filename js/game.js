var timer=100;
var maxTimer=100;

var Game = function Game() {
    ctrl = {}

    ctrl.RallyReset = function RallyReset() {
        BallClass.Reset();
        //console.log(PlayerClass.keyHeld_Esc)
        if(timer>0){
        	timer--;
			if(PlayerClass.keyHeld_Esc || PlayerClass.keyHeld_Enter){
				ServeHandler.WhoServes();
				PlayerClass.Reset();
		        ComputerClass.Reset();
		        timerOnCheer = 0;
                cheerOn = false;
		        endPoint=false;	
		    }
		} else {
	        //console.log("Timer run out",timer, endGameTimer);
	        ServeHandler.WhoServes();
			PlayerClass.Reset();
	        ComputerClass.Reset();
	        endPoint=false;	
    	}
    }

    return ctrl;
}()