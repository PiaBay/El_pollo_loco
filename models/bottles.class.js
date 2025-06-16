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
        const offset = 20; // ← kleiner machen = präzisere Kollision

        return character.x + character.width > this.x &&
            character.x < this.x + this.width &&
            character.y + character.height > this.y &&
            character.y < this.y + this.height;
    }
}
