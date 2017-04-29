var selectedMenuIndex = 0;
var mainMenuArray =["Play", "Game Rules", "Scoring System", "Controls", "Credits"];
var difficultyMenu = ["Level 1", "Level 2", "Level 3"];
var menuArray= mainMenuArray;

var creditsListArray = ["Sergio - Design, Gameplay, Code", "Christer - Design, Gameplay, Code", "TBD"];
var curr_menuScreen = "Main"; //Rules, Credits
var menuActive = false;

var AI_Difficulty = 0;

function drawText(text, height) {
    canvasContext.fillStyle = "blue";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 18px Cherry Cream Soda";
    //canvasContext.fillText(text, canvas.width / 2, 490);
    canvasContext.fillText(text, canvas.width / 2, height);
}

function drawScoringText(text, height) {
    canvasContext.fillStyle = "blue";
    canvasContext.textAlign = "center";
    canvasContext.font = "18px Cherry Cream Soda";
    //canvasContext.fillText(text, canvas.width / 2, 490);
    canvasContext.fillText(text, canvas.width / 2, height);
}

function drawTextCustom(text, x, y) {
    canvasContext.fillStyle = "blue";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 18px Cherry Cream Soda";
    canvasContext.fillText(text, x, y);
}
var gameLoop;
function startGame() {
    //console.log("startgame running")
    menuActive = false;
    numFullSpins = 2;
    moreFrames = false;
    spinFrame = 0;
    drawNow=false;
    serveBet=true;
    clearInterval(menuLoop);
    message=0;
    if(menuActive==false){
        gameLoop = setInterval(function () {
            moveAll();
            drawAll();
        }, 1000 / framesPerSecond);
        loadLevel();    
    }
}
function returnToMenu(){
    curr_menuScreen="Main";
    message=0;
    playerEntry = false;
    ServeHandler.Reset();
    initInput();
    clearInterval(gameLoop);
    menuArray= mainMenuArray;
    menuLoop = setInterval(function () {
        drawMenu();
    }, 1000 / framesPerSecond);
}

function drawMenu() {
    menuActive = true;
    clearScreen();
    drawBitmapCenteredWithRotation(squashcourt_nocheer, canvas.width / 2, canvas.height / 2, 0);
    drawMessageBoard();
    //console.log("Menu Active",menuActive)
    //console.log("at returnToMenu ",curr_menuScreen)
    switch (curr_menuScreen) {
        case "Credits":
            drawCredits();
            break;
        case "Game Rules":
            drawRules();
            break;
        case "Scoring System":
            drawScoring();
            break;
        case "Controls":
            drawControls();
            break;
        case "Play":
            drawDifficultySelection();
            break;
        default:
            drawMainMenu();
            break;
    }
    if (curr_menuScreen === "Main") {
        drawTextCustom("Confirm: Space", canvas.width / 10 * 6.5, canvas.height / 10 * 8.7);
    }else if (curr_menuScreen === "Play"){
        drawTextCustom("Confirm: Space", canvas.width / 10 * 6.5, canvas.height / 10 * 8.7);
        drawTextCustom("Exit: Enter", canvas.width / 10 * 3.25, canvas.height / 10 * 8.7);
    } else {
        drawTextCustom("Exit: Enter", canvas.width / 10 * 3.25, canvas.height / 10 * 8.7);
    }
    redrawCanvas();
}

function drawDifficultySelection(){
    drawText("Level 1", 400);
    drawText("Level 2", 425);
    drawText("Level 3", 450);
    canvasContext.drawImage(p1_standing,
    canvas.width / 5.8 * 2, 350 + selectedMenuIndex * 25,
    50, 50);
    canvasContext.drawImage(p2_standing,
    canvas.width / 3.3 * 2, 350 + selectedMenuIndex * 25,
    50, 50);
}

function drawControls() {
    drawText("Game Controls:", 125);
    drawScoringText("Forwards: W", 215);
    drawScoringText("Backwards: S", 235);
    drawScoringText("Right: D", 255);
    drawScoringText("Left: A", 275);
    drawScoringText("Sprint and Kill Shot: Space Bar", 295);
    drawScoringText("", 315);
    drawScoringText("Serve: Enter", 315);

    drawScoringText("Target Wall Quadrants: Left mouse CLICK", 405);
    drawScoringText("Front Wall: Top / Bottom Right / Left", 425);
    drawScoringText("Back Wall: Right / Left ", 445);
}

