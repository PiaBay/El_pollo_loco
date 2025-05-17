class World {
    canvas;
    ctx;
    character;
    chickens = [];
    clouds = [];
    backgroundObjects = [];
    keys = {};

    constructor(canvas,ctx,character) {
        this.canvas = canvas;
        this.ctx = ctx;
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
        
        this.character = character;
        let startX = 800;

        for (let i = 0; i < 5; i++) {
            const chicken = new Chicken(startX, (c) => {
                this.chickens.push(c);
            });
            const offset = 200 + Math.random() * 300;
            startX += offset;
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

        // Bewegung & Animation
        if (keyboard.RIGHT) {
            this.character.moveRight();
            this.character.startWalkingAnimation();
        } else if (keyboard.LEFT) {
            this.character.moveLeft();
            this.character.startWalkingAnimation();
        } else if (this.character.walking) {
            this.character.stopWalkingAnimation();
        }

        // Hintergrund
        this.addObjectsToMap(this.backgroundObjects);

        // Gegner
        this.chickens.forEach(chicken => chicken.moveLeft());
        this.addObjectsToMap(this.chickens);

        // Hauptfigur (mit Spiegelung, handled in addToMap)
        this.addToMap(this.character);

        // Wolken
        this.clouds.forEach(cloud => cloud.moveLeft());
        this.addObjectsToMap(this.clouds);

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Fügt ein Array von Objekten zur Map hinzu.
     * @param {Array} objects 
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Fügt ein einzelnes Objekt zur Map hinzu, inklusive Spiegelung bei Bedarf.
     * @param {MovableObject} mo 
     */
    addToMap(mo) {
        if (mo.img && mo.img.complete && mo.img.naturalWidth > 0) {
            if (mo.otherDirection) {
                this.ctx.save();
                this.ctx.translate(mo.x + mo.width, 0);  // Position beachten
                this.ctx.scale(-1, 1);                   // Spiegelung aktivieren
                this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
            }
        }
    }

    /**
     * Initialisiert Tastatursteuerung für die Richtung.
     */
    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowRight':
                    keyboard.RIGHT = true;
                    break;
                case 'ArrowLeft':
                    keyboard.LEFT = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.key) {
                case 'ArrowRight':
                    keyboard.RIGHT = false;
                    break;
                case 'ArrowLeft':
                    keyboard.LEFT = false;
                    break;
            }
        });
    }
}
