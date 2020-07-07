'use strict';
class Arena extends Phaser.Scene {
    

    constructor() {
        super("arenaScene");
    }
    
    preload() {

        // load images/tile sprites
        // this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('planet1', './assets/planet1.png');
        this.load.image('asteroid1', './assets/asteroid1.png');
        
        // load spritesheets
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('rocketanim', './assets/rocketanim.png', {frameWidth: 32, frameHeight: 16, startFrame: 0, endFrame: 7});
    }
    
    create() {
        
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        // white rectangular borders
        
        this.drawWorld();

        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        this.p1Score = 0;

        // scoreboard setup
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

        // setup input
        this.inputSetup();   
                
        //create explosion animation from preloaded spritesheet
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 24,
        });
        
        this.anims.create({
            key: 'rocketfire',
            frames: this.anims.generateFrameNumbers('rocketanim', { start: 0, end: 7, first: 0}),
            frameRate: 8,
            repeat: -1,
        })
        
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocketanim', 0);

        // this.scoreLeft.on('scoreChange', function() {
        //     this.scoreLeft.updateText();
        // })

        // add rocket (player 1)
        
        // this.p1Rocket.setScale(0.5, 0.5);
        this.p1Rocket.setOrigin(0, 0);
        this.p1Rocket.setActive(true);                
        
        // create game object group for spaceships for easier collisions
        // i do a similar thing when making the rectangle boundaries, but
        // dont implement it in the same fashion, to-do
        this.spaceshipGroup = this.add.group();
        
        // add spaceships (x3)
        // shipAdd returns a gameobject of type Spaceship
        this.spaceshipGroup.add(this.shipAdd(game.config.width + 192, 132, 30));
        this.spaceshipGroup.add(this.shipAdd(game.config.width + 96, 196, 20));
        this.spaceshipGroup.add(this.shipAdd(game.config.width, 260, 10));

        // create colliders using physics plugin
        this.physics.add.overlap(this.spaceshipGroup, this.p1Rocket, this.destroyEvent, null, this);
        this.physics.add.collider(this.p1Rocket, this.rocketBoundaries);
        
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
                this.scene.restart(this.p1Score);
            }
            if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.scene.start('menuScene');
            }
        } else {
            this.inputCheck(); 
        }
        
        // scroll tile sprite
        this.starfield.tilePositionX -= 1 * delta/60;
            }

    shipAdd(x, y, pointsValue) {
        
        var tempShip = new Spaceship(this, x, y, 'spaceship', 0, pointsValue);

        // make sure our new/reused ship is seen and active
        tempShip.setActive(true);
        tempShip.setVisible(true);
        
        // return the spaceship
        return tempShip;
    }

    destroyEvent(spaceship, rocket) {

        // change score:
        this.changeScore(spaceship.points);

        // on destroy event, spawn a new spaceship in same y coordinate
        // with same tier of points

        // (instead of just resetting position, I simply destroy the game object
        // and respawn a new one. it's probably less efficient, but it seemed to
        // make more sense)
        
        if (spaceship.points === 30) {
            this.spaceshipGroup.add(this.shipAdd(game.config.width, 132, spaceship.points));
        }
        if (spaceship.points === 20) {
            this.spaceshipGroup.add(this.shipAdd(game.config.width, 196, spaceship.points));            
        }
        if (spaceship.points === 10) {
            this.spaceshipGroup.add(this.shipAdd(game.config.width, 260, spaceship.points));            
        }

        this.shipDestroy(spaceship, rocket);
        this.p1Rocket.reset();
    }
    
    shipDestroy(spaceship, rocket) {

        spaceship.onExplode(this);
    }
    
    disableObjects() {

        this.spaceshipGroup.children.each(function (spaceship) {            
            // disable physics:
            this.physics.world.disableBody(spaceship.body);
            // set inactive then hide:
            this.spaceshipGroup.killAndHide(spaceship);
        }, this);

        // stop rocket movement and set inactive
        this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.ZERO);

        // disable rocket physics (do this after setting velocity to 0)
        this.physics.world.disableBody(this.p1Rocket);

        this.p1Rocket.setActive(false);
        this.p1Rocket.destroy();
    }
    

    // isolate score-changing function from shipDestroy, for more flexibility
    changeScore(score) {

        this.p1Score += score;
        this.scoreLeft.text = this.p1Score;
    }

    // define input manager
    inputSetup() {

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
        }

        /*
            // passing a vector2 into a parameter whos function primarily should only 
            // be making horizontal calculations seems a little sus but i kept it cuz i like
            // the Phaser vector2 constants (I should prolly just define it globally like the 
            // keyboard inputs)
        */
        if (!this.gameOver) {


            if (keyLEFT.isDown) {
                // go left...
                this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.LEFT);
                if (keyRIGHT.isDown) {
                    //if both Left and Right are down, stop horizontal movement
                    this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.ZERO);
                }
            } else if (keyRIGHT.isDown) {
                // if not both down, but only right, then go right
                this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.RIGHT);
            } else if (keyLEFT.isUp && keyRIGHT.isUp) {
                // if both left and right are up, then set horizontal velocity to 0
                // (this part feels really hacky and suspicious)
                this.p1Rocket.rocketStrafe(Phaser.Math.Vector2.ZERO);
            }

            if (keyF.isDown) {
                //this.p1Rocket.play('rocketfire');
                this.p1Rocket.fire();
            }
        }
    }
    
    drawWorld() {
        
        this.planet1 = this.add.sprite(-200, 300, 'planet1').setScale(6, 6);
        this.physics.world.enableBody(this.planet1);
        this.planet1.body.velocity.x = 50;
        this.planet1.z = -5;
        
        this.asteroid1 = this.add.sprite(-700, 350, 'asteroid1').setScale(6, 6);
        this.physics.world.enableBody(this.asteroid1);
        this.asteroid1.body.velocity.x = 250;
        this.asteroid1.z = -5;

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
            rectangle.setDepth(1000);
        }, this);
    }
}