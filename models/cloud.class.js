/**
 * Represents a decorative cloud object that slowly moves across the background.
 * Inherits from MovableObject.
 */
class Cloud extends MovableObject {
/**
 * Creates a new Cloud instance at a given position with predefined size and speed.
 * 
 * @param {number} x - The horizontal start position of the cloud.
 * @param {number} y - The vertical position of the cloud in the background.
 */
    constructor(x, y) {
        super();
        this.loadImage('./assets/img_pollo_locco/img/5_background/layers/4_clouds/1.png');
        this.x = x;
        this.y = y;
        this.width = 350;
        this.height = 180;
        this.speed = 0.3; // Slow scroll speed for parallax effect
    }
}