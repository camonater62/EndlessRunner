const defaultDeathCondition = (enemy) => {
    return enemy.y > game.config.height;
};

const defaultMovement = (enemy) => {
    enemy.y += enemy.speed;
}

class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, {texture, startFrame, endFrame, speed, shootInterval, deathFunction=defaultDeathCondition, moveFunction=defaultMovement}) {
        super(scene, x, y, texture, startFrame);

        this.speed = speed;
        this.shootInterval = shootInterval;
        // this.dead = false;
        this.deathFunction = deathFunction;
        this.moveFunction = moveFunction;
        // TODO: Add more to enemy config (behaviour)

        scene.add.existing(this);

        this.anims.create({
            key: 'animation',
            frames: this.anims.generateFrameNames(texture, {
                start: startFrame, 
                end: endFrame, 
            }),
            frameRate: 20
        });
    }

    update() {
        // TODO: Check collision

        if (!this.anims.isPlaying) {
            this.anims.play('animation');
        }

        // this.y += this.speed;
        this.moveFunction(this);

        // this.dead = this.deathFunction(this);
    }
}