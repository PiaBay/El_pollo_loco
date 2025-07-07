class StatusBarManager {
    constructor(character, gameManager) {
        this.character = character;
        this.gameManager = gameManager;

        this.statusBar = new StatusBar(100);
        this.coinStatusBar = new CoinStatusBar();
        this.bottleStatusBar = new BottleStatusBar();
        this.bossHealthBar = new EndbossStatusBar();
        this.showBossHealthBar = false;

        // Icons für Kompaktmodus
        this.heartIcon = new Image();
        this.heartIcon.src = './assets/img_pollo_locco/img/7_statusbars/3_icons/icon_health.png';

        this.coinIcon = new Image();
        this.coinIcon.src = './assets/img_pollo_locco/img/7_statusbars/3_icons/icon_coin.png';

        this.bottleIcon = new Image();
        this.bottleIcon.src = './assets/img_pollo_locco/img/7_statusbars/3_icons/icon_salsa_bottle.png';

        this.bossIcon = new Image();
        this.bossIcon.src = './assets/img_pollo_locco/img/7_statusbars/3_icons/icon_health_endboss.png';
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

    drawCompactIcon(ctx, icon, value, x, y, iconSize, lastValueKey) {
        if (!this.lastDrawn) this.lastDrawn = {};
        if (this.lastDrawn[lastValueKey] === value) return;

        // Nur wenn Bild geladen
        if (icon.complete && icon.naturalWidth > 0) {
            ctx.drawImage(icon, x, y, iconSize, iconSize);
        }
        ctx.fillText(`${value}`, x + iconSize + 4, y + 20);
        this.lastDrawn[lastValueKey] = value;
    }


    drawAll(ctx) {
        const isCompact = window.innerWidth <= 700;

        if (!isCompact) {
            // Standard-Modus: große Statusbars zeichnen
            this.statusBar.draw(ctx);
            this.coinStatusBar.draw(ctx);
            this.bottleStatusBar.draw(ctx);
            if (this.showBossHealthBar) {
                this.bossHealthBar.draw(ctx);
            }
        } else {
            // Kompaktmodus: Icons + Zahlen zeichnen
            const iconSize = 28;
            const spacingX = 70;
            const baseX = 80;
            const baseY = 50;

            ctx.font = 'bold 18px Arial';
            ctx.fillStyle = 'white';

            this.drawCompactIcon(ctx, this.heartIcon, this.character.energy, baseX, baseY, iconSize, 'energy');
            this.drawCompactIcon(ctx, this.coinIcon, this.gameManager.collectedCoins, baseX + spacingX, baseY, iconSize, 'coins');
            this.drawCompactIcon(ctx, this.bottleIcon, this.gameManager.availableBottles, baseX + spacingX * 2, baseY, iconSize, 'bottles');

            if (this.showBossHealthBar && this.bossHealthBar.energy !== undefined) {
                this.drawCompactIcon(ctx, this.bossIcon, this.bossHealthBar.energy, baseX + spacingX * 3, baseY, iconSize, 'boss');
            }
        }
    }
    }
