class EndbossStatusBar extends MovableObject {
    IMAGES = [
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green100.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green80.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green60.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green40.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green20.png',
        './assets/img_pollo_locco/img/7_statusbars/2_statusbar_endboss/green/green0.png'
    ];

    /**
       * @param {number} maxEnergy - The maximum energy level.
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
            this.setPercentage(100); // ✅ garantiert nach Bild-Load
        });
    }

    setPercentage(newEnergy) {
        this.currentEnergy = Math.max(0, Math.min(this.maxEnergy, newEnergy));
        const percentage = (this.currentEnergy / this.maxEnergy) * 100;
        let index = Math.round((100 - percentage) / 20);
        if (index >= this.IMAGES.length) index = this.IMAGES.length - 1;
        const path = this.IMAGES[index];
        this.setImage(path); // ✅ wichtig
    }

    draw(ctx) {
        if (this.img && this.img.complete) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }
}
