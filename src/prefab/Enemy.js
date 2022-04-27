const defaultDeathCondition = (enemy) => {
    return enemy.y > game.config.height;
};

const defaultMovement = (enemy, delta) => {
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
            texture, startFrame, endFrame, speed, shootInterval, health,
            deathFunction=defaultDeathCondition, 
            moveFunction=defaultMovement,
            fireFunction=defaultFire
        }) {

        super(scene, x, y, texture, startFrame);

        this.scale = SCALE;

        this.maxHealth = health;
        this.health = this.maxHealth;
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

        this.anims.play('animation');
    }

    update(delta) {
        // TODO: make time accurate (untie fps)
        this.time += delta;

        this.moveFunction(this, delta);

        // TODO: Change enemy angle based off velocity

        if (this.health <= 0) {                 // FOR DEBUGGING; displays explosions at top
            this.explodinate();                 // dunno why, ships are dying before getting to bottom
        }                                       // maybe need to have enemy bullets and player bullets
    }

    explodinate() {
        // Destruction of being if health gets too low
        let boom = this.scene.add.sprite(this.x, this.y, 'healthbar').setOrigin(0.5,0.5);
        boom.scale = SCALE*2;
        boom.anims.play('explosion');
        boom.on('animationComplete', () => {
            boom.alpha = 0;
            boom.destroy();
        });
        this.remove = true;
    };

    reset() {       
        this.time = 0;
        this.active = true;
        this.visible = true;
        this.shootTimer.paused = false;
        this.clearTint();

        this.health = this.maxHealth;
    }
}