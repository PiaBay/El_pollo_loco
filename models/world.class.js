/**
 * Represents the game world, including rendering, game logic, audio, and object handling.
 */
class World {
canvas;
ctx;
character;
camera_x = 0;

/**
 * Initializes a new World instance.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
 * @param {Character} character - The main playable character.
 * @param {AudioManager} [audio] - The audio manager (optional).
 */
    constructor(canvas, ctx, character, audio = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.audio = audio || window.audio;

        this.character = character;
        this.character.world = this;
        this.gameManager = new GameManager(this, this.audio);
        this.endbossController = new EndbossController(this);
        this.statusBarManager = new StatusBarManager(
            this.character,
            this.gameManager,
        );
        this.inputHandler = new InputHandler(this.character, this);
        this.characterController = new CharacterController(this.character, this, this.inputHandler);
        this.gameManager.loadLevelContent();
        this.gameManager.initLevelItems();
        this.draw();
    }

/**
 * Starts the game loop and continuously renders the game.
 */
    draw() {
        if (this.gameOverHandled) return; // ⛔ STOPP GANZ AM ANFANG!

        if (!window.frameCount) {
            window.frameCount = 0;
            setInterval(() => {
                window.frameCount = 0;
            }, 1000);
        }
        window.frameCount++;

        this.character.applyGravity();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(-this.camera_x, 0);
        this.drawWorldElements();
        this.ctx.restore();

        this.drawStatusBars();
        if (!this.gameOverHandled) {
            this.animationFrameId = requestAnimationFrame(() => this.draw());
        }
    }

/**
 * Renders and updates all world elements.
 */
    drawWorldElements() {
        this.drawBackground();
        this.updateWorldState();
        if (this.gameManager.checkEndConditions()) return;
        this.drawWorldObjects();

    }

/**
 * Draws all background elements.
 */
    drawBackground() {
        this.addObjectsToMap(this.gameManager.backgroundObjects);
        this.addObjectsToMap(this.gameManager.clouds);
    }

/**
 * Updates all dynamic world entities.
 */
    updateWorldState() {
        this.endbossController.checkActivation();
        this.updateEnemies();
        this.characterController.update();
        this.updateCoins();
        this.updateBottles();
        this.updateThrowables();
        this.endbossController.update();

        if (this.endbossController.endboss?.isDead) {
            this.endbossController.bossFocusActive = false;
        }
    }

/**
 * Renders all visible game objects.
 */
    drawWorldObjects() {
        this.addToMap(this.character);
        this.addObjectsToMap(this.gameManager.coins);
        this.addObjectsToMap(this.gameManager.bottles);
        this.addObjectsToMap(this.gameManager.throwables);
        this.gameManager.throwables.forEach(b => {
            if (b.x < this.character.x + this.canvas.width) {
                b.move();
            }
        });        
        if (!this.endbossController?.endboss?.isIntroRunning) {
            this.addObjectsToMap(this.gameManager.chickens);
        }

        const boss = this.endbossController.endboss;
        if (this.bossActivated && boss && !this.gameOverHandled) {
            this.addToMap(boss);
        }
    }

/**
 * Draws all status bars (health, bottles, coins, boss).
 */
    drawStatusBars() {
        this.statusBarManager.drawAll(this.ctx);
    }

/**
 * Handles coin collection and status update.
 */
    updateCoins() {
        this.gameManager.coins = this.gameManager.coins.filter((coin) => {
            if (coin.isCollectedBy(this.character)) {
                this.gameManager.collectedCoins++;
                this.statusBarManager.updateCoins(
                    this.gameManager.collectedCoins,
                    this.gameManager.totalCoins
                );
                this.audio.play('coin');
                return false;
            }
            return true;
        });
    }

/**
 * Handles chicken movement, collision, and jump-kill or damage.
 */
    updateEnemies() {
        this.gameManager.chickens = this.gameManager.chickens.filter(chicken => {
            if (!chicken) return false;

            chicken.moveLeft();

            if (this.character.isDead) return true;

            if (!this.character.isColliding(chicken)) return true;
            if (this.characterController.handleJumpKill(chicken)) {
                return false;
            }
            if (this.character.canTakeDamage()) {
                this.characterController.handleHit();
                return true;
            }

            return true;
        });
    }

/**
 * Handles bottle collection and status update.
 */
    updateBottles() {
        this.gameManager.bottles = this.gameManager.bottles.filter((bottle) => {
            if (bottle.isCollectedBy(this.character)) {
                this.gameManager.collectedBottles += 5;
                this.gameManager.availableBottles += 5;
                this.statusBarManager.updateBottles(
                    this.gameManager.availableBottles,
                    this.gameManager.maxBottleCapacity
                );
                this.audio.play('bottlePickup');
                return false;
            }
            return true;
        });
    }
/**
 * Handles thrown bottle movement and collision with the endboss.
 */
    updateThrowables() {
        this.gameManager.throwables = this.gameManager.throwables.filter((bottle) => {
            bottle.move();

            const boss = this.endbossController?.endboss;
            const collidesWithBoss = boss && boss.isColliding(bottle);

            if (this.bossActivated && collidesWithBoss) {
                this.audio.play('bossHit');
                boss.hit(30); // Schaden beim Boss
                return false; // Flasche entfernen
            }
            this.gameManager.chickens = this.gameManager.chickens.filter((chicken) => {
                if (bottle.isColliding(chicken)) {
                    // Optional: this.audio.play('chickenHit');
                    return false; // Chicken entfernen
                }
                return true;
            });
            return bottle.x <= this.character.x + 720;
        });
    }

/**
 * Draws a list of objects onto the canvas.
 * @param {MovableObject[]} objects - List of drawable objects.
 */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

/**
 * Draws a single object, flipped if facing left.
 * @param {MovableObject} mo - Movable object to render.
 **/
    addToMap(mo) {
        if (!mo.img) return;
        const isFlipped = mo.otherDirection;
        if (mo instanceof Endboss && mo.isDead && mo.fallAfterDeath) {
            this.ctx.save();
            const cx = mo.x + mo.width / 2;
            const cy = mo.y + mo.height / 2;
            this.ctx.translate(cx, cy);
            this.ctx.rotate(0.3);
            this.ctx.drawImage(mo.img, -mo.width / 2, -mo.height / 2, mo.width, mo.height);
            this.ctx.restore();
        } else if (isFlipped) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(mo.img, -mo.x - mo.width, mo.y, mo.width, mo.height);
            this.ctx.restore();
        } else {
            this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }
    }
}
window.World = World;