class BottleStatusBar extends MovableObject {
    IMAGES = [
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

    constructor() {
        super();
        this.x = 20;
        this.y = 100;
        this.width = 200;
        this.height = 60;
        this.loadImages(this.IMAGES);
        this.setPercentage(0); // Start bei 0%
    }

    /**
     * Sets bottle percentage based on collected vs total bottles
     * @param {number} collectedBottles - Amount of collected bottles
     * @param {number} totalBottles - Max amount of bottles in level
     */
    setBottles(collectedBottles, totalBottles = 10) {
        const percentage = Math.min(100, (collectedBottles / totalBottles) * 100);
        this.setPercentage(percentage);
        this.current = collectedBottles;
        this.total = totalBottles;
    }

    /**
     * Selects correct image based on fill percentage
     * @param {number} percentage - Value from 0 to 100
     */
    setPercentage(percentage) {
        let index = Math.round(percentage / 20);
        if (index >= this.IMAGES.length) index = this.IMAGES.length - 1;
        const path = this.IMAGES[index];
        this.img = this.imageCache[path];
    }
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth > 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
           }
        }
}
