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
    }

    update() {
        if (!this.anims.isPlaying) {
            this.anims.play('animation');
        }

        if (keyLEFT.isDown) {
            this.x -= this.speed;
        }
        if (keyRIGHT.isDown) {
            this.x += this.speed;
        }
        if (keyUP.isDown) {
            this.y -= this.speed;
        }
        if (keyDOWN.isDown) {
            this.y += this.speed;
        }

        this.y = max(min(game.config.height, this.y), 0);
        this.x = max(min(game.config.width, this.x), 0);
    }
}