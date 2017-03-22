function ComputerClass(){

  this.Init = function(){
    this.Reset();
  }

  this.Reset = function(){
    this.x=COURT_W*0.8;
    this.y=initYPosition;
    whichPic = p2_standing;
    this.isSwinging=false;
  }

  this.drawPlayer = function(){
    var drawLocation = perspectiveLocation(this.x,this.y,0);
    var playerAnimationFrames = whichPic.width/PLAYER_W;
    if (playerFrameTimer-- < 0) {
      playerFrameTimer = playerStepsPerAnimFrame;
      playerFrame++;
    }
    if (playerFrame >= playerAnimationFrames) {
          playerFrame = 0;
          whichPic = p1_standing;
          this.isSwinging=false;
      }
    drawAtBaseSheetSprite(whichPic, playerFrame, drawLocation.x, drawLocation.y);
  }
}

