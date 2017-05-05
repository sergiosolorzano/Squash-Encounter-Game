var squashcourt_withcheer = document.createElement("img");
var squashcourt_nocheer = document.createElement("img");
var ballPicBlue = document.createElement("img");
var ballPicRed = document.createElement("img");
var ballShadow = document.createElement("img");
var p1_standing = document.createElement("img");
var p1_running = document.createElement("img");
var p1_shot_bottom_left = document.createElement("img");
var p1_shot_bottom_right = document.createElement("img");
var p1_kill_shot_right = document.createElement("img");
var p1_kill_shot_left = document.createElement("img");
var p1_shot_top_right = document.createElement("img");
var p1_shot_top_left = document.createElement("img");
var p1_serve = document.createElement("img");

var p2_standing = document.createElement("img");
var p2_running = document.createElement("img");
var p2_shot_bottom_left = document.createElement("img");
var p2_shot_bottom_right = document.createElement("img");
var p2_shot_top_right = document.createElement("img");
var p2_shot_top_left = document.createElement("img");
var p2_serve = document.createElement("img");

var scorecounterbackground = document.createElement("img");
var zero = document.createElement("img");
var one = document.createElement("img");
var two = document.createElement("img");
var three = document.createElement("img");
var four = document.createElement("img");
var five = document.createElement("img");
var six = document.createElement("img");
var seven = document.createElement("img");
var eight = document.createElement("img");
var nine = document.createElement("img");

var p1_start = document.createElement("img");
var p2_start = document.createElement("img");
var serve_spin = document.createElement("img");
var p1_right_hit = document.createElement("img");
var p1_left_hit = document.createElement("img");
var p2_right_hit = document.createElement("img");
var p2_left_hit = document.createElement("img");
var p1_sprint = document.createElement("img");

var gamePlayButton = document.createElement("img");
var soundOnButton = document.createElement("img");
var soundOffButton = document.createElement("img");
var gamePauseButton = document.createElement("img");

var entryScreen = document.createElement("img");


//message board
var messageboard = document.createElement("img");

//var front_bench = document.createElement("img");


var picsToLoad=0;

function countLoadedImagesAndLaunchIfReady(){
		picsToLoad--;
		if(picsToLoad==0) {
		imageLoadingDoneSoStartGame();
		}
	}

function beginLoadingImage(imgVar, fileName){
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = "img/"+fileName;
	}

function loadImages(){
	var imageList = [
	{varName: squashcourt_withcheer, theFile: "squashcourt_with_cheer.png"},
	{varName: squashcourt_nocheer, theFile: "squashcourt_no_cheer.png"},
	{varName: ballPicBlue, theFile: "ball_sprite_6x6_blue.png"},
	{varName: ballPicRed, theFile: "ball_sprite_6x6_red.png"},
	{varName: ballShadow, theFile: "ball_shadow.png"},
	{varName: p1_shot_bottom_left, theFile: "shortsprite_p1_shot_bottom_left.png"},
	{varName: p1_shot_bottom_right, theFile: "shortsprite_p1_shot_bottom_right2.png"},
	{varName: p1_standing, theFile: "p1_standing.png"},
	{varName: p1_running, theFile: "p1_running.png"},
	{varName: p1_kill_shot_right, theFile: "sprite_p1_kill_shot_right.png"},
	{varName: p1_kill_shot_left, theFile: "sprite_p1_kill_shot_left.png"},
	{varName: p1_shot_top_right, theFile: "shortsprite_p1_shot_top_right.png"},
	{varName: p1_shot_top_left, theFile: "shortsprite_p1_shot_top_left.png"},
    {varName: p1_serve, theFile: "p1_serve.png" },
	
	{varName: p2_shot_bottom_left, theFile: "shortsprite_p2_shot_bottom_left.png"},
	{varName: p2_shot_bottom_right, theFile: "shortsprite_p2_shot_bottom_right2.png"},
	{varName: p2_standing, theFile: "p2_standing.png"},
	{varName: p2_running, theFile: "p2_running.png"},
	{varName: p2_shot_top_right, theFile: "shortsprite_p2_shot_top_right.png"},
	{varName: p2_shot_top_left, theFile: "shortsprite_p2_shot_top_left.png"},
    {varName: p2_serve, theFile: "p2_serve.png" },

	
	{varName: scorecounterbackground, theFile: "scorecounterbackground.png"},
	{varName: zero, theFile: "zero.png"},
	{varName: one, theFile: "one.png"},
	{varName: two, theFile: "two.png"},
	{varName: three, theFile: "three.png"},
	{varName: four, theFile: "four.png"},
	{varName: five, theFile: "five.png"},
	{varName: six, theFile: "six.png"},
	{varName: seven, theFile: "seven.png"},
	{varName: eight, theFile: "eight.png"},
	{varName: nine, theFile: "nine.png"},

	{varName: p1_start, theFile: "p1_start.png"},
	{varName: p2_start, theFile: "p2_start.png"},

	{varName: serve_spin, theFile: "serve_spin.png"},

	{varName: p1_right_hit, theFile: "p1_right_hit.png"},
	{varName: p1_left_hit, theFile: "p1_left_hit.png"},
	{varName: p2_right_hit, theFile: "p2_right_hit.png"},
	{varName: p2_left_hit, theFile: "p2_left_hit.png"},
	{varName: p1_sprint, theFile: "p1_sprint.png"},
	{varName: messageboard, theFile: "messageboard.png"},
	{varName: soundOnButton, theFile: "soundOnButton.png"},
	{varName: soundOffButton, theFile: "soundOffButton.png"},
	{varName: gamePlayButton, theFile: "gameplaybutton.png"},
	{varName: gamePauseButton, theFile: "gamepausebutton.png"},
	{varName: entryScreen, theFile: "entryscreen.png"}

	];

	picsToLoad = imageList.length;

	for (var i=0; i < imageList.length; i++){
		if(imageList[i].varName != undefined){
			beginLoadingImage(imageList[i].varName, imageList[i].theFile);
		} 	
	}
}