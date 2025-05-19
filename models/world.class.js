class World {
    /** @type {HTMLCanvasElement} */
    canvas;

    /** @type {CanvasRenderingContext2D} */
    ctx;

    /** @type {Character} */
    character;

    /** @type {MovableObject[]} */
    chickens = [];

    /** @type {MovableObject[]} */
    clouds = [];

    /** @type {MovableObject[]} */
    backgroundObjects = [];

    /** @type {Object} */
    keys = {};

    /** @type {number} */
    camera_x = 0;

    /**
     * Initializes the world and loads the level content.
     * @param {HTMLCanvasElement} canvas - The canvas element.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
     * @param {Character} character - The main character instance.
     */
    constructor(canvas, ctx, character) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.character = character;

        // Level content from level1.js
        this.backgroundObjects = level1.backgroundObjects;
        this.chickens = level1.enemies;
        this.clouds = level1.clouds;

        this.setupKeyboard();
        this.draw();
    }

    /**
     * Main drawing function, handles movement, rendering, and camera.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(-this.camera_x, 0);

        // Background
        this.addObjectsToMap(this.backgroundObjects);

        // Enemies
        this.chickens.forEach(chicken => chicken.moveLeft());
        this.addObjectsToMap(this.chickens);

        // Movement and camera logic
        if (keyboard.RIGHT) {
            this.character.moveRight();
            this.character.startWalkingAnimation();
            this.camera_x = this.character.x - 100;
        } else if (keyboard.LEFT) {
            this.character.moveLeft();
            this.character.startWalkingAnimation();
            this.camera_x = this.character.x - 100;
        } else if (this.character.walking) {
            this.character.stopWalkingAnimation();
        }

        if (this.camera_x < 0) this.camera_x = 0;

        // Character
        this.addToMap(this.character);

        // Clouds
        this.clouds.forEach(cloud => cloud.moveLeft());
        this.addObjectsToMap(this.clouds);

        this.ctx.restore();

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Adds multiple objects to the map.
     * @param {MovableObject[]} objects - Array of objects to add.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Adds a single object to the map, includes horizontal flipping if needed.
     * @param {MovableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.img && mo.img.complete && mo.img.naturalWidth > 0) {
            if (mo.otherDirection) {
                this.ctx.save();
                this.ctx.translate(mo.x + mo.width, 0);
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
            }
        }
    }

    /**
     * Initializes keyboard event listeners for directional input.
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
