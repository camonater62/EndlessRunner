class Play extends Phaser.Scene {

    preload() {
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // this.load.image('player', './assets/player-0.png');
        this.load.spritesheet('player', './assets/player.png', {
            frameWidth: 222, 
            frameHeight: 102, 
            startFrame: 0, 
            endFrame: 1
        });
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
        this.player = new Player(this, game.config.width / 2, 3 * game.config.height / 4, 'player', 0, 10).setOrigin(0.5, 0.5);

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

        // this.addEnemy(0, game.config.width / 2);

        this.enemyTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                this.addEnemy(0, Math.random() * game.config.width);
            }, loop: true
        });
    }

    update() {
        this.player.update();

        this.enemyGroup.getChildren().forEach((enemy)=>{
            enemy.update();
            if (enemy.deathFunction(enemy)) {
                this.enemyGroup.killAndHide(enemy);
                this.enemyGroup.remove(enemy);
                
            }
        }, this);
        // TODO: collisions
        // TODO: Set up timers to add enemies (different types)
        // TODO: pass in config
        // this.addEnemy(0, Math.random() * game.config.width);
    }

    // Object pooling based off:
    // https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
    addEnemy(enemyType, posX) {
        let enemy;
        if (this.enemyPool.getLength()) {
            enemy = this.enemyPool.getFirst();
            enemy.x = posX;
            enemy.y = 0;
            enemy.time = 0;
            enemy.active = true;
            enemy.visible = true;
            this.enemyPool.remove(enemy);
        } else {
            enemy = new Enemy(this, posX, 0, {
                texture: 'enemy1',
                startFrame: 0,
                endFrame: 1,
                speed: 3,
                shootInterval: 0,
                moveFunction: (enemy) => {
                   enemy.y += enemy.speed;
                   enemy.x += 150 * cos(2 * enemy.time) / game.config.fps;
                } 
            });
            this.enemyGroup.add(enemy);
        }
    }
    
}