class Character extends MovableObject {
    constructor() {
        super();
        this.loadImage('./assets/img_pollo_locco/img/2_character_pepe/2_walk/W-21.png');
        this.x = 100;
        this.y = 180;
        this.width = 120;
        this.height = 240;
    }

    moveRight() {
        this.x += 5;
    }
}
