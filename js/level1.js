const level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackground(),
    createEndboss(),
    createCoins(),
    createBottles()
    );


// Funktionen:
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

function createBottles() {
    return [
        new Bottle(300, 360),
        new Bottle(780, 120),
        new Bottle(1050, 350),
        new Bottle(1280, 120),
        new Bottle(1550, 350),
        new Bottle(2000, 120),
    ];
}


function createEnemies() {
    let enemies = [];
    for (let i = 0; i < 5; i++) {
        // weiter auseinander & etwas zufälliger
        let xPos = 600 + i * 500 + Math.random() * 200;
        enemies.push(new Chicken(xPos));
    }
    return enemies;
}


function createClouds() {
    return [
        new Cloud(250, 50),
        new Cloud(650, 70)
    ];
}

function createBackground() {
    const bg = [];

    const layer1 = [
        './assets/img_pollo_locco/img/5_background/layers/1_first_layer/1.png',
        './assets/img_pollo_locco/img/5_background/layers/1_first_layer/2.png'
    ];
    const layer2 = [
        './assets/img_pollo_locco/img/5_background/layers/2_second_layer/1.png',
        './assets/img_pollo_locco/img/5_background/layers/2_second_layer/2.png'
    ];
    const layer3 = [
        './assets/img_pollo_locco/img/5_background/layers/3_third_layer/1.png',
        './assets/img_pollo_locco/img/5_background/layers/3_third_layer/2.png'
    ];
    const air = './assets/img_pollo_locco/img/5_background/layers/air.png';

    // Himmel
    for (let i = -1; i < 6; i++) {
        bg.push(new BackgroundObject(air, i * 719));
    }

    // 3rd Layer
    for (let i = -1; i < 6; i++) {
        const imgIndex = (i + layer3.length) % layer3.length;
        bg.push(new BackgroundObject(layer3[imgIndex], i * 719));
    }

    // 2nd Layer
    for (let i = -1; i < 6; i++) {
        const imgIndex = (i + layer2.length) % layer2.length;
        bg.push(new BackgroundObject(layer2[imgIndex], i * 719));
    }

    // 1st Layer
    for (let i = -1; i < 6; i++) {
        const imgIndex = (i + layer1.length) % layer1.length;
        bg.push(new BackgroundObject(layer1[imgIndex], i * 719));
    }

    return bg;
}

function createEndboss() {
    return new Endboss(3000); // deutlich rechts vom Levelende
}



