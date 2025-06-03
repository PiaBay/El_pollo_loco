class Coin extends MovableObject {
    IMAGES_ROTATING = [
        './assets/img_pollo_locco/img/8_coin/coin_1.png',
        './assets/img_pollo_locco/img/8_coin/coin_2.png'
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;

        this.loadImages(this.IMAGES_ROTATING);
        this.setImage(this.IMAGES_ROTATING[0]);
        this.startAnimation(this.IMAGES_ROTATING, 100); // 100ms pro Frame
    }
}
