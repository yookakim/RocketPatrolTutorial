//create game configuration object

/*  points breakdown:
        Rework spaceship, rocket, and explosion sprites/assets: 25
        Create a new spaceship type with new artwork that is smaller and faster: 25
        Implement parallax scrolling: 15
        total (as of 12:25 am July 7 2020 after due date): 65 points/100
        
        work done after due date:
        Display the remaining time in seconds on the screen: 15
        track a high score that persists across screens: 10
        total (as of 1:09 am): 90 points

        -- Yooha Kim (1548605)
*/

'use strict';

let globalHighScore = 0;

let config = {
    type: Phaser.Canvas,
    width: 640,
    height: 480,
    fps: {
        // smoothStep: true,
        target: 30,
    },
    
    pixelArt: true,
    
    physics: {
        default: 'arcade',
        arcade: {
            // debug: false,
            fps: 140,
        },
    },
    scene: [ Menu, Arena ],
}

//create game object...
let game = new Phaser.Game(config);

// define game settings
// game.settings = {
//     defaultSpaceshipSpeed: 3,
//     gameTimer: 60000,
// }

//reserve some keyboard bindings
let keyF, keyR, keyLEFT, keyRIGHT, keySPACE;