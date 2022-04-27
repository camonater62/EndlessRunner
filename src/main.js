/** @type {import("../typings/phaser")} */


// I don't like typing 'Math.'
const max = Math.max;
const min = Math.min;
const sin = Math.sin;
const cos = Math.cos;
const sqrt = Math.sqrt;
const abs = Math.abs;

const SQRT2 = sqrt(2);

let SCALE = 2;

let config = {
    type: Phaser.AUTO,
    width: 720,
    height: 960,
    scene: [Menu, Play],
    fps: 60,
    physics: {
        default: 'arcade',
        arcade: {
            useTree: true,
            gravity: { y: 0 },
            debug: false
        },
    },
    pixelArt: true,

};

let highScore = localStorage.getItem('highScore');
if (highScore === null) {
    highScore = 0;
}

let game = new Phaser.Game(config);

// reserve keyboard vars
// Movement
let keyW, keyA, keyS, keyD;
let keyLEFT, keyRIGHT, keyUP, keyDOWN;
// Shooting
let keySpace;