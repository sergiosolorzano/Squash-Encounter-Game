//ball subtle fire puff on kill shot swing
var particleKillList=[];
/*//RECT
//var PARTICLESKILLNUM=60;
//var CYCLEKILLANCHOR=5;//MINKILLCYCLE + 1*CYCLEKILLANCHOR = max cyclesKillLeft
//var MINKILLCYCLE=1;
//var MINKILLPARTICLESIZE=2;
//var GRAVITY_KILL_PER_CYCLE=0.1;*/

//circles
var PARTICLESKILLNUM=60;
var CYCLEKILLANCHOR;//MINKILLCYCLE + 1*CYCLEKILLANCHOR = max cyclesKillLeft
var MINKILLCYCLE;
var MINKILLPARTICLESIZE=2;
var GRAVITY_KILL_PER_CYCLE=0.1;

function createParticleskill(){
		for(var i=0;i<PARTICLESKILLNUM;i++){
			var particlesKillClass = new ParticlesKillClass();
			particlesKillClass.cyclesKillLeft=MINKILLCYCLE+Math.random()*CYCLEKILLANCHOR;
			particleKillList.push(particlesKillClass);

				//console.log(particlesTimer==1, particlesTimer==2,  BallClass.killParticlesActive)
				if(particlesTimer==1 || particlesTimer==2 && BallClass.killParticlesActive){
					MINKILLCYCLE=3;
					CYCLEKILLANCHOR=6;
					if(Math.random()<0.5){
						particlesKillClass.myColor="#ED1313";//red ED1313
					} else {
						particlesKillClass.myColor="#E4E418"; //yellow E4E418
					}
				}
				else {
					MINKILLCYCLE=1;
					CYCLEKILLANCHOR=4;
					if(Math.random()<0.5){
						particlesKillClass.myColor="#ED1313";//grey 7a7a7a
					} else {
						particlesKillClass.myColor="#E4E418" // grey D3D3D3
					}
				}
		}
		//console.log(MINKILLCYCLE,CYCLEKILLANCHOR,particlesKillClass.myColor)
	}


function moveAllKillParticles(){
	
		for(var i=0;i<particleKillList.length;i++){
			particleKillList[i].move();
		}
		for(var i=particleKillList.length-1;i>=0;i--){
			if(particleKillList[i].readyToRemove){
				particleKillList.splice(i,1);			
			}
		}
	}


function drawAllKillParticles(){

		for(var i=0;i<particleKillList.length;i++){
			particleKillList[i].draw();
		}
	}

function clearKillParticles(){
particleKillList=[];
}

/*function removeParticles(){
	for(var i=0;i<particleKillList.length;i++){
		particleKillList[i].readyToRemove=true;
	}
}*/

function ParticlesKillClass (){
var draw = perspectiveLocation(BallClass.x, BallClass.y, BallClass.z)
this.x=draw.x;
this.y=draw.y;
this.z=draw.z;
this.cyclesLeft;
this.myColor;
this.cyclesKillLeft;
this.velX=2-Math.random()*4;
this.velY=2-Math.random()*4;

this.readyToRemove=false;

	this.move=function(){
		this.cyclesKillLeft--;
		if(this.cyclesKillLeft <0){
			this.readyToRemove=true;
		}
		this.velY+=GRAVITY_KILL_PER_CYCLE;
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
		colorCircle(this.x,this.y-this.z,MINKILLPARTICLESIZE*this.cyclesKillLeft/(MINKILLCYCLE+CYCLEKILLANCHOR),this.myColor);
	}
}
