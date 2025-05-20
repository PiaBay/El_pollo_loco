class Endboss extends MovableObject {
    walking = false;

    IMAGES_WALKING = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];
    
    
    constructor(x) {
        super();
        this.loadImages(this.IMAGES_WALKING, () => {
            this.setImage(this.IMAGES_WALKING[0]);
        });        
        this.x = x;
        this.y = 180;
        this.width = 250;
        this.height = 300;
        this.speed = 0.3;
    }

    startWalkingAnimation() {
        if (this.walking) return;
        this.walking = true;
        this.animationInterval = setInterval(() => {
            const i = this.currentImage % this.IMAGES_WALKING.length;
            this.setImage(this.IMAGES_WALKING[i]);
            this.currentImage++;
        }, 150); // Geschwindigkeit in ms
    }
    moveLeft() {
        this.x -= this.speed;
        // optional: Animation oder Angriff auslösen
    }
}
