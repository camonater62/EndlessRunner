class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        // TODO: everything lol
        this.speed = speed;

        this.scale = 0.25;

        scene.add.existing(this);
    }

    update() {
        // TODO: more advanced movement
        this.y -= this.speed;
    }
}