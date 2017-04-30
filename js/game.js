var timer=90;
var maxTimer=90;

var Game = function Game() {
    ctrl = {}

    ctrl.RallyReset = function RallyReset() {
        
        if(timer>0){
        	timer--;
        	console.log(timer)
        } else {
	        console.log("Timer run out",timer, endGameTimer);
	        ServeHandler.WhoServes();
	        BallClass.Reset();
	        PlayerClass.Reset();
	        ComputerClass.Reset();
	        endPoint=false;
    	}
    }

    return ctrl;
}()