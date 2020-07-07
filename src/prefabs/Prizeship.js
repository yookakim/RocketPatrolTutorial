//Prize ship prefab
'use strict';
class Prizeship extends Spaceship {
    constructor(scene, x, y, texture, frame, pointValue) {

        super(scene, x, y, texture, frame, pointValue);

        this.speed = game.settings.prizeshipSpeed;
        
        this.body.setVelocity(-this.speed, 0);
    }
    preUpdate(time, delta) {

    }
    reset() {
        // override 
    }
}