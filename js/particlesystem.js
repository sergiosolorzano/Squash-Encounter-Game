

//----------------------------
//
// 	      MODULE
//
//-----------------------
//
//
var ParticleSystem = (function () {
	//
	//
	// MEMBERS
	//
	var _clusters;
  	var _canvas;
  	var _time;
  	var _msDelay;
  	var _dtCap;
  	var _presets = {};
  	//
  	var psCtx;
  	var dt;
  	var labMode;
	//
	
	//
	//
	// METHODS
	//
	var draw = function() 
	{
		var now = new Date().getTime();
		dt = now - (_time || now);
		if(dt > _dtCap) { // Ugly hack to fix the browser tab-switch timing distortion
			dt = _dtCap;
		}
    	_time = now;

    	if(labMode) {
    		psCtx.globalCompositeOperation = "source-over";
			psCtx.fillStyle = "rgba(100, 100, 100, 1.0)";
			psCtx.fillRect(0, 0, 800, 600);
			//psCtx.globalCompositeOperation = "lighter";
    	} 

		for(var i=0; i < _clusters.length; i++) {
			_clusters[i].drawShadows();
		}

		for(var i=0; i < _clusters.length; i++) {
			_clusters[i].draw();
		}
	};
	//
	var add = function(x_, y_, settings_, presetId_) 
	{
		if(typeof presetId_ !== 'undefined') {
			settings_ = typeof settings_ === 'undefined' ? _presets[presetId_] : Da.Merge(settings_, _presets[presetId_]);
		}
		var pSys = new Cluster().init(this, x_, y_, settings_);
		_clusters.push(pSys);
		return pSys;
	}; 
	var remove = function(pSys_) 
	{
		var idx = _clusters.indexOf(pSys_);
		if(idx != -1) {
			_clusters.splice(idx, 1);
		}
	};
	var clear = function()
	{
		_clusters = [];
	};
	//
	//
	var init = function(canvas_, msDelay_, labMode_) 
	{
		labMode = typeof labMode_ === 'undefined' ? false : labMode_;
		//
		_canvas = canvas_;
		_msDelay = msDelay_;
		_dtCap = msDelay_ * 3.0;
		//
		psCtx = _canvas.getContext("2d");
		_clusters = [];
	};
	var addPreset = function(id_, preset_)
	{
		_presets[id_] = preset_;
	};





//----------------------------
//
// 	   SIMPLE TOOLS
//
//-----------------------
//
//
function Da() { } 
Da.Clamp = function(value_, min_, max_) { return Math.min(Math.max(value_, min_), max_); };
Da.RGBA = function(rgb_, alpha_) { return "rgba("+rgb_[0]+", "+rgb_[1]+", "+rgb_[2]+", "+alpha_+")"; };
Da.Merge = function(cfgA_, cfgB_) 
{
	for(var key in cfgB_) {
		if(!( key in cfgA_ )) {
			cfgA_[key] = cfgB_[key];
		}
	}
	return cfgA_;
};


//--------------------------------------------
//
// 	particlesystem / cluster / PARTICLE
//
//---------------------------------------
//
//
function Particle() 
{
	this.cluster;
	this.alive = false;
	//
	this.radius;
	//
	this.x = 0;
	this.y = 0;	
	//
	this.vx;
	this.vy;
	this.oscStepX = 0.0;
	this.oscCtrX = 0.0;
	this.alpha;
	this.minAlpha;
	this.maxAlpha;
	this.alphaStep;
	this.alphaLoopCtr;
	this.scale = 1.0;
	this.minScale;
	this.maxScale;
	this.scaleStep;
	this.scaleLoopCtr;
	//
	this.color = [0.0, 0.0, 0.0];
	this.rgba;
	//
	this.parDot; // cache perspective location
	this.labMode;
	return this;	
} Particle.prototype.init = function(cluster_, first_) {
	//
	this.cluster = cluster_;
	if(first_) return this;
	//
	this.radius = this.cluster.getRadius();
	this.color = this.cluster.getColor();
	//
	var spawnPos = this.cluster.getSpawnPos();
	this.x = spawnPos[0];
	this.y = spawnPos[1];
	
	// Random velocity
	var vxRange = this.cluster.settings['vxRange'];
	var vyRange = this.cluster.settings['vyRange'];
	this.vx = Math.random() * (vxRange[1]-vxRange[0]) + vxRange[0];
	this.vy = Math.random() * (vyRange[1]-vyRange[0]) + vyRange[0];
	if(this.cluster.settings['xOscillate'] != null) {
		var cfg = this.cluster.settings['xOscillate'];
		this.oscStepX = cfg['step'];
		this.oscCtrX = cfg['length'] / 2.0;
	}
	// Alpha
	this.alpha = this.cluster.settings['alpha'];
	this.alphaLoopCtr = this.cluster.settings['alphaLoop'];
	if(this.cluster.settings['alphaRange'] != null) {
		this.alpha = this.cluster.settings['alphaRange'][0];
		this.minAlpha = Math.min(this.cluster.settings['alphaRange'][0], this.cluster.settings['alphaRange'][1]);
		this.maxAlpha = Math.max(this.cluster.settings['alphaRange'][0], this.cluster.settings['alphaRange'][1]);
		this.alphaStep = this.cluster.settings['alphaRange'][2];
	}	
	// Scale
	this.scaleLoopCtr = this.cluster.settings['scaleLoop'];
	if(this.cluster.settings['scaleRange'] != null) {
		this.scale = this.cluster.settings['scaleRange'][0];
		this.minScale = Math.min(this.cluster.settings['scaleRange'][0], this.cluster.settings['scaleRange'][1]);
		this.maxScale = Math.max(this.cluster.settings['scaleRange'][0], this.cluster.settings['scaleRange'][1]);
		this.scaleStep = this.cluster.settings['scaleRange'][2];
	}
	// Finalize color
	this.rgba = Da.RGBA(this.color, + this.alpha);
	//
	this.alive = true;
	this.labMode = this.cluster.system.getLabmode();
	//
	return this;
};


Particle.prototype.gradient = function()
{
	var cfg = this.cluster.settings['gradient'];
	if(cfg == null) {
		return this.rgba;
	}
	//
	var gradient = this.cluster.system.getCtx().createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius*this.scale);
	for(var i=0; i < cfg.length; i++) {
		var col = cfg[i]['color'] != null ? Da.RGBA(cfg[i]['color'], + cfg[i]['alpha']*this.alpha) : this.rgba;
		gradient.addColorStop(cfg[i]['pos'], col);	
	}
	//
	return gradient;
};

Particle.prototype.shadowGradient = function()
{
	var cfg = this.cluster.settings['shadow'];
	if(cfg['gradient'] == null) {
		return "rgba(0,0,0,1)";
	}
	//
	var scale = this.cluster.settings['shadow']['scale']*this.scale;
	var gradient = this.cluster.system.getCtx().createRadialGradient(
		this.parDot.x,
		this.parDot.y, 0,
		this.parDot.x,
		this.parDot.y, this.radius*scale);
	for(var i=0; i < cfg['gradient'].length; i++) {
		var col = cfg['gradient'][i]['color'] != null ? Da.RGBA(cfg['gradient'][i]['color'], + cfg['gradient'][i]['alpha']*cfg['alpha']) : this.rgba;
		gradient.addColorStop(cfg['gradient'][i]['pos'], col);	
	}
	//
	return gradient;
};


Particle.prototype.drawShadow = function()
{
	if(!this.alive) return;
	//
	var cfg = this.cluster.settings['shadow'];
	//
	var psCtx = this.cluster.system.getCtx();
	psCtx.beginPath();

	var x = this.x + cfg['offset'][0] + this.cluster.xOffset;
	var y = this.y + cfg['offset'][1] + this.cluster.yOffset;
	this.parDot = this.labMode ? {x:x, y:y, scaleHere:1.0} : worldCoordToParCoord(x,y);

	psCtx.fillStyle = this.shadowGradient();
	psCtx.arc(this.parDot.x, this.parDot.y, 
		this.radius*this.scale*cfg['scale']*this.parDot.scaleHere,
		Math.PI*2, false);
	psCtx.fill();
};


Particle.prototype.draw = function()
{
	if(!this.alive) {
		if(Math.random() > this.cluster.settings['spawnChance']) return;
		//
		this.init(this.cluster, false);
		return;
	}
	//
	var psCtx = this.cluster.system.getCtx();
	psCtx.beginPath();

	var x = this.x + this.cluster.xOffset;
	var y = this.y + this.cluster.yOffset;
	this.parDot = this.labMode ? { x:x, y:y, scaleHere:1.0} : worldCoordToParCoord(x,y);

	psCtx.fillStyle = this.gradient(false);
	psCtx.arc(this.parDot.x, this.parDot.y,
		this.radius*this.scale, Math.PI*2, false);
	psCtx.fill();
	//
	// Update
	var dt = this.cluster.system.getDeltatime();
	// Movement
	this.x += this.vx * dt;
	this.y += this.vy * dt;
	if(this.cluster.settings['bounds'] != null) {
		if( this.x < this.cluster.settings['bounds'][0][0] 
		 || this.y < this.cluster.settings['bounds'][0][1]
		 || this.x > this.cluster.settings['bounds'][1][0]
		 || this.y > this.cluster.settings['bounds'][1][1] ) {
			this.alive = false;
		}
	}
	if(this.oscStepX != 0) {
		var length = this.cluster.settings['xOscillate']['length'];
		var diff = this.oscStepX * dt;
		this.oscCtrX -= Math.abs(diff);
		if(this.cluster.settings['xOscillate']['smooth']) {
			diff *= 2 * Math.sin(Math.PI * ( this.oscCtrX / length ));
		}
		this.x += diff;
		if(this.oscCtrX <= 0.0) {
			this.oscStepX *= -1;
			this.oscCtrX = length;
		}
	}
	// Alpha
	if(this.cluster.settings['alphaRange'] != null) {
		this.alpha += this.alphaStep;
		this.alpha = Da.Clamp(this.alpha, this.minAlpha, this.maxAlpha);
		this.rgba = Da.RGBA(this.color, this.alpha);
		if(this.alpha == this.minAlpha || this.alpha == this.maxAlpha) {
			if(this.alphaLoopCtr == 0) {
				this.alphaStep = 0;
				this.alive = this.cluster.settings['endByAlpha'] != true;
			} else {
				this.alphaStep *= -1;
				this.alphaLoopCtr -= this.alphaLoopCtr > 0 ? 1 : 0;
			}			
		}
	}
	// Scale
	if(this.cluster.settings['scaleRange'] != null) {
		this.scale += this.scaleStep;
		this.scale = Da.Clamp(this.scale, this.minScale, this.maxScale);
		if(this.scale == this.minScale || this.scale == this.maxScale) {
			if(this.scaleLoopCtr == 0) {
				this.scaleStep = 0;
				this.alive = this.cluster.settings['endByScale'] != true;
			} else {
				this.scaleStep *= -1;
				this.scaleLoopCtr -= this.scaleLoopCtr > 0 ? 1 : 0;
			}			
		}
	}

};



//--------------------------------------------
//
// 	particlesystem / CLUSTER
//
//---------------------------------------
//
//
function Cluster() 
{
	this.system;
	this.x;
	this.y;
	this.xOffset;
	this.yOffset;
	//
	this.particles;
	//
	return this;	
} Cluster.prototype.init = function(system_, x_, y_, settings_) {
	this.system = system_;
	this.x = x_;
	this.y = y_;
	this.xOffset = 0.0;
	this.yOffset = 0.0;
	//
	settings_ = typeof settings_ === 'undefined' ? {} : settings_;
	this.settings = Da.Merge(settings_, Cluster.DefaultSettings);
	//
	var aliveCtr = this.settings['startAmount'];
	this.particles = [];
	for(var i=0; i < this.settings['maxAmount']; i++) {
		this.particles.push(new Particle().init( this, (i >= aliveCtr) ));
	}
	//
	return this;
};


Cluster.DefaultSettings = {
	'color': [255,255,255],
	'colorPicks': null,
	// 'colorPicks': [ [0.5, 255,0,0], [1.0, 0,255,0] ],
	'startAmount': 0,
	'maxAmount': 10,
	'spawnChance': 1.0,
	'fixedRadius': null,
	'minRadius': 1,
	'maxRadius': 8,
	'scatter': [0,0],
	'vxRange': [-10,10],
	'vyRange': [-10,10],
	'xOscillate': null,
	/*
	'xOscillate': { 
		'length': 20.0,
		'step': 0.1,
		'smooth': false
	 },
	*/
	'bounds': null,
	'alpha': 1.0,
	'alphaRange': null,
	'alphaLoop': 0,
	'endByAlpha': false,
	'scaleRange': null,
	'scaleLoop': 0,
	'endByScale': false,
	'gradient': [
		{ 
			'pos': 0.0,
			'color': [255,255,255],
			'alpha': 1.0
		},
		{ 
			'pos': 0.4,
			'color': [255,255,255],
			'alpha': 1.0
		},
		{ 
			'pos': 0.4,
			'color': null,
			'alpha': 1.0
		},
		{ 
			'pos': 1.0,
			'color': [0,0,0],
			'alpha': 0.0
		},
	],
	'shadow': null,
	/*
	'shadow': {
		'offset': [1,1],
		'alpha': 1.0,
		'scale': 1,
		'gradient': [
			{ 
				'pos': 0.0,
				'color': [0,0,0],
				'alpha': 0.0
			},
			{ 
				'pos': 1.0,
				'color': [0,0,0],
				'alpha': 1.0
			},
		],
	},
	*/


};


Cluster.prototype.resetWith = function(changes_, xShift_, yShift_)
{
	this.x += typeof xShift_ === 'undefined' ? 0 : xShift_;
	this.y += typeof yShift_ === 'undefined' ? 0 : yShift_;
	//
	this.settings = Da.Merge(changes_, this.settings);
	for(var i=0; i < this.particles.length; i++) {
		this.particles[i].init(this, ( i >= this.settings['startAmount'] ));
	}	
};

Cluster.prototype.switchPreset = function(presetId_, xShift_, yShift_)
{
	this.x += typeof xShift_ === 'undefined' ? 0 : xShift_;
	this.y += typeof yShift_ === 'undefined' ? 0 : yShift_;
	//
	this.settings = Da.Merge(_presets[presetId_], Cluster.DefaultSettings);
	for(var i=0; i < this.particles.length; i++) {
		this.particles[i].init(this, ( i >= this.settings['startAmount'] ));
	}	
};


Cluster.prototype.draw = function()
{
	for(var i=0; i < this.particles.length; i++) {
		this.particles[i].draw();
	}
};


Cluster.prototype.drawShadows = function()
{
	if(this.settings['shadow'] == null) return;
	//
	for(var i=0; i < this.particles.length; i++) {
		this.particles[i].drawShadow();
	}
};


Cluster.prototype.getSpawnPos = function() 
{
	var sx = this.settings['scatter'][0];
	var sy = this.settings['scatter'][1];
	return [
		this.x + (sx == 0 ? 0 : Math.random()*sx - sx/2),
		this.y + (sy == 0 ? 0 : Math.random()*sy - sy/2)
	];
};


Cluster.prototype.getRadius = function() 
{
	if(this.settings['fixedRadius'] != null) {
		return this.settings['fixedRadius'];
	}
	//
	return (Math.random()*(this.settings['maxRadius']-this.settings['minRadius']) + this.settings['minRadius']) >> 0;
};

Cluster.prototype.getColor = function() 
{
	if(this.settings['colorPicks'] != null) {
		var rndPick = Math.random();
		for(var p in this.settings['colorPicks']) {
			if(rndPick < this.settings['colorPicks'][p][0]) {
				return this.settings['colorPicks'][p].slice(1,4);
			}
		} 
	}
	//
	if(this.settings['color'] != null) {
		return this.settings['color'];
	}
	//
	var r = Math.random()*255 >> 0;
	var g = Math.random()*255 >> 0;
	var b = Math.random()*255 >> 0;
	return [r,g,b];
};




	
  	//----------------------------
	//
	// 	 MODULE INTERFACE
	//
	//-----------------------
	//
	//
	return {
	  	draw: draw,
	  	add: add,
	  	remove: remove,
	  	clear: clear,
	  	init: init,
	  	addPreset: addPreset,
	  	//
	  	getCtx: function() { return psCtx; },
	  	getDeltatime: function() { return dt / _msDelay; },
	  	getLabmode: function() { return labMode; },
	};

})();






