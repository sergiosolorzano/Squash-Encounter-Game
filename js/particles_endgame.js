//end game particles party
var particleEndGameList=[];
/*//RECT
var PARTICLESEndGameNUM=60;
var CYCLEEndGameANCHOR=5;//MINEndGameCYCLE + 1*CYCLEEndGameANCHOR = max cyclesEndGameLeft
var MINEndGameCYCLE=1;
var MINEndGamePARTICLESIZE=4;
var GRAVITY_EndGame_PER_CYCLE=0.1;*/

//circles
var PARTICLESENDGAMENUM=20;
var CYCLEENDGAMEANCHOR=20;//MINEndGameCYCLE + 1*CYCLEEndGameANCHOR = max cyclesEndGameLeft
var MINENDGAMECYCLE=20;
var MINENDGAMEPARTICLESIZE=2;
var GRAVITY_ENDGAME_PER_CYCLE=0.1;

function createParticlesEndGame(){
		for(var i=0;i<PARTICLESENDGAMENUM;i++){
			var particlesEndGameClass = new ParticlesEndGameClass();
			particlesEndGameClass.cyclesEndGameLeft=MINENDGAMECYCLE+Math.random()*CYCLEENDGAMEANCHOR;
			particleEndGameList.push(particlesEndGameClass);
			if(Math.random()<0.5){
				particlesEndGameClass.myColor="#ED1313";//red ED1313
			} else {
				particlesEndGameClass.myColor="#E4E418"; //yellow E4E418
			}
		}
}

function clearEndGameParticles(){
	particleEndGameList=[];
}

function moveAllEndGameParticles(){
	
		for(var i=0;i<particleEndGameList.length;i++){
			particleEndGameList[i].move();
		}
		for(var i=particleEndGameList.length-1;i>=0;i--){
			if(particleEndGameList[i].readyToRemove){
				particleEndGameList.splice(i,1);			
			}
		}
}

function drawAllEndGameParticles(){
		for(var i=0;i<particleEndGameList.length;i++){
			particleEndGameList[i].draw();
		}
}

/*function removeParticles(){
	for(var i=0;i<particleEndGameList.length;i++){
		particleEndGameList[i].readyToRemove=true;
	}
}*/

function ParticlesEndGameClass (){
this.x=canvas.width/2;
this.y=canvas.height/2;
this.cyclesLeft;
this.myColor;
this.cyclesEndGameLeft;
this.velX=2-Math.random()*4;
this.velY=2-Math.random()*4;

this.readyToRemove=false;

	this.move=function(){
		this.cyclesEndGameLeft--;
		if(this.cyclesEndGameLeft <0){
			this.readyToRemove=true;
		}
		this.velY+=GRAVITY_ENDGAME_PER_CYCLE;
		this.x+=this.velX;
		this.y+=this.velY;

		if(this.x<0){
			this.velX*=-1;
		}
		if (this.x>canvas.width){
			this.velX*=-1;
		}
		if(this.y<0){
			this.velY*=-1;
		}
		if(this.y>canvas.height){
			//dampen the effect at bounce on the ground. Then set this.velY below to this.velY*=-0.3;
			this.y-=this.velY;
			this.velY*=-0.3;
		}
	}

	this.draw=function(){
		colorCircle(this.x,this.y,MINENDGAMEPARTICLESIZE/**this.cyclesEndGameLeft/(MINENDGAMECYCLE+CYCLEENDGAMEANCHOR)*/,this.myColor);
	}
}
