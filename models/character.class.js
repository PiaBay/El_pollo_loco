class Character extends MovableObject {
/** Whether the character is currently facing left (for mirroring). */
    otherDirection = false;

/** Gravity-related properties */
    gravity = 0.1;
    velocityY = 0;
    groundY = 180;
    isInAir = false;

/** State tracking */
    walking = false;
    jumpAnimationRunning = false;
    isHurt = false;
    isDead = false;
    lastMovementTime = Date.now();     
    isInLongIdle = false;  
    longIdlePermanentlyDisabled = false;

/** Health and speed */
    energy = 100;
    animationSpeed = 80;

/** Prevents movement while animation is playing */
    isStunned = false;

/** Animation frames */
    IMAGES_IDLE = [
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-1.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-2.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-3.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-4.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-5.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-6.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-7.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-8.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-9.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_LONG_IDLE = [
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-11.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-12.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-13.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-14.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-15.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-16.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-17.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-18.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-19.png',
        './assets/img_pollo_locco/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_WALKING = [
        './assets/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png',
        './assets/img_pollo_locco/img/2_character_pepe/2_walk/W-22.png',
        './assets/img_pollo_locco/img/2_character_pepe/2_walk/W-23.png',
        './assets/img_pollo_locco/img/2_character_pepe/2_walk/W-24.png',
        './assets/img_pollo_locco/img/2_character_pepe/2_walk/W-25.png',
        './assets/img_pollo_locco/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-31.png',
        './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-32.png',
        './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-33.png',
        './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-34.png',
        './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png',
        './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-36.png',
        './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-37.png',
        './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-38.png',
        './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGE_FALLING = './assets/img_pollo_locco/img/2_character_pepe/3_jump/J-35.png';

    IMAGES_DEAD = [
        './assets/img_pollo_locco/img/2_character_pepe/5_dead/D-51.png',
        './assets/img_pollo_locco/img/2_character_pepe/5_dead/D-52.png',
        './assets/img_pollo_locco/img/2_character_pepe/5_dead/D-53.png',
        './assets/img_pollo_locco/img/2_character_pepe/5_dead/D-54.png',
        './assets/img_pollo_locco/img/2_character_pepe/5_dead/D-55.png',
        './assets/img_pollo_locco/img/2_character_pepe/5_dead/D-56.png'
    ];

    IMAGES_HURT = [
        './assets/img_pollo_locco/img/2_character_pepe/4_hurt/H-41.png',
        './assets/img_pollo_locco/img/2_character_pepe/4_hurt/H-42.png',
        './assets/img_pollo_locco/img/2_character_pepe/4_hurt/H-43.png'
    ];

/**
 * Creates and initializes the character with default position, size, and animations.
 * Loads all necessary image sets for different states.
 */
    constructor() {
        super();
        this.x = 100;
        this.y = 0;
        this.width = 120;
        this.height = 240;
        this.lastHitTime = 0;
        this.hurtCooldown = 1000;

        this.loadImages(this.IMAGES_IDLE, () => this.setImage(this.IMAGES_IDLE[0]));
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImage(this.IMAGE_FALLING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

/**
 * Checks if the character is allowed to take damage based on the cooldown.
 * 
 * @returns {boolean} True if the character can take damage, false otherwise.
 */
    canTakeDamage() {
        return Date.now() - this.lastHitTime > this.hurtCooldown;
    }

/**
 * Makes the character jump by setting upward velocity and starting the jump animation.
 * Jumping is disabled when the character is dead.
 */
    jump() {
        if (this.isDead) return;

        this.interruptIdleAndMarkActive();
        this.velocityY = -5;
        this.isInAir = true;
        this.jumpAnimationRunning = false;
        this.startAnimation(this.IMAGES_JUMPING, 150);
    }

/**
 * Moves the character to the right if not stunned or dead.
 * Ensures the character stays within level bounds and triggers walking animation.
 */
    moveRight() {
        if (this.isDead || this.isInAir || this.isJumping) return;

        this.interruptIdleAndMarkActive();

        const maxRight = 3500 - this.width;
        if (this.x < maxRight) {
            this.x += this.speed;
            this.otherDirection = false;
            this.startWalkingAnimation();
        }
    }

/**
 * Moves the character to the left if not stunned or dead.
 * Ensures the character does not move past the level's left boundary and triggers walking animation.
 */
    moveLeft() {
        if (this.isDead || this.isInAir || this.isJumping) return;
        this.interruptIdleAndMarkActive();
        if (this.x > 0) this.x -= this.speed;
        this.otherDirection = true;
        this.startWalkingAnimation();
    }

/**
 * Starts the walking animation if not already playing and if the character is alive.
 */
    startWalkingAnimation() {
        if (this.isDead) return;
        if (this.animationInterval) return;

        this.walking = true;
        this.currentImage = 0;
        this.startAnimation(this.IMAGES_WALKING, this.animationSpeed);
    }


/**
 * Stops the walking animation and resets the character to idle state.
 */
    stopWalkingAnimation() {
        if (!this.walking) return;
        this.walking = false;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
        this.setImage(this.IMAGES_IDLE[0]);
    }

/**
 * Applies damage to the character.
 * Triggers hurt animation and sets stunned state to temporarily disable actions.
 * 
 * @param {number} amount - The amount of damage to apply.
 */
    takeDamage(amount) {
        if (this.isDead || this.isStunned || !this.canTakeDamage()) return;
        this.energy = Math.max(0, this.energy - amount);
        this.lastHitTime = Date.now();
        this.isHurt = true;
        this.isStunned = true;
        this.world.audio.play('hurt');
        if (this.energy <= 0) {
            this.die();
        } else {
            this.playHurtAnimation();
            setTimeout(() => {
                this.isHurt = false;
                this.isStunned = false;
            }, 600);
        }
    }

    /**
 * Plays the idle animation if character is standing still.
 * Prevents restarting if already running.
 */
    playIdleAnimation() {
        if (this.isDead || this.walking || this.isHurt || this.isInAir || this.isInLongIdle) return;

        // Wenn keine andere Animation läuft
        if (!this.animationInterval) {
            this.currentImage = 0;
            this.startAnimation(this.IMAGES_IDLE, 200);
        }
    }



/**
 * Checks if the character has been idle long enough to trigger the long idle animation.
 * Only runs when not walking, jumping, hurt, dead, or already in long idle.
 */
    checkLongIdleAnimation() {
        if (this.longIdlePermanentlyDisabled) return;

        const now = Date.now();
        const idleDuration = now - this.lastMovementTime;

        if (
            !this.walking &&
            !this.isDead &&
            !this.isHurt &&
            !this.isInAir &&
            !this.isInLongIdle
        ) {
            if (idleDuration > 1000 && idleDuration < 15000) {
                this.playIdleAnimation();
            }
            if (idleDuration >= 15000) {
                this.playLongIdleAnimation();
            }
        }
    }


/**
 * Plays the long idle animation after a delay of inactivity.
 * Animation ends automatically, and the character returns to idle pose.
 */
    playLongIdleAnimation() {
        this.isInLongIdle = true;
        this.currentImage = 0;
        clearInterval(this.animationInterval);
        this.world.audio.play('longIdle');
        const images = this.IMAGES_LONG_IDLE;
        let frame = 0;
        this.animationInterval = setInterval(() => {
            if (frame < images.length) {
                this.setImage(images[frame]);
                frame++;
            } else {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                this.currentImage = 0;
                this.isInLongIdle = false;
                this.setImage(this.IMAGES_IDLE[0]);
            }
        }, 150);
    }

/**
 * Plays the hurt animation and resets character state after completion.
 * Character is temporarily stunned and cannot move.
 */
    playHurtAnimation() {
        if (this.isDead) return;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
        const hurtImages = this.IMAGES_HURT;
        let frame = 0;
        this.animationInterval = setInterval(() => {
            if (frame < hurtImages.length) {
                this.setImage(hurtImages[frame]);
                frame++;
            } else {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                this.currentImage = 0;
                this.isHurt = false;
                this.isStunned = false;
                this.setImage(this.IMAGES_WALKING[0]);
            }
        }, 150);
    }

/**
 * Throws a bottle in the direction the character is facing.
 * Reduces the available bottle count and updates the status bar.
 * Does nothing if no bottles are available or boss is temporarily invulnerable.
 * 
 * @param {World} world - The current game world instance.
 */

    throwBottle(world) {
        if (this.isDead || this.isStunned || this.isHurt) return;
        if (world.gameManager.availableBottles <= 0) return;
        const boss = world.endbossController?.endboss;
        if (world.gameManager.bossActivated && boss?.isHurt) return;

        this.interruptIdleAndMarkActive();

        const offsetX = 30;
        const handHeight = this.y + this.height * 0.4; // 👉 ca. Handhöhe (40 % der Körperhöhe)
        const bottle = new ThrowableObject(this.x + offsetX, handHeight, this.otherDirection);

        world.gameManager.throwables.push(bottle);
        world.gameManager.availableBottles--;
        world.statusBarManager.updateBottles(
            world.gameManager.availableBottles,
            world.gameManager.maxBottleCapacity
        );

        if (world.audio) {
            world.audio.play('throw');
        }
    }

/**
 * Triggers the death animation and sets the character into a flying death state.
 * Once the animation is complete, vertical motion and horizontal slide begin.
 */
    die() {
        if (this.isDead) return;
        this.isDead = true;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.walking = false;
        this.jumpAnimationRunning = false;
        this.currentImage = 0;
        let frame = 0;
        const interval = setInterval(() => {
            if (frame < this.IMAGES_DEAD.length) {
                this.setImage(this.IMAGES_DEAD[frame]);
                frame++;
            } else {
                clearInterval(interval);
                this.velocityY = -5;
                this.vxAfterDeath = 3;
                this.fallAfterDeath = true;
            }
        }, 300);
    }

/**
 * Interrupts idle or long idle animations (but not walking or jumping).
 * Optionally resets the character image to the idle pose.
 * 
 * @param {boolean} [setIdleImage=true] - Whether to set the default idle image.
 */
    interruptIdleAndMarkActive(setIdleImage = true) {
        this.lastMovementTime = Date.now();
        this.isInLongIdle = false;
        if (this.isInLongIdle || (!this.walking && !this.jumpAnimationRunning)) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            this.walking = false;
            this.jumpAnimationRunning = false;
            this.currentImage = 0;
            if (setIdleImage) {
                this.setImage(this.IMAGES_IDLE[0]);
            }
        }
    }
}