/** @type {import("../typings/phaser")} */

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play],
    fps: 60,
};

let highScore = localStorage.getItem('highScore');
if (highScore === null) {
    highScore = 0;
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;
