/*
function drawUI(){
	colorText("stamina: " +  PlayerClass.sprintStamina, canvas.width-200, 50, 'red');
	console.log(PlayerClass.sprintStamina);
}
*/

function drawStaminaBar(){
	//draw bar background
	colorRect(canvas.width-100,0, 100, 20, 'LightGray');
	//draw current stamina
	colorRect(canvas.width-100,0, PlayerClass.sprintStamina, 20, 'red');
}
