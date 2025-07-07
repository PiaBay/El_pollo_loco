/**
 * Class representing the Endboss enemy.
 * Handles movement, attacks, damage, animations, and death behavior.
 */
class Endboss extends MovableObject {
    walking = false;
    activated = false;
    energy = 100;
    introPlayed = false;
    isHurt = false;
    isDead = false;
    isStunned = false;
    phase = 'intro';
    attackInterval = null;
    isIntroRunning = false;

    IMAGES_WALKING = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DIE = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Constructs the Endboss instance and preloads images.
     * @param {number} x - Starting X coordinate
     */
    constructor(x) {
        super();
        this.x = 2600;
        this.y = 180;
        this.width = 250;
        this.height = 300;
        this.speed = 10;
        this.introPositionX = 2600;

        this.velocityY = 0;
        this.gravity = 0.8;
        this.groundY = 180;

        this.loadImages(this.IMAGES_WALKING, () => this.setImage(this.IMAGES_WALKING[0]));
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIE);
    }


    /**
     * Determines if the boss can currently take damage.
     * @returns {boolean}
     */
    canTakeDamage() {
        return Date.now() - this.lastHitTime > this.hurtCooldown;
    }


    /** Starts the boss intro animation. */
    startIntroAnimation() {
        if (this.introPlayed || this.isIntroRunning) return;
        this.world.inputHandler?.resetKeys?.(); 

        this.isIntroRunning = true;
        this.introPlayed = true;
        this.phase = 'intro';
        this.speed = 0;
        this.onIntroStart?.();
        this.loadImages(this.IMAGES_ALERT, () => this.playAlertAnimation());
    }


    /** Plays alert animation frames. */
    playAlertAnimation() {
        let frame = 0;
        this.alertInterval = setInterval(() => {
            this.setImage(this.IMAGES_ALERT[frame % this.IMAGES_ALERT.length]);
            frame++;
            if (frame >= this.IMAGES_ALERT.length) this.endIntroAnimation();
        }, 500);
    }


    /** Finalizes intro and starts movement and attack. */
    endIntroAnimation() {
        clearInterval(this.alertInterval);
        this.alertInterval = null;

        this.isIntroRunning = false;
        this.phase = 'attack';
        this.startWalkingAnimation();
        this.onIntroEnd?.();
        this.speed = 8;
    }


    /** Starts the walking animation. */
    startWalkingAnimation() {
        if (this.animationInterval) return;
        this.walking = true;
        this.currentImage = 0;
        this.animationInterval = setInterval(() => {
            const i = this.currentImage % this.IMAGES_WALKING.length;
            this.setImage(this.IMAGES_WALKING[i]);
            this.currentImage++;
        }, 350);
    }


    /** Moves the boss left until reaching intro position. */
    moveLeft() {
        if (this.isHurt) return;
        if (!this.walking) this.startWalkingAnimation();
        if (this.x > this.introPositionX) {
            this.x -= this.speed;
        } else if (!this.introPlayed && !this.alertInterval) {
            this.stopWalkingAnimation();
            this.startIntroAnimation();
        }
    }


    /** Stops the walking animation. */
    stopWalkingAnimation() {
        this.walking = false;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
    }


    /** Starts attacking sequence with animation and sound. */
    startAttacking() {
        if (this.attackInterval) return;
        this.playAttackSound();
        this.resetAnimationState();
        this.loadImages(this.IMAGES_ATTACK, () => this.playAttackAnimation());
    }


    /** Plays boss attack sound. */
    playAttackSound() {
        this.world.audio.play('bossAttack');
    }


    /** Resets the animation state and image. */
    resetAnimationState() {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
    }


    /** Plays attack animation frames. */
    playAttackAnimation() {
        const attackImages = this.IMAGES_ATTACK;
        let frame = 0;
        this.animationInterval = setInterval(() => {
            if (frame < attackImages.length) {
                this.setImage(attackImages[frame]);
                frame++;
            } else {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                this.currentImage = 0;
                this.isHurt = false;
                this.setImage(this.IMAGES_WALKING[0]);
            }
        }, 300);
    }


    /** Plays hurt animation when taking damage. */
    playHurtAnimation() {
        if (this.isDead) return;
        this.resetAnimationState();
        let frame = 0;
        this.animationInterval = setInterval(() => {
            if (frame < this.IMAGES_HURT.length) {
                this.setImage(this.IMAGES_HURT[frame]);
                frame++;
            } else {
                this.finishHurtAnimation();
            }
        }, 300);
    }


    /** Finalizes hurt animation state. */
    finishHurtAnimation() {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
        this.setImage(this.IMAGES_WALKING[0]);
        this.walking = false;
        this.isHurt = false;
        this.isStunned = false;
        this.startWalkingAnimation();
    }


    /**
     * Handles damage intake and calls death if energy depleted.
     * @param {number} amount - Amount of damage
     * @param {StatusBar} [statusBar] - Optional custom health bar
     */
    hit(amount = 30) {
        if (this.isDead) return;
        this.energy = Math.max(0, this.energy - amount);
        this.statusBarManager?.updateBossHealth(this.energy);
        this.lastHitTime = Date.now();
        this.isHurt = true;
        this.isStunned = true;

        this.phase = 'retreat';

        // 🔁 Optional: Nach kurzer Zeit zurück zur "attack"-Phase
        setTimeout(() => {
            if (!this.isDead && !this.isHurt) {
                this.phase = 'attack';
            }
        }, 1200);

        if (this.energy <= 0) {
            this.die();
        } else {
            this.playHurtAnimation();
        }
    }



    /** Reduces energy and updates health bar. */
    reduceEnergy(amount) {
        this.energy = Math.max(0, this.energy - amount);
        this.statusBarManager?.updateBossHealth(this.energy);
    }


    /** Moves the boss toward the player and attacks if in range. */
    pursueTarget(character) {
        if (this.shouldSkipPursuit()) return;

        switch (this.phase) {
            case 'attack':
                this.pursueAndAttack(character);
                break;
            case 'retreat':
                this.moveBackToIntroPosition();
                break;
            case 'wait':
                // nichts tun – auf neues Intro warten
                break;
        }
    }


