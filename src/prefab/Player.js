class Player extends Phaser.Physics.Arcade.Sprite {

    // TODO: config table
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.texture.setFilter('NEAREST');
        //this.scale = 0.6; // Would like to avoid this


        this.speed = speed;

        this.anims.create({
            key: 'animation',
            frames: this.anims.generateFrameNames(texture, {start: 0, end: 1, first: 0}),
            frameRate: 20
        });

        // Add to config
        this.shootTimer = scene.time.addEvent({
            delay: 150,
            callback: () => {
                scene.addBullet(this.x + this.width / 2, this.y, null);
            },
            loop: true,
            paused: true,
            startAt: 250
        });
        

    }

    update() {
        if (!this.anims.isPlaying) {
            this.anims.play('animation');
        }

        // TODO: Make movement based of physics velocity 
        // so that movement speed isn't tied to FPS
        if (keyLEFT.isDown || keyA.isDown) {
        //    this.x -= this.speed;
            this.setVelocityX(-this.speed);
        } else if (keyRIGHT.isDown || keyD.isDown) {
        //    this.x += this.speed;
            this.setVelocityX(this.speed);
        } else {
            this.setVelocityX(0);
        }

        if (keyUP.isDown || keyW.isDown) {
        //    this.y -= this.speed;
            this.setVelocityY(-this.speed);
        } else if (keyDOWN.isDown || keyS.isDown) {
        //    this.y += this.speed;
            this.setVelocityY(this.speed);
        } else {
            this.setVelocityY(0);
        }

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