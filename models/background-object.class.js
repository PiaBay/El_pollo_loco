class BackgroundObject extends MovableObject {
    /**
     * Erstellt ein Background-Objekt, das sich automatisch nach links bewegt.
     * @param {string} imagePath - Pfad zum Bild.
     * @param {number} x - Startposition X.
     * @param {number} speed - Bewegungsgeschwindigkeit (Standard 0.5).
     */
    constructor(imagePath, x, speed = 0.5) {
        super();
        this.loadImage(imagePath);
        this.x = x;
        this.y = 0;
        this.width = 720;  // Passe an deine Canvas-Breite an
        this.height = 480; // Passe an deine Canvas-Höhe an
    }

}
