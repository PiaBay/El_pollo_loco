/**
 * Represents a rotating coin collectible in the game.
 * Inherits from MovableObject and animates between two frames.
 */
class Coin extends MovableObject {
/**
 * Image paths used for the rotating coin animation.
 * @type {string[]}
 */
    IMAGES_ROTATING = [
        './assets/img_pollo_locco/img/8_coin/coin_1.png',
        './assets/img_pollo_locco/img/8_coin/coin_2.png'
    ];

/**
 * Creates a new Coin instance at a specific position.
 * Starts the rotating animation immediately.
 * 
 * @param {number} x - The horizontal position of the coin.
 * @param {number} y - The vertical position of the coin.
 */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.loadImages(this.IMAGES_ROTATING);
        this.setImage(this.IMAGES_ROTATING[0]);
        this.startAnimation(this.IMAGES_ROTATING, 100); // 100ms per frame
    }

/**
 * Checks if the coin has been collected by the character.
 * Uses a bounding box check with offset to make collection slightly easier.
 * 
 * @param {Character} character - The character to check collision with.
 * @returns {boolean} True if the coin is within the character's bounds.
 */
    isCollectedBy(character) {
        const offset = 30;
        return character.x + character.width - offset > this.x + offset &&
            character.x + offset < this.x + this.width - offset &&
            character.y + character.height - offset > this.y + offset &&
            character.y + offset < this.y + this.height - offset;
    }
}
