var timer=90;
var maxTimer=90;

var Game = function Game() {
    ctrl = {}

    ctrl.RallyReset = function RallyReset() {
        
        if(timer>0){
        	timer--
        	console.log(timer)
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