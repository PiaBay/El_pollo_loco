const level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackground(),
    createEndboss()
);

// Funktionen:
function createEnemies() {
    const enemies = [];
    let startX = 800;
    for (let i = 0; i < 5; i++) {
        enemies.push(new Chicken(startX));
        startX += 200 + Math.random() * 300;
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