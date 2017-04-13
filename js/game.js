var Game = function Game() {
    ctrl = {}

    ctrl.RallyReset = function RallyReset() {
        ServeHandler.SwitchServe();
        BallClass.Reset();
        PlayerClass.Reset();
        ComputerClass.Reset();
    }

    return ctrl;
}()