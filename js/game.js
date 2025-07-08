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

/**
 * Checks device orientation and shows/hides overlay and canvas accordingly.
 */
function checkOrientation() {
  const overlay = document.querySelector('.orientation-overlay');
  const canvas = document.querySelector('#gameCanvas');
  if (window.innerWidth < 320 || window.innerHeight > window.innerWidth) {
    overlay.classList.add('visible');
    overlay.classList.remove('hidden');
    canvas.classList.add('hidden');
    canvas.classList.remove('canvas-visible');
  } else {
    overlay.classList.add('hidden');
    overlay.classList.remove('visible');
    canvas.classList.remove('hidden');
    canvas.classList.add('canvas-visible');
  }
}

/**
 * Initialisiert alle Touch-Button EventListener (nur wenn die Buttons existieren).
 */
function initMobileControls() {
  const btnLeft = document.querySelector('.btn-left');
  const btnRight = document.querySelector('.btn-right');
  const btnJump = document.querySelector('.btn-jump');
  const btnThrow = document.querySelector('.btn-throw');
  if (btnLeft) {
    btnLeft.addEventListener('touchstart', () => { keyboard.LEFT = true; });
    btnLeft.addEventListener('touchend', () => { keyboard.LEFT = false; });
  }
  if (btnRight) {
    btnRight.addEventListener('touchstart', () => { keyboard.RIGHT = true; });
    btnRight.addEventListener('touchend', () => { keyboard.RIGHT = false; });
  }
  if (btnJump) {
    btnJump.addEventListener('touchstart', () => { keyboard.UP = true; });
    btnJump.addEventListener('touchend', () => { keyboard.UP = false; });
  }
  if (btnThrow) {
    btnThrow.addEventListener('touchstart', () => { keyboard.SPACE = true; });
    btnThrow.addEventListener('touchend', () => { keyboard.SPACE = false; });
  }
}

/**
 * Starts the game by initializing the canvas, character, and world.
 * Also begins playing game music if enabled.
 */
function startGame() {
  canvas = document.querySelector('#gameCanvas');
  document.querySelector('.game-controls')?.classList.remove('hidden');
  const ctx = adjustCanvasForHDPI(canvas);
  const character = new Character();
  character.loadImages(character.IMAGES_WALKING, () => {
    character.setImage(character.IMAGES_WALKING[0]);
    character.startWalkingAnimation();
    world = new World(canvas, ctx, character, window.audio);
    applyAudioSettings();
    window.audio.play('gameMusic');
  });
}

/**
 * Reloads the entire page to restart the game.
 */
function restartGame() {
  location.reload();
}

/**
 * Exits the game after user confirmation and redirects to the start page.
 */
function exitGame() {
  if (confirm("Exit game and return to start page?")) {
    window.location.href = './index.html';
  }
}

/**
 * Plays the menu music once on first user interaction, if music is enabled.
 */
function startMusicOnce() {
  if (!musicStarted && localStorage.getItem('musicEnabled') !== 'false') {
    if (window.audio) {
      window.audio.play('menuMusic');
      musicStarted = true;
    }
  }
}

/**
 * Initializes the overlay buttons (Help, Settings, Audio).
 * Adds click event listeners that open the corresponding overlay.
 */
function initOverlayButtons() {
  const helpBtn = document.querySelector('.help-btn');
  const settingsBtn = document.querySelector('.settings-btn');
  const audioBtn = document.querySelector('.audio-btn');
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

/**
 * Opens the overlay with the provided URL and pauses the game.
 * 
 * @param {string} url - The URL of the overlay content to load.
 */
function openOverlay(url) {
  pauseGame();
  const overlay = document.querySelector('.overlay');
  const frame = document.querySelector('.overlay-frame');
  frame.src = url;
  overlay.classList.remove('hidden');
}

/**
 * Closes the overlay and resumes the game.
 */
function closeOverlay() {
  const overlay = document.querySelector('.overlay');
  const frame = document.querySelector('.overlay-frame');
  frame.src = '';
  overlay.classList.add('hidden');
  applyAudioSettings();
  resumeGame();
}

/**
 * Initializes the start button and defines what happens when it's clicked.
 * Hides the start screen, shows the game canvas, stops menu music, and starts the game.
 */
function initStartButton() {
  const startButton = document.querySelector('.start-btn');
  const startScreen = document.querySelector('.start-end-screen');
  const canvas = document.querySelector('#gameCanvas');
  if (startButton && startScreen && canvas) {
    startButton.addEventListener('click', () => {
      if (window.audio) {
        window.audio.stop('menuMusic');
      }
      startScreen.classList.add('hidden');
      canvas.classList.remove('hidden');
      startGame();
    });
  }
}

/**
 * Initializes the restart button.
 * When clicked, redirects to the main index page.
 */
function initRestartButton() {
  const restartButton = document.querySelector('.restart-btn');
  if (restartButton) {
    restartButton.addEventListener('click', () => {
      location.href = '../index.html';
    });
  }
}

/**
 * Pauses the game by stopping the game loop and disabling player movement.
 */
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

/**
 * Resumes the game by restarting the game loop if it was previously paused.
 */
function resumeGame() {
  if (!isPaused) return;
  isPaused = false;
  if (world && world.startGameLoop) {
    world.startGameLoop();
  }
}

/**
 * Applies the current audio settings based on whether the start screen is visible.
 * Syncs world sound/music settings with AudioManager.
 */
function applyAudioSettings() {
  const isStartScreenVisible = !document.querySelector('.start-end-screen')?.classList.contains('hidden');
  if (window.audio) {
    window.audio.applySettingsBasedOnState(isStartScreenVisible);
  }
  if (world) {
    world.musicEnabled = window.audio.musicEnabled;
    world.soundEnabled = window.audio.soundEnabled;
  }
}

// Expose applyAudioSettings globally
window.applyAudioSettings = applyAudioSettings;

/**
 * Initializes game logic on DOM load.
 * Loads audio manager, sets music to play once on interaction,
 * sets up controls and orientation checks.
 */
window.addEventListener('DOMContentLoaded', () => {
  window.audio = new AudioManager();
  document.addEventListener('click', startMusicOnce, { once: true });
  document.addEventListener('keydown', startMusicOnce, { once: true });

  initOverlayButtons();
  initStartButton();
  initRestartButton();
  initMobileControls();
  checkOrientation();

  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
});