/** Checks if boss should skip pursuing the player. */
    shouldSkipPursuit() {
        return this.isDead || this.isHurt || this.isStunned || this.energy <= 0;
    }


/**
 * Moves toward the character and checks for attack.
 * @param {Character} character - The player character
 */
    pursueAndAttack(character) {
        const dist = character.x - this.x;

        if (Math.abs(dist) > 20) {
            this.moveTowardsTarget(dist);
            this.startWalkingAnimation();
        } else {
            this.stopWalkingAnimation();
        }

        this.checkAttack(character);
    }


/** Moves boss in direction of target. */
    moveTowardsTarget(dist) {
        if (dist < 0) {
            this.x -= this.speed;
            this.otherDirection = false;
        } else {
            this.x += this.speed;
            this.otherDirection = true;
        }
    }


 /** Checks attack condition and applies damage if applicable. */
    checkAttack(character) {
        const distance = Math.abs(this.x - character.x);
        const now = Date.now();
        const attackRange = 80;
        if (!this.lastAttackTime) this.lastAttackTime = 0;
        if (this.canAttack(distance, now)) {
            this.startAttacking();
            character.takeDamage(20);
            this.lastAttackTime = now;
            this.world.statusBarManager.updateCharacterHealth();
            this.phase = 'retreat';
            this.world.bossFocusActive = true; // ✅ Kamera auf Boss
            this.stopWalkingAnimation();
        }
    }
    

/** Returns true if attack is allowed. */
    canAttack(distance, now) {
        return distance < 80 && !this.isDead && !this.isHurt && !this.isStunned && now - this.lastAttackTime > 1000;
    }


    /**
     * Moves the boss back until the edge of the visible camera area.
     * Once reached, stops and faces the character.
     */
    moveBackToIntroPosition() {
        const pepe = this.world.character;
        const stopX = pepe.x + 720; // oder 680, je nach Abstand


        if (this.x < stopX) {
            this.x += this.speed;
            this.otherDirection = true; // läuft weg von Pepe
            this.startWalkingAnimation();
        } else {
            this.stopWalkingAnimation();
            this.otherDirection = false; // dreht sich zu Pepe
            this.phase = 'wait';
            this.introPlayed = false;
            this.startIntroAnimation();
        }
    }


/** Handles death animation and fall. */
    /** Handles death animation and triggers fall and end screen. */
    die() {
        if (this.isDead) return;

        this.isDead = true;
        this.stopCurrentAnimation();
        this.world.statusBarManager.updateBossHealth(0);
        this.velocityY = 0; // Setze den Startwert für den Fall
        this.gravity = 0.8;

        // Animation und Fall durchlaufen, dann Endscreen anzeigen
        this.playDeathAnimation(() => {
            this.world.gameManager.handleGameEnd(true);
        });
    }





/** Stops animation interval and resets state. */
    stopCurrentAnimation() {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.walking = false;
        this.currentImage = 0;
    }

    /** Enables falling after death. */
    prepareDeathFall() {
        this.velocityY = -2;     // 🟢 Weniger Sprungkraft
        this.gravity = 0.2;      // 🟢 Sanftere Beschleunigung
        this.vxAfterDeath = 1.5; // optional für seitliches Wegdriften
        this.fallAfterDeath = true;
    }



/** Plays death animation frames. */
    /**
     * Plays death animation frames and triggers falling afterward.
     * @param {Function} [onComplete] - Optional callback after boss has fallen out of view.
     */
    playDeathAnimation(onComplete) {
        let frame = 0;

        const animationInterval = setInterval(() => {
            if (frame < this.IMAGES_DIE.length) {
                this.setImage(this.IMAGES_DIE[frame]);
                frame++;
            } else {
                clearInterval(animationInterval);

                // Starte Fall nach Animation
                this.fallAfterDeath = true;

                // Warte bis der Boss ganz unten ist (aus dem Canvas gefallen)
                const fallInterval = setInterval(() => {
                    this.y += this.velocityY;
                    this.velocityY += this.gravity;

                    if (this.y > 600) { // Etwas über Canvas-Höhe hinaus
                        clearInterval(fallInterval);
                        onComplete?.(); // ✅ Endscreen auslösen
                    }
                }, 50);
            }
        }, 400);
    }

}
