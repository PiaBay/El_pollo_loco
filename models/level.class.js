/**
 * Represents a game level with all static and dynamic objects.
 */
class Level {
/**
 * Constructs a level.
 * @param {MovableObject[]} enemies - List of enemies (e.g. chickens)
 * @param {Cloud[]} clouds - Moving cloud decorations
 * @param {BackgroundObject[]} backgroundObjects - Layered backgrounds
 * @param {Endboss} endboss - The level's final boss
 * @param {Coin[]} [coins=[]] - Optional: collectable coins in this level
 */
    constructor(enemies, clouds, backgroundObjects, endboss, coins = [], bottles = []) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.endboss = endboss;
        this.coins = coins || []; 
        this.bottles = bottles || [];
}
}
