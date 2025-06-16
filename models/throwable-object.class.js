class ThrowableObject extends MovableObject {
    IMAGES = [
        './assets/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        './assets/img_pollo_locco/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',

    ];
    
    
    constructor(x, y, directionLeft = false) {
        super();
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 80;
        this.speed = 10;
        this.otherDirection = directionLeft;
        this.loadImages(this.IMAGES);
        this.setImage(this.IMAGES[0]);
        this.startAnimation(this.IMAGES, 200);

    }

    move() {
        this.x += this.otherDirection ? -this.speed : this.speed;
    }
}
