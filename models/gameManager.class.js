/**
 * Manages game state and end screen logic.
 * Extracted from World to keep responsibilities separated.
 */
class GameManager {
/**
 * Creates a new GameManager instance.
 * 
 * @param {World} world - The world instance.
 * @param {AudioManager} audio - The audio manager.
 */
    constructor(world, audio) {
        this.world = world;
        this.audio = audio;
        this.characterCanMove = true;
        this.cameraLocked = false;
        this.preventIdle = false;
        this.gameOverHandled = false;
        this.bossActivated = false;
        this.maxBottleCapacity = 30;
    }

/** Initializes global game state flags. */
    initGameState() {
        this.bossActivated = false;
        this.characterCanMove = true;
        this.preventIdle = false;
        this.gameOverHandled = false;
        this.maxBottleCapacity = 30;
    }

/** Initializes all level items like bottles and coins. */
    initLevelItems() {
        this.bottles = level1.bottles;
        this.coins = level1.coins;
        this.totalBottles = this.bottles.length;
        this.totalCoins = this.coins.length;
        this.collectedBottles = 0;
        this.collectedCoins = 0;
        this.availableBottles = 0;
        this.throwables = [];
    }

/** Loads level-specific objects like background, clouds and enemies. */
    loadLevelContent() {
        this.backgroundObjects = level1.backgroundObjects || [];
        this.clouds = level1.clouds || [];
        this.chickens = level1.enemies;
    }

/**
 * Returns whether the game has already ended.
 * @returns {boolean} True if game is over.
 */
    isGameOver() {
        return this.gameOverHandled;
    }

/** Marks the game as over and disables character control. */
    setGameOver() {
        this.gameOverHandled = true;
        this.characterCanMove = false;
        this.cameraLocked = true;
        this.preventIdle = true;
        pauseGame();

    }

/**
 * Checks if the game should end based on character death.
 * 
 * @returns {boolean} True if game should end now.
 */
    checkEndConditions() {
        const characterDead = this.world.character.isDead && this.world.character.y > 500;
        if (characterDead && !this.world.gameOverHandled) {
            this.handleGameEnd(false);
            return true;
        }
        return false;
    }

/**
 * Shows the win or lose screen and plays the appropriate sound.
 * 
 * @param {boolean} won - Whether the player won the game.
 */
    showEndScreen(won) {
        pauseGame();
        const screen = document.getElementById('end-screen');
        const text = document.getElementById('end-text');
        const image = document.getElementById('end-image');

        if (won) {
            text.innerText = 'You Won!';
            image.src = './assets/img_pollo_locco/img/You won, you lost/You Win A.png';
            this.audio.play('win');
        } else {
            text.innerText = 'You Lost!';
            image.src = './assets/img_pollo_locco/img/You won, you lost/Game Over.png';
            this.audio.play('lose');
        }
        this.stopGameLoop();
        this.setGameOver();
        screen.classList.remove('hidden');
        const controls = document.querySelector('.game-controls');
        if (controls) {
            controls.classList.add('hidden');
        }
    }

/** Stops the animation loop and background music. */
    stopGameLoop() {
        if (this.world.animationFrameId) {
            cancelAnimationFrame(this.world.animationFrameId);
            this.world.animationFrameId = null;
        }
        this.audio.pauseMusic('gameMusic');
        this.characterCanMove = false;
        this.cameraLocked = true;
        this.world.inputHandler?.resetKeys();
    }

/** Starts the main game loop and background music. */
    startGameLoop() {
        if (!this.world.animationFrameId) {
            this.characterCanMove = true;
            this.cameraLocked = false;
            if (this.world.musicEnabled) {
                this.audio.play('gameMusic');
            }
            this.world.draw();
        }
    }

/**
 * Ends the game, stops music, disables controls, and shows final screen.
 * 
 * @param {boolean} won - Whether the player won or lost.
 */
    handleGameEnd(won) {
        if (this.gameOverHandled) return;
        this.gameOverHandled = true;
        this.characterCanMove = false;
        this.cameraLocked = true;
        this.preventIdle = true;

        this.audio.musicEnabled = false;
        this.audio.stop('gameMusic');
        this.audio.stop('menuMusic');
        this.showEndScreen(won);
    }
}
window.GameManager = GameManager;
