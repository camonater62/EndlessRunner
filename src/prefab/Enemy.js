const defaultDeathCondition = (enemy) => {
    // TODO: Handle getting shot
    return enemy.y > game.config.height;
};

const defaultMovement = (enemy) => {
    enemy.y += enemy.speed;
}

const defaultFire = (enemy) => {
    // do nothing
}

class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, 
        {
            texture, startFrame, endFrame, speed, shootInterval, 
            deathFunction=defaultDeathCondition, 
            moveFunction=defaultMovement,
            fireFunction=defaultFire
        }) {

        super(scene, x, y, texture, startFrame);

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
            frameRate: 20
        });
    }

    update() {
        // TODO: Check collision

        this.time += 1 / game.config.fps;

        if (!this.anims.isPlaying) {
            this.anims.play('animation');
        }

        this.moveFunction(this);
    }

    checkCollision(player) {
        // AABB checking
        if (this.x < player.x + player.width && 
            this.x + this.width > player.x && 
            this.y < player.y + player.height && 
            this.y + this.height > player.y) {
                return true;
        } else {
            return false;
        }
    }
}