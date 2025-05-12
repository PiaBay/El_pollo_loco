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

    /**
     * Bewegt das Objekt kontinuierlich nach links.
     * Sobald es ganz links draußen ist, wird es rechts neu positioniert (Endlosschleife).
     */
    moveLeft() {
        this.x -= this.speed;
        if (this.x + this.width <= 0) {
            this.x = 720; // Startet wieder rechts (Canvas-Breite anpassen!)
        }
    }
}
