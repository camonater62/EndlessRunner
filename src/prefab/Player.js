class Player extends Phaser.Physics.Arcade.Sprite {

    // TODO: config table
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.texture.setFilter('NEAREST');
        this.scale = SCALE/2;
        //this.scale = 0.6; // Would like to avoid this

        // Physics
        this.setMaxVelocity(speed)
        this.ACCELERATION = speed*8;
        this.DRAG = speed*6;
        this.setDragX(this.DRAG);
        this.setDragY(this.DRAG);
        // Variables
        this.MAXHEALTH = 20;
        this.health = this.MAXHEALTH;
        this.baseRegen = 0.05;
        this.regenRate = this.baseRegen;
        this.particleBase = 25

        this.anims.create({
            key: 'animation',
            frames: this.anims.generateFrameNames(texture, {start: 2, end: 2, first: 2}),
            frameRate: 12
        });

        this.playerHit = this.scene.particles.createEmitter({
            x: this.x,
            y: this.y,
            // follow: this,
            // followOffset: {
            //     x: this.width/2,
            //     y: this.height/2,
            // },
            scale: this.scale,
            // **emitter**
            name: 'Kachow',
            on: false,          // set false to stop emitter
            active: true,      // set false to pause emitter and particles
            frequency: 1,      // -1 for exploding emitter
            quantity: {min: 25, max: 35},       // { min, max }
            maxParticles: 0,
            reserve: 15,
            // rotate: this.player.velocityX,           // I want to get it to rotate with the player direction
            timeScale: 1,
            // repeating values
            delay: {min: 25, max: 55},
            lifespan: {min: 115, max: 275},
            // directionx
            // radial: true,
            angle: {min: 0, max: 360},
            // velocity
            speed: {min: 125, max: 300},
            acceleration: -500,
            // sprite sheet frames : animation
            frame: 7,
            alpha: 1,
            cycle: true
        });

        // this.shootTimer = scene.time.addEvent({
        //     delay: shootInterval,
        //     callback: () => {fireFunction(this);},
        //     loop: true,
        // });

        // Add to config
        this.shootTimer = scene.time.addEvent({
            delay: 175,         // 0 for laser!!
            callback: () => {
                scene.addBullet(this.x + this.width / 2, this.y - 25, -1.5 * speed, 'player');
                this.scene.laser.play();
            },
            loop: true,
            paused: true,
            startAt: 250
        });

        this.degrade = this.scene.time.addEvent({
            delay: 30,
            callback: () => {
                // Increase Health
                this.health -= this.regenRate;
                this.scene.updateHealthBar();
                // If health is too much, stop function
                if (this.health >= this.MAXHEALTH) {
                    this.health = this.MAXHEALTH;
                    this.scene.time.removeEvent(this.heal);
                };
            },
            loop: true,
            startAt: -500
        });

        // this.setCollideWorldBounds(true, game.config.width, game.config.height, 0);
    }

    update(delta) {
        if (!this.anims.isPlaying) {
            this.anims.play('animation');
        }

        let accelx = 0;
        let accely = 0;
        

        if (keyLEFT.isDown || keyA.isDown) {
            accelx -= this.ACCELERATION;
        } 
        if (keyRIGHT.isDown || keyD.isDown) {
            accelx += this.ACCELERATION;
        }

        if (keyUP.isDown || keyW.isDown) {
            accely -= this.ACCELERATION;
        }
        if (keyDOWN.isDown || keyS.isDown) {
            accely += this.ACCELERATION;
        } 

        this.setAccelerationX(accelx);
        this.setAccelerationY(accely);

        // if (velox != 0 && veloy != 0) {
        //     velox /= SQRT2;
        //     veloy /= SQRT2;
        // }
        // this.setVelocityX(velox);
        // this.setVelocityY(veloy);

        if (keySpace.isDown) {
            if (this.shootTimer.paused) {
                // Let player immediately shoot when they press space
                // Is spammable; problem?
                this.shootTimer.paused = false;
                this.shootTimer.callback();
                this.shootTimer.elapsed = 0;
            }
        }
        if (keySpace.isUp) {
            this.shootTimer.paused = true;
        }


        this.y = max(min(game.config.height - this.height / 2, this.y), -this.height / 2);
        this.x = max(min(game.config.width - this.width / 2, this.x), -this.width / 2);
    }

    hit(damage) {
        this.scene.playerdamage.play();
        this.health -= damage;
        this.scene.time.removeEvent(this.heal, this.increaseHeal);
        this.setTintFill(0xffffff);
        this.playerHit.setPosition(this.x + this.width/2, this.y + this.height/2)
        this.playerHit.setQuantity({min:65, max: 75})//this.particleBase*(damage+10)
        this.playerHit.start();
        this.scene.physics.pause();
        this.particleStop = this.scene.time.delayedCall(25, () => {
            this.playerHit.stop();
        });

        let boom = this.scene.add.sprite(this.x + this.width/2, this.y + this.height/2, 'healthbar').setOrigin(0.5,0.5);
        boom.scale = SCALE*1.5;
        boom.anims.play('super-explosion');
        boom.on('animationcomplete', () => {
            boom.alpha = 0;
            boom.destroy();
        });
        this.clearTintCall = this.scene.time.delayedCall(125 +damage*5, () => {
            this.clearTint();
            this.scene.physics.resume();
        }, null, this);
    }

    heal(damage) {
        this.health += damage;
        if (this.health > this.MAXHEALTH) {
            this.health = this.MAXHEALTH;
        }
    }
}