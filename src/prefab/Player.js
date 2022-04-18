class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.scale = 0.5;

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
            this.x -= 4;
        }
        if (keyRIGHT.isDown) {
            this.x += 4;
        }
        if (keyUP.isDown) {
            this.y -= 4;
        }
        if (keyDOWN.isDown) {
            this.y += 4;
        }
    }
}