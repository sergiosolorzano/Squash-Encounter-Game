function drawAtBaseSheetSprite(graphic, idx, atX, atY) {
  canvasContext.save();
  canvasContext.translate(atX, atY);
  canvasContext.drawImage(graphic,
    idx * PLAYER_W, 0,
    PLAYER_W, PLAYER_H,
    -PLAYER_W/2, -PLAYER_H/2,
    PLAYER_W, PLAYER_H);
  canvasContext.restore();
}

function drawBallAtBaseSheetSprite(graphic, idx, atX, atY) {
  canvasContext.save();
  canvasContext.translate(atX, atY);
  canvasContext.drawImage(graphic,
    idx * BALL_W, 0,
    BALL_W, BALL_H,
    -BALL_W/4, -BALL_H,
    BALL_W, BALL_H);
  canvasContext.restore();
}

function drawAtBaseSheetCounter(graphic, idx, atX, atY) {
  canvasContext.save();
  canvasContext.translate(atX, atY);
  canvasContext.drawImage(graphic,
    idx * COUNTER_W, 0,
    COUNTER_W, COUNTER_H,
    -COUNTER_W, -COUNTER_H,
    COUNTER_W, COUNTER_H);
  canvasContext.restore();
}

function drawBitmapCenteredWithRotation(useBitmap, atX,atY, withAng) {
  canvasContext.save();
  canvasContext.translate(atX, atY);
  canvasContext.rotate(withAng);
  canvasContext.drawImage(useBitmap, -useBitmap.width/2, -useBitmap.height/2);
  canvasContext.restore();
}

function colorRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function colorCircle(centerX,centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX,centerY, 10, 0,Math.PI*2, true);
  canvasContext.fill();
}

function colorText(showWords, textX,textY, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.font="30px Verdana";
  canvasContext.fillText(showWords, textX, textY);
}