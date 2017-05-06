var selectedMenuIndex = 0;
var mainMenuArray =["Play", "Game Rules", "Scoring System", "Controls", "Credits"];
var difficultyMenu = ["Level 1", "Level 2", "Level 3"];
var menuArray= mainMenuArray;
var exitLoop;
var creditsListArray =[];

/*var creditsListArray = ["A Gamkedo Club Team Production",
"Sergio Solorzano - Lead game developer; characters and ball movement,",
"ball particle effects, mouse ball aim, squash rules, pause functionality,",
"point assingment, messaging, design, game pixel and Unity art", 
"JL Evans- Players serve, draw for right to serve, game scale to full screen,",
"computer AI programming; player serve pixel art", 
"Marcus Silva - Point assignment, score counter, computer AI programming,",
"menu game title banner",
"Matthew Ko - Menu programming",
"Adam Croft - Credits and Ball hit sound integration",
"Nikki Sapp - Menu Music",
"Ashleigh Morris - Sprint and sound mute programming",
"Christopher Kocan - Ball bounce trail",
"Dalath - Sprint sweat particles",
"Caspar Dunant - Game scale to full screen, debug support",
"Christer (McFunkypants) Kaitila - Adapted sounds from pmBrowne",
"Caboosey1186 AlaskaRobotics, Howler sound library integration,",
"gamepad functionality",
"Chris DeLeon- Computer AI and game debugging support",
"Game Testing: Jeremy Kenyon, Trenton Pegeas",
];*/

var curr_menuScreen = "Main"; //Rules, Credits
var menuActive = false;

var AI_Difficulty = 0;


var gameLoop;
function startGame() {
    //console.log("startgame running")
    menuActive = false;
    numFullSpins = 2;
    moreFrames = false;
    spinFrame = 0;
    drawNow=false;
    serveBet=true;
    //ServeHandler.bluePicks=false;
    clearInterval(menuLoop);
    //message=0;
    if(menuActive==false){
        gameLoop = setInterval(function () {
            if(gameIsPaused==false){
                moveAll();
            }  
            drawAll();
        }, 1000 / framesPerSecond);
        loadLevel();    
    }
}

function returnToMenu(){
    Sound.play("menu3_music",true,0.5);    
    curr_menuScreen="Main";
    playerEntry = false;
    ServeHandler.Reset();
    clearInterval(gameLoop);
    menuArray= mainMenuArray;
    menuLoop = setInterval(function () {
        drawMenu();
    }, 1000 / framesPerSecond);
}

/*function exitScreen(){
    exitLoop = setInterval(function () {
        drawText("Press Esc to Exit Game", 350);
        drawText("Press Enter to Return to Game", 400);
    }, 1000 / framesPerSecond);
}*/

function drawMenu() {
    menuActive = true;
    clearScreen();
    
    if(curr_menuScreen=='Game Rules' || curr_menuScreen=='Scoring System' || curr_menuScreen=='Controls'){
        drawBitmapCenteredWithRotation(squashcourt_towrite, canvas.width / 2, canvas.height / 2, 0);        
    } else if (curr_menuScreen=='Credits'){
    drawBitmapCenteredWithRotation(squashcourt_nocheer, canvas.width / 2, canvas.height / 2, 0);
    }
    else {
    drawBitmapCenteredWithRotation(squashcourt_menu, canvas.width / 2, canvas.height / 2, 0);
    }

    if(curr_menuScreen=='Credits'){
    //    drawBitmapCenteredWithRotation(orangepost, 405, 125, 0);        

        colorTextCredits("hello", 600,175, Math.PI/8)

        drawBitmapCenteredWithRotation(orangepost, canvas.width/2+4, 104, 0);
        var anchorsergioY=132;
        var offsetY=20;
        colorTextCreditsName("Sergio Solorzano", canvas.width/2-90,anchorsergioY-offsetY*3)
        colorTextCredits("Lead game developer", canvas.width/2-90,anchorsergioY-offsetY*2)
        colorTextCredits("characters and ball movement", canvas.width/2-90,anchorsergioY-offsetY)
        colorTextCredits("ball particle effects, mouse ball aim,", canvas.width/2-90,anchorsergioY)
        colorTextCredits("squash rules, pause functionality,", canvas.width/2-90,anchorsergioY+offsetY, 0)
        colorTextCredits("point assingment, messaging, design, ", canvas.width/2-90,anchorsergioY+offsetY*2, 0)
        colorTextCredits("game pixel and Unity art", canvas.width/2-90,anchorsergioY+offsetY*3, 0)

        //drawBitmapCenteredWithRotation(bluepost, 200, 175, Math.PI*7/4);        

    }

    message=MESSAGEBOARD;
    drawMessageBoard();
    //console.log("Menu Active",menuActive)
    //console.log("at returnToMenu ",curr_menuScreen)
    switch (curr_menuScreen) {
        case "Credits":
            drawCredits();
            drawMuteState();
            break;
        case "Game Rules":
            drawRules();
            drawMuteState();
            break;
        case "Scoring System":
            drawScoring();
            drawMuteState();
            break;
        case "Controls":
            drawControls();
            drawMuteState();
            break;
        case "Play":
            drawDifficultySelection();
            break;
        default:
            drawMainMenu();
            drawMuteState();
            break;
    }
    if (curr_menuScreen === "Main") {
        drawTextCustom("Confirm: Space", canvas.width / 10 * 6.5, canvas.height / 10 * 8.7);
    }else if (curr_menuScreen === "Play"){
        drawTextCustom("Confirm: Space", canvas.width / 10 * 6.5, canvas.height / 10 * 8.7);
        drawTextCustom("Back: Esc", canvas.width / 10 * 3.25, canvas.height / 10 * 8.7);
    } else {
        drawRulesEsc("Back: Esc", canvas.width / 10 * 3.25, canvas.height / 10 * 8.7);
    }
    redrawCanvas();
}

