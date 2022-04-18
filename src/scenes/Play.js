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
        this.load.image('enemy1', './assets/firstenemy-0.png');
        this.load.image('enemy2', './assets/secondenemy-0.png');
        this.load.image('enemy3', './assets/thirdenemy-0.png');
        this.load.image('enemy4', './assets/fourthenemy-0.png');
    }

    create() {
        this.player = new Player(this, game.config.width / 2, 3 * game.config.height / 4, 'player', 0).setOrigin(0.5, 0);
    }

    update() {
        this.player.update();
    }
    
}