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
                scene.addBullet(this.x + this.width / 2, this.y - 25, -1.5 * speed);
            },
            loop: true,
            paused: true,
            startAt: 250
        });
        
        // this.setCollideWorldBounds(true, game.config.width, game.config.height, 0);
    }

    update() {
        if (!this.anims.isPlaying) {
            this.anims.play('animation');
        }

        let velox = 0;
        let veloy = 0;

        if (keyLEFT.isDown || keyA.isDown) {
            // velox -= this.speed;
            if (!keyRIGHT.isDown || !keyD.isDown) {
                this.setAccelerationX(-this.ACCELERATION);
            }
            else {this.setAccelerationX(0)};
        } 
        else if (keyRIGHT.isDown || keyD.isDown) {
            // velox += this.speed;
            if (!keyLEFT.isDown || !keyA.isDown) {
                this.setAccelerationX(this.ACCELERATION);
            }
            else {this.setAccelerationX(0)};
        }
        else {this.setAccelerationX(0)};

        if (keyUP.isDown || keyW.isDown) {
            // veloy -= this.speed;
            if (!keyDOWN.isDown || keyS.isDown) {
                this.setAccelerationY(-this.ACCELERATION);
            }
            else {this.setAccelerationY(0)};
        }
        else if (keyDOWN.isDown || keyS.isDown) {
            // veloy += this.speed;
            if (!keyUP.isDown || !keyUP.isDown) {
                this.setAccelerationY(this.ACCELERATION);
            }
            else {this.setAccelerationY(0)};
        } 
        else {
            this.setAccelerationY(0);
        }

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
}