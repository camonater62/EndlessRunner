class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        // TODO: everything lol
        this.speed = speed;


        this.scale = .25;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.remove = false;        
    }

    update() {
        // TODO: more advanced movement
        // this.y -= this.speed / 60;
        this.setVelocityY(this.speed);
    }
}