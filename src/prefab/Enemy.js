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
            texture, startFrame, endFrame, speed, shootInterval, health, damage, score,
            deathFunction=defaultDeathCondition, 
            moveFunction=defaultMovement,
            fireFunction=defaultFire
        }) {

        super(scene, x, y, texture, startFrame);

        this.scale = SCALE;
        // Variables
        this.maxHealth = health;
        this.health = this.maxHealth;
        this.speed = speed;
        this.shootInterval = shootInterval;
        this.damage = damage;
        this.texture = texture;

        this.deathFunction = deathFunction;
        this.moveFunction = moveFunction;
        // TODO: Add more to enemy config (behaviour)

        this.time = 0;

        this.score = score;

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

        this.enemyHit = this.scene.particles.createEmitter({
            x: this.x,
            y: this.y,
            scale: 1,
            // **emitter**
            name: 'Mitten',
            on: false,          // set false to stop emitter
            active: true,      // set false to pause emitter and particles
            frequency: 1,      // -1 for exploding emitter
            quantity: {min: 5, max: 5},       // { min, max }
            maxParticles: 0,
            reserve: 15,
            // rotate: this.player.velocityX,           // I want to get it to rotate with the player direction
            timeScale: 1,
            // repeating values
            // delay: {min: 5, max: 5},
            lifespan: {min: 150, max: 300},
            // directionx
            // radial: true,
            angle: {min: 235, max: 305},
            // velocity
            speed: {min: 250, max: 550},
            gravityY: 1500,
            // sprite sheet frames : animation
            frame: 10, //{start: 9, end: 11}
            cycle: true 
        });

        this.enemyExplodinate = this.scene.particles.createEmitter({
            x: this.x,
            y: this.y,
            scale: 1,
            // **emitter**
            name: 'Explode',
            on: false,          // set false to stop emitter
            active: true,      // set false to pause emitter and particles
            frequency: 1,      // -1 for exploding emitter
            quantity: {min: 35, max: 45},       // { min, max }
            maxParticles: 0,
            reserve: 15,
            // rotate: this.player.velocityX,           // I want to get it to rotate with the player direction
            timeScale: 1,
            // repeating values
            delay: {min: 15, max: 35},
            lifespan: {min: 50, max: 200},
            // directionx
            // radial: true,
            angle: {min: 0, max: 360},
            // velocity
            speed: {min: 50*this.scale, max: 150*this.scale},
            // acceleration: -500,
            // sprite sheet frames : animation
            frame: 10,
            cycle: true
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
        let scale = this.findScale();
        // Particles
        this.enemyExplodinate.setPosition(this.x, this.y);
        this.enemyExplodinate.setScale(scale/2);
        this.enemyExplodinate.setLifespan({min: 50, max: 300 + 50*scale});
        this.enemyExplodinate.start();
        // Screenshake
        this.scene.screenshake(10, 0.5);
        // Explosion animation
        let boom = this.scene.add.sprite(this.x, this.y, 'superExplosion-sheet').setOrigin(0.5,0.5);
        boom.scale = scale;
        boom.anims.play('super-explosion');           // super-explosion
        this.scene.time.delayedCall(25, () => {
            this.enemyExplodinate.stop();
            this.scene.explode.play();
        });
        boom.on('animationcomplete', () => {
       
            boom.alpha = 0;
            boom.destroy();
        });
        this.remove = true;
        this.scene.score += this.score;
    };

    reset() {       
        this.time = 0;
        this.active = true;
        this.visible = true;
        this.shootTimer.paused = false;
        this.clearTint();

        this.health = this.maxHealth;
    }

    hit(damage) {
        this.scene.hit.play();
        this.health -= damage;
        this.setTintFill(0xffffff);
        this.scene.physics.pause();
        this.enemyHit.setPosition(this.x, this.y + this.height*0.8);
        this.enemyHit.start();
        this.clearTintCall = this.scene.time.delayedCall(125, () => {
            this.clearTint();
            this.enemyHit.stop();
        }, null, this);
        this.scene.time.delayedCall(25, () => {
            this.scene.physics.resume();
            this.enemyHit.stop();
        })
        let boom = this.scene.add.sprite(this.x, this.y, 'healthbar').setOrigin(0.5,0.5);
        boom.scale = SCALE;
        boom.anims.play('explosion');
        boom.on('animationcomplete', () => {
            boom.alpha = 0;
            boom.destroy();
        });
        if (this.health <= 0) {
            this.explodinate();
        };
    }

    findScale() {
        let key = this.texture.key;
        if (key == 'enemy1') {
            return SCALE * 1.2
        }
        else if (key == 'enemy2') {
            return SCALE * 1.5
        }
        else if (key == 'enemy3') {
            return SCALE * 2
        }
        else if (key == 'enemy4') {
            return SCALE * 2
        }
        else if (key == 'asteroid') {
            return SCALE * 1.5
        };
    }
}