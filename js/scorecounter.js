var COUNTER_W=220;
var COUNTER_H=110;

function drawScoreCounter(){
	var ang1=11.5*Math.PI/6;
	var ang2=4.3*Math.PI/3;
	
	//drawBitmapCenteredWithRotation(scorecounter2, 710, 475,ang1);
	//drawBitmapCenteredWithRotation(scorecounter1, 100, 475,ang2);
	//drawBitmapCenteredWithRotation(zero, 80, 456,0);
	//drawBitmapCenteredWithRotation(zero, 726, 456,0);
	drawBitmapCenteredWithRotation(scorecounterbackground, 100, 40,0);
	drawBitmapCenteredWithRotation(zero, 40, 40,0);
	drawBitmapCenteredWithRotation(three, 75, 40,0);
	drawBitmapCenteredWithRotation(zero, 125, 40,0);
	drawBitmapCenteredWithRotation(seven, 160, 40,0);

}
