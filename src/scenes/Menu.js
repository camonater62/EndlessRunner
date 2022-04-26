// TODO

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
       
        this.add.text(game.config.width/2, game.config.height/2, 'Menu. YOu die.').setOrigin(0, 0);
    }

    update() {
        if (this.keyEnter.isDown) {
            this.scene.start('playScene');
        }
    }
    
}