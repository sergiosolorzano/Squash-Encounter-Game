// SOUND SYSTEM MODULE
// by Christer "McFunkypants" Kaitila for http://gamkedo.com

// Requires https://github.com/goldfire/howler.js

"use strict";

var SoundSystem = (function () {

	var mute = false;	// if true ignore all play()
	var music = null;	// one looping Howl() object
  	var sounds = [];	// an array of Howl() objects

	var play = function(samplename,looping,vol) 
	{
		if (mute) return;
		if (looping==null) looping = false;
		if (vol==null) vol = 1;

		if (!sounds[samplename]) // downloads on demand once only
		{
			// src array is filenames to try in what order
			// every new browser supports .webm, 
			// older ones like mp3 or ogg but not both
			sounds[samplename] = new Howl({
				src: [
					'audio/'+samplename+'.mp3',
					'audio/'+samplename+'.ogg',
					'audio/'+samplename+'.webm'],
				loop: looping,
				volume: vol
			});
		}
		
		sounds[samplename].play();
	}
	
	var init = function()
	{
		// TODO: normally a game should not auto play sound but 
		play("music",true,0.5); // looping quite music
		
		// test voiceover intro
		//play("Wendy_B_Loon_Intro_Cinematic_VO"); // once only
	}
	
	init();
	
})();

