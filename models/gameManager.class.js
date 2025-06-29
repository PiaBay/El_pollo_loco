/**
 * Manages game state and end screen logic.
 * Extracted from World to keep responsibilities separated.
 */
class GameManager {
    /**
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



    /** Initializes game state flags. */
    initGameState() {
        this.bossActivated = false;
        this.characterCanMove = true;
        this.preventIdle = false;
        this.gameOverHandled = false;
        this.maxBottleCapacity = 30;
    }

    /** Initializes level items like bottles and coins. */
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

    /** Loads level-specific objects into the world. */
    loadLevelContent() {
        this.backgroundObjects = level1.backgroundObjects || [];
        this.clouds = level1.clouds || [];        
        this.chickens = level1.enemies;
    }

    /** Checks if the game is already over. */
    isGameOver() {
        return this.gameOverHandled;
    }

    /** Marks the game as ended. */
    setGameOver() {
        this.gameOverHandled = true;
        this.characterCanMove = false;
        this.cameraLocked = true;
        this.preventIdle = true;
    }


    /** Checks end conditions for character or boss death. */
    checkEndConditions() {
        const characterDead = this.world.character.isDead && this.world.character.y > 500;
        const bossDead = this.world.endbossController.endboss?.isDead &&
            this.world.endbossController.endboss.y > 500;

        if (characterDead && !this.world.gameOverHandled) {
            this.handleGameEnd(false);
            return true;
        }

        if (bossDead && !this.world.gameOverHandled) {
            this.handleGameEnd(true);
            return true;
        }

        return false;
    }



    /**
     * Shows the end screen based on win/loss and stops the game.
     * @param {boolean} won - Whether the player won.
     */
    showEndScreen(won) {
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
    }

    /**
     * Stops the game loop and disables controls.
     */
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

    /**
     * Starts the game loop (if not running).
     */
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

    /** Handles end of game logic and displays result. */
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

// Export for usage in World
window.GameManager = GameManager;
