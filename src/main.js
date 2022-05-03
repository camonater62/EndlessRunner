/*
Game Title: Celestial Combat
Collaborators: Cameron West, Kaelen Cook, Jasha Puzon
Date Completed: 5/2/2022
Creative tilt justification:
    Technical: The enemy object is a generic class that get defined by a series of functions 
               passed in to the constructor. This allows for great flexibility for different
               types of enemies without requiring a separate class for each one. We also use
               object pooling for objects that get created/deleted often (bullets & enemies)
               keeping performance high by reducing costly constructor and destructor calls.
    Visual Style: The assets of all the sprites and backgrounds all follow a distinct color palette,
                which is very nice to look at with your eyes. There are lots of nifty little visual
                effects, such as screenshake, freeze frame, particle effects, health bar shattering,
                explosion effects, and the like which when combined create a very satisfying feeling
                of game juice. Plus, the game look is very retro with all the assets being pixellated,
                and the main menu really lends itself to that look as well.
*/

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
    scale: {
        mode: Phaser.Scale.FIT,
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