class StatusBarManager {
    constructor(character) {
        this.statusBar = new StatusBar();
        this.coinStatusBar = new coinStatusBar();
        this.bottleStatusBar = new BottleStatusBar();
        this.bossHealthBar = new EndbossStatusBar();
        this.showBossHealthBar = false;
        this.character = character;
    }

    updateCoins(collected, total) {
        this.coinStatusBar.setCoins(collected, total);
    }

    updateBottles(currentBottles, maxCapacity) {
        this.bottleStatusBar.setBottles(currentBottles, maxCapacity);
    }

    updateCharacterHealth() {
        this.statusBar.setEnergy(this.character.energy);
    }

    updateBossHealth(currentEnergy) {
        this.bossHealthBar.setPercentage(currentEnergy);
    }


    drawAll(ctx) {
        this.statusBar.draw(ctx);
        this.coinStatusBar.draw(ctx);
        this.bottleStatusBar.draw(ctx);
        if (this.showBossHealthBar) {
            this.bossHealthBar.draw(ctx);
        }
    }
}
