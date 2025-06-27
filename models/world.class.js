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
        this.characterCanMove = true;
        this.preventIdle = false;
        this.gameOverHandled = false;
        this.availableBottles = 0;
        this.maxBottleCapacity = 30; // oder was du willst
        this.character.world = this; 
        this.loadLevelContent();

        this.jumpSound = new Audio('./audio/jump-up-245782.mp3');
        this.throwSound = new Audio('./audio/bottle-pop-45531.mp3');
        this.hurtSound = new Audio('./audio/grunt2-85989.mp3');
        this.winSound = new Audio('./audio/game-bonus-144751.mp3');
        this.loseSound = new Audio('./audio/game-over-38511.mp3');
        this.bottlePickupSound = new Audio('./audio/bottle-205353.mp3');
        this.coinSound = new Audio('./audio/coins-135571.mp3');
        this.chickenSound = new Audio('./audio/chicken-noise-228106.mp3');
        this.bossHitSound = new Audio('./audio/roaster-crows-2-363352.mp3');
        this.bossIntroSound = new Audio('./audio/dark-drone-351092.mp3');


        this.setupKeyboard();
        this.draw();
    }

    loadLevelContent() {

        this.backgroundObjects = level1.backgroundObjects;
        this.chickens = level1.enemies;
        this.clouds = level1.clouds;
        this.endboss = level1.endboss;
        this.endboss.bossHealthBar = this.bossHealthBar;
        this.endboss.world = this;

}

    draw() {
        if (this.checkEndConditions()) return;

        this.character.applyGravity();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(-this.camera_x, 0);

        this.drawWorldElements(); // ⬅️ ausgelagert

        this.ctx.restore();

        this.drawStatusBars();    // ⬅️ ausgelagert

        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    drawWorldElements() {
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
    }


    drawStatusBars() {
        this.statusBar.draw(this.ctx);
        this.coinStatusBar.draw(this.ctx);
        this.bottleStatusBar.draw(this.ctx);
        this.bossHealthBar.draw(this.ctx);
    }

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

    
    updateCoins() {
        this.coins = this.coins.filter((coin) => {
            if (coin.isCollectedBy(this.character)) {
                this.collectedCoins++;
                this.coinStatusBar.setCoins(this.collectedCoins, this.totalCoins);

                // 🔊 Soundeffekt abspielen
                this.coinSound?.play();

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
                    this.chickenSound?.play();
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
            if (bottle.isCollectedBy(this.character)) {
                this.collectedBottles += 5;  // 🔼 Diese Zeile ergänzt die Gesamtanzahl
                this.availableBottles += 5;

                this.bottleStatusBar.setBottles(this.availableBottles, this.maxBottleCapacity);
                console.log('Available:', this.availableBottles);
                this.bottlePickupSound?.play();
                console.log('✅ Flasche eingesammelt bei y:', bottle.y);

                return false; // Flasche aus der Liste entfernen
            }
            return true;
        });
    }

    updateThrowables() {
        this.throwables = this.throwables.filter((bottle) => {
            bottle.move();

            const collides = this.endboss && this.endboss.isColliding(bottle);

            if (this.bossActivated && collides) {
                this.bossHitSound?.play();
                this.endboss.hit(30, this.bossHealthBar); // 30 = Schaden
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
            this.bossIntroSound?.play(); // 🔊 Intro-Sound abspielen

            this.cameraLocked = true;
            this.characterCanMove = false;
            this.preventIdle = true; // ⛔️ Idle sofort deaktivieren
            this.endboss.onIntroStart = () => {
                this.chickens = [];
                this.character.longIdlePermanentlyDisabled = true; // 🧠 Long Idle ab sofort komplett aus!
                this.preventIdle = true;
              };
            this.endboss.onIntroEnd = () => {
                this.characterCanMove = true;
                this.cameraLocked = false;
                this.preventIdle = false; // ✅ Idle wieder erlauben
            };
        }
    }

    updateEndbossBehavior() {
        if (!this.bossActivated) return;

        const boss = this.endboss;
        const pepe = this.character;

        // 🚪 Intro: Boss läuft zur Kampfposition
        if (!boss.introPlayed) {
            boss.moveLeft();
        }
        // 🧠 Kampfphase
        else {
            boss.pursueTarget(pepe);
        }

        // 🧲 Fallverhalten nach dem Tod
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
            if (e.key === 'ArrowUp' && !this.character.isInAir) {
                this.jumpSound?.play(); // Sound hier
                this.character.jump();
            }  
            if (e.key === ' ' && this.availableBottles > 0) {
                this.character.throwBottle(this);
                this.availableBottles--;

                this.bottleStatusBar.setBottles(this.availableBottles, this.maxBottleCapacity);
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowRight') keyboard.RIGHT = false;
            if (e.key === 'ArrowLeft') keyboard.LEFT = false;
        });
    }

    checkEndConditions() {
        if (this.character.isDead && this.character.y > 500 && !this.gameOverHandled) {
            console.log('💀 Character tot – Spiel verloren');
            this.handleGameEnd(false);
            return true;
        }

        if (this.endboss?.isDead && this.endboss.y > 500 && !this.gameOverHandled) {
            console.log('🏆 Endboss besiegt – Spiel gewonnen');
            this.handleGameEnd(true);
            return true;
        }

        return false;
    }

    handleGameEnd(won) {
        this.gameOverHandled = true;
        this.showEndScreen(won); // Jetzt wird der Endscreen wirklich angezeigt
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
            image.src = './assets/img_pollo_locco/img/You won, you lost/You Win A.png';
            this.winSound?.play();
        } else {
            text.innerText = 'You Lost!';
            image.src = './assets/img_pollo_locco/img/You won, you lost/Game Over.png';
            this.loseSound?.play();
        }
        this.stopGameLoop(); // 🔴 Spiel sofort anhalten!

        screen.classList.remove('hidden');
    }

    stopGameLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.characterCanMove = false;
        this.cameraLocked = true;

        // Tasteneingaben blockieren
        keyboard.RIGHT = false;
        keyboard.LEFT = false;

        // Endboss stoppen
        if (this.endboss) {
            this.endboss.freeze();  // 🧊 <– HIER wird alles gestoppt
        }

        console.log('🛑 Spiel gestoppt.');
    }


}
