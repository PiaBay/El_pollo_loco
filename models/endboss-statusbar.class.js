/**
 * Represents the status bar that displays the endboss's remaining energy.
 * Inherits from MovableObject.
 */
class EndbossStatusBar extends MovableObject {
/**
 * Image paths for the endboss status bar at various energy levels.
 * @type {string[]}
 */
    IMAGES = [
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green100.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green80.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green60.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green40.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green20.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green0.png'
    ];

/**
 * Creates a new EndbossStatusBar instance with given max energy.
 * Initializes position, size, and loads energy images.
 * 
 * @param {number} [maxEnergy=100] - The maximum energy level of the endboss.
 */
    constructor(maxEnergy = 100) {
        super();
        this.maxEnergy = maxEnergy;
        this.currentEnergy = maxEnergy;
        this.x = 500;
        this.y = 17;
        this.width = 200;
        this.height = 60;

        this.loadImages(this.IMAGES, () => {
            this.setPercentage(100); // Set to full health after image load
        });
    }

/**
 * Updates the status bar based on the endboss's current energy level.
 * Selects the appropriate image based on percentage.
 * 
 * @param {number} newEnergy - The new energy value to set.
 */
    setPercentage(newEnergy) {
        this.currentEnergy = Math.max(0, Math.min(this.maxEnergy, newEnergy));
        const percentage = (this.currentEnergy / this.maxEnergy) * 100;
        let index = Math.round((100 - percentage) / 20);
        if (index >= this.IMAGES.length) index = this.IMAGES.length - 1;
        const path = this.IMAGES[index];
        this.setImage(path);
    }

/**
 * Draws the current energy bar image onto the canvas.
 * 
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 */
    draw(ctx) {
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
