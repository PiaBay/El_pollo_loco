class World {
    /** @type {HTMLCanvasElement} */ canvas;
    /** @type {CanvasRenderingContext2D} */ ctx;
    /** @type {Character} */ character;
    /** @type {MovableObject[]} */ chickens = [];
    /** @type {MovableObject[]} */ clouds = [];
    /** @type {MovableObject[]} */ backgroundObjects = [];
    /** @type {number} */ camera_x = 0;

    cameraLocked = false;

    constructor(canvas, ctx, character) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.character = character;
        this.statusBar = new StatusBar();
        this.coinStatusBar = new coinStatusBar();
        this.bottleStatusBar = new BottleStatusBar();
        this.bossHealthBar = new EndbossStatusBar();

        this.bottles = level1.bottles;
        this.coins = level1.coins;
        this.totalBottles = this.bottles.length;
        this.totalCoins = this.coins.length;
        this.collectedBottles = 0;
        this.collectedCoins = 0;
        this.throwables = [];
        this.availableBottles = 0;
        this.bossActivated = false;
        this.characterCanMove = true; // Standard: beweglich

        this.loadLevelContent();
        this.setupKeyboard();
        this.draw();
    }

    loadLevelContent() {

        this.backgroundObjects = level1.backgroundObjects;
        this.chickens = level1.enemies;
        this.clouds = level1.clouds;
        this.endboss = level1.endboss;
        this.endboss.bossHealthBar = this.bossHealthBar;
}

    draw() {
        this.character.applyGravity();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(-this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.updateEnemies();
        this.updateCharacter();
        this.updateCoins();
        this.updateBottles();
        this.handleEndboss();
        this.addToMap(this.character);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.throwables);
        this.throwables.forEach(b => b.move());
        this.addObjectsToMap(this.chickens);
        this.updateThrowables();

        this.ctx.restore();

        this.statusBar.draw(this.ctx);
        this.coinStatusBar.draw(this.ctx);
        this.bottleStatusBar.draw(this.ctx);
        this.bossHealthBar.draw(this.ctx);

        requestAnimationFrame(() => this.draw());

        if (this.character.isDead && this.character.y > 500) {
            this.showEndScreen(false); // ❌ You Lost
        }

        if (this.endboss?.isDead && this.endboss.y > 500) {
            this.showEndScreen(true);  // ✅ You Won
        }
    }

    updateCharacter() {
        this.character.checkLongIdleAnimation(); // ✅ korrekt

        if (!this.characterCanMove) return;
        if (this.character.isDead || this.character.isStunned || this.character.isHurt) return;

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
            this.camera_x = Math.max(this.character.x - 100, 0);
        }
    }


    

    updateCoins() {
        this.coins = this.coins.filter((coin) => {
            if (coin.isCollectedBy(this.character)) {
                this.collectedCoins++;
                this.coinStatusBar.setCoins(this.collectedCoins, this.totalCoins);
                return false;
            }
            return true;
        });
    }

    updateEnemies() {
        this.chickens = this.chickens.filter((chicken) => {
            chicken.moveLeft();

            if (!this.character.isDead && this.character.isColliding(chicken)) {
                const fromAbove = this.character.y + this.character.height < chicken.y + 30;

                if (fromAbove) {
                    this.character.velocityY = -3;
                    return false;
                } else if (this.character.canTakeDamage()) {
                    this.character.takeDamage(20);
                    this.statusBar.setEnergy(this.character.energy);
                    return false;
                }
            }
            return true;
        });
    }

    updateBottles() {
        this.bottles = this.bottles.filter((bottle) => {
            if (bottle.x > this.character.x - 100 && bottle.x < this.character.x + 400) {
                if (bottle.isCollectedBy(this.character)) {
                    this.collectedBottles++;
                    this.availableBottles++;
                    this.bottleStatusBar.setBottles(this.availableBottles, this.totalBottles);
                    return false;
                }
            }
            return true;
        });
    }

    updateThrowables() {
        this.throwables = this.throwables.filter((bottle) => {
            bottle.move();

            const collides = this.endboss && this.endboss.isColliding(bottle);
            console.log('🧪 Flasche:', bottle.x, 'Boss:', this.endboss.x, '→ Kollision:', collides);

            if (this.bossActivated && collides) {
                console.log('💥 Flasche trifft Boss!');
                this.endboss.hit(35, this.bossHealthBar); // 30 = Schaden
                return false;
            }

            return bottle.x <= this.character.x + 720;
        });
    }



    handleEndboss() {
        if (!this.endboss) return;

        this.checkEndbossActivation();
        this.updateEndbossBehavior();
        this.updateEndbossCamera();
    }

    checkEndbossActivation() {
        if (!this.bossActivated && this.character.x > 2200) {
            this.bossActivated = true;
            this.cameraLocked = true;
            this.characterCanMove = false;

            this.endboss.onIntroStart = () => {
                this.chickens = [];
                console.log('🐔 Chickens entfernt!');
            };

            this.endboss.onIntroEnd = () => {
                this.characterCanMove = true;
                this.cameraLocked = false;
            };
        }
    }

    updateEndbossBehavior() {
        if (!this.bossActivated) return;

        const boss = this.endboss;
        const pepe = this.character;

        if (!boss.introPlayed) {
            boss.moveLeft();
        } else if (!boss.isHurt && boss.energy > 0) {
            const dist = pepe.x - boss.x;

            if (Math.abs(dist) > 20) {
                if (dist < 0) {
                    boss.x -= boss.speed;
                    boss.otherDirection = false;
                } else {
                    boss.x += boss.speed;
                    boss.otherDirection = true;
                }

                boss.startWalkingAnimation();
            } else {
                boss.stopWalkingAnimation();
            }
        }

        // 🧲 Gravity nach dem Tod
        if (boss.fallAfterDeath) {
            boss.y += boss.velocityY;
            boss.velocityY += boss.gravity;
        }

        this.addToMap(boss);
    }

    updateEndbossCamera() {
        if (this.cameraLocked) {
            this.camera_x = this.endboss.x - 200;
        }
    }



    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

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

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (this.character.isStunned) return;
            if (e.key === 'ArrowRight') keyboard.RIGHT = true;
            if (e.key === 'ArrowLeft') keyboard.LEFT = true;
            if (e.key === 'ArrowUp' && !this.character.isInAir) this.character.jump();
            if (e.key === ' ' && this.availableBottles > 0) {
                this.character.throwBottle(this);
                this.availableBottles--;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight') keyboard.RIGHT = false;
            if (e.key === 'ArrowLeft') keyboard.LEFT = false;
        });
    }


    /**
 * Shows the final game screen with image and text.
 * @param {boolean} won - True if player won, false if lost
 */
    showEndScreen(won) {
        const screen = document.getElementById('end-screen');
        const text = document.getElementById('end-text');
        const image = document.getElementById('end-image');

        if (won) {
            text.innerText = 'You Won!';
            image.src = './assets/img_pollo_locco/img/You won, you lost/You Win A.png'; // ← dein Bild hier einfügen
        } else {
            text.innerText = 'You Lost!';
            image.src = './assets/img_pollo_locco/img/You won, you lost/Game Over.png'; // ← dein Bild hier einfügen
        }

        screen.classList.remove('hidden');
    }

}
