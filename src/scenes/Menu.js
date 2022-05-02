// TODO

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('background', './assets/CCMenu.png');
        //this.load.audio('music', './assets/CCMusic.mp3');
    }

    create() {

        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
       
        let background = this.add.image(0, game.config.height / 2, 'background').setOrigin(0, 0.5);
        
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