class Bottle extends MovableObject {
    IMAGES = [
        './assets/img_pollo_locco/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        './assets/img_pollo_locco/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 80;

        this.loadImages(this.IMAGES);
        this.setImage(this.IMAGES[0]);
        this.startAnimation(this.IMAGES, 200);
    }

    isCollectedBy(character) {
        const offset = 6; // optional – macht es etwas großzügiger

        return (
            this.x + this.width > character.x + offset &&
            this.x < character.x + character.width - offset &&
            this.y + this.height > character.y + offset &&
            this.y < character.y + character.height - offset
        );
    }
}
