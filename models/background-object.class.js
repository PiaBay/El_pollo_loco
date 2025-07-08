/**
 * Represents a background layer object that scrolls horizontally.
 * Inherits from MovableObject.
 */
class BackgroundObject extends MovableObject {
/**
 * Creates a background object that moves automatically to the left.
 * 
 * @param {string} imagePath - Path to the background image.
 * @param {number} x - Horizontal start position of the background.
 * @param {number} [speed=0.5] - Movement speed (optional, default is 0.5).
 */
    constructor(imagePath, x, speed = 0.5) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}