function drawDifficultySelection(){
    drawText("Select Level", 350);
    drawText("A warm up", 400);
    drawText("Moderate", 425);
    drawText("Sweaty !", 450);
    canvasContext.drawImage(p1_standing,
    canvas.width / 5.8 * 2, 350 + selectedMenuIndex * 25,
    50, 50);
    canvasContext.drawImage(p2_standing,
    canvas.width / 3.3 * 2, 350 + selectedMenuIndex * 25,
    50, 50);
}

function drawControls() {
    drawRulesTextTitle("Game Controls:", 230);
    drawScoringText("Forward: W", 260);
    drawScoringText("Backward: S", 280);
    drawScoringText("Right: D", 300);
    drawScoringText("Left: A", 320);
    drawScoringText("Sprint & Kill Shot: Space Bar", 340);
    drawScoringText("Serve: Space", 360);

    drawScoringText("Target Wall Quadrants:", 390);
    drawControlsMouse("Left mouse CLICK", 470, 410);
    drawControlsMouse("Front Wall Targets:", 375, 430);    
    drawControlsMouse("Top / Bottom", 440, 450);
    drawControlsMouse("Right / Left", 433, 470);

    drawControlsMouse("Back Wall Targets:", 360, 490);    
    drawControlsMouse("Top / Bottom", 440, 510);

    //drawControls("Front Wall: Top / Bottom - Right / Left", canvas.width / 10 * 3.25, canvas.height / 10 * 8.7);
    //drawControls("Back Wall: Right / Left ", canvas.width / 10 * 3.25, canvas.height / 10 * 8.7);
}

function drawCredits() {
    creditsListArray.forEach(function (element, index, creditsListArray) {
        drawCreditsText(element, 60 + 28 * index);
    });
}

function drawScoring() {
    drawRulesText("Hand Out", 230);
    drawRulesText("Scoring System:", 250);
    drawScoringText("If the server wins a rally", 280);
    drawScoringText("receives a point whilst", 300);
    drawScoringText("if the returner wins a", 320);
    drawScoringText("rally, only the service", 340);
    drawScoringText("changes, i.e. (the ball goes", 360);
    drawScoringText(" hand-out), and no point", 380);
    drawScoringText("is given.", 400);
    drawScoringText("The first player to reach 9", 430);
    drawScoringText("points wins the game. However, if", 450);
    drawScoringText("the score reaches 8–8 the winner", 470);
    drawScoringText("needs two points advantage to win ", 490);
    drawScoringText("(e.g. 10-8).", 510);
}

function drawRules() {
    drawRulesTextTitle("Key Game Rules:", 230);
    drawRulesText("The rally is over (Down)", 260);
    drawRulesText("if the ball bounces on", 280);
    drawRulesText("the floor more than once.", 300);
    drawRulesText("The rally is over (Down) if", 320);
    drawRulesText("the ball hits the tin.", 340);
    
    drawRulesText("The rally is over if the ball", 380);
    drawRulesText("bounces over the Outside (top).", 400);
    drawRulesText(" End of rally if the ball bounces on", 420);
    drawRulesText("the floor and before the front wall.", 440);
    drawRulesText("Accidental racket accidents do not", 480);
    drawRulesText(" stop the rally or hand over points.", 500);
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
    if (keyEvent.keyCode === KEY_W || keyEvent.keyCode === KEY_ARROWUP || keyEvent.keyCode === KEY_ARROWLEFT) {
        selectedMenuIndex -= 1;
        Sound.bounce();
        if (selectedMenuIndex < 0) {
            selectedMenuIndex = menuArray.length - 1;
        }

    } else if (keyEvent.keyCode === KEY_S || keyEvent.keyCode === KEY_ARROWDOWN || keyEvent.keyCode === KEY_ARROWRIGHT) {
        selectedMenuIndex += 1;
        Sound.bounce();
        if (selectedMenuIndex >= menuArray.length) {
            selectedMenuIndex = 0;
        }

    } else if (keyEvent.keyCode === KEY_SPACE || keyEvent.keyCode ===KEY_ENTER) {
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
                    if(curr_menuScreen=='Credits'){
                        Sound.stop("menu3_music");
                        Sound.play("creditsmusic",true,0.5);
                    }
                    break;
            }
            //console.log('Curr :'+curr_menuScreen);
        }
    }
    else if (keyEvent.keyCode === KEY_ESC) {
        //console.log('Shift pressed');
        if (curr_menuScreen != 'Main') {
            if(curr_menuScreen === 'Play'){
                selectedMenuIndex = 0;
            }  
            if(curr_menuScreen=='Credits'){
                Sound.stop("creditsmusic");
                Sound.play("menu3_music",true,0.5);        
            }
            curr_menuScreen = 'Main';
            menuArray = mainMenuArray;          
        }
    }
}