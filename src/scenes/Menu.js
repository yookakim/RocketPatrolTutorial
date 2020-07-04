'use strict';
class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
      // load audio
      this.load.audio('sfx_select', './assets/blip_select12.wav');
      this.load.audio('sfx_explosion', './assets/explosion38.wav');
      this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
    }    
    
    create() {
      //define keyboard inputs for this scene
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0,
        }

        // show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX, centerY - textSpacer, "ROCKET PATROL", menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, "Left/Right to move, F to Fire", menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = "#000";
        this.add.text(centerX, centerY + textSpacer, "Press Left for Easy or Right for Hard", menuConfig).setOrigin(0.5);
        
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy:
            game.settings = {
              spaceshipSpeed: 3,
              gameTimer: 3000,   
            }
            this.sound.play('sfx_select');
            this.scene.start("arenaScene");
          }
          if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard:
            game.settings = {
              spaceshipSpeed: 4,
              gameTimer: 8000,  
            }
            this.sound.play('sfx_select');
            this.scene.start("arenaScene");    
          }
    }

}