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

    /** Timing for damage cooldown */
    lastHitTime = 0;
    hurtCooldown = 500; // in ms

    /** Health and speed */
    energy = 100;
    animationSpeed = 80;

    /** Animation frames */
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

    constructor() {
        super();
        this.x = 100;
        this.y = 0;
        this.width = 120;
        this.height = 240;
        this.lastHitTime = 0;
        this.hurtCooldown = 200; // z. B. 500 ms Schutzzeit

        this.loadImage(this.IMAGE_FALLING);
        this.loadImages(this.IMAGES_WALKING, () => this.setImage(this.IMAGES_WALKING[0]));
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    canTakeDamage() {
        return !this.isHurt && Date.now() - this.lastHitTime > this.hurtCooldown;
    }

    applyGravity() {
        if (this.fallAfterDeath) {
            this.y += this.velocityY;
            this.velocityY += this.gravity;
            this.x += this.vxAfterDeath || 0;
            return;
        }

        this.velocityY += this.gravity;
        this.y += this.velocityY;

        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;

            if (this.isInAir) {
                this.isInAir = false;
                this.jumpAnimationRunning = false;
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                if (!this.isDead) this.setImage(this.IMAGES_WALKING[0]);
            }
        } else {
            if (!this.isInAir) {
                this.isInAir = true;
                if (!this.isDead) this.setImage(this.IMAGE_FALLING);
            }
        }
    }

    jump() {
        if (this.isDead) return;
        this.velocityY = -5;
        this.isInAir = true;
        this.jumpAnimationRunning = false;
        this.startAnimation(this.IMAGES_JUMPING, 150);
    }

    moveRight() {
        if (this.isDead) return;
        const maxRight = 2500 - this.width;
        if (this.x < maxRight) this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft() {
        if (this.isDead) return;
        if (this.x > 0) this.x -= this.speed;
        this.otherDirection = true;
    }

    startWalkingAnimation() {
        if (this.isDead || (this.walking && this.animationInterval)) return;
        this.walking = true;
        clearInterval(this.animationInterval);
        this.startAnimation(this.IMAGES_WALKING, this.animationSpeed);
    }

    stopWalkingAnimation() {
        if (!this.walking) return;
        this.walking = false;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
        this.setImage(this.IMAGES_WALKING[0]);
    }

    takeDamage(amount) {
        if (this.isDead || !this.canTakeDamage()) return;
        this.energy = Math.max(0, this.energy - amount);
        this.lastHitTime = Date.now();
        this.isHurt = true;
        if (this.energy <= 0) {
            this.die();
        } else {
            this.playHurtAnimation();
        }
    }

    playHurtAnimation() {
        if (this.isDead) return;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;

        let frame = 0;
        this.animationInterval = setInterval(() => {
            if (frame < this.IMAGES_HURT.length) {
                this.setImage(this.IMAGES_HURT[frame]);
                frame++;
            } else {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                this.isHurt = false;
                this.setImage(this.IMAGES_WALKING[0]);
            }
        }, 150);
    }

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
}
