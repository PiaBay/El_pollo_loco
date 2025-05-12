class MovableObject {
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    img;

    /**
     * Lädt ein Bild.
     * @param {string} path 
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
}
