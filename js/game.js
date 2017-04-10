var Game = function Game() {
    ctrl = {}

    ctrl.RallyReset = function RallyReset() {
        ServeClass.SwitchServe();
        BallClass.Reset();
        PlayerClass.Reset();
        ComputerClass.Reset();
    }

    return ctrl;
}()