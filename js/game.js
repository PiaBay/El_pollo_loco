const keyboard = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  SPACE: false
};

/**
 * Adjusts the canvas for high DPI displays (e.g. Retina).
 * Ensures sharp rendering on all devices.
 * @param {HTMLCanvasElement} canvas 
 * @returns {CanvasRenderingContext2D}
 */
function adjustCanvasForHDPI(canvas) {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = 720 * ratio;
    canvas.height = 480 * ratio;
    canvas.style.width = '720px';
    canvas.style.height = '480px';

    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return ctx;
}


let canvas;
let world;

function startGame() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = adjustCanvasForHDPI(canvas);

  const character = new Character();
  character.loadImages(character.IMAGES_WALKING, () => {
    character.setImage(character.IMAGES_WALKING[0]);
    character.startWalkingAnimation();
    world = new World(canvas, ctx, character);
  });
}
