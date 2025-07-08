/**
 * Represents a throwable salsa bottle object.
 * Handles image loading, animation, direction, and movement logic.
 * Inherits from MovableObject.
 */
class ThrowableObject extends MovableObject {
/**
 * Array of image paths used for bottle rotation animation.
 * @type {string[]}
 */
    IMAGES = [
        './assets/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
    ];

/**
 * Creates a new throwable salsa bottle.
 * 
 * @param {number} x - The starting X position of the bottle.
 * @param {number} y - The starting Y position of the bottle.
 * @param {boolean} [directionLeft=false] - Whether the bottle is thrown to the left.
 */
    constructor(x, y, directionLeft = false) {
        super();
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 80;
        this.speed = 10;
        this.otherDirection = directionLeft;

        this.loadImages(this.IMAGES);
        this.setImage(this.IMAGES[0]);
        this.startAnimation(this.IMAGES, 200); // 200ms per frame
    }

/**
 * Moves the bottle horizontally based on direction.
 */
    move() {
        this.x += this.otherDirection ? -this.speed : this.speed;
    }
}
