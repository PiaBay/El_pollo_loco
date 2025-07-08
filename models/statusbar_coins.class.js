/**
 * Represents the status bar for collected coins.
 * Displays a green bar that fills up as coins are collected.
 */
class CoinStatusBar extends MovableObject {

/**
 * Array of image paths representing the status bar fill levels.
 * @type {string[]}
 */
    IMAGES = [
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

/**
 * Creates a new coin status bar.
 */
    constructor() {
        super();
        this.x = 20;
        this.y = 50;
        this.width = 200;
        this.height = 60;

        this.loadImages(this.IMAGES);
        this.setPercentage(0); // Start with 0%
    }

/**
 * Sets the number of collected and total coins, and updates the bar display.
 * 
 * @param {number} collected - Number of collected coins.
 * @param {number} [total=10] - Total number of coins available.
 */
    setCoins(collected, total = 10) {
        this.collected = collected;
        this.total = total;

        const percentage = Math.min(100, (collected / total) * 100);
        this.setPercentage(percentage);
    }

/**
 * Updates the status bar image based on the given percentage.
 * 
 * @param {number} percentage - Current progress as percentage (0–100).
 */
    setPercentage(percentage) {
        let index = Math.round(percentage / 20);
        if (index >= this.IMAGES.length) index = this.IMAGES.length - 1;
        const path = this.IMAGES[index];
        this.img = this.imageCache[path];
    }

/**
 * Draws the status bar image on the canvas context.
 * 
 * @param {CanvasRenderingContext2D} ctx - The rendering context.
 */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
