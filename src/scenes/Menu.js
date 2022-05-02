// TODO

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.image('menu_background', './assets/CCMenu.png');
    }

    create() {
        this.keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
       
        let background = this.add.image(game.config.width/65, game.config.height/10, 'menu_background').setOrigin(0, 0);
        background.displayWidth = game.config.width;
        //background.displayHeight = game.config.height;
        
        //this.add.image(game.config.width/65, game.config.height/10, 'background').setOrigin(0, 0);
    
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