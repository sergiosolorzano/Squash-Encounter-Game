var selectedMenuIndex = 0;
var menuArray = ["Play", "Squash Rules", "Controls", "Credits"];

var creditsListArray = ["Sergio - Design, Gameplay, Code","Christer - Design, Gameplay, Code","TBD"];
var curr_menuScreen = "Main"; //Rules, Credits
var menuActive = false;

function drawText(text, height){
    canvasContext.fillStyle = "grey";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 15px verdana";
    //canvasContext.fillText(text, canvas.width / 2, 490);
    canvasContext.fillText(text, canvas.width / 2, height);
}

function drawTextCustom(text, x, y){
    canvasContext.fillStyle = "grey";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 15px verdana";    
    canvasContext.fillText(text, x, y);
}


function startGame(){
    menuActive = false;
    clearInterval(menuLoop);
    setInterval(function() {
        moveAll();
        drawAll();
        }, 1000/framesPerSecond);
    loadLevel();    
}

function drawMenu(){
    clearScreen();
    drawBitmapCenteredWithRotation(squashcourt, canvas.width/2, canvas.height/2, 0);
    switch(curr_menuScreen){
        case "Credits":
        drawCredits();
        break;
        case "Squash Rules":
        drawRules();
        break;
        case "Controls":
        drawControls();
        break;
        default:
        drawMainMenu();
        break;
    }
    if(curr_menuScreen === "Main"){
        drawTextCustom("Confirm: Space", canvas.width /10*6.7, canvas.height/10*8.7);
    }else{
        drawTextCustom("Exit: Shift", canvas.width /10*3, canvas.height/10*8.7);
    }

}

function drawControls(){
    drawText("Controls");
}

function drawCredits(){
    creditsListArray.forEach(function(element, index, creditsListArray){
        drawText(element, 100+ 28*index);
    });
}

function drawRules(){
    drawText("Squash Rules", 125);
    drawText("TBD", 250);
}

function drawMainMenu(){
    
    drawText("Play", 400);
    drawText("Squash Rules", 425);
    drawText("Controls", 450);
    drawText("Credits", 475);
    canvasContext.drawImage(p2_standing,
    canvas.width / 5 *2, 350 + selectedMenuIndex * 25,
    50, 50);
}

function menuInput(keyEvent, pressed){
    
    if(keyEvent.keyCode === KEY_W){
        selectedMenuIndex-=1;
        Sound.bounce();
        if(selectedMenuIndex <0){
            selectedMenuIndex = menuArray.length -1;
        }
        
    }else if(keyEvent.keyCode === KEY_S){
        selectedMenuIndex+=1;
        Sound.bounce();
        if(selectedMenuIndex >= menuArray.length){
            selectedMenuIndex = 0;
        }

    }else if(keyEvent.keyCode === KEY_SPACE){
        if(curr_menuScreen != "Main"){
            //ignore if not on main menu
            return;
        }else{
            switch(menuArray[selectedMenuIndex]){
                case 'Play':
                Sound.wall();
                startGame();
                break;
                default:
                curr_menuScreen = menuArray[selectedMenuIndex];
                break;
            }
            console.log('Curr :'+curr_menuScreen);
        }
    }else if(keyEvent.keyCode === KEY_LEFT_SHIFT){
        console.log('Shift pressed');
        if(curr_menuScreen != 'Main'){
            curr_menuScreen = 'Main';
        }
    }
}