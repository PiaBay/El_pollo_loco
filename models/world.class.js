class World {
    /** @type {HTMLCanvasElement} */ canvas;
    /** @type {CanvasRenderingContext2D} */ ctx;
    /** @type {Character} */ character;
    /** @type {MovableObject[]} */ chickens = [];
    /** @type {MovableObject[]} */ clouds = [];
    /** @type {MovableObject[]} */ backgroundObjects = [];
    /** @type {Object} */ keys = {};
    /** @type {number} */ camera_x = 0;

    cameraLocked = false;

    constructor(canvas, ctx, character) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.character = character;
        this.statusBar = new StatusBar();
        this.coinStatusBar = new CoinStatusBar();
        this.coins = level1.coins; // ⬅️ angenommen, Level enthält coins
        this.collectedCoins = 0;
        this.totalCoins = level1.coins.length;
        this.loadLevelContent();
        this.setupKeyboard();
        this.draw();
    }

    /**
     * Loads all objects from level1.
     */
    loadLevelContent() {
        this.backgroundObjects = level1.backgroundObjects;
        this.chickens = level1.enemies;
        this.clouds = level1.clouds;
        this.endboss = level1.endboss;
        this.bossTargetX = 2300;

    }

    /**
     * Main drawing function, handles movement, rendering, collisions, and UI.
     */
    draw() {
        this.character.applyGravity();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.updateEnemies();
        this.updateCharacter();
        this.updateCoins();
        this.handleEndboss();
        this.addToMap(this.character);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.coins); // Coins anzeigen

        // Coin-Kollision prüfen
        this.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.coins.splice(index, 1);
                this.collectedCoins++;
                this.coinStatusBar.setCoins(this.collectedCoins);
            }
        });
        this.ctx.save();
        this.ctx.translate(this.camera_x, 0);
        this.statusBar.draw(this.ctx);
        this.coinBar.draw(this.ctx); // ⬅️ zusätzlich zeichnen
        this.ctx.restore();

        // Draw UI elements (e.g. StatusBar)


        requestAnimationFrame(() => this.draw());
    }

    /**
     * Handles character movement, camera updates and animation switching.
     */
    updateCharacter() {
        if (keyboard.RIGHT) {
            this.character.moveRight();
            this.character.startWalkingAnimation();
        } else if (keyboard.LEFT) {
            this.character.moveLeft();
            this.character.startWalkingAnimation();
        } else if (this.character.walking) {
            this.character.stopWalkingAnimation();
        }

        if (!this.cameraLocked) {
            this.camera_x = this.character.x - 100;
            if (this.camera_x < 0) this.camera_x = 0;
        }
    }

    updateCoins() {
        level1.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                level1.coins.splice(index, 1);
                this.collectedCoins++;
                this.coinBar.setCoins(this.collectedCoins, this.totalCoins);
            }
        });

        this.addObjectsToMap(level1.coins);
    }

    /**
     * Updates and checks all enemies.
     */
    updateEnemies() {
        this.chickens.forEach((chicken, index) => {
            chicken.moveLeft();
        });

        this.chickens.forEach((chicken, index) => {
            if (!this.character.isDead && this.character.isColliding(chicken)) {
                this.character.takeDamage(20);
                this.statusBar.setEnergy(this.character.energy);
                this.chickens.splice(index, 1); // oder später im Frame
            }
        });


        this.addObjectsToMap(this.chickens);
    }

    /**
     * Handles endboss logic and movement.
     */
    handleEndboss() {
        if (!this.endboss) return;

        if (!this.bossActivated && this.character.x >= 2200) {
            this.bossActivated = true;
            this.endboss.activate();
            this.chickens = [];
        }

        if (this.bossActivated) {
            if (this.endboss.x > this.bossTargetX) {
                this.endboss.x -= 5;
            } else {
                this.cameraLocked = true;
            }
            this.addToMap(this.endboss);
        }
    }

    /**
     * Adds an array of objects to the canvas.
     * @param {MovableObject[]} objects
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Adds one object to the canvas, mirrored if needed.
     * @param {MovableObject} mo
     */
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

    /**
     * Initializes keyboard event listeners.
     */
    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowRight': keyboard.RIGHT = true; break;
                case 'ArrowLeft': keyboard.LEFT = true; break;
                case 'ArrowUp':
                    if (!this.character.isInAir) {
                        this.character.jump();
                    }
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowRight': keyboard.RIGHT = false; break;
                case 'ArrowLeft': keyboard.LEFT = false; break;
            }
        });
    }
}

