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

	var AIScore = WhatEverPeopleCallSignsThatDisplayScoresInSports.transformScoreToImages(Rules.score.AI);
	drawBitmapCenteredWithRotation(AIScore[0], 151, 40,0);
	drawBitmapCenteredWithRotation(AIScore[1], 120, 40,0);
	
	
	
	var playerScore = WhatEverPeopleCallSignsThatDisplayScoresInSports.transformScoreToImages(Rules.score.player);
	drawBitmapCenteredWithRotation(playerScore[0], 75, 40,0);
	drawBitmapCenteredWithRotation(playerScore[1], 44, 40,0);
	

}

//I'm tired, everythings is gonna get verbose af
WhatEverPeopleCallSignsThatDisplayScoresInSports = function(){
	self = {}
	self.transformScoreToImages = function(score){
		var img = ""
		//TODO: get this stuff out of global namespace
		var allImages = [
			zero,
			one,
			two,
			three,
			four,
			five,
			six,
			seven,
			eight,
			nine
		]
		var img = []
		var scoreStr = score.toString()
		//todo: a whole lot of checking >.>
		for(var i of scoreStr){
			img.push(allImages[i])			
		}
		if(img.length == 0){
			img.push(allImages[0])
		}
		if(img.length == 1){
			img.push(allImages[0])
		}

		return img
	}
	return self
}()