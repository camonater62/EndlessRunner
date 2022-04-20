class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

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

        this.load.image('bullet', './assets/bullet.png');

        this.enemyTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                this.addEnemy(0, game.config.width / 2);
            }, loop: true
        });
    }

    create() {

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

        this.bulletGroup = this.add.group({
            removeCallback: (bullet) => {
                bullet.scene.bulletPool.add(bullet);
            }
        });
        this.bulletPool = this.add.group({
            removeCallback: (bullet) => {
                bullet.scene.bulletGroup.add(bullet);
            }
        });

        // TODO: Set up timers to add enemies (different types)
        // TODO: pass in config
        // this.addEnemy(0, Math.random() * game.config.width);


        // TODO: Draw Player on top
        this.player = new Player(this, game.config.width / 2, 3 * game.config.height / 4, 'player', 0, 10).setOrigin(0.5, 0.5);

        this.gameTime = 0;
    }

    update() {
        this.gameTime += 1 / this.game.config.fps;

        this.player.update();

        this.enemyGroup.getChildren().forEach((enemy) => {
            enemy.update();
            if (enemy.checkCollision(this.player)) {
                console.log("KACHOW!");
                this.scene.start("menuScene");           // crashes game
            };
            if (enemy.deathFunction(enemy)) {
                this.enemyGroup.killAndHide(enemy);
                this.enemyGroup.remove(enemy);
            }
        }, this);

        this.bulletGroup.getChildren().forEach((bullet) => {
            bullet.update();
            bullet.checkCollision(this.enemyGroup);
            if (bullet.y < 0) {
                // TODO: more advanced kill condition
                this.bulletGroup.killAndHide(bullet);
                this.bulletGroup.remove(bullet);
            }
        }, this);
        // TODO: collisions
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
                   enemy.x += 150 * cos(3 * enemy.time) / game.config.fps;
                } 
            });
            // enemy.time = this.time;
            this.enemyGroup.add(enemy);
        }
    }

    // TODO: args
    addBullet() {
        
        let bullet;
        if (this.bulletPool.getLength()) {
            bullet = this.bulletPool.getFirst();
            bullet.x = this.player.x;
            bullet.y = this.player.y;
            bullet.active = true;
            bullet.visible = true;
            // TODO: vars
            this.bulletPool.remove(bullet);
        } else {
            bullet = new Bullet(this, this.player.x, this.player.y, 'bullet', 0, 15);
            this.bulletGroup.add(bullet);
        }
    }
    
}