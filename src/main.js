/** @type {import("../typings/phaser")} */

let config = {
    type: Phaser.AUTO,
    width: 720,
    height: 960,
    scene: [Play],
    fps: 60,
};

let highScore = localStorage.getItem('highScore');
if (highScore === null) {
    highScore = 0;
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyLEFT, keyRIGHT, keyUP, keyDOWN;