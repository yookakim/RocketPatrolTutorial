//create game configuration object
'use strict';
let config = {
    type: Phaser.Canvas,
    width: 640,
    height: 480,
    fps: {
        target: 140,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
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