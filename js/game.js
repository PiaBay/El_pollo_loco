const keyboard = {
  LEFT: false,
  RIGHT: false,
  UP: false,
  DOWN: false,
  SPACE: false
};

let canvas;
let world;
let backgroundMusic;
let musicStarted = false;
let isPaused = false;
/** @type {AudioManager} */
window.audio;

/**
 * Adjusts the canvas for high DPI displays (e.g. Retina).
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
function startGame() {
  canvas = document.getElementById('gameCanvas');
  const ctx = adjustCanvasForHDPI(canvas);

  const character = new Character();
  character.loadImages(character.IMAGES_WALKING, () => {
    character.setImage(character.IMAGES_WALKING[0]);
    character.startWalkingAnimation();

    world = new World(canvas, ctx, character, window.audio);

    applyAudioSettings();        
    window.audio.play('gameMusic'); // ✅ korrekt
  });
}



function restartGame() {
  location.reload();
}

function exitGame() {
  if (confirm("Spiel beenden und zur Startseite zurückkehren?")) {
    window.location.href = './index.html';
  }
}

// Musik nur einmal nach Nutzeraktion starten
function startMusicOnce() {
  if (!musicStarted && localStorage.getItem('musicEnabled') !== 'false') {
    if (window.audio) {
      window.audio.play('menuMusic');
      musicStarted = true;
    }
  }
}


function initOverlayButtons() {
  const helpBtn = document.getElementById('help-btn');
  const settingsBtn = document.getElementById('settings-btn');
  const audioBtn = document.getElementById('audio-btn');

  if (helpBtn) {
    helpBtn.addEventListener('click', () => openOverlay('./html/help.html'));
  }
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => openOverlay('./html/settings.html'));
  }
  if (audioBtn) {
    audioBtn.addEventListener('click', () => openOverlay('./html/settings.html'));
  }
}

function openOverlay(url) {
  pauseGame();
  const overlay = document.getElementById('overlay');
  const frame = document.getElementById('overlay-frame');
  frame.src = url;
  overlay.classList.remove('hidden');
}

function closeOverlay() {
  const overlay = document.getElementById('overlay');
  const frame = document.getElementById('overlay-frame');
  frame.src = '';
  overlay.classList.add('hidden');
  applyAudioSettings(); // Audioeinstellungen nach Overlay neu anwenden
  resumeGame();
}

function initStartButton() {
  const startButton = document.getElementById('start-btn');
  const startScreen = document.getElementById('start-screen');
  const canvas = document.getElementById('gameCanvas');

  if (startButton && startScreen && canvas) {
    startButton.addEventListener('click', () => {
      // Menü-Musik beenden (mit AudioManager)
      if (window.audio) {
        window.audio.stop('menuMusic');
      }

      startScreen.classList.add('hidden');
      canvas.classList.remove('hidden');

      startGame(); // <- ruft intern applyAudioSettings auf
    });
  }
}

function initRestartButton() {
  const restartButton = document.getElementById('restart-btn');
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      location.href = '../index.html';
    });
  }
}

function pauseGame() {
  if (isPaused) return;
  isPaused = true;
  if (world && world.stopGameLoop) {
    world.stopGameLoop();
  }
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.UP = false;
  keyboard.SPACE = false;
}

function resumeGame() {
  if (!isPaused) return;
  isPaused = false;
  if (world && world.startGameLoop) {
    world.startGameLoop();
  }
}

function applyAudioSettings() {
  const isStartScreenVisible = !document.getElementById('start-screen')?.classList.contains('hidden');

  if (window.audio) {
    window.audio.applySettingsBasedOnState(isStartScreenVisible);
  }

  if (world) {
    world.musicEnabled = window.audio.musicEnabled;
    world.soundEnabled = window.audio.soundEnabled;
  }
}

window.applyAudioSettings = applyAudioSettings;

window.addEventListener('DOMContentLoaded', () => {
  window.audio = new AudioManager();

  document.addEventListener('click', startMusicOnce, { once: true });
  document.addEventListener('keydown', startMusicOnce, { once: true });

  initOverlayButtons();
  initStartButton();
  initRestartButton();
});