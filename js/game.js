var Game = function Game(){
	ctrl = {}

	ctrl.RallyReset = function RallyReset(){
		BallClass.Reset();
		PlayerClass.Reset();
		ComputerClass.Reset();
		playerEntry = true;
	}

	return ctrl;
}()