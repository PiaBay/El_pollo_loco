class coinStatusBar extends MovableObject {

    IMAGES = [
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        './assets/img_pollo_locco/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    constructor() {
        super();
        this.x = 20;
        this.y = 50;
        this.width = 200;
        this.height = 60;
        this.loadImages(this.IMAGES);
        this.setPercentage(0); // Start bei 0%
    }

    setCoins(collected, total = 10) {
        this.collected = collected;
        this.total = total;

        const percentage = Math.min(100, (collected / total) * 100);
        this.setPercentage(percentage);
    }

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

