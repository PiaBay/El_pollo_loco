/**
 * A simple status bar that displays the character's energy.
 * Drawn as a filled rectangle at a fixed position.
 */
class StatusBar {
    /**
     * @param {number} maxEnergy - The maximum energy level.
     */
    constructor(maxEnergy = 100) {
        this.maxEnergy = maxEnergy;
        this.currentEnergy = maxEnergy;

        // Position and dimensions
        this.x = 20;
        this.y = 20;
        this.width = 200;
        this.height = 30;
    }

    /**
     * Updates the current energy value.
     * @param {number} newEnergy
     */
    setEnergy(newEnergy) {
        this.currentEnergy = Math.max(0, Math.min(this.maxEnergy, newEnergy));
    }

    /**
     * Draws the energy bar onto the given context.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        // Background
        ctx.fillStyle = '#555';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Foreground (energy)
        const energyWidth = (this.currentEnergy / this.maxEnergy) * this.width;
        ctx.fillStyle = '#c1272d';
        ctx.fillRect(this.x, this.y, energyWidth, this.height);

        // Border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}
