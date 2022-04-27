class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        // TODO: everything lol
        this.speed = speed;
        this.scale = SCALE*1.5;

        this.anims.create({ 
            key: 'animation',
            frames: this.anims.generateFrameNames(texture, {
                start: 0, 
                end: 2, 
            }),
            frameRate: 12,
            repeat: -1
        });
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.remove = false;        
    }

    update() {
        // TODO: more advanced movement
        // this.y -= this.speed / 60;
        this.setVelocityY(this.speed);
        if (!this.anims.isPlaying) {
            this.anims.play('animation');
        }
    }
}