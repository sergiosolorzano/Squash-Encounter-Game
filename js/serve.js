/*************************************************
ServeClass Constructor
*************************************************/

function ServeClass() {
    var self = {};

    self.RED = -1;
    self.BLUE = 1;
    self.LEFT_SQUARE = COURT_W * 0.07;
    self.RIGHT_SQUARE = COURT_W * 0.99;
    self.LEFT_SQUASHBALL = COURT_W * 0.07;
    self.RIGHT_SQUASHBALL = COURT_W * 0.97;

    self.bluePos = self.LEFT_SQUARE;
    self.redPos = self.RIGHT_SQUARE;
    self.flipPos = 1;
    self.bluePicks = false;
    self.servingPlayer = self.RED;
    self.nextServingPlayer = self.RED;
    self.matchStart = false;
    self.inPlay = false;
    self.inServe = false;
    self.countTimer = null;
    self.animTimer = null;
    self.time = 0;

    self.Reset = function () {
        self.matchStart = false;
        self.inPlay = false;
        self.inServe = false;
    }

    self.WhoServes = function () {
        self.inPlay = false;
        if (self.matchStart) {
            if (self.servingPlayer === self.nextServingPlayer) self.flipPos *= -1;
            self.servingPlayer = self.nextServingPlayer;
        }
        if (self.flipPos > 0) {
            PlayerClass.x = self.LEFT_SQUARE;
            ComputerClass.x = self.RIGHT_SQUARE;
            if (self.servingPlayer === self.BLUE) BallClass.x = self.LEFT_SQUASHBALL;
            else BallClass.x = self.RIGHT_SQUASHBALL;
        }
        else {
            PlayerClass.x = self.RIGHT_SQUARE;
            ComputerClass.x = self.LEFT_SQUARE;
            if (self.servingPlayer === self.BLUE) BallClass.x = self.RIGHT_SQUASHBALL;
            else BallClass.x = self.LEFT_SQUASHBALL;
        }

        /*if (self.inPlay == false) {
            if (self.servingPlayer === self.RED) {
                message = REDSERVES;
            } else {
                message = BLUESERVES;
            }
        }*/

        self.time = 0;
        self.RedServes();
    }

    self.WhereBall = function () {
        if (self.flipPos > 0) {
            if (self.servingPlayer === self.RED) return self.RIGHT_SQUASHBALL;
            else return self.LEFT_SQUASHBALL;
        }
        else {
            if (self.servingPlayer === self.RED) return self.LEFT_SQUASHBALL;
            else return self.RIGHT_SQUASHBALL;
        }
    }

    self.ServeBall = function () {
        self.inServe = false;
        BallClass.isServed = true;
        self.inPlay = true;
    }

    self.RedServes = function () {
        if (self.servingPlayer === self.RED) {
            self.time = 5;
            self.countTimer = window.setInterval(function () { self.RedCountDown(); }, 1000);
        }
    }

    self.RedCountDown = function () {
        self.time--;
        if (self.time < 1) self.StartAnim();
    }

    self.StartAnim = function () {
        if (!self.inPlay) {
            if (self.servingPlayer === self.RED) {
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

    self.StartPlay = function () {
        window.clearTimeout(self.animTimer);
        if (self.servingPlayer === self.RED) {
            var ranNumber = Math.random();
            if (ranNumber < 0.33) {
                BallClass.speedX = -1.68 * self.flipPos;
                BallClass.zv = 1.5;
            }
            else if (ranNumber < 0.66) {
                BallClass.speedX = -1 * self.flipPos;
                BallClass.zv = 1.5;
            }
            else BallClass.speedX = -1.1 * self.flipPos;

            self.time = 0;
            window.clearInterval(self.countTimer);
        }
        else {
            switch (PlayerClass.targetFrontWall) {
                case TOPRIGHTFRONTWALL:
                    if (self.flipPos > 0) BallClass.speedX = 1.68;
                    else BallClass.speedX = -1;
                    BallClass.zv = 1.5;
                    break;
                case TOPLEFTFRONTWALL:
                    if (self.flipPos < 0) BallClass.speedX = -1.68;
                    else BallClass.speedX = 1;
                    BallClass.zv = 1.5;
                    break;
                default:
                    BallClass.speedX = 1.1 * self.flipPos;
                    break;
            }
        }
        BallClass.isVisible = true;
        self.inServe = true;
    }

    self.DrawCountDown = function () {
        if (self.time > 0) colorText(self.time, canvas.width * 0.5, canvas.height * 0.5, "blue", 60);
    }

    return self;
}

var ServeHandler = ServeClass();