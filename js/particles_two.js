//ball subtle puff on wall bounce

var particleList=[];
var PARTICLESNUM=400;

var remX=300, remY=100;
var remW=390, remH=230;


function createParticles(){
	for(var i=0;i<PARTICLESNUM;i++){
		var particlesClass = new ParticlesTwoClass();
		particlesClass.x=Math.random()*canvas.width;
		particlesClass.y=Math.random()*canvas.height;
		particlesClass.cyclesLeft=30+Math.random()*300;
		particleList.push(particlesClass);
		//console.log(particleList.length)
		//tempParticle.x=
		//tempParticle.y=;
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
	//colorRect(remX,remY,remW,remH,'red');//to delete
	for(var i=0;i<particleList.length;i++){
		particleList[i].draw();
	}

}

function removeParticles(){
		for(var i=0;i<particleList.length;i++){
			if(particleList[i].x>remX && particleList[i].x< remX+remW && particleList[i].y>remY && particleList[i].y<remY+remH){
				particleList[i].readyToRemove=true;
			}
		//var removeIdx=Math.floor(Math.random*particleList.length);
		}
}

function ParticlesTwoClass (){
this.x;
this.y;
this.cyclesLeft;
this.velX=5-Math.random()*10;
this.velY=5-Math.random()*10;

this.readyToRemove=false;

	this.move=function(){
		this.cyclesLeft--;

		if(this.cyclesLeft <0){
			this.readyToRemove=true;
		}

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
			this.velY*=-1;
		}
	}

	this.draw=function(){
		//console.log(this.size)
		colorCircle(this.x,this.y,20*this.cyclesLeft/330,'cyan');
	}
}