ParticleSystem.addPreset("upwind", {
	'maxAmount': 5,
	'minRadius': 2,
	'maxRadius': 3,
	'alphaRange': [0.0, 1.0, 0.06], 
	'alphaLoop': 1,
	'endByAlpha': true, 
	'spawnChance': 0.1,
	'bounds': [
		[0,0],
		[800,600]
	],
	'color': [80,160,255],
	'gradient': null,
	'scatter': [30,30],
	'vxRange': [0,0],
	'vyRange': [-0.5,-1.5],
	'shadow': {
		'alpha': 0.1,
		'offset': [0,35],
		'scale': 3,
		'gradient': [
			{ 
				'pos': 0.0,
				'color': [0,0,0],
				'alpha': 1.0
			},
			{ 
				'pos': 1.0,
				'color': [0,0,0],
				'alpha': 0.0
			},
		],
	},
});

ParticleSystem.addPreset("downwind", {
	'maxAmount': 5,
	'minRadius': 2,
	'maxRadius': 3,
	'alphaRange': [0.0, 1.0, 0.06], 
	'alphaLoop': 1,
	'endByAlpha': true, 
	'spawnChance': 0.1,
	'bounds': [
		[0,0],
		[800,600]
	],
	'color': [220,190,60],
	'gradient': null,
	'scatter': [30,30],
	'vxRange': [0,0],
	'vyRange': [0.5,1.5],
	'shadow': {
		'alpha': 0.1,
		'offset': [0,35],
		'scale': 3,
		'gradient': [
			{ 
				'pos': 0.0,
				'color': [0,0,0],
				'alpha': 1.0
			},
			{ 
				'pos': 1.0,
				'color': [0,0,0],
				'alpha': 0.0
			},
		],
	},
});

