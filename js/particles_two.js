//ball subtle puff on wall bounce

var particleClass = new ParticlesTwoClass();
var particleList=[];

function createParticles(){
	for(var i=0;i<50;i++){
		particleList.push(particleClass);
		particleList[i].particleRandomStartLocation();
		//console.log(particleList.length)
		//tempParticle.x=
		//tempParticle.y=;
	}
}

function moveAllParticles(){
	for(var i=0;i<particleList.length;i++){
		particleList[i].move();
	}
}

function drawAllParticles(){
	for(var i=0;i<particleList.length;i++){
		particleList[i].draw();
	}
}

function ParticlesTwoClass (){
//this.x=75;//
//this.y=75;//Math.random()*canvas.height;
this.velX=1;
this.velY=1;
	
	this.particleRandomStartLocation = function(){
		this.x=Math.random()*canvas.width;
		this.y=Math.random()*canvas.height;
	}

	this.move=function(){
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
		colorRect(this.x,this.y,8,8,'cyan');
	}
}
