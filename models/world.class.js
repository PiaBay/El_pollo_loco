/**
 * Represents the game world, including rendering, game logic, audio, and object handling.
 */
class World {
    /** @type {HTMLCanvasElement} */ canvas;
    /** @type {CanvasRenderingContext2D} */ ctx;
    /** @type {Character} */ character;
    /** @type {MovableObject[]} */ chickens = [];
    /** @type {MovableObject[]} */ clouds = [];
    /** @type {MovableObject[]} */ backgroundObjects = [];
    /** @type {number} */ camera_x = 0;

    cameraLocked = false;

    /**
     * Initializes a new World instance.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     * @param {Character} character - The main playable character.
     */
    constructor(canvas, ctx, character, audio = null) {
        this.audio = audio || window.audio;
                this.canvas = canvas;
        this.ctx = ctx;
        this.character = character;
        this.character.world = this;

        this.initStatusBars();
        this.initLevelItems();
        this.initGameState();
        this.loadSettings();
        this.setupKeyboard();
        this.loadLevelContent();

        this.draw();
    }

    /** Initializes all status bars. */
    initStatusBars() {
        this.statusBar = new StatusBar();
        this.coinStatusBar = new coinStatusBar();
        this.bottleStatusBar = new BottleStatusBar();
        this.bossHealthBar = new EndbossStatusBar();
        this.showBossHealthBar = false;
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

    /** Initializes game state flags. */
    initGameState() {
        this.bossActivated = false;
        this.characterCanMove = true;
        this.preventIdle = false;
        this.gameOverHandled = false;
        this.maxBottleCapacity = 30;
    }

    /** Loads settings from localStorage. */
    loadSettings() {
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.musicEnabled = localStorage.getItem('musicEnabled') === 'true';
    }


    /** Loads level-specific objects into the world. */
    loadLevelContent() {
        this.backgroundObjects = level1.backgroundObjects;
        this.chickens = level1.enemies;
        this.clouds = level1.clouds;
    }

    /** Starts the game loop and continuously draws the game world. */
    draw() {
        if (this.gameOverHandled) return;
        this.character.applyGravity();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.camera_x, 0);
        this.drawWorldElements();
        this.ctx.restore();
        this.drawStatusBars();
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /** Draws background, updates world state, and renders game objects. */
    drawWorldElements() {
        this.drawBackground();
        this.updateWorldState();
        if (this.checkEndConditions()) return;
        this.drawWorldObjects();
    }

    /** Draws background layers. */
    drawBackground() {
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
    }

    /** Updates all world entities like enemies, character, and items. */
    updateWorldState() {
        this.updateEnemies();
        this.updateCharacter();
        this.updateCoins();
        this.updateBottles();
        this.updateThrowables();
        this.handleEndboss();
    }

    /** Draws all visible game objects on screen. */
    drawWorldObjects() {
        this.addToMap(this.character);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.throwables);
        this.throwables.forEach(b => b.move());
        this.addObjectsToMap(this.chickens);
        if (this.bossActivated && this.endboss && !this.gameOverHandled) {
            this.addToMap(this.endboss);
        }
    }

    /** Draws all status bars (health, coins, bottles, boss). */
    drawStatusBars() {
        this.statusBar.draw(this.ctx);
        this.coinStatusBar.draw(this.ctx);
        this.bottleStatusBar.draw(this.ctx);
        if (this.showBossHealthBar && this.bossHealthBar) {
            this.bossHealthBar.draw(this.ctx);
        }
    }

    /**
     * Updates character movement and handles camera position.
     */
    updateCharacter() {
        if (!this.characterCanMove) return;
        if (this.character.isDead || this.character.isStunned || this.character.isHurt) return;
        this.character.checkLongIdleAnimation(this.preventIdle);
        if (keyboard.RIGHT) {
            this.character.moveRight();
        } else if (keyboard.LEFT) {
            this.character.moveLeft();
        } else {
            this.character.stopWalkingAnimation();
        }
        if (!this.cameraLocked) {
            this.camera_x = Math.max(this.character.x - 100, 0);
        }
    }

