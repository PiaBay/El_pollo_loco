/**
 * Represents a basic movable object in the game.
 * Provides image handling, caching, and positional properties.
 */
class MovableObject {
    /**
     * The horizontal position of the object on the canvas.
     * @type {number}
     */
    x = 0;

    /**
     * The vertical position of the object on the canvas.
     * @type {number}
     */
    y = 0;

    /**
     * The width of the object.
     * @type {number}
     */
    width = 100;

    /**
     * The height of the object.
     * @type {number}
     */
    height = 100;

    /**
     * The currently displayed image of the object.
     * @type {HTMLImageElement | undefined}
     */
    img;

    /**
     * A cache for preloaded images, mapped by their file paths.
     * @type {Object<string, HTMLImageElement>}
     */
    imageCache = {};

    /**
     * Index for tracking the current image in animations.
     * @type {number}
     */
    currentImage = 0;


    /** @type {number} */
    speed = 5;


    /**
 * Reference to animation interval.
 * @type {number | null}
 */
    animationInterval = null;

/**
* Loads a single image and sets it as the current image.
* @param {string} path - The file path of the image to load.
*/
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

/**
* Preloads an array of image paths into the image cache.
* @param {string[]} paths - Array of image file paths to preload.
*/
    loadImages(paths, callback) {
        let loaded = 0;
        paths.forEach((path) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                loaded++;
                if (loaded === paths.length && typeof callback === 'function') {
                    callback();
                }
            };
            img.onerror = () => {
                console.error("❌ Fehler beim Laden:", path);
            };
            this.imageCache[path] = img;
        });
    }


/**
 * Sets the current image by index from the image cache.
 * @param {number} i - Index of the image in the animation sequence.
 */
setImageByIndex(i) {
    const path = this.IMAGES_WALKING[i];
    this.img = this.imageCache[path];
}


    /**
     * Sets the current image from the image cache if it's fully loaded.
     * @param {string} path - File path of the image.
     */
    setImage(path) {
        const cached = this.imageCache[path];
        if (!cached) {
            console.warn("❌ Bild nicht im Cache:", path);
            return;
        }

        if (cached.complete && cached.naturalWidth > 0) {
            this.img = cached;
        } else {
            cached.onload = () => {
                this.img = cached;
            };
        }
    }



/**
* Starts the walking animation if not already active.
*/
    startAnimation(imageList, interval = 120) {
        if (this.animationInterval) return;

        this.animationInterval = setInterval(() => {
            const i = this.currentImage % imageList.length;
            const imgPath = imageList[i];

            const cachedImg = this.imageCache[imgPath];
            if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
                this.img = cachedImg;
            } else {
                console.warn('⚠️ Bild nicht geladen:', imgPath);
            }

            this.currentImage++;
        }, interval);
    }



/**
 * Moves the object to the left based on its speed.
 * If the object leaves the visible canvas area on the left,
 * it re-enters from the right side (looping effect).
 */
    moveLeft() {
        this.x -= this.speed;
        if (this.x + this.width <= 0) {
            this.x = 720; // or use a canvas width constant
        }
    }


/**
 * Checks if this object is colliding with another.
 * @param {MovableObject} other - Another game object.
 * @returns {boolean} True if bounding boxes intersect.
 */
    isColliding(other) {
        const offset = 10;

        return this.x + this.width - offset > other.x + offset &&
            this.x + offset < other.x + other.width - offset &&
            this.y + this.height - offset > other.y + offset &&
            this.y + offset < other.y + other.height - offset;
    }
    applyGravity() {
        if (this.fallAfterDeath) {
            this.y += this.velocityY;
            this.velocityY += this.gravity;
            this.x += this.vxAfterDeath || 0;
            return;
        }

        this.velocityY += this.gravity;
        this.y += this.velocityY;

        if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.velocityY = 0;

            if (this.isInAir) {
                this.isInAir = false;
                this.jumpAnimationRunning = false;
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                if (!this.isDead) this.setImage(this.IMAGES_IDLE[0]);
            }
        } else {
            if (!this.isInAir) {
                this.isInAir = true;
                if (!this.isDead) this.setImage(this.IMAGE_FALLING);
            }
        }
    }
}