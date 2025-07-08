/**
 * Represents the bottle status bar UI element.
 * Shows how many bottles have been collected in the current level.
 * Inherits from MovableObject.
 */
class BottleStatusBar extends MovableObject {
    /**
     * Array of image paths representing the different fill levels of the bottle status bar.
     * @type {string[]}
     */
    IMAGES = [
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

/**
 * Creates a new BottleStatusBar instance and initializes it at position (20, 100).
 * Starts with 0% fill level.
 */
    constructor() {
        super();
        this.x = 20;
        this.y = 100;
        this.width = 200;
        this.height = 60;
        this.loadImages(this.IMAGES);
        this.setPercentage(0); // Start at 0%
    }

/**
 * Updates the status bar based on the number of collected bottles.
 * 
 * @param {number} collectedBottles - Number of bottles collected by the player.
 * @param {number} [totalBottles=10] - Total number of bottles available in the level.
 */
    setBottles(collectedBottles, totalBottles = 10) {
        const percentage = Math.min(100, (collectedBottles / totalBottles) * 100);
        this.setPercentage(percentage);
        this.current = collectedBottles;
        this.total = totalBottles;
    }

/**
 * Sets the visual representation of the status bar based on percentage.
 * Chooses an image from the IMAGES array.
 * 
 * @param {number} percentage - The fill level percentage (0–100).
 */
    setPercentage(percentage) {
        let index = Math.floor(percentage / 20);
        if (index >= this.IMAGES.length) index = this.IMAGES.length - 1;
        const path = this.IMAGES[index];
        this.img = this.imageCache[path];
    }

/**
 * Draws the current status bar image to the canvas context.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
