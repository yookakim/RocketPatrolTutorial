//Rocket prefab
'use strict';
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        
        
        //store point value
        this.points = pointValue;
        this.speed = game.settings.spaceshipSpeed;
        
        //console.log(game.settings.spaceshipSpeed);
        // add object to existing scene
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        this.body.velocity.x = -this.speed * 60;

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
        boom.on('animationcomplete', () => {    // callback after animation completes
            console.log('reset position');
            this.reset();                       // reset ship position
            this.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });       
        // score increment and repaint
        // scene.changeScore(ship.points);
        // scene.events.emit('spaceshipDestroyed', this.points);
        // scene.scoreLeft.text = scene.p1Score;
        scene.sound.play('sfx_explosion');
        this.destroy();
    }

    // checkCollision() {
    //     this.physics.add.collider();
    // }

    reset() {
        this.x = game.config.width;
    }
}