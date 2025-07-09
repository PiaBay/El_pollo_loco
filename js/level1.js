/**
 * Creates and initializes Level 1 with enemies, clouds, background, coins, bottles, and endboss.
 * @type {Level}
 */
const level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackground(),
    createEndboss(),
    createCoins(),
    createBottles()
);

/**
 * Creates and returns an array of Coin instances placed at specific coordinates.
 * 
 * @returns {Coin[]} An array of coins.
 */
function createCoins() {
    return [
        new Coin(200, 180),
        new Coin(600, 120),
        new Coin(850, 80),
        new Coin(1000, 180),
        new Coin(1200, 50),
        new Coin(1600, 90),
        new Coin(1800, 120),
        new Coin(2000, 100),
    ];
}

/**
 * Creates and returns an array of Bottle instances placed at specific coordinates.
 * 
 * @returns {Bottle[]} An array of bottles.
 */
function createBottles() {
    return [
        new Bottle(300, 280),
        new Bottle(780, 120),
        new Bottle(1050, 350),
        new Bottle(1280, 120),
        new Bottle(1550, 350),
        new Bottle(2000, 120),
    ];
}

/**
 * Creates and returns an array of Chicken enemies positioned across the level.
 * Spacing includes slight random offset for variation.
 * 
 * @returns {Chicken[]} An array of Chicken enemies.
 */
function createEnemies() {
    let enemies = [];
    for (let i = 0; i < 40; i++) {
        let xPos = 600 + i * 300 + Math.random() * 150;
        enemies.push(new Chicken(xPos));
    }
    return enemies;
}


/**
 * Creates and returns an array of Cloud objects for the sky layer.
 * 
 * @returns {Cloud[]} An array of cloud instances.
 */
function createClouds() {
    return [
        new Cloud(250, 50),
        new Cloud(650, 70)
    ];
}

/**
 * Creates and returns the full background array with all layers.
 * 
 * @returns {BackgroundObject[]} Array of background objects for the level.
 */
function createBackground() {
    const bg = [];
    bg.push(...createAirLayer());
    bg.push(...createParallaxLayer(layer3Images(), -1, 6));
    bg.push(...createParallaxLayer(layer2Images(), -1, 6));
    bg.push(...createParallaxLayer(layer1Images(), -1, 6));
    return bg;
}

/**
 * Returns the image paths for the first (frontmost) layer.
 * 
 * @returns {string[]} Array of image paths.
 */
function layer1Images() {
    return [
        './assets/img_pollo_locco/img/5_background/layers/1_first_layer/1.png',
        './assets/img_pollo_locco/img/5_background/layers/1_first_layer/2.png'
    ];
}

/**
 * Returns the image paths for the second (middle) layer.
 * 
 * @returns {string[]} Array of image paths.
 */
function layer2Images() {
    return [
        './assets/img_pollo_locco/img/5_background/layers/2_second_layer/1.png',
        './assets/img_pollo_locco/img/5_background/layers/2_second_layer/2.png'
    ];
}

/**
 * Returns the image paths for the third (backmost) layer.
 * 
 * @returns {string[]} Array of image paths.
 */
function layer3Images() {
    return [
        './assets/img_pollo_locco/img/5_background/layers/3_third_layer/1.png',
        './assets/img_pollo_locco/img/5_background/layers/3_third_layer/2.png'
    ];
}

/**
 * Creates the repeating air (sky) layer.
 * 
 * @returns {BackgroundObject[]} Array of air background objects.
 */
function createAirLayer() {
    const air = './assets/img_pollo_locco/img/5_background/layers/air.png';
    const airLayer = [];
    for (let i = -1; i < 6; i++) {
        airLayer.push(new BackgroundObject(air, i * 719));
    }
    return airLayer;
}

/**
 * Creates a parallax layer by repeating image elements along the X-axis.
 * 
 * @param {string[]} images - Array of image paths for the layer.
 * @param {number} start - Starting index (typically -1 for alignment).
 * @param {number} end - Ending index (non-inclusive upper bound).
 * @returns {BackgroundObject[]} Array of background objects for this layer.
 */
function createParallaxLayer(images, start, end) {
    const layer = [];
    for (let i = start; i < end; i++) {
        const imgIndex = (i + images.length) % images.length;
        layer.push(new BackgroundObject(images[imgIndex], i * 719));
    }
    return layer;
}

/**
 * Creates and returns the Endboss instance.
 * Positioned far right to allow for dramatic entrance timing.
 * 
 * @returns {Endboss} An Endboss object.
 */
function createEndboss() {
    return new Endboss(3000);
}