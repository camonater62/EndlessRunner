// TODO

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {

    }

    create() {
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    //    console.log("MENU SCENE");
        this.scene.start('playScene');
        this.add.text(game.config.width/2, game.config.height/2, 'Menu. YOu die.').setOrigin(0, 0);
    }

    update() {

    }
    
}