function drawCredits() {
    creditsListArray.forEach(function (element, index, creditsListArray) {
        drawText(element, 100 + 28 * index);
    });
}

function drawScoring() {
    drawText("Hand Out Scoring System:", 125);
    drawScoringText("If the server wins a", 215);
    drawScoringText("rally they receive a", 235);
    drawScoringText("point, while if the returner", 255);
    drawScoringText("wins a rally, only the service", 275);
    drawScoringText("changes, i.e. (the ball goes", 295);
    drawScoringText(" hand-out), and no point", 315);
    drawScoringText("is given.", 335);
    drawScoringText("The first player to reach 9 points", 405);
    drawScoringText("wins the game. However, if the score", 425);
    drawScoringText("reaches 8–8 the winner needs two", 445);
    drawScoringText("points advantage to win (e.g. 10-8).", 465);
}

function drawRules() {
    drawText("Key Game Encounter Rules:", 125);
    drawScoringText("Down or the rally is over if", 215);
    drawScoringText("the ball bounces on the floor", 235);
    drawScoringText("more than once.", 255);
    drawScoringText("Down or the rally is over if", 275);
    drawScoringText("the ball hits the tin.", 295);
    drawScoringText(" ", 315);
    drawScoringText("Out or the rally is over if the ball", 400);
    drawScoringText("bounces over the Outside (top) Lines.", 420);
    drawScoringText("End of rally if the ball bounces on the", 440);
    drawScoringText("floor and before the front wall.", 460);
    drawScoringText("Accidental racket accidents.", 480);
    drawScoringText("do not stop the rally or hand over points.", 500);
}

function drawMainMenu() {
    drawText("Play", 400);
    drawText("Game Rules", 425);
    drawText("Scoring System", 450);
    drawText("Controls", 475);
    drawText("Credits", 500);
    canvasContext.drawImage(p1_standing,
    canvas.width / 5.8 * 2, 350 + selectedMenuIndex * 25,
    50, 50);
    canvasContext.drawImage(p2_standing,
    canvas.width / 3.3 * 2, 350 + selectedMenuIndex * 25,
    50, 50);

}

function menuInput(keyEvent, pressed) {
    Sound.wall();
    if (keyEvent.keyCode === KEY_W) {
        selectedMenuIndex -= 1;
        Sound.bounce();
        if (selectedMenuIndex < 0) {
            selectedMenuIndex = menuArray.length - 1;
        }

    } else if (keyEvent.keyCode === KEY_S) {
        selectedMenuIndex += 1;
        Sound.bounce();
        if (selectedMenuIndex >= menuArray.length) {
            selectedMenuIndex = 0;
        }

    } else if (keyEvent.keyCode === KEY_SPACE) {
        if (curr_menuScreen != "Main" && curr_menuScreen!="Play") {
            //ignore if not on main menu
            return;
        } else {
            //console.log('selected:'+menuArray[selectedMenuIndex]);
            switch (menuArray[selectedMenuIndex]) {
                case 'Play':
                    curr_menuScreen = 'Play';
                    menuArray = difficultyMenu;
                    selectedMenuIndex = 0;
                    break;
                case 'Level 1':
                    Sound.wall();
                    AI_Difficulty = 0;
                    startGame();
                    break;
                case 'Level 2':
                    Sound.wall();
                    AI_Difficulty = 1;
                    startGame();
                    break;
                case 'Level 3':
                    Sound.wall();
                    AI_Difficulty = 2;
                    startGame();
                    break;
                default:
                    curr_menuScreen = menuArray[selectedMenuIndex];
                    break;
            }
            //console.log('Curr :'+curr_menuScreen);
        }
    }
    else if (keyEvent.keyCode === KEY_ENTER) {
        //console.log('Shift pressed');
        if (curr_menuScreen != 'Main') {
            if(curr_menuScreen === 'Play'){
                selectedMenuIndex = 0;
            }  
            curr_menuScreen = 'Main';
            menuArray = mainMenuArray;          
        }
    }
}