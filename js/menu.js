//vector2 branch test
var selectedMenuIndex = 0;
var menuArray = ["Play", "Scoring System", "Controls", "Credits"];

var creditsListArray = ["Sergio - Design, Gameplay, Code", "Christer - Design, Gameplay, Code", "TBD"];
var curr_menuScreen = "Main"; //Rules, Credits
var menuActive = false;

function drawText(text, height) {
    canvasContext.fillStyle = "blue";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 18px verdana";
    //canvasContext.fillText(text, canvas.width / 2, 490);
    canvasContext.fillText(text, canvas.width / 2, height);
}

function drawScoringText(text, height) {
    canvasContext.fillStyle = "blue";
    canvasContext.textAlign = "center";
    canvasContext.font = "18px verdana";
    //canvasContext.fillText(text, canvas.width / 2, 490);
    canvasContext.fillText(text, canvas.width / 2, height);
}

function drawTextCustom(text, x, y) {
    canvasContext.fillStyle = "blue";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 18px verdana";
    canvasContext.fillText(text, x, y);
}

function startGame() {
    menuActive = false;
    clearInterval(menuLoop);
    setInterval(function () {
        moveAll();
        drawAll();
    }, 1000 / framesPerSecond);
    loadLevel();
}

function drawMenu() {
    clearScreen();
    drawBitmapCenteredWithRotation(squashcourt, canvas.width / 2, canvas.height / 2, 0);
    switch (curr_menuScreen) {
        case "Credits":
            drawCredits();
            break;
        case "Scoring System":
            drawRules();
            break;
        case "Controls":
            drawControls();
            break;
        default:
            drawMainMenu();
            break;
    }
    if (curr_menuScreen === "Main") {
        drawTextCustom("Confirm: Space", canvas.width / 10 * 6.5, canvas.height / 10 * 8.7);
        drawTextCustom("Fullscreen: F11", canvas.width / 10 * 3.575, canvas.height / 10 * 8.7);
    } else {
        drawTextCustom("Exit: Shift", canvas.width / 10 * 3.25, canvas.height / 10 * 8.7);
    }

}

function drawControls() {
    drawText("Game Controls:", 125);
    drawScoringText("Forwards: W", 215);
    drawScoringText("Backwards: S", 235);
    drawScoringText("Right: D", 255);
    drawScoringText("Left: A", 275);
    drawScoringText("Sprint: Right SHIFT", 295);
    drawScoringText("Kill Shot: SPACE bar", 315);

    drawScoringText("Target Walls: Left mouse CLICK", 345);
}

function drawCredits() {
    creditsListArray.forEach(function (element, index, creditsListArray) {
        drawText(element, 100 + 28 * index);
    });
}

function drawRules() {
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
    drawScoringText("reaches 8–8 the player that reaches ", 445);
    drawScoringText("10 points first wins.", 465);
}

function drawMainMenu() {

    drawText("Play", 400);
    drawText("Scoring System", 425);
    drawText("Controls", 450);
    drawText("Credits", 475);
    canvasContext.drawImage(p1_standing,
    canvas.width / 5.8 * 2, 350 + selectedMenuIndex * 25,
    50, 50);
    canvasContext.drawImage(p2_standing,
    canvas.width / 3.3 * 2, 350 + selectedMenuIndex * 25,
    50, 50);
}

function menuInput(keyEvent, pressed) {

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
        if (curr_menuScreen != "Main") {
            //ignore if not on main menu
            return;
        } else {
            switch (menuArray[selectedMenuIndex]) {
                case 'Play':
                    Sound.wall();
                    startGame();
                    break;
                default:
                    curr_menuScreen = menuArray[selectedMenuIndex];
                    break;
            }
            //console.log('Curr :'+curr_menuScreen);
        }
    } else if (keyEvent.keyCode === KEY_LEFT_SHIFT) {
        //console.log('Shift pressed');
        if (curr_menuScreen != 'Main') {
            curr_menuScreen = 'Main';
        }
    }
    else if (keyEvent.keyCode === KEY_F11) {
        screenfull.request(canvas);
    }
}