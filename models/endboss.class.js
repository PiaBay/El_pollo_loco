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
 * Constructs the Endboss instance and preloads all animations.
 * 
 * @param {number} x - Starting X position of the endboss.
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
 * Determines if the endboss can currently take damage.
 * 
 * @returns {boolean} True if damage cooldown has passed.
 */
    canTakeDamage() {
        return Date.now() - this.lastHitTime > this.hurtCooldown;
    }

/**
 * Starts the intro animation sequence.
 * Disables movement, resets input, and switches to alert phase.
 */
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

/**
 * Plays alert animation frames in sequence.
 * Transitions to attack phase after completion.
 */
    playAlertAnimation() {
        let frame = 0;
        this.alertInterval = setInterval(() => {
            this.setImage(this.IMAGES_ALERT[frame % this.IMAGES_ALERT.length]);
            frame++;
            if (frame >= this.IMAGES_ALERT.length) this.endIntroAnimation();
        }, 500);
    }

/**
 * Ends the intro animation and switches the boss to attack phase.
 * Resumes movement and calls `onIntroEnd()` if defined.
 */
    endIntroAnimation() {
        clearInterval(this.alertInterval);
        this.alertInterval = null;

        this.isIntroRunning = false;
        this.phase = 'attack';
        this.startWalkingAnimation();
        this.onIntroEnd?.();
        this.speed = 8;
    }

/**
 * Starts the walking animation in a loop.
 * Each frame is shown for 350 ms.
 */
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

/**
 * Moves the boss to the left until the intro trigger position is reached.
 * Starts the intro animation once at the target position.
 */
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

/**
 * Stops the walking animation and resets walking state.
 */
    stopWalkingAnimation() {
        this.walking = false;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
    }

/**
 * Starts the attack sequence by playing sound, resetting animation state,
 * and loading attack images before starting the attack animation.
 */
    startAttacking() {
        if (this.attackInterval) return;
        this.playAttackSound();
        this.resetAnimationState();
        this.loadImages(this.IMAGES_ATTACK, () => this.playAttackAnimation());
    }

/**
* Plays the boss attack sound using the world audio manager.
*/
    playAttackSound() {
        this.world.audio.play('bossAttack');
    }

/**
* Resets the animation state by clearing intervals and resetting image index.
*/
    resetAnimationState() {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
    }

/**
* Plays the attack animation frames in sequence.
* Returns to walking image after animation completes.
*/
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

/**
* Plays the hurt animation when the boss takes damage.
* Skips if the boss is already dead.
*/
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

/**
* Finalizes the hurt animation and resumes walking state.
*/
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
    * Handles damage intake and transitions the boss to the retreat phase.
    * Triggers death animation if energy is depleted.
    * 
    * @param {number} amount - The amount of damage to apply.
    * @param {StatusBar} [statusBar] - Optional custom status bar to update.
    */
    hit(amount = 30, statusBar) {
        if (this.isDead) return;
        this.energy = Math.max(0, this.energy - amount);
        this.statusBarManager?.updateBossHealth(this.energy);
        this.lastHitTime = Date.now();
        this.isHurt = true;
        this.isStunned = true;
        this.phase = 'retreat';
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

/**
    * Reduces the boss's energy without triggering animations.
    * 
    * @param {number} amount - The amount of energy to reduce.
    */
    reduceEnergy(amount) {
        this.energy = Math.max(0, this.energy - amount);
        this.statusBarManager?.updateBossHealth(this.energy);
    }

/**
* Moves the boss in the direction of the target.
* 
* @param {number} dist - Distance between boss and target (positive or negative).
*/
    moveTowardsTarget(dist) {
        if (dist > 0) {
            this.x += this.speed;
            this.otherDirection = true;
        } else {
            this.x -= this.speed;
            this.otherDirection = false;
        }

    }

/**
* Triggers the death animation, fall behavior, and ends the game.
*/
    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.stopCurrentAnimation();
        this.world.statusBarManager.updateBossHealth(0);
        this.velocityY = 0;
        this.gravity = 0.8;
        this.playDeathAnimation(() => {
            this.world.gameManager.handleGameEnd(true);
        });
    }

/**
* Stops the current animation interval and resets animation state.
*/
    stopCurrentAnimation() {
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.walking = false;
        this.currentImage = 0;
    }

/**
* Prepares the boss for falling after death.
* Adjusts gravity, vertical and horizontal velocity.
*/
    prepareDeathFall() {
        this.velocityY = -2;
        this.gravity = 0.2;
        this.vxAfterDeath = 1.5;
        this.fallAfterDeath = true;
    }

/**
* Plays the death animation frame by frame, then triggers the falling motion.
* Executes optional callback after the boss has fallen off-screen.
* 
* @param {Function} [onComplete] - Callback function executed after falling is complete.
*/
    playDeathAnimation(onComplete) {
        let frame = 0;
        const animationInterval = setInterval(() => {
            if (frame < this.IMAGES_DIE.length) {
                this.setImage(this.IMAGES_DIE[frame]);
                frame++;
            } else {
                clearInterval(animationInterval);
                this.fallAfterDeath = true;
                const fallInterval = setInterval(() => {
                    this.y += this.velocityY;
                    this.velocityY += this.gravity;
                    if (this.y > 600) {
                        clearInterval(fallInterval);
                        onComplete?.();
                    }
                }, 50);
            }
        }, 400);
    }
}