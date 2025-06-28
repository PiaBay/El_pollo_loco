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
        this.showBossHealthBar = false;
        this.gameOverHandled = false;
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
        this.maxBottleCapacity = 30;
        this.character.world = this;

        this.loadSounds();
        this.setupKeyboard();
        this.loadLevelContent();
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // default: true
        this.musicEnabled = localStorage.getItem('musicEnabled') === 'true';  // default: false (oder wie du willst)
        this.draw();
    }

    loadSounds() {
        this.jumpSound = new Audio('./audio/jump-up-245782.mp3');
        this.throwSound = new Audio('./audio/bottle-pop-45531.mp3');
        this.hurtSound = new Audio('./audio/grunt2-85989.mp3');
        this.winSound = new Audio('./audio/spanish-motifs-329486.mp3');
        this.loseSound = new Audio('./audio/to-you-valladolid-254757.mp3');
        this.bottlePickupSound = new Audio('./audio/bottle-205353.mp3');
        this.coinSound = new Audio('./audio/coins-135571.mp3');
        this.chickenSound = new Audio('./audio/chicken-noise-228106.mp3');
        this.bossHitSound = new Audio('./audio/roaster-crows-2-363352.mp3');
        this.bossIntroSound = new Audio('./audio/dark-drone-351092.mp3');
        this.bossAttackSound = new Audio('./audio/dragon-growl-364483.mp3')
        this.backgroundMusic = new Audio('./audio/spanish-motifs-329486.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
    }




    playSound(sound) {
        if ((sound === this.backgroundMusic && this.musicEnabled) ||
            (sound !== this.backgroundMusic && this.soundEnabled)) {
            sound?.play().catch((e) => {
                console.warn('🎵 Fehler beim Abspielen von Sound:', e);
            });
        }
    }

    loadLevelContent() {

        this.backgroundObjects = level1.backgroundObjects;
        this.chickens = level1.enemies;
        this.clouds = level1.clouds;
}

    draw() {
        if (this.gameOverHandled) return;

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
        this.handleEndboss();  // 👈 Endboss vor Spiel-Ende prüfen

        if (this.checkEndConditions()) return;

        this.addToMap(this.character);
        this.addObjectsToMap(this.clouds);
        this.addObjectsToMap(this.coins);
        this.addObjectsToMap(this.bottles);
        this.addObjectsToMap(this.throwables);
        this.throwables.forEach(b => b.move());
        this.addObjectsToMap(this.chickens);
        this.updateThrowables();
        if (this.bossActivated && this.endboss && !this.gameOverHandled) {
            this.addToMap(this.endboss);
        }
    }



    drawStatusBars() {
        this.statusBar.draw(this.ctx);
        this.coinStatusBar.draw(this.ctx);
        this.bottleStatusBar.draw(this.ctx);
        if (this.showBossHealthBar && this.bossHealthBar) {
            this.bossHealthBar.draw(this.ctx);
        }    
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
                if (localStorage.getItem('soundEnabled') === 'true') {
                    this.playSound(this.coinSound);                                }               

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
                    if (localStorage.getItem('soundEnabled') === 'true') {
                        this.playSound(this.chickenSound);                    }
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
                this.playSound(this.bottlePickupSound);
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
                if (localStorage.getItem('soundEnabled') === 'true') {
                    this.playSound(this.bossHitSound);                }
                this.endboss.hit(30, this.bossHealthBar); // 30 = Schaden
                return false;
            }

            return bottle.x <= this.character.x + 720;
        });
    }



    handleEndboss() {
        console.log('[handleEndboss] aufgerufen, bossActivated:', this.bossActivated, '| character.x:', this.character.x);

        // ⬇️ Erst prüfen, ob Endboss aktiviert werden soll:
        this.checkEndbossActivation();

        // ⬇️ Wenn kein Boss existiert, trotzdem hier rausgehen:
        if (!this.endboss || this.gameOverHandled) return;

        this.updateEndbossBehavior();
        this.updateEndbossCamera();
    }



    checkEndbossActivation() {
        console.log('🧨 Endboss aktiviert!');
        if (this.gameOverHandled) return;
        if (!this.bossActivated && this.character.x > 2200) {
            this.endboss = new Endboss(); // 🆕 Boss wird hier erstellt
            this.endboss.bossHealthBar = this.bossHealthBar;
            this.endboss.world = this;
            this.bossActivated = true;
            this.showBossHealthBar = true; // ✅ Statusbar jetzt anzeigen

            this.playSound(this.bossIntroSound);
            this.cameraLocked = true;
            this.characterCanMove = false;
            this.preventIdle = true;

            this.endboss.onIntroStart = () => {
                this.chickens = [];
                this.character.longIdlePermanentlyDisabled = true;
                this.preventIdle = true;
            };

            this.endboss.onIntroEnd = () => {
                this.characterCanMove = true;
                this.cameraLocked = false;
                this.preventIdle = false;
            };
        }
    }
    updateEndbossBehavior() {
        console.log('🎬 Endboss wird gezeichnet bei X:', this.endboss?.x);

        if (this.gameOverHandled) return;
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
                this.playSound(this.jumpSound);
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
        if (this.gameOverHandled) return;
        this.gameOverHandled = true;

        this.characterCanMove = false;
        this.cameraLocked = true;
        this.preventIdle = true;

        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }

        // Direkt die zentrale Methode aufrufen:
        this.showEndScreen(won);
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
    if (this.backgroundMusic) {
        this.backgroundMusic.pause();
    }
    this.characterCanMove = false;
    this.cameraLocked = true;

    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    console.log('🛑 Spiel gestoppt.');
}
    startGameLoop() {
        if (!this.animationFrameId) {
            this.characterCanMove = true;
            this.cameraLocked = false;

            if (this.musicEnabled) {
                this.backgroundMusic.play().catch(() => { });
            }

            this.draw();
            console.log('▶️ Spiel fortgesetzt.');
        }
    }


}