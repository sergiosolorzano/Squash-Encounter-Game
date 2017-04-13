/*************************************************
ServeClass Constructor
*************************************************/

function ServeClass() {
    this.RED = -1;
    this.BLUE = 1;

    this.servingPlayer = this.RED;

    this.SwitchServe = function () {
        this.servingPlayer *= -1;
    }
}

var ServeHandler = new ServeClass();