class Character extends MovableObject {
    /**
     * Whether the character is currently facing the other direction (left).
     * Used to control mirroring when drawing.
     * @type {boolean}
     */
    otherDirection = false;

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

    /**
     * Indicates whether the walking animation is currently active.
     * @type {boolean}
     */
    walking = false;

    /**
     * Creates a new character, loads images and sets initial position and size.
     */
    constructor() {
        super();
        this.x = 100;
        this.y = 180;
        this.width = 120;
        this.height = 240;

        this.loadImages(this.IMAGES_WALKING, () => {
            this.setImage(this.IMAGES_WALKING[0]);
        });
    }

    /**
     * Moves the character to the right based on fixed step size.
     * Prevents moving outside the canvas.
     */
    moveRight() {
        const maxRight = 720 - this.width;
        if (this.x < maxRight) {
            this.x += 5;
        }
        this.otherDirection = false;
    }

    /**
     * Moves the character left using fixed step size and enables mirroring.
     */
    moveLeft() {
        if (this.x > 0) {
            this.x -= 5;
        }
        this.otherDirection = true;
    }

    /**
     * Starts the walking animation if not already running.
     */
    startWalkingAnimation() {
        if (this.walking) return;
        this.walking = true;
        this.startAnimation(this.IMAGES_WALKING, 120);
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