    /**
     * Updates coin collection logic and updates the coin status bar.
     */
    updateCoins() {
        this.coins = this.coins.filter((coin) => {
            if (coin.isCollectedBy(this.character)) {
                this.collectedCoins++;
                this.coinStatusBar.setCoins(this.collectedCoins, this.totalCoins);
                 this.audio.play('coin');
                return false;
            }
            return true;
        });
    }

    /**
     * Updates enemy movement and collision behavior.
     */
    updateEnemies() {
        this.chickens = this.chickens.filter(chicken => {
            chicken.moveLeft();
            if (this.character.isDead) return true;
            if (!this.character.isColliding(chicken)) return true;
            if (this.isJumpingOnChicken(chicken)) {
                this.handleChickenJumpKill();
                return false;
            }
            if (this.character.canTakeDamage()) {
                this.handleCharacterHit();
                return false;
            }
            return true;
        });
    }

    /**
     * Checks if the character is jumping on top of a chicken.
     * @param {MovableObject} chicken - The chicken to check.
     * @returns {boolean} True if collision is from above.
     */
    isJumpingOnChicken(chicken) {
        return this.character.y + this.character.height < chicken.y + 30;
    }

    /** Handles logic when chicken is killed by jump. */
    handleChickenJumpKill() {
        this.character.velocityY = -3;
            this.audio.play('chicken');
    }

    /** Handles logic when character gets hit by enemy. */
    handleCharacterHit() {
        this.character.takeDamage(20);
        this.statusBar.setEnergy(this.character.energy);
    }

    /**
     * Updates bottle collection and status bar.
     */
    updateBottles() {
        this.bottles = this.bottles.filter((bottle) => {
            if (bottle.isCollectedBy(this.character)) {
                this.collectedBottles += 5;
                this.availableBottles += 5;
                this.bottleStatusBar.setBottles(this.availableBottles, this.maxBottleCapacity);
                    this.audio.play('bottlePickup');
                return false;
            }
            return true;
        });
    }

    /**
     * Updates thrown bottles and handles collision with endboss.
     */
    updateThrowables() {
        this.throwables = this.throwables.filter((bottle) => {
            bottle.move();
            const collides = this.endboss && this.endboss.isColliding(bottle);
            if (this.bossActivated && collides) {
                    this.audio.play('bossHit');
                this.endboss.hit(30, this.bossHealthBar);
                return false;
            }
            return bottle.x <= this.character.x + 720;
        });
    }

    /**
     * Handles logic for activating and controlling the endboss.
     */
    handleEndboss() {
        this.checkEndbossActivation();
        if (!this.endboss || this.gameOverHandled) return;
        this.updateEndbossBehavior();
        this.updateEndbossCamera();
    }

    /** Checks if endboss should be activated. */
    checkEndbossActivation() {
        if (this.gameOverHandled) return;
        if (!this.bossActivated && this.character.x > 2200) {
            this.activateEndboss();
        }
    }

    /** Activates the endboss and initializes intro behavior. */
    activateEndboss() {
        this.endboss = new Endboss();
        this.endboss.bossHealthBar = this.bossHealthBar;
        this.endboss.world = this;
        this.bossActivated = true;
        this.showBossHealthBar = true;
        this.audio.play('bossIntro');
        this.lockCameraAndCharacter();
        this.endboss.onIntroStart = () => this.handleBossIntroStart();
        this.endboss.onIntroEnd = () => this.handleBossIntroEnd();
    }

    /** Locks player and camera during endboss intro. */
    lockCameraAndCharacter() {
        this.cameraLocked = true;
        this.characterCanMove = false;
        this.preventIdle = true;
    }

    /** Called at the start of the endboss intro. */
    handleBossIntroStart() {
        this.chickens = [];
        this.character.longIdlePermanentlyDisabled = true;
        this.preventIdle = true;
    }

    /** Called at the end of the endboss intro. */
    handleBossIntroEnd() {
        this.characterCanMove = true;
        this.cameraLocked = false;
        this.preventIdle = false;
    }

