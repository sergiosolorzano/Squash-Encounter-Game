var selectedMenuIndex = 0;
var mainMenuArray =["Play", "Game Rules", "Scoring System", "Controls", "Credits"];
var difficultyMenu = ["Level 1", "Level 2", "Level 3"];
var menuArray= mainMenuArray;
var exitLoop;
var creditsListArray =[];

var sergio=5
var jlevans = 15
var marcus = 25
var mko = 35
var nikki = 45
var chris = 55 
var dalath = 65
var jeremy = 75
var christer = 85


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

        if(sergio--<0){
        
        drawBitmapCenteredWithRotation(orangepost, canvas.width/2+4, 104, 0);
        var anchorsergioY=100;
        var offsetY=14;
        colorTextCreditsName("Sergio Solorzano, Lead Game Developer", canvas.width/2-93,anchorsergioY-offsetY*2)
        //colorTextCredits("", canvas.width/2-90,anchorsergioY-offsetY*2)
        colorTextCredits("Characters and ball movement, tools,", canvas.width/2-90,anchorsergioY-offsetY)
        colorTextCredits("on-mouse ball aim, ball particle effects,", canvas.width/2-90,anchorsergioY)
        colorTextCredits("squash rules, pause functionality, point", canvas.width/2-90,anchorsergioY+offsetY, 0)
        colorTextCredits("assingment, messaging, design, menu", canvas.width/2-90,anchorsergioY+offsetY*2, 0)
        colorTextCredits("data/format, game pixel and Unity art", canvas.width/2-90,anchorsergioY+offsetY*3, 0)    
        //return
        }

        if(jlevans--<0){
        anchorY=130;
        offsetY=14;
        drawBitmapCenteredWithRotation(greenpost, 600, 175,Math.PI*0.25);//Math.PI*0.25
        colorTextCreditsName("JL Evans", 570,anchorY-offsetY*2-5, Math.PI*0.25)
        colorTextCredits("Players serve, draw for right to", 560,anchorY-offsetY-5, Math.PI*0.25)
        colorTextCredits("serve, game scale to full screen,", 550, anchorY-10, Math.PI*0.25)
        colorTextCredits("computer AI programming, ", 540, anchorY+offsetY-14, Math.PI*0.25)
        colorTextCredits("player serve pixel art", 530, anchorY+offsetY*2-15, Math.PI*0.25)    
        }
        
        if(marcus--<0){
        anchorY=230;
        offsetY=0;
        var postAng=Math.PI*7/4;
        drawBitmapCenteredWithRotation(lightbluepost, 210, 175,postAng);
        colorTextCreditsName("Marcus Silva", 130,anchorY-offsetY*2-25, postAng)
        colorTextCredits("Point assignment, score counter,", 142,anchorY-offsetY-10, postAng)
        colorTextCredits("computer AI programming,", 150, anchorY, postAng)
        colorTextCredits("menu game title banner", 160, anchorY+offsetY+8, postAng)    
        }

        if(mko--<0){
        anchorY=250;
        offsetY=14;
        postAng=Math.PI*0.05;
        drawBitmapCenteredWithRotation(lightbluepost, 400, 250,postAng);//Math.PI*0.25
        colorTextCreditsName("Matthew Ko", 330,anchorY-offsetY*3, postAng)
        colorTextCredits("Menu programming", 328,anchorY-offsetY*2, postAng)
        
        colorTextCreditsName("Adam Croft", 326, anchorY-offsetY+5, postAng)
        colorTextCredits("Credits Music and", 324, anchorY+5, postAng)
        colorTextCredits("ball hit sound integration", 322, anchorY+offsetY+5, postAng)    
        }
        if(nikki--<0){
        anchorY=300;
        offsetY=15;
        postAng=Math.PI*0.05;
        drawBitmapCenteredWithRotation(greenpost, 200, 350,postAng);//Math.PI*0.25
        colorTextCreditsName("Nikki Sapp", 130, anchorY-offsetY*2+40, postAng)
        colorTextCredits("Menu Music", 128, anchorY-offsetY+40, postAng)

        colorTextCreditsName("Ashleigh Morris", 125, anchorY+40, postAng)
        colorTextCredits("Sprint and ", 123, anchorY+offsetY+40, postAng)
        colorTextCredits("sound mute programming", 121, anchorY+offsetY*2+40, postAng)            
        }
        if(chris--<0){
        anchorY=450;
        offsetY=14;
        postAng=Math.PI*11/6;
        drawBitmapCenteredWithRotation(redpost, 375, 400,postAng);//Math.PI*0.25
        colorTextCreditsName("Christopher Kocan", 300,anchorY-offsetY*3-2, postAng)
        colorTextCredits("Ball bounce trail", 307,anchorY-offsetY*2-2-4, postAng)
        
        colorTextCreditsName("Dalath", 315, anchorY-offsetY-6-2, postAng)
        colorTextCredits("Sprint sweat particles", 320, anchorY-offsetY+13-6-4, postAng)
        
        colorTextCreditsName("Caspar Dunant", 326, anchorY-offsetY+18-3, postAng)
        colorTextCredits("Game scale to full screen,", 332, anchorY+offsetY*2-17, postAng)
        colorTextCredits("debug support", 340, anchorY+offsetY*2-9, postAng)    
        }
        if(jeremy--<0){
        anchorY=325;
        offsetY=14;
        postAng=Math.PI*0.2;
        drawBitmapCenteredWithRotation(greenpost, 600, 350,postAng);

        colorTextCreditsName("Game Testing", 565,anchorY-offsetY*3, postAng)
        colorTextCredits("Jeremy Kenyon", 552, anchorY-offsetY*2+5, postAng)
        colorTextCredits("Trenton Pegeas ", 538, anchorY-offsetY+15, postAng)    
        }
        if(christer--<0){
        anchorY=470;
        offsetY=0;
        postAng=Math.PI*1.9;
        drawBitmapCenteredWithRotation(orangepost, 485, 470,postAng);
        colorTextCreditsName("Christer (McFunkypants) Kaitila", 390,anchorY-offsetY*3-4, postAng)
        
        colorTextCredits("Adapted sounds from pmBrowne", 394,anchorY-offsetY*2+12-5, postAng)
        colorTextCredits("Caboosey1186 AlaskaRobotics,", 397,anchorY-offsetY*1+24-5, postAng)
        colorTextCredits("Howler sound library integration,", 401,anchorY+36-5, postAng)
        colorTextCredits("gamepad functionality", 405,anchorY+48-5, postAng)

        colorTextCreditsName("Chris DeLeon", 409,anchorY+offsetY+60-5, postAng)
        colorTextCredits("Computer AI, debugging support", 413, anchorY+offsetY*2+72-7, postAng)    
        }

        /*anchorY=315;
        offsetY=14;
        postAng=Math.PI*0.2;
        drawBitmapCenteredWithRotation(orangepost, 600, 350,postAng);
        colorTextCreditsName("Christer (McFunkypants) Kaitila", 540,anchorY-offsetY*3-5, postAng)
        
        colorTextCredits("Adapted sounds from pmBrowne", 535,anchorY-offsetY*2-8, postAng)
        colorTextCredits("Caboosey1186 AlaskaRobotics,", 528,anchorY-offsetY*1-13, postAng)
        colorTextCredits("Howler sound library integration,", 522,anchorY-18, postAng)
        colorTextCredits("gamepad functionality", 516,anchorY-9, postAng)

        colorTextCreditsName("Chris DeLeon", 508,anchorY+offsetY-13, postAng)
        colorTextCredits("Computer AI, debugging support", 500, anchorY+offsetY*2-20, postAng)
 
        anchorY=420;
        offsetY=14;
        postAng=Math.PI*0.1;
        drawBitmapCenteredWithRotation(greenpost, 550, 450,postAng);

        colorTextCreditsName("Game Testing", 490,anchorY-offsetY, postAng)
        colorTextCredits("Jeremy Kenyon", 490, anchorY+5, postAng)
        colorTextCredits("Trenton Pegeas ", 485, anchorY+offsetY+10, postAng)*/
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
    } else if (curr_menuScreen==="Credits"){
        drawTextCustom("Back: Esc", canvas.width / 10 * 3.25, canvas.height / 10 * 8.7);
    }

    else {
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
                        Sound.play("creditsmusic", false, 0.5);  
                        if(sergio>0){
                            Sound.play("crowd-cheer", false, 0.5);    
                        }
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