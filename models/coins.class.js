class Coin extends MovableObject {
    IMAGES_ROTATING = [
        './assets/img_pollo_locco/img/8_coin/coin_1.png',
        './assets/img_pollo_locco/img/8_coin/coin_2.png'
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;

        this.loadImages(this.IMAGES_ROTATING);
        this.setImage(this.IMAGES_ROTATING[0]);
        this.startAnimation(this.IMAGES_ROTATING, 100); // 100ms pro Frame
    }
    isCollectedBy(character) {
        const offset = 30;


        return character.x + character.width - offset > this.x + offset &&
            character.x + offset < this.x + this.width - offset &&
            character.y + character.height - offset > this.y + offset &&
            character.y + offset < this.y + this.height - offset;
    }


}
