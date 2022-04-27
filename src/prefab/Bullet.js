class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, speed, team) {
        super(scene, x, y, texture, frame);

        // TODO: everything lol

        this.team = team;
        this.speed = speed;
        this.scale = SCALE*1.5;
       
        this.updateAnimation();
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.remove = false;        
    }

    update(delta) {
        // TODO: more advanced movement
        this.setVelocityY(this.speed);
    }

    updateAnimation() {
        if (this.team == 'player') {
            this.anims.play('player-bullet');
        }
        else if (this.team == 'enemy') {
            this.anims.play('enemy-bullet');
        }
        else {
            this.anims.play('neutral-bullet');
        }
    }
}