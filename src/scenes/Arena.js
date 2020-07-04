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
        // this.physics.world.setFPS(60);
        
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // white rectangular borders
        
        this.drawWorld();
        this.inputSetup();   
        
        
        //create explosion animation from preloaded spritesheet
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        
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


        this.scoreLeft.on('scoreChange', function() {
            this.scoreLeft.updateText();
        })
        console.log(this.scoreLeft);
        // add rocket (player 1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket', 0);
        
        this.p1Rocket.setScale(0.5, 0.5);
        this.p1Rocket.setOrigin(0, 0);
        this.p1Rocket.setActive(true);
        
        
        
        // create game object pool for spaceships
        
        
        /*
            Referenced code from sprite pool example from official Phaser website:
            https://github.com/photonstorm/phaser3-examples/blob/master/public/src/game%20objects/group/sprite%20pool.js
        */

        this.spaceshipGroup = this.add.group({       //
            // runChildUpdate: true,
        });
        
        // add spaceships (x3)
        // shipAdd returns a gameobject of type Spaceship


        this.spaceshipGroup.add(this.shipAdd(game.config.width + 192, 132, 30));
        this.spaceshipGroup.add(this.shipAdd(game.config.width + 96, 196, 20));
        this.spaceshipGroup.add(this.shipAdd(game.config.width, 260, 10));

        console.log('p1 score 66:' + this.p1Score);

        this.physics.add.overlap(this.spaceshipGroup, this.p1Rocket, this.destroyEvent, null, this);
        console.log(this.rocketBoundaries);
        this.physics.add.collider(this.p1Rocket, this.rocketBoundaries, function () {
            console.log('collision rocket boundary');
        });
        
        // score
        
        // game over flag
        this.gameOver = false;
        
        // 60-second game clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'R to (R)estart, Spacebar for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.disableObjects();
        }, null, this);  
    }
    


    update(time, delta) {
        // check key input for restart
        if (this.gameOver) {
            if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
                
            }
            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.scene.start('menuScene');
            }
        } else {
            this.inputCheck(); 
        }
        
        // scroll tile sprite
        this.starfield.tilePositionX -= 8 * delta/60;
/*
        if (!this.gameOver) {
            // update rocket
            this.p1Rocket.update();
        }
*/      // console.log(this.p1Rocket.x + ', ' + this.p1Rocket.y);


        // if(this.checkCollision(this.p1Rocket, this.ship03)) {
        //     this.p1Rocket.reset();
        //     this.shipDestroy(this.ship03);
        // }
        
        // if(this.checkCollision(this.p1Rocket, this.ship02)) {
        //     this.p1Rocket.reset();
        //     this.shipDestroy(this.ship02);
        // }
        
        // if(this.checkCollision(this.p1Rocket, this.ship01)) {
        //     this.p1Rocket.reset();
        //     this.shipDestroy(this.ship01);
        // }
        
    }

    // checkCollision(rocket, ship) {
    //     // simple AABB checking
    //     if( rocket.x < ship.x + ship.width &&
    //         rocket.x + rocket.width > ship.x &&
    //         rocket.y < ship.y + ship.height &&
    //         rocket.height + rocket.y > ship.y) {
    //             return true;
    //     } else {
    //         return false;
    //     }
    // }

    shipAdd(x, y, pointsValue) {
        
        var tempShip = new Spaceship(this, x, y, 'spaceship', 0, pointsValue);

        // make sure our new/reused ship is seen and active
        tempShip.setActive(true);
        tempShip.setVisible(true);

        // set origin to upper left corner
        tempShip.setOrigin(0, 0);     
        
        return tempShip;
    }
/*
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
*/

    destroyEvent(spaceship, rocket) {
        // change score:
        this.changeScore(spaceship.points);
        console.log('score after in destroyEvent:' + this.p1Score);

        // on destroy event, spawn a new spaceship in same y coordinate
        // with same tier of points

        // (instead of just resetting position, I simply destroy the game object
        // and respawn a new one. it's probably less efficient, but it seemed to
        // make more sense)

        this.spaceshipGroup.add(this.shipAdd(game.config.width, spaceship.y, spaceship.points));
        
        this.shipDestroy(spaceship, rocket);
        this.p1Rocket.reset();
    }
    
    shipDestroy(spaceship, rocket) {
        console.log('destroying ship');
        this.changeScore(spaceship.points);
        spaceship.onExplode(this);
    }
    
    disableObjects() {
        // this.ship01.setActive(false);
        // this.ship02.setActive(false);
        // this.ship03.setActive(false);
        this.spaceshipGroup.children.each(function (spaceship) {
            // disable physics:
            this.physics.world.disableBody(spaceship.body);

            // set inactive then hide:
            this.spaceshipGroup.killAndHide(spaceship);
        }, this);
        // disable rocket physics
        this.physics.world.disableBody(this.p1Rocket);

        // stop rocket movement and set inactive
        this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.ZERO);
        this.p1Rocket.setActive(false);

    }
    

    changeScore(score) {
    //isolate score-changing function from shipDestroy, for more flexibility
        this.p1Score += score;
        this.scoreLeft.text = this.p1Score;
    }

    inputSetup() {
        // define input manager
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // input checking function for update()
    inputCheck() {
        if (this.gameOver) {
            if (keyR.isDown) {
                this.scene.restart(this.p1Score);
            }
            if (keySPACE.isDown) {
                this.scene.start('menuScene');
            }
        } else {
            if (keyLEFT.isDown) {
                // this.events.emit('keyLEFT');
                this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.LEFT);
                console.log('pressing left in arena');
                if (keyRIGHT.isDown) {
                    this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.ZERO);
                }
            } else if (keyRIGHT.isDown) {
                this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.RIGHT);
            } else if (keyLEFT.isUp && keyRIGHT.isUp) {
                this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.ZERO);
            }
        }


    

        // fire button
        // if(keyF.isDown) {
        //     console.log('fire rocket');
        //     this.sfxRocket.play();  // play sfx
        // }
    }
    
    drawWorld() {
        
        // make an array of rectangles as a boundary for the rocket
        var rectangleContainer = [
            this.physics.world.enableBody(this.add.rectangle(5, 5, 630, 32, 0xFFFFFF)).setOrigin(0, 0),
            this.physics.world.enableBody(this.add.rectangle(5, 443, 630, 32, 0xFFFFFF)).setOrigin(0, 0),
            this.physics.world.enableBody(this.add.rectangle(5, 5, 32, 455, 0xFFFFFF)).setOrigin(0, 0),
            this.physics.world.enableBody(this.add.rectangle(603, 5, 32, 455, 0xFFFFFF)).setOrigin(0, 0),
        ];

        // add the rectangles to a arcade physics group so we can check for collision
        this.rocketBoundaries = this.physics.add.group(rectangleContainer);

        // make each immovable so player and obstacle stays in bounds
        this.rocketBoundaries.children.iterate((rectangle) => {
            rectangle.body.immovable = true;
        }, this);
        
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);
    }
}