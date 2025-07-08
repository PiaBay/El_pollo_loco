/**
 * Handles character-specific logic like movement, damage, and camera updates.
 * Extracted from the World class to keep separation of concerns.
 */
class CharacterController {
    /**
     * @param {Character} character - The main character instance.
     * @param {World} world - The world instance (to access camera, status bars, etc).
     * @param {InputHandler} inputHandler - Handles keyboard input.
     */
    constructor(character, world, inputHandler) {
        this.character = character;
        this.world = world;
        this.inputHandler = inputHandler;
    }

/**
 * Updates character movement, idle animation, and camera tracking.
 */
    update() {
        if (!this.world.gameManager.characterCanMove) return;
        if (this.character.isDead || this.character.isStunned || this.character.isHurt) return;

        this.handleIdleAnimation();
        this.handleMovementInput();
        this.updateCameraPosition();
    }

/**
 * Triggers idle animation if applicable.
 */
    handleIdleAnimation() {
        this.character.checkLongIdleAnimation(this.world.gameManager.preventIdle);
    }

/**
 * Handles keyboard input for movement.
 */
    handleMovementInput() {
        if (this.inputHandler.isPressed('RIGHT')) {
            this.character.moveRight();
        } else if (this.inputHandler.isPressed('LEFT')) {
            this.character.moveLeft();
        } else {
            this.character.stopWalkingAnimation();
        }
    }

/**
 * Updates camera position based on character or boss focus.
 */
    updateCameraPosition() {
        const boss = this.world.endbossController?.endboss;
        const bossFocus = this.world.endbossController?.bossFocusActive;
        const gameManager = this.world.gameManager;

        if (bossFocus && boss && !gameManager.cameraLocked) {
            this.world.camera_x = Math.max(boss.x - 300, 0);
        } else if (!gameManager.cameraLocked) {
            this.world.camera_x = Math.max(this.character.x - 100, 0);
        }
    }

/**
 * Handles logic when the character takes damage from an enemy.
 */
    handleHit() {
        this.character.takeDamage(20);
        this.world.statusBarManager.updateCharacterHealth();
    }

/**
 * Handles jump-on-chicken logic.
 */
    handleJumpKill(chicken) {
        const hitFromAbove = this.character.y + this.character.height < chicken.y + 30;
        if (hitFromAbove) {
            this.character.velocityY = -3;
            this.world.audio.play('chicken');
            return true;
        }
        return false;
    }
    handleChickenJumpKill() {
        this.character.velocityY = -3;
        this.world.audio.play('chicken');
    }
}
window.CharacterController = CharacterController;