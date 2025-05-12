class Cloud extends MovableObject {
    constructor(x, y) {
        super();
        this.loadImage('./assets/img_pollo_locco/img/5_background/layers/4_clouds/1.png');
        this.x = x;
        this.y = y;
        this.width = 350;
        this.height = 180;
    }
}
