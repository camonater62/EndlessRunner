class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.scale = 0.5; // Would like to avoid this
        this.speed = speed;

        this.anims.create({
            key: 'animation',
            frames: this.anims.generateFrameNames(texture, {start: 0, end: 1, first: 0}),
            frameRate: 30
        });

        /*
this.enemyTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                this.addEnemy(0, game.config.width / 2);
            }, loop: true
        });
        */
        this.shootTimer = scene.time.addEvent({
            delay: 250,
            callback: () => {
            //    console.log("SHOOTING");
                scene.addBullet();
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

        if (keyLEFT.isDown || keyA.isDown) {
            this.x -= this.speed;
        }
        if (keyRIGHT.isDown || keyD.isDown) {
            this.x += this.speed;
        }
        if (keyUP.isDown || keyW.isDown) {
            this.y -= this.speed;
        }
        if (keyDOWN.isDown || keyS.isDown) {
            this.y += this.speed;
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

        this.y = max(min(game.config.height, this.y), 0);
        this.x = max(min(game.config.width, this.x), 0);
    }
}