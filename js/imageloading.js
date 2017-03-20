var squashcourt = document.createElement("img");
var ballPic = document.createElement("img");
var ballShadow = document.createElement("img");
var p1_standing = document.createElement("img");
var p1_running = document.createElement("img");
var p1_shot_bottom_left = document.createElement("img");
var p1_shot_bottom_right = document.createElement("img");
var p1_sprint_shot_down_right = document.createElement("img");
var p1_shot_top_right = document.createElement("img");
var p1_shot_top_left = document.createElement("img");

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
	{varName: squashcourt, theFile: "squashcourt4.png"},
	{varName: ballPic, theFile: "ball_sprite_6x6.png"},
	{varName: ballShadow, theFile: "ball_shadow.png"},
	{varName: p1_shot_bottom_left, theFile: "sprite_p1_shot_bottom_left.png"},
	{varName: p1_shot_bottom_right, theFile: "sprite_p1_shot_bottom_right_v2.png"},
	{varName: p1_standing, theFile: "p1_standing.png"},
	{varName: p1_running, theFile: "p1_running.png"},
	{varName: p1_sprint_shot_down_right, theFile: "sprite_p1_sprint_shot_down_right_v2.png"},
	{varName: p1_shot_top_right, theFile: "sprite_p1_shot_top_right_v2.png"},
	{varName: p1_shot_top_left, theFile: "sprite_p1_shot_top_left.png"}
	];

	picsToLoad = imageList.length;

	for (var i=0; i < imageList.length; i++){
		if(imageList[i].varName != undefined){
			beginLoadingImage(imageList[i].varName, imageList[i].theFile);
		} 	
	}
}