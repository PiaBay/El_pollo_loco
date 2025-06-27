
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
  canvas = document.getElementById('gameCanvas'); // ✔️ greift auf globale Variable zu
  const ctx = adjustCanvasForHDPI(canvas);

  const character = new Character();
  character.loadImages(character.IMAGES_WALKING, () => {
    character.setImage(character.IMAGES_WALKING[0]);
    character.startWalkingAnimation();
    world = new World(canvas, ctx, character);
  });
}

function restartGame() {
  location.reload();
}

function exitGame() {
  alert("Spiel beendet."); // Oder window.close(); wenn in eigenem Fenster
}

window.addEventListener('DOMContentLoaded', () => {
  const backgroundMusic = new Audio('./audio/spanish-guitar-208363.mp3');
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.4;

  let musicStarted = false;

  function startMusicOnce() {
    if (!musicStarted) {
      backgroundMusic.play().catch((e) => {
        console.warn('🎵 Musik konnte nicht automatisch abgespielt werden:', e);
      });
      musicStarted = true;
    }
  }

  // Erste Benutzeraktion löst Musikstart aus (Klick irgendwo auf der Seite)
  document.addEventListener('click', startMusicOnce, { once: true });
  document.addEventListener('keydown', startMusicOnce, { once: true });

  const startButton = document.getElementById('start-btn');
  const startScreen = document.getElementById('start-screen');
  const canvas = document.getElementById('gameCanvas');

  if (startButton && startScreen && canvas) {
    startButton.addEventListener('click', () => {
      startScreen.classList.add('hidden');
      canvas.classList.remove('hidden');
      startGame();
    });
  }
});
  // Neustart auf anderen Seiten
  const restartButton = document.getElementById('restart-btn');
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      location.href = '../index.html';
    });
  }



function goBack() {
  // Beispiel: Zurück zum Startbildschirm oder andere Seite
  window.location.href = '../index.html';
}

function wentBack() {
  // Beispiel: Zurück zum Startbildschirm oder andere Seite
  window.location.href = './index.html';
}