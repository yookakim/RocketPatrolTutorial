//Rocket prefab
'use strict';
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add object to existing scene
        scene.add.existing(this);

        //track rocket's firing status
        this.isFiring = false;

        this.launchSpeed = 2;
        this.moveSpeed = 2;
        scene.physics.world.enableBody(this);

        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    preUpdate() {
        // left/right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= 47) {
                this.x -= this.moveSpeed;
            } else if(keyRIGHT.isDown && this.x <= 578) {
                this.x += this.moveSpeed;
            }
        }

        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }

        // if fired, move up
        if(this.isFiring && this.y >= 108) {
            this.y -= this.launchSpeed;
        }

        // reset on miss
        if(this.y <= 108) {
            this.isFiring = false;
            this.y = 431;
        }
    }

    // reset rocekt to "ground"
    reset() {
        this.isFiring = false;
        this.y = 431;
    }
}