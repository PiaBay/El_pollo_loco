class Character extends MovableObject {
    /**
     * Whether the character is currently facing the other direction (left).
     * Used to control mirroring when drawing.
     * @type {boolean}
     */
    otherDirection = false;


    gravity = 0.1;        // Gravitation
    velocityY = 0;        // Vertikale Geschwindigkeit
    groundY = 180;        // Zielhöhe (der „Boden“)
    isInAir = false;
    jumpAnimationRunning = false;
    /**
     * Array of walking image paths for the walking animation.
     * @type {string[]}
     */
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

    /**
     * Indicates whether the walking animation is currently active.
     * @type {boolean}
     */
    walking = false;


    /** @type {number} */
    animationSpeed = 80;


    /**
     * Creates a new character, loads images and sets initial position and size.
     */
    constructor() {
        super();
        this.x = 100;
        this.y = 0;
        this.width = 120;
        this.height = 240;
        this.loadImage(this.IMAGE_FALLING);

        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_WALKING, () => {
            this.setImage(this.IMAGES_WALKING[0]);
        });
    }

    jump() {
        this.velocityY = -5;
        this.isInAir = true;
        this.jumpAnimationRunning = false;

        this.animationInterval = setInterval(() => {
            const i = this.currentImage % this.IMAGES_JUMPING.length;
            this.setImage(this.IMAGES_JUMPING[i]);
            this.currentImage++;

            // Stop automatically after full cycle (optional)
            if (this.currentImage >= this.IMAGES_JUMPING.length) {
                clearInterval(this.animationInterval);
                this.jumpAnimationRunning = false;
                this.currentImage = 0;
            }
        }, 150); 
    }

    applyGravity() {
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
                this.setImage(this.IMAGES_WALKING[0]);
            }
        } else {
            if (!this.isInAir) {
                this.isInAir = true;
                this.setImage(this.IMAGE_FALLING);
            }
        }
    }




    startJumpAnimation() {
        if (this.jumpAnimationRunning) return;
        this.jumpAnimationRunning = true;

        this.animationInterval = setInterval(() => {
            const i = this.currentImage % this.IMAGES_JUMPING.length;
            this.setImage(this.IMAGES_JUMPING[i]);
            this.currentImage++;

            if (this.currentImage >= this.IMAGES_JUMPING.length) {
                clearInterval(this.animationInterval);
                this.jumpAnimationRunning = false;
                this.currentImage = 0;
            }
        }, 150);
    }



    /**
     * Moves the character to the right based on fixed step size.
     * Prevents moving outside the canvas.
     */
    moveRight() {
        const maxRight = 2500 - this.width;
        if (this.x < maxRight) {
            this.x += this.speed;
        }
        this.otherDirection = false;
    }

    /**
     * Moves the character left using fixed step size and enables mirroring.
     */
    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
        }
        this.otherDirection = true;
    }

    /**
     * Starts the walking animation if not already running.
     */
    startWalkingAnimation() {
        if (this.walking && this.animationInterval) return;

        this.walking = true;
        clearInterval(this.animationInterval); // ← damit es sicher neu startet
        this.startAnimation(this.IMAGES_WALKING, this.animationSpeed);
    }

    /**
     * Stops the walking animation and resets to first frame.
     */
    stopWalkingAnimation() {
        if (!this.walking) return;
        this.walking = false;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
        this.setImage(this.IMAGES_WALKING[0]);
    }
}
