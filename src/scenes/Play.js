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
        this.load.spritesheet('player', './assets/Player-Sheet.png', {
            frameWidth: 32,
            frameHeight: 64,
            startFrame: 2, 
            endFrame: 2
        });
        this.load.spritesheet('enemy1', './assets/Asteroid_White.png', {
            frameWidth: 34,
            frameHeight: 34,
            startFrame: 0,
            endFrame: 0
        });
        this.load.spritesheet('enemy2', './assets/Enemy-Shooter-Sheet.png', {
            frameWidth: 32,
            frameHeight: 48,
            startFrame: 0,
            endFrame: 19
        });
        this.load.spritesheet('enemy3', './assets/Enemy-Large-Sheet.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 15
        });
        this.load.spritesheet('enemy4', './assets/Player-Sheet.png', {
            frameWidth: 32,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 0
        });
        this.load.spritesheet('explosion-sheet', './assets/explosion.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
        this.load.spritesheet('bullet', './assets/Bullet-Sheet.png', {
            frameWidth: 10,
            frameHeight: 10,
            startFrame: 0,
            endFrame: 2
        });

        // this.load.image('bullet', './assets/bullet.png');
        
        this.load.image('ocean', './assets/ocean.png');

        this.load.image('health', './assets/health.png');
    }

    create() {

        this.ocean = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ocean').setOrigin(0, 0);
        this.ocean.alpha = 0.75;

        // TODO: Draw Player on top
        this.player = new Player(this, game.config.width / 2, 3 * game.config.height / 4, 'player', 0, 750).setOrigin(0, 0);
        this.player.x -= this.player.width / 2;

        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNames('explosion-sheet', {start: 0, end: 9}),
            frameRate: 30
        });

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

        this.physics.add.overlap(this.player, this.bulletGroup, (player, bullet) => {
            bullet.remove = true;
            player.health -= 2;
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
            speed: 250,
            shootInterval: 1000000, // This enemy doesn't shoot, so irrelevant number
            // Functions
            moveFunction: (enemy) => {
            //    enemy.y += enemy.speed;
            //    enemy.x += cos(enemy.time);
                enemy.setVelocityY(enemy.speed);
                enemy.setVelocityX(enemy.speed * sin(enemy.time) * 0.5);
            },
            fireFunction: defaultFire,
            deathFunction: defaultDeathCondition,
        };
        this.addEnemyPoolGroupPair(enemyRedConfig);
        const enemyGreenConfig = {
            // Texture settings
            texture: 'enemy2',
            startFrame: 9,
            endFrame: 19,
            // Behaviour
            speed: 200,
            shootInterval: 1000,
            moveFunction: defaultMovement,
            fireFunction: (enemy) => { 
                // TODO: config
                this.addBullet(enemy.x, enemy.y + (enemy.height * SCALE) + 8, 300);
            },
            deathFunction: defaultDeathCondition,
        }
        this.addEnemyPoolGroupPair(enemyGreenConfig);
        const enemyBlueConfig = {
            // Texture settings
            texture: 'enemy3',
            startFrame: 9,
            endFrame: 15,
            // Behaviour
            speed: 150,
            shootInterval: 800,
            moveFunction: (enemy) => {
                enemy.setVelocityY(enemy.speed);
                enemy.setVelocityX(enemy.speed * 2 * sin(2 * enemy.time))
            },
            fireFunction: (enemy) => { 
                this.addBullet(1 * enemy.width / 2 + enemy.x, enemy.y + (enemy.height * SCALE), 400);
                this.addBullet(-1 * enemy.width / 2 + enemy.x, enemy.y + (enemy.height * SCALE), 400);
            },
            deathFunction: defaultDeathCondition,
        }
        this.addEnemyPoolGroupPair(enemyBlueConfig);
        const enemyYellowConfig = {
            // Texture settings
            texture: 'enemy4',
            y: this.game.config.height,
            startFrame: 0,
            endFrame: 1,
            // Behaviour
            speed: -750,
            shootInterval: 1000000, // doesn't shoot
            moveFunction: (enemy) => {
                enemy.setAccelerationY(enemy.speed);
            },
            fireFunction: defaultFire,
            deathFunction: defaultDeathCondition,
        }
        this.addEnemyPoolGroupPair(enemyYellowConfig);
        
        this.time.addEvent({
            delay: 867,
            callback: () => {
                // TODO: remove special stuff ; make universal
                let e = this.addEnemy(enemyRedConfig, 0.25 * game.config.width * sin(5 * this.gameTime) + this.game.config.width / 2);
                e.time = Math.random() * this.gameTime;
            }, 
            loop: true,
            startAt: 0
        });
        this.time.addEvent({
            delay: 2119,
            callback: () => {
                this.addEnemy(enemyGreenConfig, Math.random() * game.config.width);
            }, 
            loop: true,
            startAt: -1000
        });
        this.time.addEvent({
            delay: 5557,
            callback: () => {
                this.addEnemy(enemyBlueConfig, Math.random() * game.config.width);
            }, 
            loop: true,
            startAt: -10000
        });
        this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.addEnemy(enemyYellowConfig, Math.random() * game.config.width);
            }, 
            loop: true,
            startAt: -30000
        });

        this.healthbar = this.add.tileSprite(30, 30, game.config.width - 60, 30, 'health', 0).setOrigin(0,0);

        this.gameTime = 0;
    }

    update() {
        this.gameTime += 1 / this.game.config.fps;

        this.ocean.tilePositionY = -75 * this.gameTime;

        this.player.update();
        if (this.player.health <= 0) {
            this.scene.start('menuScene');
        }

        for (let i = 0; i < this.enemyGroup.length; i++) {
            this.enemyGroup[i].getChildren().forEach((enemy) => {
                enemy.update();
                // TODO: Consider enemy death
                if (enemy.remove || enemy.deathFunction(enemy)) {
                    this.enemyGroup[i].killAndHide(enemy);
                    this.enemyGroup[i].remove(enemy);
                }
            }, this);
        }

        this.bulletGroup.getChildren().forEach((bullet) => {
            // // TODO: advanced movement
            bullet.update();
            // // TODO: better death condition
            if (bullet.remove || bullet.y < 0 || bullet.y > this.game.config.height) {
                this.bulletGroup.killAndHide(bullet);
                this.bulletGroup.remove(bullet);
            }
        }, this);

        this.healthbar.width = (this.game.config.width - 60) * (this.player.health / this.player.max_health);
        this.children.bringToTop(this.healthbar);
    }

    

    // TODO: config
    addBullet(x, y, speed) {
        let bullet;
        if (this.bulletPool.getLength()) {
            bullet = this.bulletPool.getFirst();
            bullet.x = x; //this.player.x + this.player.width / 2;
            bullet.y = y; //this.player.y;
            bullet.speed = speed;
            bullet.active = true;
            bullet.visible = true;

            bullet.remove = false;
            // TODO: config
            this.bulletPool.remove(bullet);
        } else {
            // TODO: config
            bullet = new Bullet(this, x, y, 'bullet', 0, speed);
            this.bulletGroup.add(bullet);
        }
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
            enemy.shootTimer.paused = false;

            enemy.remove = false;

            this.enemyPool[index].remove(enemy);
        } else {
            enemy = new Enemy(this, posX, 0, enemyConfig);
            // enemy.time = this.time;
            this.enemyGroup[index].add(enemy);
        }
        if (enemyConfig.y) {
            enemy.y = enemyConfig.y;
        }

        return enemy;
    }

    addEnemyPoolGroupPair(enemyconfig) {
        let index = this.enemyGroup.length;
        // Object pooling based off:
        // https://www.emanueleferonato.com/2018/11/13/build-a-html5-endless-runner-with-phaser-in-a-few-lines-of-code-using-arcade-physics-and-featuring-object-pooling/
        this.enemyGroup.push(this.physics.add.group({
            removeCallback: (enemy) => {
                this.enemyPool[index].add(enemy);
                enemy.shootTimer.paused = true;
            }
        }));
        this.enemyPool.push(this.physics.add.group({
            removeCallback: (enemy) => {
                this.enemyGroup[index].add(enemy);
            }
        }));
        this.enemyConfigs.push(enemyconfig);
    
        // TODO: Pool explosions?
        this.physics.add.overlap(this.bulletGroup, this.enemyGroup[index], (bullet, enemy) => {
            bullet.remove = true;
            enemy.remove = true;
            let boom = this.add.sprite(enemy.x, enemy.y, 'health').setOrigin(0.5,0.5);
            boom.scale = SCALE*2;
            boom.anims.play('explosion');
            boom.on('animationComplete', () => {
                boom.alpha = 0;
                boom.destroy();
            });
        });
        this.physics.add.overlap(this.player, this.enemyGroup[index], (player, enemy) => {
            enemy.remove = true;
            this.player.health -= 5;
            let boom = this.add.sprite(enemy.x, enemy.y, 'health').setOrigin(0.5,0.5);
            boom.scale = SCALE*2;
            boom.anims.play('explosion');
            boom.on('animationComplete', () => {
                boom.alpha = 0;
                boom.destroy();
            });
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