    /** Updates endboss movement and gravity. */
    updateEndbossBehavior() {
        const boss = this.endboss;
        const pepe = this.character;
        if (!boss.introPlayed) {
            boss.moveLeft();
        } else {
            boss.pursueTarget(pepe);
        }
        if (boss.fallAfterDeath) {
            boss.y += boss.velocityY;
            boss.velocityY += boss.gravity;
        }
        this.addToMap(boss);
    }

    /** Locks camera to endboss during intro phase. */
    updateEndbossCamera() {
        if (this.cameraLocked) {
            this.camera_x = this.endboss.x - 200;
        }
    }

    /** Adds multiple objects to the canvas map. */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /** Adds a single object to the canvas, accounting for direction. */
    addToMap(mo) {
        if (mo.img && mo.img.complete && mo.img.naturalWidth > 0) {
            if (mo.otherDirection) {
                this.ctx.save();
                this.ctx.translate(mo.x + mo.width, 0);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
            }
        }
    }

    /** Sets up keyboard input listeners. */
    setupKeyboard() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    /** Handles keydown input actions. */
    handleKeyDown(e) {
        if (this.character.isStunned) return;
        switch (e.key) {
            case 'ArrowRight': keyboard.RIGHT = true; break;
            case 'ArrowLeft': keyboard.LEFT = true; break;
            case 'ArrowUp': this.handleJumpKey(); break;
            case ' ': this.handleThrowKey(); break;
        }
    }

    /** Handles keyup input actions. */
    handleKeyUp(e) {
        if (e.key === 'ArrowRight') keyboard.RIGHT = false;
        if (e.key === 'ArrowLeft') keyboard.LEFT = false;
    }

    /** Handles jump key input. */
    handleJumpKey() {
        if (!this.character.isInAir) {
            this.audio.play('jump');
            this.character.jump();
        }
    }

    /** Handles bottle throw key input. */
    handleThrowKey() {
        if (this.availableBottles > 0) {
            this.character.throwBottle(this);
            this.availableBottles--;
            this.bottleStatusBar.setBottles(this.availableBottles, this.maxBottleCapacity);
        }
    }

    /** Checks end conditions for character or boss death. */
    checkEndConditions() {
        if (this.character.isDead && this.character.y > 500 && !this.gameOverHandled) {
            this.handleGameEnd(false);
            return true;
        }
        if (this.endboss?.isDead && this.endboss.y > 500 && !this.gameOverHandled) {
            this.handleGameEnd(true);
            return true;
        }
        return false;
    }

    /** Handles end of game logic and displays result. */
    handleGameEnd(won) {
        if (this.gameOverHandled) return;
        this.gameOverHandled = true;
        this.characterCanMove = false;
        this.cameraLocked = true;
        this.preventIdle = true;
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
        this.showEndScreen(won);
    }

    /**
     * Displays the end screen with appropriate message and image.
     * @param {boolean} won - True if the player won, false otherwise.
     */
    showEndScreen(won) {
        const screen = document.getElementById('end-screen');
        const text = document.getElementById('end-text');
        const image = document.getElementById('end-image');
        if (won) {
            text.innerText = 'You Won!';
            image.src = './assets/img_pollo_locco/img/You won, you lost/You Win A.png';
            this.winSound?.play();
        } else {
            text.innerText = 'You Lost!';
            image.src = './assets/img_pollo_locco/img/You won, you lost/Game Over.png';
            this.loseSound?.play();
        }
        this.stopGameLoop();
        screen.classList.remove('hidden');
    }

    /** Stops the main game loop and disables controls. */
    stopGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
        }
        this.characterCanMove = false;
        this.cameraLocked = true;
        keyboard.RIGHT = false;
        keyboard.LEFT = false;
    }

    /** Starts the game loop again (if not already running). */
    startGameLoop() {
        if (!this.animationFrameId) {
            this.characterCanMove = true;
            this.cameraLocked = false;
            if (this.musicEnabled) {
                this.backgroundMusic.play().catch(() => { });
            }
            this.draw();
        }
    }
}
