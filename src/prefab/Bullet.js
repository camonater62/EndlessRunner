class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, speed, team) {
        super(scene, x, y, texture, frame);

        // TODO: everything lol

        this.team = team;
        this.speed = speed;
        this.scale = SCALE*1.5;
        console.log(team);
        if (team == 'player') {
            this.anims.play('player-bullet');
        }
        else if (team == 'enemy') {
            this.anims.play('enemy-bullet');
        }
        else {
            this.anims.play('neutral-bullet');
        }
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