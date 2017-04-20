var drawScale,
    aspectRatio;

function initDrawCanvas() {
    drawCanvas = document.getElementById('drawCanvas');
    drawContext = drawCanvas.getContext('2d');
    
    window.addEventListener('resize', resizeWindow);
    aspectRatio = canvas.width / canvas.height;
    setTimeout(resizeWindow, 1);
}

function resizeWindow() {
    var maxHeight = window.innerHeight - 2;
    var maxWidth = window.innerWidth - 2;

    if (maxWidth / maxHeight < aspectRatio) {
        drawCanvas.width = maxWidth;
        drawCanvas.height = Math.floor(maxWidth / aspectRatio);
    }
    else {
        drawCanvas.height = maxHeight;
        drawCanvas.width = Math.floor(maxHeight * aspectRatio);
    }

    drawScale = drawCanvas.width / canvas.width;
}

function redrawCanvas() {
    drawContext.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawContext.save();
    drawContext.scale(drawScale, drawScale);
    drawContext.drawImage(canvas, 0, 0);
    drawContext.restore();
}

function scaleCoordinates(x, y) {
    return {
        x: x / drawScale,
        y: y / drawScale
    };
}