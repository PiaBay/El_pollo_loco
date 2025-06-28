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
    world = new World(canvas, ctx, character);
    world.loadSounds();
    applyAudioSettings(); // Musik bei Spielstart einstellen
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
    backgroundMusic.play().catch((e) => {
      console.warn('🎵 Musik konnte nicht automatisch abgespielt werden:', e);
    });
    musicStarted = true;
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
      // Menü-Musik beenden, falls sie läuft
      if (window.backgroundMusic && !window.backgroundMusic.paused) {
        window.backgroundMusic.pause();
        window.backgroundMusic.currentTime = 0;
      }

      startScreen.classList.add('hidden');
      canvas.classList.remove('hidden');

      startGame(); // <- ruft intern applyAudioSettings auf (z. B. in init())
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
  const musicEnabled = localStorage.getItem('musicEnabled') === 'true';
  const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

  if (world) {
    world.musicEnabled = musicEnabled;
    world.soundEnabled = soundEnabled;

    if (world.backgroundMusic) {
      if (musicEnabled) {
        world.backgroundMusic.muted = false;
        world.backgroundMusic.play().catch(() => { });
      } else {
        world.backgroundMusic.pause();
        world.backgroundMusic.muted = true;
        world.backgroundMusic.currentTime = 0;
      }
    }
  }

  if (window.backgroundMusic) {
    if (musicEnabled) {
      window.backgroundMusic.muted = false;
      window.backgroundMusic.play().catch(() => { });
    } else {
      window.backgroundMusic.pause();
      window.backgroundMusic.muted = true;
      window.backgroundMusic.currentTime = 0;
    }
  }
}

window.applyAudioSettings = applyAudioSettings;

window.addEventListener('DOMContentLoaded', () => {
  backgroundMusic = new Audio('../audio/spanish-guitar-208363.mp3');
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.4;
  window.backgroundMusic = backgroundMusic; // global verfügbar

  document.addEventListener('click', startMusicOnce, { once: true });
  document.addEventListener('keydown', startMusicOnce, { once: true });

  initOverlayButtons();
  initStartButton();
  initRestartButton();
});
