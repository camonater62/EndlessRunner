const defaultDeathCondition = (enemy) => {
    return enemy.y > game.config.height;
};

const defaultMovement = (enemy) => {
    // enemy.y += enemy.speed;
    enemy.setVelocityY(enemy.speed);
}

const defaultFire = (enemy) => {
    // do nothing
}

// TODO: save animations
let animations;

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, 
        {
            texture, startFrame, endFrame, speed, shootInterval,
            deathFunction=defaultDeathCondition, 
            moveFunction=defaultMovement,
            fireFunction=defaultFire
        }) {

        super(scene, x, y, texture, startFrame);

        this.scale = SCALE;

        this.speed = speed;
        this.shootInterval = shootInterval;

        this.deathFunction = deathFunction;
        this.moveFunction = moveFunction;
        // TODO: Add more to enemy config (behaviour)

        this.time = 0;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.anims.create({
            key: 'animation',
            frames: this.anims.generateFrameNames(texture, {
                start: startFrame, 
                end: endFrame, 
            }),
            frameRate: 12,
            repeat: -1
        });

        this.shootTimer = scene.time.addEvent({
            delay: shootInterval,
            callback: () => {fireFunction(this);},
            loop: true,
        });
    }

    update() {
        // TODO: make time accurate (untie fps)
        this.time += 1 / game.config.fps;

        if (!this.anims.isPlaying) {
            this.anims.play('animation');
        }

        this.moveFunction(this);
    }
}