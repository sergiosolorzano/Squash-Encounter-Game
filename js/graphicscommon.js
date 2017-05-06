function drawAtBaseSheetSprite(graphic, idx, atX, atY, picW, picH, globalAlpha) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    if (globalAlpha === "undefined") globalAlpha = 1;
    /*
      context.globalAlpha takes a value from 0 - 1, e.g. .5
      the default is set above to 1, which results in rendering completely opaque
    */
    canvasContext.globalAlpha = globalAlpha;
    canvasContext.drawImage(graphic,
      idx * picW, 0,
      picW, picH,
      -picW / 2, -picH / 2,
      picW, picH);
    canvasContext.restore();
}

function drawBitmapCenteredWithRotation(useBitmap, atX, atY, withAng) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    canvasContext.rotate(withAng);
    canvasContext.drawImage(useBitmap, -useBitmap.width / 2, -useBitmap.height / 2);
    canvasContext.restore();
}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor, withAng) {
  canvasContext.save();
  canvasContext.fillStyle = fillColor;
  canvasContext.translate(topLeftX,topLeftY); // added, sets position 'after' rotation
  canvasContext.rotate(withAng);
  //canvasContext.fillRect(0, 0, boxWidth,boxHeight);
  canvasContext.fillRect(-boxWidth/2,-boxHeight/2, boxWidth,boxHeight);
  canvasContext.restore();
}

function colorTextCredits(showWords, topLeftX,topLeftY, withAng) {
  canvasContext.save();
  canvasContext.font = "10px Indie Flower";
  canvasContext.textAlign = "left";
  canvasContext.fillStyle = "blue";
  canvasContext.translate(topLeftX,topLeftY); // added, sets position 'after' rotation
  canvasContext.rotate(withAng);
  canvasContext.fillText(showWords, 0, 0);
  canvasContext.restore();
}

function colorTextCreditsName(showWords, topLeftX,topLeftY, withAng) {
  canvasContext.save();
  canvasContext.textAlign = "left";
  canvasContext.font = "bold 10px Indie Flower";
  canvasContext.fillStyle = "blue";
  canvasContext.translate(topLeftX,topLeftY); // added, sets position 'after' rotation
  canvasContext.rotate(withAng);
  canvasContext.fillText(showWords, 0, 0);
  
  canvasContext.restore();
}

function colorRectStamina(topLeftX,topLeftY, boxWidth,boxHeight, fillColor, withAng) {
  canvasContext.save();
  canvasContext.fillStyle = fillColor;
  canvasContext.translate(topLeftX,topLeftY); // added, sets position 'after' rotation
  canvasContext.rotate(withAng);
  //canvasContext.fillRect(0, 0, boxWidth,boxHeight);
  canvasContext.fillRect(-boxWidth,-boxHeight, boxWidth,boxHeight);
  canvasContext.restore();
}


function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor, size) {
    canvasContext.fillStyle = fillColor;
    if (size) canvasContext.font = size + "px Verdana";
    else canvasContext.font = "30px Verdana";
    canvasContext.fillText(showWords, textX, textY);
}

function drawText(text, height) {
    canvasContext.fillStyle = "blue";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 18px Cherry Cream Soda";
    //canvasContext.fillText(text, canvas.width / 2, 490);
    canvasContext.fillText(text, canvas.width / 2, height);
}
function drawRulesTextTitle(text, height) {
    canvasContext.fillStyle = "black";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 18px Cherry Cream Soda";
    //canvasContext.fillText(text, canvas.width / 2, 490);
    canvasContext.fillText(text, canvas.width / 2, height);
}

function drawRulesEsc(text, x, y) {
        canvasContext.fillStyle = "black";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 18px Cherry Cream Soda";
    canvasContext.fillText(text, x, y);
}

function drawControlsMouse(text, x, y) {
        canvasContext.fillStyle = "black";
    canvasContext.textAlign = "center";
    canvasContext.font = "18px Cherry Cream Soda";
    canvasContext.fillText(text, x, y);
}

function drawRulesText(text, height) {
    canvasContext.fillStyle = "black";
    canvasContext.textAlign = "center";
    canvasContext.font = "bold 18px Cherry Cream Soda";
    //canvasContext.fillText(text, canvas.width / 2, 490);
    canvasContext.fillText(text, canvas.width / 2, height);
}

function drawCreditsText(text, height) {
    canvasContext.fillStyle = "black";
    canvasContext.textAlign = "left";
    canvasContext.font = "bold 18px Cherry Cream Soda";
    //canvasContext.fillText(text, canvas.width / 2, 490);
    canvasContext.fillText(text, 20, height);
}

function drawScoringText(text, height) {
    canvasContext.fillStyle = "black";
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