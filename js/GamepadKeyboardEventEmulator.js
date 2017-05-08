// Christer McFunkypants Kaitila's Gamepad Keyboard Emulator v2.1
// Sends fake keyboard events to the browser by polling the gamepad (if any).
// plug-n-play: add gamepad support to keyboard-only games!

// modified to provide game-specific functionality for Squash Encounter

const SQUASH_ENCOUNTER_WALL_SELECTING = true; // using right thumbstick
const SQUASH_ENCOUNTER_B_BUTTON_MENUS_ONLY = true; // is sends ESC

var joystick = new GamepadKeyboardEventEmulator();

function GamepadKeyboardEventEmulator()
{
    var gamepad = null;
    
    // left thumbstick
    var gamepad_left = false; // axis 0 < 0
    var gamepad_right = false; // axis 1 > 0
    var gamepad_up = false;  // axis 1 < 0
    var gamepad_down = false; // axis 1 > 0
    // right thumbstick
    var gamepad_look_left = false; // axis 0 < 0
    var gamepad_look_right = false; // axis 1 > 0
    var gamepad_look_up = false;  // axis 1 < 0
    var gamepad_look_down = false; // axis 1 > 0
    // buttons
    var gamepad_jump = false; // button 0 = A
    var gamepad_fire = false; // button 1 = B
    var gamepad_start = false; // button 9 = start
    var gamepad_back = false; // back
    var gamepad_logo = false; // big middle logo button
    var gamepad_r1 = false; // rb = button 10
    var gamepad_r2 = false; // rt = button 9
    var gamepad_l1 = false; // lb = button 5
    var gamepad_l2 = false; // lt = button 6
    
    // so we can fire events when changed
    var prev_gamepad_left = false;
    var prev_gamepad_right = false;
    var prev_gamepad_up = false;
    var prev_gamepad_down = false;
    var prev_gamepad_fire = false;
    var prev_gamepad_jump = false;
    var prev_gamepad_look_left = false;
    var prev_gamepad_look_right = false;
    var prev_gamepad_look_up = false;
    var prev_gamepad_look_down = false;
    var prev_gamepad_start = false;
    var prev_gamepad_back = false;
    var prev_gamepad_logo = false;
    var prev_gamepad_r1 = false;
    var prev_gamepad_r2 = false;
    var prev_gamepad_l1 = false;
    var prev_gamepad_l2 = false;

    // more buttons - currently unimplemented
    /*
    var gamepad_button_x = false; // button 2 = X
    var gamepad_button_y = false; // button 3 = Y
    var gamepad_dpad_up = false; // button 12
    var gamepad_dpad_down = false; // button 13
    var gamepad_dpad_left = false; // button 14
    var gamepad_dpad_right = false; // button 15
    var gamepad_back = false; // button 8
    var gamepad_l1 = false; // button 4
    var gamepad_r1 = false; // button 5
    var gamepad_l2 = false; // button 6 (analog)
    var gamepad_r2 = false; // button 7 (analog)
    var prev_gamepad_button_x = false;
    var prev_gamepad_button_y = false;
    var prev_gamepad_dpad_up = false;
    var prev_gamepad_dpad_down = false;
    var prev_gamepad_dpad_left = false;
    var prev_gamepad_dpad_right = false;
    var prev_gamepad_start = false;
    var prev_gamepad_back = false;
    var prev_gamepad_l1 = false;
    var prev_gamepad_r1 = false;
    var prev_gamepad_l2 = false;
    var prev_gamepad_r2 = false;
    */

    var SIMULATED_KEY_LEFT = 37;
    var SIMULATED_KEY_RIGHT = 39;
    var SIMULATED_KEY_UP = 38;
    var SIMULATED_KEY_DOWN = 40;
    var SIMULATED_KEY_JUMP = 32; // [A] button = space
    var SIMULATED_KEY_FIRE = 27; // [B] button = ESC (enter is 13) BUT ONLY IF menuActive
    var SIMULATED_KEY_START = 27; // [START] button = esc
    var SIMULATED_KEY_LOGO = 27; // big button = esc
    var SIMULATED_KEY_BACK = 77; // back button = "m" for mute
    var prev_gamepad_r1 = false;
    var prev_gamepad_r2 = false;
    var prev_gamepad_l1 = false;
    var prev_gamepad_l2 = false;


    window.addEventListener("gamepadconnected", function(e) {
    // Gamepad connected
    console.log("Gamepad connected", e.gamepad);
    });

    window.addEventListener("gamepaddisconnected", function(e) {
    // Gamepad disconnected
    console.log("Gamepad disconnected", e.gamepad);
    });

    function applyDeadzone(number, threshold)
    {
        var percentage = (Math.abs(number) - threshold) / (1 - threshold);
        if(percentage < 0){
            percentage = 0;
        }
        return percentage * (number > 0 ? 1 : -1);
    }

    function handle_gamepad()
    {
        if (!gamepad) // always null until you press a button!
        {
            //console.log("Init gamepad..."); // spammy
            if (!navigator.getGamepads)
            {
                console.log("Gamepad NOT supported on this browser!");
                return; // not supported?
            }
        }
        // poll every frame
        var joystickX = 0;
        var joystickY = 0;
        gamepad = navigator.getGamepads()[0];
        if (gamepad)
        {
            //console.log("Gamepad detected: " + gamepad.axes[0] + "," + gamepad.axes[1]);
            joystickX = applyDeadzone(gamepad.axes[0], 0.25);
            gamepad_right = (joystickX > 0);
            gamepad_left = (joystickX < 0);
            joystickY = applyDeadzone(gamepad.axes[1], 0.25);
            gamepad_down = (joystickY > 0);
            gamepad_up = (joystickY < 0);

            joystickX = applyDeadzone(gamepad.axes[2], 0.25);
            gamepad_look_right = (joystickX > 0);
            gamepad_look_left = (joystickX < 0);
            joystickY = applyDeadzone(gamepad.axes[3], 0.25);
            gamepad_look_down = (joystickY > 0);
            gamepad_look_up = (joystickY < 0);

            gamepad_jump = (applyDeadzone(gamepad.buttons[0].value, 0.25)>0); // [A]
            gamepad_fire = (applyDeadzone(gamepad.buttons[1].value, 0.25)>0); // [B]
            //gamepad_logo = (applyDeadzone(gamepad.buttons[???].value, 0.25)>0); // FIXME: never fires? Steam intercepts it!
            gamepad_back = (applyDeadzone(gamepad.buttons[8].value, 0.25)>0); // [BACK]
            gamepad_start = (applyDeadzone(gamepad.buttons[9].value, 0.25)>0); // [START]
            gamepad_r1 = (applyDeadzone(gamepad.buttons[5].value, 0.25)>0);
            gamepad_r2 = (applyDeadzone(gamepad.buttons[7].value, 0.25)>0);
            gamepad_l1 = (applyDeadzone(gamepad.buttons[4].value, 0.25)>0);
            gamepad_l2 = (applyDeadzone(gamepad.buttons[6].value, 0.25)>0);

        }
        else
        {
            //console.log("No gamepad detected! YET..."); // spammy before button press
        }

        // compare previous state and send fake keyboard events
        fake_keyboard_events();

        window.requestAnimationFrame(handle_gamepad);
    }

    var prevFrontWallSelection = TOPLEFTFRONTWALL;
    var prevBackWallSelection = LEFTBACKWALL;
    var prevWallFront = true;
    function fake_keyboard_events() // if any
    {
        // compare previous state and simulate a keypress if changed
        if (!prev_gamepad_left && gamepad_left) simulateKeyDown(SIMULATED_KEY_LEFT);
        if (!prev_gamepad_right && gamepad_right) simulateKeyDown(SIMULATED_KEY_RIGHT);
        if (!prev_gamepad_up && gamepad_up) simulateKeyDown(SIMULATED_KEY_UP);
        if (!prev_gamepad_down && gamepad_down) simulateKeyDown(SIMULATED_KEY_DOWN);
        if (!prev_gamepad_fire && gamepad_fire) { 
            if (!SQUASH_ENCOUNTER_B_BUTTON_MENUS_ONLY || 
                (SQUASH_ENCOUNTER_B_BUTTON_MENUS_ONLY && window.menuActive) || 
                (SQUASH_ENCOUNTER_B_BUTTON_MENUS_ONLY && window.escPress)
                ) 
                {
                    // squash encounter game specific hardcoded state check
                    console.log("[B] = ESC when menuActive or escPress");
                    simulateKeyDown(SIMULATED_KEY_FIRE); 
                }
        }
        if (!prev_gamepad_jump && gamepad_jump) { console.log("[A] = SPACE"); simulateKeyDown(SIMULATED_KEY_JUMP); }
        if (!prev_gamepad_start && gamepad_start) { console.log("[START] = ESC"); simulateKeyDown(SIMULATED_KEY_START); }
        if (!prev_gamepad_back && gamepad_back) { console.log("[BACK] = M"); simulateKeyDown(SIMULATED_KEY_BACK); }
        //if (!prev_gamepad_logo && gamepad_logo) { console.log("[LOGO]"); simulateKeyDown(SIMULATED_KEY_LOGO); }

        if (prev_gamepad_left && !gamepad_left) simulateKeyUp(SIMULATED_KEY_LEFT);
        if (prev_gamepad_right && !gamepad_right) simulateKeyUp(SIMULATED_KEY_RIGHT);
        if (prev_gamepad_up && !gamepad_up) simulateKeyUp(SIMULATED_KEY_UP);
        if (prev_gamepad_down && !gamepad_down) simulateKeyUp(SIMULATED_KEY_DOWN);
        if (prev_gamepad_fire && !gamepad_fire) simulateKeyUp(SIMULATED_KEY_FIRE);
        if (prev_gamepad_jump && !gamepad_jump) simulateKeyUp(SIMULATED_KEY_JUMP);
        if (prev_gamepad_start && !gamepad_start) simulateKeyUp(SIMULATED_KEY_START);
        if (prev_gamepad_back && !gamepad_back) simulateKeyUp(SIMULATED_KEY_BACK);
        //if (prev_gamepad_logo && !gamepad_logo) simulateKeyUp(SIMULATED_KEY_LOGO);

        if (SQUASH_ENCOUNTER_WALL_SELECTING)
        {
            // squash encounter game-specific extras:
            if (window.PlayerClass != undefined) // sanity check
            {

                if (prevWallFront && gamepad_r1)
                {
                    //console.log('TARGET TOPRIGHTFRONTWALL');
                    prevFrontWallSelection = TOPRIGHTFRONTWALL;
                    selectFrontWall(0,0,prevFrontWallSelection);
                }
                if (prevWallFront && gamepad_r2)
                {
                    //console.log('TARGET BOTTOMRIGHTFRONTWALL');
                    prevFrontWallSelection = BOTTOMRIGHTFRONTWALL;
                    selectFrontWall(0,0,prevFrontWallSelection);
                }
                if (prevWallFront && gamepad_l1)
                {
                    //console.log('TARGET TOPLEFTFRONTWALL');
                    prevFrontWallSelection = TOPLEFTFRONTWALL;
                    selectFrontWall(0,0,prevFrontWallSelection);
                }
                if (prevWallFront && gamepad_l2)
                {
                    //console.log('TARGET BOTTOMLEFTFRONTWALL');
                    prevFrontWallSelection = BOTTOMLEFTFRONTWALL;
                    selectFrontWall(0,0,prevFrontWallSelection);
                }
                if (!prevWallFront && (gamepad_r1 || gamepad_r2))
                {
                    //console.log('TARGET RIGHTBACKWALL');
                    prevBackWallSelection = RIGHTBACKWALL;
                    selectBackWall(0,0,prevBackWallSelection);
                }
                if (!prevWallFront && (gamepad_l1 || gamepad_l2))
                {
                    //console.log('TARGET LEFTBACKWALL');
                    prevBackWallSelection = LEFTBACKWALL;
                    selectBackWall(0,0,prevBackWallSelection);
                }

                if (gamepad_look_up) // switch current target direction
                {
                    //console.log('SELECTING FRONT WALL');
                    selectFrontWall(0,0,prevFrontWallSelection);
                    prevWallFront = true;
                }
                
                if (gamepad_look_down)
                {
                    //console.log('SELECTING BACK WALL');
                    selectBackWall(0,0,prevBackWallSelection);
                    prevWallFront = false;
                }
          
            }
            else
            {
                console.log("ERROR: GamepadKeyboardEventEmulator is missing the PlayerClass");
            }
        }

        // now remember current state
        prev_gamepad_left = gamepad_left;
        prev_gamepad_right = gamepad_right;
        prev_gamepad_up = gamepad_up;
        prev_gamepad_down = gamepad_down;
        prev_gamepad_fire = gamepad_fire;
        prev_gamepad_jump = gamepad_jump;
        prev_gamepad_start = gamepad_start;
        prev_gamepad_logo = gamepad_logo;
        prev_gamepad_back = gamepad_back;
        
    }
    
    function simulateKeyDown(thisKey) 
    {
        if (!thisKey) return;
        //console.log('gamepad keydown: ' + thisKey)
        var oEvent = document.createEvent('KeyboardEvent');
        Object.defineProperty(oEvent, 'keyCode', { get : function() { return this.keyCodeVal; } });     
        Object.defineProperty(oEvent, 'which', { get : function() { return this.keyCodeVal; } });     
        if (oEvent.initKeyboardEvent) {
            oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, thisKey, thisKey);
        } else {
            oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, thisKey, 0);
        }
        oEvent.keyCodeVal = thisKey;
        document.dispatchEvent(oEvent);
    }
    
    function simulateKeyUp(thisKey) 
    {
        if (!thisKey) return;
        // console.log('gamepad keyup: ' + thisKey)
        var oEvent = document.createEvent('KeyboardEvent');
        Object.defineProperty(oEvent, 'keyCode', { get : function() { return this.keyCodeVal; } });     
        Object.defineProperty(oEvent, 'which', { get : function() { return this.keyCodeVal; } });     
        if (oEvent.initKeyboardEvent) {
            oEvent.initKeyboardEvent("keyup", true, true, document.defaultView, false, false, false, false, thisKey, thisKey);
        } else {
            oEvent.initKeyEvent("keyup", true, true, document.defaultView, false, false, false, false, thisKey, 0);
        }
        oEvent.keyCodeVal = thisKey;
        document.dispatchEvent(oEvent);
    }

    // init
    console.log('Initializing gamepad support...')
    window.requestAnimationFrame(handle_gamepad);

} // GamepadKeyboardEventEmulator