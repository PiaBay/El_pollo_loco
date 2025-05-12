
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
 let canvas = document.getElementById('gameCanvas');
 let ctx = adjustCanvasForHDPI(canvas); // ⬅️ Anpassung aktiv
   let world = new World(canvas, ctx); // Übergebe den angepassten Context an World
}
