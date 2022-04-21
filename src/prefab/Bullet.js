class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, speed) {
        super(scene, x, y, texture, frame);

        // TODO: everything lol
        this.speed = speed;

        this.scale = 0.25;

        scene.add.existing(this);
        scene.physics.add.existing(this);
    }

    update() {
        // TODO: more advanced movement
        this.y -= this.speed;
    }

    checkCollision(enemyGroup) {
        let hit = [null, -1];
        for (let i = 0; i < enemyGroup.length; i++) {
            enemyGroup[i].getChildren().forEach((enemy) => {
                // AABB checking
                if (this.x < enemy.x + enemy.width && 
                    this.x + this.width > enemy.x && 
                    this.y < enemy.y + enemy.height && 
                    this.y + this.height > enemy.y) {
                        this.hit(enemy);
                        hit = [enemy, i];
                    }
                
                        //       return true;
                //} else {
                //    return false;
            // }            
            });
        }
        return hit;
    }

    hit(enemy) {
        // Destroy bullet and enemy
        // enemy.destroy();
        // this.destroy();
    }
}