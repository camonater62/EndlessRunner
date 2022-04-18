class Play extends Phaser.Scene {

    preload() {
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // this.load.image('player', './assets/player-0.png');
        this.load.spritesheet('player', './assets/player.png', {
            frameWidth: 222, 
            frameHeight: 102, 
            startFrame: 0, 
            endFrame: 1
        });
        // 34, 26
        this.load.spritesheet('enemy1', './assets/firstenemy.png', {
            frameWidth: 34,
            frameHeight: 26,
            startFrame: 0,
            endFrame: 1
        });
        // this.load.image('enemy1', './assets/firstenemy-0.png');
        this.load.image('enemy2', './assets/secondenemy-0.png');
        this.load.image('enemy3', './assets/thirdenemy-0.png');
        this.load.image('enemy4', './assets/fourthenemy-0.png');
    }

    create() {
        this.player = new Player(this, game.config.width / 2, 3 * game.config.height / 4, 'player', 0).setOrigin(0.5, 0);

        // Object pooling based off:
        // https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
        this.enemyGroup = this.add.group({
            removeCallback: (enemy) => {
                enemy.scene.enemyPool.add(enemy);
            }
        });
        this.enemyPool = this.add.group({
            removeCallback: (enemy) => {
                enemy.scene.enemyGroup.add(enemy);
            }
        });

        this.enemy = new Enemy(this, game.config.width / 2, game.config.height / 4, 'enemy1', 0, 0, 5, 5).setOrigin(0.5, 0);
    }

    update() {
        this.player.update();
        this.enemy.update();
    }

    // Object pooling based off:
    // https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
    addEnemy(enemyType, posX) {
        let enemy;
        if (this.enemyPool.getLength()) {
            enemy = this.enemyPool.getFirst();
            enemy.x = posX;
        //    enemy.active = true;
        //    enemy.visible = true;
            this.enemyPool.remove(enemy);
        } else {
            enemy = new Enemy(posX);
            this.enemyGroup.add(enemy);
        }
        // TODO: When to spawn next enemy
    }
    
}