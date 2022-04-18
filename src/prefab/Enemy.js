class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, enemyType, speed, shootInterval) {
        super(scene, x, y, texture, frame);

        this.enemyType = enemyType;
        this.speed = speed;
        this.shootInterval = shootInterval;
        // TODO: Handle enemy type

        scene.add.existing(this);

        // this.scale = 0.5;

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
        
        this.y += this.speed;
    }
}