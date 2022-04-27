class Player extends Phaser.Physics.Arcade.Sprite {

    // TODO: config table
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.texture.setFilter('NEAREST');
        this.scale = SCALE/2;
        //this.scale = 0.6; // Would like to avoid this


        this.setMaxVelocity(speed)
        this.ACCELERATION = speed*7;
        this.DRAG = speed*6;
        this.setDragX(this.DRAG);
        this.setDragY(this.DRAG);
        this.max_health = 20;
        this.health = this.max_health;

        this.anims.create({
            key: 'animation',
            frames: this.anims.generateFrameNames(texture, {start: 2, end: 2, first: 2}),
            frameRate: 12
        });

        // Add to config
        this.shootTimer = scene.time.addEvent({
            delay: 200,         // 0 for laser!!
            callback: () => {
                scene.addBullet(this.x + this.width / 2, this.y - 25, -1.5 * speed, 'player');
            },
            loop: true,
            paused: true,
            startAt: 250
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

    hit(objectType) {
        if (objectType instanceof Bullet) {
            this.health -= 2;
        }
        else if (objectType instanceof Enemy) {
            this.health -= 5;
        }
        this.setTintFill(0xffffff);
        this.scene.clearTint = this.scene.time.delayedCall(250, () => {
            this.clearTint();
        }, null, this);
    }
}