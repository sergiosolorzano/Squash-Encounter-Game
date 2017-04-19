function drawAtBaseSheetSprite(graphic, idx, atX, atY, picW, picH, globalAlpha) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    if (globalAlpha === "undefined") globalAlpha = 0.1;
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

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
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
