/**
 * Represents a walking chicken enemy.
 * Inherits animation and positioning logic from MovableObject.
 */
class Chicken extends MovableObject {
/**
 * Array of image paths used for the chicken's walking animation.
 * @type {string[]}
 */
    IMAGES_WALKING = [
        './assets/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        './assets/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        './assets/img_pollo_locco/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

/**
 * Creates a new Chicken instance at a given X position.
 * Loads animation images and starts the walking animation with random speed.
 * 
 * @param {number} xPos - The horizontal position where the chicken starts.
 * @param {function(Chicken):void} [onReadyCallback] - Optional callback function that fires after images are loaded and animation starts.
 */
    constructor(xPos, onReadyCallback) {
        super();
        this.x = xPos;
        this.y = 330;
        this.width = 70;
        this.height = 90;
        this.speed = 1.2 + Math.random() * 0.8;

        this.loadImages(this.IMAGES_WALKING, () => {
            this.setImage(this.IMAGES_WALKING[0]);
            this.startAnimation(this.IMAGES_WALKING, 150);
            if (onReadyCallback) onReadyCallback(this);
        });
    }
}
