class World {
    canvas;
    ctx;
    character;
    chickens = [];
    clouds = [];
    backgroundObjects = [];

    constructor(canvas,ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        // Hintergrundobjekte erzeugen (empfohlene Schleifenlösung)
        const layers = [
            { path: './assets/img_pollo_locco/img/5_background/layers/air.png', },
            { path: './assets/img_pollo_locco/img/5_background/layers/3_third_layer/1.png',},
            { path: './assets/img_pollo_locco/img/5_background/layers/2_second_layer/1.png',},
            { path: './assets/img_pollo_locco/img/5_background/layers/1_first_layer/1.png',}
        ];

        layers.forEach(layer => {
            this.backgroundObjects.push(new BackgroundObject(layer.path, 0, layer.speed));
            this.backgroundObjects.push(new BackgroundObject(layer.path, 720, layer.speed));
        });
        this.character = new Character();

        for (let i = 0; i < 5; i++) {
            this.chickens.push(new Chicken());
        }

        this.clouds.push(new Cloud(250, 50));
        this.clouds.push(new Cloud(650, 70));

        this.setupKeyboard();
        this.draw();
    }

    /**
     * Hauptzeichenfunktion, alles zentral hier.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //this.backgroundObjects.forEach(bg => bg.moveLeft());
        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.chickens);
        this.addToMap(this.character);

        this.clouds.forEach(cloud => cloud.moveLeft());
        this.addObjectsToMap(this.clouds);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    /**
     * Fügt ein Array von Objekten zur Map hinzu.
     * @param {Array} objects 
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Fügt ein einzelnes Objekt zur Map hinzu.
     * @param {MovableObject} mo 
     */
    addToMap(mo) {
        if (mo.img && mo.img.complete && mo.img.naturalWidth > 0) {
            this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
        }
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.character.moveRight();
            }
        });
    }
}
