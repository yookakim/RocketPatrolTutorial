//Rocket prefab
'use strict';
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        
        
        //store point value
        this.points = pointValue;
        this.speed = game.settings.spaceshipSpeed;
        
        // i set the origin to the corner here so that we avoid
        // the physics plugin shifting it in weird ways
        this.setOrigin(0, 0);

        // add object to existing scene
        scene.add.existing(this);
        
        scene.physics.world.enableBody(this);
        this.body.setVelocity(-this.speed, 0);

    }

    preUpdate() {
        // move spaceship left
        
        // wraparound from left to right edge
        if(this.x <= 0 - this.width) {
            this.x = game.config.width;
        }
    }

    onExplode(scene) {
        console.log(scene);
        scene.physics.world.disableBody(this.body);
        this.alpha = 0;                         // temporarily hide ship
        
        // create explosion sprite at ship's position
        let boom = scene.add.sprite(this.x, this.y, 'explosion').setOrigin(0, 0);

        boom.anims.play('explode');             // play explode animation
        scene.sound.play('sfx_explosion');      // play explosion sound
        this.destroy();                         // destroy gameobject
    }

    // checkCollision() {
    //     this.physics.add.collider();
    // }

    reset() {
        this.x = game.config.width;
    }
}