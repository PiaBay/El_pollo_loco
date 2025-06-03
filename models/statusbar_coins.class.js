class CoinStatusBar extends MovableObject {
    images = [
        './assets/img_pollo_locco/img/8_coin/coin_2.png'
    ];

    collected = 0;
    total = 10; // kannst du bei Bedarf anpassen

    constructor() {
        super();
        this.x = 20;
        this.y = 60;
        this.width = 200;
        this.height = 60;
        this.loadImages(this.images);
        this.setPercentage(0);
    }

    /**
     * Updates the coin bar depending on the percentage of collected coins.
     * @param {number} collectedCoins 
     * @param {number} totalCoins 
     */
    setCoins(collectedCoins, totalCoins = this.total) {
        this.collected = collectedCoins;
        this.total = totalCoins;
        const percentage = Math.min(100, (collectedCoins / totalCoins) * 100);
        this.setPercentage(percentage);
    }

    /**
     * Updates the visual based on percentage.
     * @param {number} percentage 
     */
    setPercentage(percentage) {
        const index = Math.round(percentage / 20);
        this.img = this.imageCache[this.images[index]];
    }
}
