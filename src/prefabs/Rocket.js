//Rocket prefab
'use strict';
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {

        // parent constructor
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        //track rocket's firing status
        this.isFiring = false;

        this.launchSpeed = 2;
        this.moveSpeed = 120;

        // enable physics for this object in its scene
        scene.physics.world.enableBody(this);

        // add rocket sound
        this.sfxRocket = scene.sound.add('sfx_rocket');
    }

    preUpdate() {

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
}