function drawAtBaseSheetSprite(graphic, idx, atX, atY,picW,picH) {
  canvasContext.save();
  canvasContext.translate(atX, atY);
  canvasContext.drawImage(graphic,
    idx * picW, 0,
    picW, picH,
    -picW/2, -picH/2,
    picW, picH);
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