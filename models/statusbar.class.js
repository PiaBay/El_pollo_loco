/**
 * A simple status bar that displays the character's energy.
 * Drawn as a filled rectangle at a fixed position.
 */
class StatusBar extends MovableObject {


    IMAGES = [
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png'
    ];
    /**
     * @param {number} maxEnergy - The maximum energy level.
     */
    constructor(maxEnergy = 100) {
        super();
        this.maxEnergy = maxEnergy;
        this.currentEnergy = maxEnergy;

        // Position and dimensions
        this.x = 20;
        this.y = 2;
        this.width = 200;
        this.height = 60;
        this.loadImages(this.IMAGES);
        this.setEnergy(100);

    }

    /**
     * Updates the current energy value.
     * @param {number} newEnergy
     */
    setEnergy(newEnergy) {
        this.currentEnergy = Math.max(0, Math.min(this.maxEnergy, newEnergy));

        const percentage = (this.currentEnergy / this.maxEnergy) * 100;
        let index = Math.round((100 - percentage) / 20); // 0 = 100%, 5 = 0%
        if (index >= this.IMAGES.length) index = this.IMAGES.length - 1;

        const path = this.IMAGES[index];
        this.img = this.imageCache[path];
    }


    /**
     * Draws the energy bar onto the given context.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
