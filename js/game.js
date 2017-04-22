var Game = function Game() {
    ctrl = {}

    ctrl.RallyReset = function RallyReset() {
        ServeHandler.WhoServes();
        BallClass.Reset();
        PlayerClass.Reset();
        ComputerClass.Reset();
    }

    return ctrl;
}()