class StatusBarManager {
    constructor(character, gameManager) {
        this.character = character;
        this.gameManager = gameManager;

        this.statusBar = new StatusBar(100);
        this.coinStatusBar = new CoinStatusBar();
        this.bottleStatusBar = new BottleStatusBar();
        this.bossHealthBar = new EndbossStatusBar();
        this.showBossHealthBar = false;

        this.heartIcon = new Image();
        this.heartIcon.src = './assets/img_pollo_locco/img/7_statusbars/3_icons/icon_health.png';
        this.heartIcon.onload = () => console.log('✅ heartIcon geladen');

        this.coinIcon = new Image();
        this.coinIcon.src = './assets/img_pollo_locco/img/7_statusbars/3_icons/icon_coin.png';
        this.coinIcon.onload = () => console.log('✅ coinIcon geladen');

        this.bottleIcon = new Image();
        this.bottleIcon.src = './assets/img_pollo_locco/img/7_statusbars/3_icons/icon_salsa_bottle.png';
        this.bottleIcon.onload = () => console.log('✅ bottleIcon geladen');

        this.bossIcon = new Image();
        this.bossIcon.src = './assets/img_pollo_locco/img/7_statusbars/3_icons/icon_health_endboss.png';
        this.bossIcon.onload = () => console.log('✅ bossIcon geladen');
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
        this.bossHealthBar.energy = currentEnergy; // 🔧 manuell setzen!
    }
    drawCompactIcon(ctx, icon, value, x, y, iconSize, lastValueKey, scale = 1, fontSize = 18) {
        if (!this.lastDrawn) this.lastDrawn = {};

        if (icon.complete && icon.naturalWidth > 0) {
            ctx.drawImage(icon, x, y, iconSize, iconSize);
        }

        ctx.fillStyle = 'white';
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillText(`${value}`, x + iconSize + 4, y + iconSize / 1.5);

        // 👇 Immer erst nach dem Zeichnen speichern!
        this.lastDrawn[lastValueKey] = value;
    }


    drawAll(ctx) {
        const isCompact = window.innerWidth <= 700;

        if (!isCompact) {
            this.statusBar.draw(ctx);
            this.coinStatusBar.draw(ctx);
            this.bottleStatusBar.draw(ctx);
            if (this.showBossHealthBar) {
                this.bossHealthBar.draw(ctx);
            }
        } else {
            const iconSize = 70;
            const spacingX = 130;
            const baseX = 20;
            const baseY = 25;
            const scale = ctx.canvas.width / parseInt(ctx.canvas.style.width);
            const fontSize = 18 * scale;

            this.drawCompactIcon(ctx, this.heartIcon, this.character.energy, baseX, baseY, iconSize, 'energy', scale, fontSize);
            this.drawCompactIcon(ctx, this.coinIcon, this.gameManager.collectedCoins, baseX + spacingX, baseY, iconSize, 'coins', scale, fontSize);
            this.drawCompactIcon(ctx, this.bottleIcon, this.gameManager.availableBottles, baseX + spacingX * 2, baseY, iconSize, 'bottles', scale, fontSize);
            if (this.showBossHealthBar && this.bossHealthBar.energy !== undefined) {
                this.drawCompactIcon(ctx, this.bossIcon, this.bossHealthBar.energy, baseX + spacingX * 3, baseY, iconSize, 'boss', scale, fontSize);
            }
        }
    }
}
