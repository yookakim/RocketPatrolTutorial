'use strict';
class Arena extends Phaser.Scene {
    

    constructor() {
        super("arenaScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // white rectangular borders
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        //create explosion animation from preloaded spritesheet
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        
        // add rocket (player 1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket', 0);
        this.p1Rocket.setScale(0.5, 0.5);
        this.p1Rocket.setOrigin(0, 0);
        this.p1Rocket.setActive(true);

        
        
        // create game object pool for spaceships

        /*
            Referenced code example for sprite pool from official Phaser website:
            https://github.com/photonstorm/phaser3-examples/blob/master/public/src/game%20objects/group/sprite%20pool.js
        */

        // this.spaceshipGroup = this.add.group({
        //     defaultKey: 'spaceship',            //
        //     runChildUpdate: true,
        //     createCallback: function (spaceship) {
                
        //     },
        // });
        
        // add spaceships (x3)
        this.ship01 = this.shipSpawn(game.config.width + 192, 132, 30);
        this.ship02 = this.shipSpawn(game.config.width + 96, 196, 20);
        this.ship03 = this.shipSpawn(game.config.width, 260, 10);
        
        console.log(this.ship01);

        // score
        this.p1Score = 0;
        
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        
        // game over flag
        this.gameOver = false;
        
        // 60-second game clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'R to (R)estart, Spacebar for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);     
    }
    
    update() {
        // check key input for restart
        if (this.gameOver) {
            if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
                this.scene.restart(this.p1Score);
            }
            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.scene.start('menuScene');
            }
            this.disableObjects();
        }
        
        // scroll tile sprite
        this.starfield.tilePositionX -= 4;
/*
        if (!this.gameOver) {
            // update rocket
            this.p1Rocket.update();
        }
*/


        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipDestroy(this.ship03);
        }
        
        if(this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipDestroy(this.ship02);
        }
        
        if(this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipDestroy(this.ship01);
        }
        
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if( rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
        } else {
            return false;
        }
    }

    shipSpawn(x, y, pointsValue) {
        
        var tempShip = new Spaceship(this, x, y, 'spaceship', 0, pointsValue);

        // make sure our new/reused ship is seen and active
        tempShip.setActive(true);
        tempShip.setVisible(true);

        // set origin to upper left corner
        tempShip.setOrigin(0, 0);
            
        return tempShip;
        
    }

    shipDestroy(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });       
        // score increment and repaint
        this.changeScore(ship.points);
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');         
    }

    disableObjects() {
        this.ship01.setActive(false);
        this.ship02.setActive(false);
        this.ship03.setActive(false);
        this.p1Rocket.setActive(false);
        this.starfield.setActive(false);

    }

    changeScore(score) {
    //isolate score-changing function from shipDestroy, for more flexibility
        this.p1Score += score;
    }
}