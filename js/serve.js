/*************************************************
ServeClass Constructor
*************************************************/

function ServeClass() {
    this.RED = -1;
    this.BLUE = 1;
    this.LEFT_SQUARE = COURT_W * 0.12;
    this.RIGHT_SQUARE = COURT_W * 0.93;
    this.LEFT_SQUASHBALL = COURT_W * 0.12;
    this.RIGHT_SQUASHBALL = COURT_W * 0.92;

    this.bluePos = this.LEFT_SQUARE;
    this.redPos = this.RIGHT_SQUARE;
    this.flipPos = 1;
    this.bluePicks = false;
    this.servingPlayer = this.RED;
    this.nextServingPlayer = this.RED;
    this.matchStart = false;
    this.inPlay = false;
    this.inServe = false;
    this.countTimer = null;
    this.animTimer = null;
    this.time = 0;

    this.Reset = function () {
        this.matchStart = false;
        this.inPlay = false;
        this.inServe = false;
    }

    this.WhoServes = function () {
        this.inPlay = false;
        if (this.matchStart) {
            if (this.servingPlayer === this.nextServingPlayer) this.flipPos *= -1;
            this.servingPlayer = this.nextServingPlayer;
        }

        if (this.flipPos > 0) {
            PlayerClass.x = this.LEFT_SQUARE;
            ComputerClass.x = this.RIGHT_SQUARE;
            if (this.servingPlayer === this.BLUE) BallClass.x = this.LEFT_SQUASHBALL;
            else BallClass.x = this.RIGHT_SQUASHBALL;
        }
        else {
            PlayerClass.x = this.RIGHT_SQUARE;
            ComputerClass.x = this.LEFT_SQUARE;
            if (this.servingPlayer === this.BLUE) BallClass.x = this.RIGHT_SQUASHBALL;
            else BallClass.x = this.LEFT_SQUASHBALL;
        }
        this.time = 0;
        this.RedServes();
    }

    this.WhereBall = function () {
        if (this.flipPos > 0) {
            if (this.servingPlayer === this.RED) return this.RIGHT_SQUASHBALL;
            else return this.LEFT_SQUASHBALL;
        }
        else {
            if (this.servingPlayer === this.RED) return this.LEFT_SQUASHBALL;
            else return this.RIGHT_SQUASHBALL;
        }
    }

    this.ServeBall = function () {
        this.inServe = false;
        this.inPlay = true;
        BallClass.served = true;
    }

    this.RedServes = function () {
        var self = this;
        if (this.servingPlayer === this.RED) {
            this.time = 5;
            this.countTimer = window.setInterval(function () { self.RedCountDown(); }, 1000);
        }
    }

    this.RedCountDown = function () {
        this.time--;
        if (this.time < 1) this.StartAnim();
    }

    this.StartAnim = function () {
        if (!this.inPlay) {
            var self = this;
            if (this.servingPlayer === this.RED) {
                ComputerClass.whichPic = p2_serve;
                ComputerClass.computerFrameTimer = 10
                ComputerClass.computerStepsPerAnimFrame = 10;
            }
            else {
                PlayerClass.whichPic = p1_serve;
                PlayerClass.playerFrameTimer = 10;
                PlayerClass.playerStepsPerAnimFrame = 10;
            }
            self.StartPlay();
        }
    }

    this.StartPlay = function () {
        var self = this;
        window.clearTimeout(self.animTimer);
        if (this.servingPlayer === this.RED) {
            this.time = 0;
            window.clearInterval(self.countTimer);
            var ranNumber = Math.random();
            if (ranNumber < 0.33) {
                if (this.flipPos > 0) {
                    BallClass.speedX = -1.1;
                    BallClass.speedY = -1.5;
                    BallClass.zv = 0.95;
                }
                else {
                    BallClass.speedX = 1.1;
                    BallClass.speedY = -1.5;
                    BallClass.zv = 0.95;
                }
            }
            else if (ranNumber < 0.66) {
                BallClass.zv = 1.25;
                BallClass.speedY = -2;
            }
            else {
                BallClass.zv = 1.3;
            }
        }
        else {
            switch (PlayerClass.targetFrontWall) {
                case TOPLEFTFRONTWALL:
                    if (this.flipPos < 0) {
                        BallClass.speedX = -1.1;
                        BallClass.speedY = -1.5;
                        BallClass.zv = 0.95;
                    }
                    else {
                        BallClass.zv = 1.15;
                        BallClass.speedY = -2;
                    }
                    break;
                case TOPRIGHTFRONTWALL:
                    if (this.flipPos > 0) {
                        BallClass.speedX = 1.1;
                        BallClass.speedY = -1.5;
                        BallClass.zv = 0.95;
                    }
                    else {
                        BallClass.zv = 1.15;
                        BallClass.speedY = -2;
                    }
                    break;
                default:
                    BallClass.zv = 1.3;
            }
        }
        BallClass.isVisible = true;
        this.inServe = true;
        message = 0;
    }

    this.DrawCountDown = function () {
        if (this.time > 0) colorText(this.time, canvas.width * 0.5, canvas.height * 0.5, "blue", 60);
    }
}

var ServeHandler = new ServeClass();