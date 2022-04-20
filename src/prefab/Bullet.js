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

    checkCollision(enemyGroup) {
        enemyGroup.getChildren().forEach((enemy) => {
            // AABB checking
            if (this.x < enemy.x + enemy.width && 
                this.x + this.width > enemy.x && 
                this.y < enemy.y + enemy.height && 
                this.y + this.height > enemy.y) {
                    console.log("pew");
                    this.hit(enemy);
                    return true;
            } else {
                return false;
            }            
        });
    }

    hit(enemy) {
        // Destroy bullet and enemy
        // enemy.destroy();
        // this.destroy();
    }
}