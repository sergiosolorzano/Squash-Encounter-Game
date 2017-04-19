//ball subtle puff on wall bounce
var particleList=[];
var PARTICLESNUM=35;
var CYCLEANCHOR=4;//MINCYCLE + 1*CYCLEANCHOR = max cyclesLeft
var MINCYCLE=1;
var MINPARTICLESIZE=3;
var GRAVITY_PER_CYCLE=0.1;


function createParticles(){
		for(var i=0;i<PARTICLESNUM;i++){
			var particlesClass = new ParticlesTwoClass();
			//particlesClass.x=0.5*canvas.width;
			//particlesClass.y=0.5*canvas.height;
			particlesClass.cyclesLeft=MINCYCLE+Math.random()*CYCLEANCHOR;
			particleList.push(particlesClass);
				if(Math.random()<0.5){
					particlesClass.myColor="#9C9BA0";
				} else {
					particlesClass.myColor="#888A8A"
				}
		}
	}


function moveAllParticles(){
	
		for(var i=0;i<particleList.length;i++){
			particleList[i].move();
		}
		for(var i=particleList.length-1;i>=0;i--){
			if(particleList[i].readyToRemove){
				particleList.splice(i,1);			
			}
		}
	}


function drawAllParticles(){

		for(var i=0;i<particleList.length;i++){
			particleList[i].draw();
		}
	}

/*function removeParticles(){
	for(var i=0;i<particleList.length;i++){
		particleList[i].readyToRemove=true;
	}
}*/

function ParticlesTwoClass (){
var draw = perspectiveLocation(BallClass.x, BallClass.y, BallClass.z)
this.x=draw.x;
this.y=draw.y;
this.z=draw.z;
this.myColor;
this.cyclesLeft;
this.velX=2-Math.random()*4;
this.velY=2-Math.random()*4;

this.readyToRemove=false;

	this.move=function(){
		this.cyclesLeft--;
		if(this.cyclesLeft <0){
			this.readyToRemove=true;
		}
		this.velY+=GRAVITY_PER_CYCLE;
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
		colorCircle(this.x,this.y-this.z,MINPARTICLESIZE*this.cyclesLeft/(MINCYCLE+CYCLEANCHOR),this.myColor);
		
	}
}