ParticleSystem.addPreset("leftwind", {
	'maxAmount': 5,
	'minRadius': 2,
	'maxRadius': 3,
	'alphaRange': [0.0, 1.0, 0.06], 
	'alphaLoop': 1,
	'endByAlpha': true, 
	'spawnChance': 0.1,
	'bounds': [
		[0,0],
		[800,600]
	],
	'color': [64,211,80],
	'gradient': null,
	'scatter': [30,30],
	'vxRange': [-0.5,-1.5],
	'vyRange': [0,0],
	'shadow': {
		'alpha': 0.1,
		'offset': [0,35],
		'scale': 3,
		'gradient': [
			{ 
				'pos': 0.0,
				'color': [0,0,0],
				'alpha': 1.0
			},
			{ 
				'pos': 1.0,
				'color': [0,0,0],
				'alpha': 0.0
			},
		],
	},
});

ParticleSystem.addPreset("rightwind", {
	'maxAmount': 5,
	'minRadius': 2,
	'maxRadius': 3,
	'alphaRange': [0.0, 1.0, 0.06], 
	'alphaLoop': 1,
	'endByAlpha': true, 
	'spawnChance': 0.1,
	'bounds': [
		[0,0],
		[800,600]
	],
	'color': [255,64,255],
	'gradient': null,
	'scatter': [30,30],
	'vxRange': [0.5,1.5],
	'vyRange': [0,0],
	'shadow': {
		'alpha': 0.1,
		'offset': [0,35],
		'scale': 3,
		'gradient': [
			{ 
				'pos': 0.0,
				'color': [0,0,0],
				'alpha': 1.0
			},
			{ 
				'pos': 1.0,
				'color': [0,0,0],
				'alpha': 0.0
			},
		],
	},
});


