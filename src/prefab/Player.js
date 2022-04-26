class Player extends Phaser.Physics.Arcade.Sprite {

    // TODO: config table
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.texture.setFilter('NEAREST');
        //this.scale = 0.6; // Would like to avoid this


        this.speed = speed;
        this.max_health = 100;
        this.health = this.max_health;

        this.anims.create({
            key: 'animation',
            frames: this.anims.generateFrameNames(texture, {start: 0, end: 1, first: 0}),
            frameRate: 20
        });

        // Add to config
        this.shootTimer = scene.time.addEvent({
            delay: 200,
            callback: () => {
                scene.addBullet(this.x + this.width / 2, this.y - 25, -1.5 * this.speed);
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
            velox -= this.speed;
        } 
        if (keyRIGHT.isDown || keyD.isDown) {
            velox += this.speed;
        } 

        if (keyUP.isDown || keyW.isDown) {
            veloy -= this.speed;
        } else if (keyDOWN.isDown || keyS.isDown) {
            veloy += this.speed;
        } 

        if (velox != 0 && veloy != 0) {
            velox /= SQRT2;
            veloy /= SQRT2;
        }
        this.setVelocityX(velox);
        this.setVelocityY(veloy);

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