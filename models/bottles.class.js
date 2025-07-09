/**
 * Represents a collectible salsa bottle object in the game.
 * Inherits from MovableObject and plays an idle animation on the ground.
 */
class Bottle extends MovableObject {
/**
 * The array of image paths used for the bottle's idle animation.
 * @type {string[]}
 */
    IMAGES = [
        './assets/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './assets/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

/**
 * Creates a new Bottle instance at a specific position.
 * 
 * @param {number} x - The horizontal position of the bottle.
 * @param {number} y - The vertical position of the bottle.
 */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;

        this.loadImages(this.IMAGES);
        this.setImage(this.IMAGES[0]);
        this.startAnimation(this.IMAGES, 200);
    }

/**
 * Determines whether the bottle is collected by a given character.
 * Uses a slightly reduced hitbox margin for more forgiving collisions.
 * 
 * @param {Character} character - The character to check for collision.
 * @returns {boolean} True if the bottle is within the character's bounds, false otherwise.
 */
    isCollectedBy(character) {
        const offsetX = 5;

        return (
            this.x + this.width > character.x + offsetX &&
            this.x < character.x + character.width - offsetX &&
            this.y + this.height > character.y + character.height * 0.4 &&
            this.y < character.y + character.height * 0.9
        );
    }
}