ParticleSystem.addPreset("heat", {
	'maxAmount': 70,
	'minRadius': 0.5,
	'maxRadius': 6,
	'alphaRange': [1.0, 0.1, -0.01], 
	'endByAlpha': false,
	'scaleRange': [0.5, 1.2, 0.012],
	'scaleLoop': 1,
	'endByScale': true, 
	'spawnChance': 0.01,
	'bounds': [
		[0,0],
		[800,600]
	],
	'color': null,
	'colorPicks': [ [0.2, 100,20,0], [0.4, 150,0,0], [0.6, 255,51,0], [0.8, 255,100,0], [1.0, 255,255,0] ],
	
	'gradient': [
		{
			'pos': 0.0,
			'color': null,
			'alpha': 1.0,
		},
		{
			'pos': 1.0,
			'color': null,
			'alpha': 0.0,
		},
	],

	'shadow': {
		'offset': [0,0],
		'alpha': 1.0,
		'scale': 1.0,
		'gradient': [
			{ 
				'pos': 0.0,
				'color': [0,0,0],
				'alpha': 1.0
			},
			{ 
				'pos': 1.0,
				'color': [0,0,0],
				'alpha': 0.0
			},
		],
	},		
	'scatter': [25,10],
	'vxRange': [0,0],
	'vyRange': [-0.1,-0.8],
});


ParticleSystem.addPreset("twister", {
	'maxAmount': 100,
	'minRadius': 0.5,
	'maxRadius': 1.5,
	'alphaRange': [1.0, 0.01, -0.005], 
	'endByAlpha': true,
	'scaleRange': null,//[0.5, 1.2, 0.012],
	'scaleLoop': null,//1,
	'endByScale': false,//true, 
	'spawnChance': 0.01,
	'bounds': [
		[0,0],
		[800,600]
	],
	'color': [0,0,0],
	//'colorPicks': [ [0.33, 20,20,20], [0.67, 40,40,40], [1.0, 60,60,60] ],
	'colorPicks': [ [0.33, 200,200,200], [0.67, 228,228,228], [1.0, 255,255,255] ],
	'gradient': null,
	'shadow': null,	

	'scatter': [0,0],
	'vxRange': [0,0],
	'vyRange': [-0.15,-1.0],
	'xOscillate': { 
		'length': 79.0,
		'step': 2.0,
		'smooth': true
 	},
});