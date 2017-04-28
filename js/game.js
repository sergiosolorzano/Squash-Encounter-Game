var timer=50;
var maxTimer=50;

var Game = function Game() {
    ctrl = {}

    ctrl.RallyReset = function RallyReset() {
        
        if(timer>0){
        	timer--
        } else {
	        ServeHandler.WhoServes();
	        BallClass.Reset();
	        PlayerClass.Reset();
	        ComputerClass.Reset();
	        timer=maxTimer;
	        endPoint=false;
    	}
    }

    return ctrl;
}()