// TODO

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.spritesheet('menu-sheet', './assets/menusheet.png', {
            frameWidth: 1013, // lmao what is this res
            frameHeight: 764,
            startFrame: 0,
            endFrame: 6
        });
    }

    create() {

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.anims.create({
            key: 'menu',
            frames: this.anims.generateFrameNames('menu-sheet', {start: 0, end: 6}),
            frameRate: 15, // what was this?
            loop: true,
            yoyo: true,
            repeat: -1,
        });

        let background = this.add.sprite(0, game.config.height / 2, 'menu', 0).setOrigin(0, 0.5);
        background.anims.play('menu');        
        
        background.displayWidth = game.config.width;
        background.displayHeight = background.displayWidth * background.height / background.width;
        
        let ratio = game.config.width / game.config.height;
        this.scale.displaySize.setAspectRatio( ratio );
        this.scale.refresh();
    }

    update() {

        if (this.keyEnter.isDown) {
            this.scene.start('playScene');
        } 
    }
    
}