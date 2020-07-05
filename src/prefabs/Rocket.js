//Rocket prefab
'use strict';
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        this.inputListenerSetup();
        //track rocket's firing status
        this.isFiring = false;

        this.launchSpeed = 2;
        this.moveSpeed = 120;

        scene.physics.world.enableBody(this);

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
        // scene.input.keyboard.on('keydown-LEFT', function () {
        //     console.log('left pressed in rocket');
        // })
    }

    preUpdate() {
        // left/right movement
        // if(!this.isFiring) {
        //     if(keyLEFT.isDown && this.x >= 47) {
        //         this.body.velocity.x = -this.movespeed * 60;
        //     } else if(keyRIGHT.isDown && this.x <= 578) {
        //         this.body.velocity.x = this.movespeed * 60;
        //     }
        // }

        // fire button
        // if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
        //     this.isFiring = true;
        //     this.sfxRocket.play();  // play sfx
        // }

        // if fired, move up
        if(this.isFiring && this.y >= 108) {
            this.body.velocity.y = - this.launchSpeed * 60;
        }

        // reset on miss
        if(this.y <= 108) {
            this.reset();
        }
    }

    fire() {   
        if (!this.isFiring) {
            this.isFiring = true;
            this.body.setVelocity(0, 0);
            this.sfxRocket.play();
        }
    }



    // reset rocekt to "ground"
    reset() {
        this.isFiring = false;
        this.body.setVelocity(0, 0);
        this.y = 431;
    }

    // change left/right
    rocketStrafe(direction) {
        // I thought it would make sense to get the x values as a Vector2 object
        if (!this.isFiring) {
            this.body.setVelocity(direction.x * this.moveSpeed, direction.y);
        }
    }

    inputListenerSetup(scene) {
        // scene.input.keyboard.on('keydown-LEFT', this.move, this)
    }
}