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
            frameWidth: 111, 
            frameHeight: 51, 
            startFrame: 0, 
            endFrame: 1
        });
        this.load.spritesheet('enemy1', './assets/firstenemy.png', {
            frameWidth: 34,
            frameHeight: 26,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('enemy2', './assets/secondenemy.png', {
            frameWidth: 50,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('enemy3', './assets/thirdenemy.png', {
            frameWidth: 86,
            frameHeight: 54,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('enemy4', './assets/fourthenemy.png', {
            frameWidth: 50,
            frameHeight: 42,
            startFrame: 0,
            endFrame: 1
        });

        this.load.image('bullet', './assets/bullet.png');

        
        this.load.image('ocean', './assets/ocean.png');
    }

    create() {

        this.ocean = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ocean').setOrigin(0, 0);
        this.ocean.alpha = 0.75;

        // TODO: Draw Player on top
        this.player = new Player(this, game.config.width / 2, 3 * game.config.height / 4, 'player', 0, 750).setOrigin(0, 0);


        this.bulletGroup = this.physics.add.group({
            removeCallback: (bullet) => {
                bullet.scene.bulletPool.add(bullet);
            }
        });
        this.bulletPool = this.physics.add.group({
            removeCallback: (bullet) => {
                bullet.scene.bulletGroup.add(bullet);
            }
        });

        this.enemyGroup = [];
        this.enemyPool = [];
        this.enemyConfigs = [];
        const enemyRedConfig = {
            // Texture settings
            texture: 'enemy1',
            startFrame: 0,
            endFrame: 1,
            // Behaviour
            speed: 3,
            shootInterval: 0, // This enemy doesn't shoot, so irrelevant number
            // Functions
            moveFunction: defaultMovement,
            fireFunction: defaultFire,
            deathFunction: defaultDeathCondition,
        };
        this.addEnemyPoolGroupPair(enemyRedConfig);
        const enemyGreenConfig = {
            // Texture settings
            texture: 'enemy2',
            startFrame: 0,
            endFrame: 1,
            // Behaviour
            speed: 4,
            shootInterval: 300,
            moveFunction: defaultMovement,
            fireFunction: (enemy) => { /* TODO */ },
            deathFunction: defaultDeathCondition,
        }
        this.addEnemyPoolGroupPair(enemyGreenConfig);
        const enemyBlueConfig = {
            // Texture settings
            texture: 'enemy3',
            startFrame: 0,
            endFrame: 1,
            // Behaviour
            speed: 10,
            shootInterval: 300,
            moveFunction: defaultMovement,
            fireFunction: (enemy) => { /* TODO */ },
            deathFunction: defaultDeathCondition,
        }
        this.addEnemyPoolGroupPair(enemyBlueConfig);
        // TODO: get this to spawn at bottom
        const enemyYellowConfig = {
            // Texture settings
            texture: 'enemy4',
            startFrame: 0,
            endFrame: 1,
            // Behaviour
            speed: -2,
            shootInterval: 300,
            moveFunction: defaultMovement,
            fireFunction: defaultFire,
            deathFunction: defaultDeathCondition,
        }
        this.addEnemyPoolGroupPair(enemyYellowConfig);
        // Object pooling based off:
        // https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
        // this.enemyGroup = this.add.group({
        //     removeCallback: (enemy) => {
        //         enemy.scene.enemyPool.add(enemy);
        //     }
        // });
        // this.enemyPool = this.add.group({
        //     removeCallback: (enemy) => {
        //         enemy.scene.enemyGroup.add(enemy);
        //     }
        // });
        

        

        

        // TODO: Set up timers to add enemies (different types)
        // TODO: pass in config
        // this.addEnemy(0, Math.random() * game.config.width);
        this.time.addEvent({
            delay: 500,
            callback: () => {
                this.addEnemy(enemyRedConfig, Math.random() * game.config.width);
            }, loop: true
        });
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.addEnemy(enemyGreenConfig, Math.random() * game.config.width);
            }, loop: true
        });
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.addEnemy(enemyBlueConfig, Math.random() * game.config.width);
            }, loop: true
        });
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                this.addEnemy(enemyYellowConfig, Math.random() * game.config.width);
            }, loop: true
        });

        this.gameTime = 0;
    }

    update() {
        this.gameTime += 1 / this.game.config.fps;

        this.ocean.tilePositionY = -100 * this.gameTime;

        this.player.update();

        for (let i = 0; i < this.enemyGroup.length; i++) {
            this.enemyGroup[i].getChildren().forEach((enemy) => {
                enemy.update();
                if (enemy.deathFunction(enemy)) {
                    this.enemyGroup[i].killAndHide(enemy);
                    this.enemyGroup[i].remove(enemy);
                }
            }, this);
        }

        this.bulletGroup.getChildren().forEach((bullet) => {
            // TODO: advanced movement
            bullet.update();
        }, this);

    }

    // Object pooling based off:
    // https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
    addEnemy(enemyConfig, posX) {
        let enemy;
        let index = this.getEnemyConfigIndex(enemyConfig);
        if (index == -1) {
            return;
        }
        if (this.enemyPool[index].getLength()) {
            enemy = this.enemyPool[index].getFirst();
            enemy.x = posX;
            enemy.y = 0;
            enemy.time = 0;
            enemy.active = true;
            enemy.visible = true;
            this.enemyPool[index].remove(enemy);
        } else {
            enemy = new Enemy(this, posX, 0, enemyConfig);
            // enemy.time = this.time;
            this.enemyGroup[index].add(enemy);
        }
    }

    // TODO: args
    addBullet() {
        let bullet;
        if (this.bulletPool.getLength()) {
            bullet = this.bulletPool.getFirst();
            bullet.x = this.player.x + this.player.width / 2;
            bullet.y = this.player.y;
            bullet.active = true;
            bullet.visible = true;
            // TODO: vars
            this.bulletPool.remove(bullet);
        } else {
            bullet = new Bullet(this, this.player.x + this.player.width / 2, this.player.y, 'bullet', 0, 15);
            this.bulletGroup.add(bullet);
        }
    }

    addEnemyPoolGroupPair(enemyconfig) {
        let index = this.enemyGroup.length;
        // Object pooling based off:
        // https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
        this.enemyGroup.push(this.physics.add.group({
            removeCallback: (enemy) => {
                this.enemyPool[index].add(enemy);
            }
        }));
        this.enemyPool.push(this.physics.add.group({
            removeCallback: (enemy) => {
                this.enemyGroup[index].add(enemy);
            }
        }));
        this.enemyConfigs.push(enemyconfig);
        

        this.physics.add.collider(this.bulletGroup, this.enemyGroup[index], (bullet, enemy) => {
            this.bulletGroup.killAndHide(bullet);
            this.bulletGroup.remove(bullet);
            this.enemyGroup[index].killAndHide(enemy);
            this.enemyGroup[index].remove(enemy);
        });
        this.physics.add.collider(this.player, this.enemyGroup[index], (player, enemy) => {
            // TODO: Handle player damage
            this.enemyGroup[index].killAndHide(enemy);
            this.enemyGroup[index].remove(enemy);
        });
    }

    getEnemyConfigIndex(enemyconfig) {
        for (let i = 0; i < this.enemyConfigs.length; i++) {
            if (enemyconfig == this.enemyConfigs[i]) {
                return i;
            }
        }
        return -1;
    }
}