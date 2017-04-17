/*************************************************
ServeClass Constructor
*************************************************/

function ServeClass() {
    this.RED = -1;
    this.BLUE = 1;

    this.servingPlayer = this.RED;
    this.nextServingPlayer = this.RED;
    this.matchStart = false;
    this.inPlay = false;
    this.timer = null;
    this.time = 0;

    this.SwitchServe = function () {
        this.servingPlayer = this.nextServingPlayer;
        this.time = 0;
        this.RedServes();
    }

    this.RedServes = function () {
        var self = this;
        if (this.servingPlayer === this.RED) {
            this.time = 5;
            this.timer = window.setInterval(function () { self.RedCountDown(); }, 1000);
        }
    }

    this.RedCountDown = function () {
        this.time--;
        if (this.time < 1) this.StartPlay();
    }

    this.StartPlay = function () {
        var self = this;
        if (this.servingPlayer === this.RED) {
            this.time = 0;
            window.clearInterval(self.timer);
        }
        this.inPlay = true;
    }

    this.DrawCountDown = function () {
        if (this.time > 0) colorText(this.time, canvas.width * 0.5, canvas.height * 0.5, "blue", 60);
    }
}

var ServeHandler = new ServeClass();