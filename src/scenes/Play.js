class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.audio('hit', './assets/CCHit.wav');
        this.load.audio('laser', './assets/CCLaser1.wav');
        this.load.audio('explode', './assets/CCExplode1.wav');

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
        this.load.spritesheet('enemy1', './assets/Enemy-Tiny-Sheet.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 1
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
        this.load.spritesheet('superExplosion-sheet', './assets/explosionado-Sheet.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 4
        });
        this.load.spritesheet('bullet', './assets/Bullet-Sheet.png', {
            frameWidth: 10,
            frameHeight: 10,
            startFrame: 0,
            endFrame: 11
        });
        this.load.spritesheet('asteroid', './assets/Asteroid_White.png', {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 0,
        });

        // this.load.image('bullet', './assets/bullet.png');
        
        // this.load.image('ocean', './assets/ocean.png');
        this.load.image('background', './assets/Background.png');
        // this.load.image('foreground', './assets/Foreground.png');
        this.load.image('blobs', './assets/Blobs.png');
        this.load.image('void', './assets/Void.png');
        this.load.image('stars', './assets/Backstars.png');
        this.load.image('cluster01', './assets/cluster01.png');
        this.load.image('cluster02', './assets/cluster02.png');
        this.load.image('cluster03', './assets/cluster03.png');
        // this.load.image('clusters', './assets/Mid_Stars.png');
        // this.load.image('galaxy', './assets/Galaxxy.png');
        this.load.image('healthbar', './assets/health.png');
        this.load.image('healthbar-outline', './assets/health-bar-outline.png');

        this.load.audio('music', './assets/CCMusic.mp3');
    }

    create() {
        this.music = this.sound.add('music');
        this.music.setLoop(true);
        this.music.play();

        this.laser = this.sound.add('laser');
        this.hit = this.sound.add('hit');
        this.explode = this.sound.add('explode');
        
        this.ocean = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ocean').setOrigin(0, 0);
        this.ocean.alpha = 0.75;

        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNames('explosion-sheet', {start: 0, end: 9}),
            frameRate: 30
        });
        this.anims.create({ 
            key: 'super-explosion',
            frames: this.anims.generateFrameNumbers('superExplosion-sheet', {start: 0, end: 4}),
            frameRate: 12
        })
        this.anims.create({
            key: 'player-bullet',
            frames: this.anims.generateFrameNames('bullet', {
                start: 6,
                end: 8,
            }),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: 'enemy-bullet',
            frames: this.anims.generateFrameNumbers('bullet', {
                start: 9, 
                end: 11
            }),
            frameRate: 12,
            repeat: -1
        });
        // this.anims.create({
        //     key: 'neutral-bullet',
        //     frames: this.anims.generateFrameNumbers('bullet', {
        //         start: 0, 
        //         end: 2
        //     }),
        //     frameRate: 12,
        //     repeat: -1
        // });

        // Draw Background
        this.void = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'void').setOrigin(0, 0);
        this.stars = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'stars').setOrigin(0, 0).setScale(1.5);
        // add star clusters
        this.cluster01 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cluster01').setOrigin(0, 0);
        this.cluster02 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cluster02').setOrigin(0, 0);
        this.cluster03 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'cluster03').setOrigin(0, 0);
        this.cluster01.alpha = 0.4;
        this.cluster02.alpha = 0.6;
        this.cluster03.alpha = 0.2;
        // add sidebars
        this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0, 0);
        this.blobs = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'blobs').setOrigin(0, 0);
        // this.galaxy = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'galaxy').setOrigin(0, 0);
        // this.foreground = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'foreground').setOrigin(0, 0);

        // Particle Manager
        this.particles = this.make.particles({
            key: 'bullet',
            add: true,
            emitters: [
                // this.emitterConfig0,
                // ... etc
            ],
            alpha: 1
        });

        // TODO: Draw Player on top
        this.player = new Player(this, game.config.width / 2, 3 * game.config.height / 4, 'player', 0, 750).setOrigin(0, 0);
        this.player.x -= this.player.width / 2;


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
            if (bullet.team != 'player') {
                bullet.remove = true;
                player.hit(bullet.damage);
                this.updateHealthBar();
                this.screenshake(35, 1);
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
            speed: 250,
            shootInterval: 1000000, // This enemy doesn't shoot, so irrelevant number
            health: 5,
            damage: 1,
            score: 10,
            // Functions
            moveFunction: defaultMovement,
            fireFunction: defaultFire,
            deathFunction: defaultDeathCondition,
        };
        this.addEnemyPoolGroupPair(enemyRedConfig);
        const asteroidConfig = {
            // Texture settings
            texture: 'asteroid',
            startFrame: 0,
            endFrame: 0,
            // Behavior
            speed: 80,
            shootInterval: 1000000,
            health: 15,
            damage: 7,
            score: 20,
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
        this.addEnemyPoolGroupPair(asteroidConfig);
        const enemyGreenConfig = {
            // Texture settings
            texture: 'enemy2',
            startFrame: 9,
            endFrame: 19,
            // Behaviour
            speed: 150,
            shootInterval: 1500,
            health: 15,
            damage: 3,
            score: 40,
            moveFunction: defaultMovement,
            fireFunction: (enemy) => { 
                // TODO: config
                this.addBullet(enemy.x, enemy.y + (enemy.height), 300, 'enemy');
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
            shootInterval: 1000,
            health: 25,
            damage: 4,
            score: 150,
            moveFunction: (enemy, delta) => {
                enemy.setVelocityY(enemy.speed);
                enemy.setVelocityX(enemy.speed * sin(5 * enemy.time))
            },
            fireFunction: (enemy) => { 
                this.addBullet(1 * enemy.width*0.9 + enemy.x, enemy.y + (enemy.height * SCALE), 400, 'enemy');
                this.addBullet(-1 * enemy.width*0.9 + enemy.x, enemy.y + (enemy.height * SCALE), 400, 'enemy');
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
            speed: -500,
            shootInterval: 1000000, // doesn't shoot
            health: 10,
            damage: 8,
            score: 500,
            moveFunction: (enemy) => {
                enemy.setAccelerationY(enemy.speed);
            },
            fireFunction: defaultFire,
            deathFunction: defaultDeathCondition,
        }
        this.addEnemyPoolGroupPair(enemyYellowConfig);
        
        this.time.addEvent({
            delay: 4000,
            callback: () => {
                // TODO: remove special stuff ; make universal
                this.addEnemyWave(enemyRedConfig, 5, 500);
            }, 
            loop: true,
            startAt: 5000
        });
        this.time.addEvent({ 
            delay: 20000,
            callback: () => {
                this.addEnemy(asteroidConfig, Math.random() * game.config.width);
            },
            loop: true,
            startAt: -2000
        })
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                this.addEnemy(enemyGreenConfig, Math.random() * game.config.width);
            }, 
            loop: true,
            startAt: -1500
        });
        this.time.addEvent({
            delay: 5000,          // 5000
            callback: () => {
                this.addEnemy(enemyBlueConfig, Math.random() * game.config.width/2);
            }, 
            loop: true,
            startAt: -10000     // -10000
        });
        this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.addEnemy(enemyYellowConfig, this.player.x);
            }, 
            loop: true,
            startAt: -30000
        });

        // add health bar images
        this.healthbar = this.add.tileSprite(game.config.width*0.2, 30, game.config.width*0.6, 30, 'healthbar', 0).setOrigin(0,0);
        this.damagebar = this.add.tileSprite(game.config.width*0.2, 30, game.config.width*0.6, 30, 'healthbar', 0).setOrigin(0,0);
        this.damagebar.setTintFill(0xffffff);
        this.healthOutline = this.add.image(game.config.width*0.2, 30, 'healthbar-outline').setOrigin(0, 0).setScale(SCALE*2);
        this.destroyedBarGroup = this.physics.add.group({ 
            gravityY: 1500,
            // accelerationY: 500,
            velocityX: 250,
            velocityY: -250,
            // dragX: 2000
            angularVelocity: 2500,
        });
        
        this.shakeCount = 0;
        this.shakeIntensity = 0;

        this.playerJetStream = this.particles.createEmitter({
            // x: {min: this.player.x - 5, max: this.player.x + 5},
            // y: {min: this.player.y - 5, max:this.player.y + 5},
            x: this.player.x,
            y: this.player.y,
            follow: this.player,
            followOffset: {
                x: this.player.width/2,
                y: this.player.height,
            },
            scaleY: 3,
            // **emitter**
            name: 'Emitter',
            on: true,          // set false to stop emitter
            active: true,      // set false to pause emitter and particles
            frequency: 1,      // -1 for exploding emitter
            quantity: {min: 40, max: 60},       // { min, max }
            maxParticles: 0,
            reserve: 15,
            rotate: this.player.velocityX,           // I want to get it to rotate with the player direction
            timeScale: 1,
            // repeating values
            // delay: {min: 5, max: 5},
            lifespan: {min: 50, max: 80},
            // direction
            // radial: true,
            angle: {min: 75, max: 105},
            // velocity
            speed: {min: 50, max: 80},
            // sprite sheet frames : animation
            frames: 6,
            cycle: true
        });

        this.score = 0;
        let scoreConfig = {
            fontFamily: 'Courier', // TODO better font?
            fontSize: '28px',
            backgroundColor: '#000',
            color: '#FFF',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100,
        };
        this.scoreDisplay = this.add.text(10, 10, this.score, scoreConfig);
        this.highScoreDisplay = this.add.text(game.config.width - 10 - scoreConfig.fixedWidth, 10, highScore, scoreConfig);
    }

    update(time, delta) {
        this.gameTime = time;
        delta /= 1000; // ms -> s

        // Update background
        this.background.tilePositionY -= delta * 150;
        this.blobs.tilePositionY -= delta * 140;
        this.stars.tilePositionY -= delta * 50;
        // Star clusters
        // this.clusters.tilePositionY -= delta * 100;
        // this.clusters.tilePositionX -= delta * 50 * sin(0.001 * this.gameTime);
        this.cluster01.tilePositionY -= delta * 80;
        this.cluster01.tilePositionX -= delta * 50 * sin(0.0005 * this.gameTime);
        this.cluster02.tilePositionY -= delta * 50;
        this.cluster02.tilePositionX += delta * 50 * sin(0.0005 * this.gameTime);
        this.cluster03.tilePositionY -= delta * 70;
        this.cluster03.tilePositionX -= delta * 50 * sin(0.0005 * this.gameTime);


        this.player.update(delta);
        if (this.player.health <= 0) {
            if (this.score > highScore) {
                highScore = this.score;
                localStorage.setItem('highScore', highScore);
            }
            this.music.stop();
            this.scene.start('menuScene');
        }

        for (let i = 0; i < this.enemyGroup.length; i++) {
            this.enemyGroup[i].getChildren().forEach((enemy) => {
                enemy.update(delta);
                // TODO: Consider enemy death
                if (enemy.remove || enemy.deathFunction(enemy)) {
                    this.enemyGroup[i].killAndHide(enemy);
                    this.enemyGroup[i].remove(enemy);
                }
            }, this);
        }

        this.bulletGroup.getChildren().forEach((bullet) => {
            // // TODO: advanced movement
            bullet.update(delta);
            // // TODO: better death condition
            if (bullet.remove || bullet.y < 0 || bullet.y > this.game.config.height) {
                this.bulletGroup.killAndHide(bullet);
                this.bulletGroup.remove(bullet);
            }
        }, this);
        // Set Z values to highest for healths
        this.children.bringToTop(this.damagebar);
        this.children.bringToTop(this.healthbar);
        this.destroyedBarGroup.getChildren().forEach((bar) => {
            this.children.bringToTop(bar);
        });
        this.children.bringToTop(this.healthOutline);
        // this.children.bringToTop(scoreDisplay);              // doesn't work for some reason
        // this.children.bringToTop(highScoreDisplay);


        let cam = this.cameras.main;
        if (this.shakeCount > 0) {
            cam.x += 10 * delta * this.shakeIntensity * cos(time*10);
            cam.y -= 10 * delta * this.shakeIntensity * sin(time*10);
            this.shakeIntensity -= 0.95 * this.shakeIntensity * delta;
            this.shakeCount -= 10 * delta;
        } else {
            cam.x *= 0.85;
            cam.y *= 0.85;
        }

        const MAXDIST = 20;
        cam.x = max(min(cam.x, MAXDIST), -MAXDIST);
        cam.y = max(min(cam.y, MAXDIST), -MAXDIST);
        
        this.scoreDisplay.text = this.score;
    }

    // TODO: config
    addBullet(x, y, speed, team) {
        let bullet;
        if (this.bulletPool.getLength()) {
            bullet = this.bulletPool.getFirst();
            bullet.x = x; //this.player.x + this.player.width / 2;
            bullet.y = y; //this.player.y;
            bullet.speed = speed;
            bullet.active = true;
            bullet.visible = true;
            bullet.team = team;
            bullet.remove = false;
            bullet.updateAnimation();
            // TODO: config
            this.bulletPool.remove(bullet);
        } else {
            // TODO: config
            bullet = new Bullet(this, x, y, 'bullet', 0, speed, team);
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
            enemy.reset();

            enemy.y = 0;
            enemy.x = posX;
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

    addEnemyWave(enemyConfig, amount, wait) {
        // let baseX = (Math.random() * this.game.config.width)
        // if (baseX < this.game.config.width * 0.25) {
        //     baseX = this.game.config.width * 0.25
        // }
        // else if (baseX > this.game.config.width * .75) {
        //     baseX = this.game.config.width * .75
        // }
        let baseX = this.game.config.width;
        this.time.addEvent({
            delay: wait,
            callback: () => {
                // TODO: remove special stuff ; make universal
                this.addEnemy(enemyConfig, baseX * Math.random());
                // let e = this.addEnemy(enemyConfig, baseX * sin(5 * this.gameTime));
                // e.time = Math.random() * this.gameTime;
            }, 
            repeat: amount,
            startAt: 0
        });
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
            if (bullet.team != 'enemy') {
                bullet.remove = true;
                enemy.hit(bullet.damage);
                this.screenshake(10, 1);
            };
        });
        this.physics.add.overlap(this.player, this.enemyGroup[index], (player, enemy) => {
            player.hit(enemy.damage);
            this.updateHealthBar();
            enemy.explodinate();
            this.screenshake(50, 1.5)
            let boom = this.add.sprite(enemy.x, enemy.y, 'healthbar').setOrigin(0.5,0.5);
            boom.scale = SCALE*2;
            boom.anims.play('explosion');
            boom.on('animationComplete', () => {
                boom.alpha = 0;
                boom.destroy();
            });
        });
    }

    updateHealthBar() {
        let width = (this.game.config.width*0.6)
        let newWidth = width * (this.player.health / this.player.MAXHEALTH);
        let damage = -(newWidth - this.healthbar.width);
        if (newWidth < this.healthbar.width) {
            let destroyedBar = this.add.tileSprite(game.config.width*0.2 + newWidth, 30, 
                damage, 30, 'healthbar', 0).setOrigin(0.5,0.5);
            destroyedBar.x += destroyedBar.width/2;
            destroyedBar.y += destroyedBar.height/2;
            destroyedBar.setTintFill(0x990000);
            destroyedBar = this.physics.add.existing(destroyedBar);
            this.destroyedBarGroup.add(destroyedBar);
            this.time.delayedCall(750, () => {
                destroyedBar.remove = true;
                destroyedBar.destroy();
            }, null, this)
        }
        this.healthbar.width = newWidth;



        if (this.damagebar.width < this.healthbar.width) {
            this.damagebar.width = this.healthbar.width;
        }
        this.time.removeEvent(this.depleteBar);
        this.depleteBar = this.time.addEvent({
            delay: 15,
            callback: () => {
                // Increase Health
                this.damagebar.width -= 4;
                // If health is too much, stop function
                if (this.damagebar.width <= this.healthbar.width) {
                    this.damagebar.width = this.healthbar.width;
                    this.time.removeEvent(this.depleteBar);
                };
            },
            loop: true,
            startAt: -500
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

    screenshake(intensity, count) {
        this.shakeCount = max(this.shakeCount, count);
        this.shakeIntensity = max(this.shakeIntensity, intensity);
    }
}