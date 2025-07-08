/**
 * Represents a basic movable object in the game.
 * Provides image handling, caching, and positional properties.
 */
class MovableObject {
    x = 0;
    y = 0;
    width = 100;
    height = 100;
    img;
    imageCache = {};
    currentImage = 0;
    speed = 5;
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
    
/**
 * Applies gravity logic to the object.
 * Handles both death fall and regular movement physics.
 */
    applyGravity() {
        if (this.fallAfterDeath) {
            this.applyDeathFall();
        } else {
            this.applyStandardGravity();
        }
    }

/**
 * Applies gravity and horizontal movement during the death fall.
 * The object continues falling and drifting sideways if configured.
 */
    applyDeathFall() {
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        this.x += this.vxAfterDeath || 0;
    }

/**
    * Applies standard gravity when character is alive and jumping/falling.
    * Handles landing and falling state transitions.
    */
    applyStandardGravity() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;
        if (this.isOnGround()) {
            this.landOnGround();
        } else {
            this.handleFallingState();
        }
    }

/**
    * Checks whether the object has reached or passed the ground level.
    * 
    * @returns {boolean} True if object is touching or below ground.
    */
    isOnGround() {
        return this.y >= this.groundY;
    }

/**
    * Handles the landing logic after falling or jumping.
    * Resets velocity, updates flags, and shows idle image.
    */
    landOnGround() {
        this.y = this.groundY;
        this.velocityY = 0;
        if (this.isInAir) {
            this.isInAir = false;
            this.jumpAnimationRunning = false;
            clearInterval(this.animationInterval);
            this.animationInterval = null;

            if (!this.isDead) {
                this.setImage(this.IMAGES_IDLE[0]);
            }
        }
    }

/**
    * Handles state and animation when the object is in the air and falling.
    * Triggers falling image if not already in air or dead.
    */
    handleFallingState() {
        if (!this.isInAir) {
            this.isInAir = true;
            if (!this.isDead) {
                this.setImage(this.IMAGE_FALLING);
            }
        }
    }
}