/**
 * Handles the logic related to the Endboss character.
 * Manages activation, behavior, intro sequence, and camera interaction.
 */
class EndbossController {
/**
 * @param {World} world - Reference to the World instance.
 */
    constructor(world) {
        this.world = world;
        this.endboss = null;
        this.bossFocusActive = false;
    }

/**
 * Called every frame to update boss state and camera logic.
 */
    update() {
        this.checkActivation();
        this.updateBehavior();
        this.updateCamera();
    }

/**
 * Checks if the Endboss should be activated based on character position.
 */
    checkActivation() {
        if (this.world.gameOverHandled) return;
        if (!this.world.bossActivated && this.world.character.x > 2200) {
            this.activate();
        }
    }

/**
 * Activates the Endboss, starts the intro sequence, and locks camera/player movement.
 */
    activate() {
        this.endboss = new Endboss();
        this.endboss.world = this.world;
        this.endboss.statusBarManager = this.world.statusBarManager;

        this.endboss.onIntroStart = () => this.handleIntroStart();
        this.endboss.onIntroEnd = () => this.handleIntroEnd();

        this.world.endboss = this.endboss;
        this.world.bossActivated = true;
        this.bossFocusActive = true;
        this.world.statusBarManager.showBossHealthBar = true;
        this.world.audio.play('bossIntro');
        this.lockCameraAndCharacter();

        this.endboss.startIntroAnimation();
    }

/**
 * Locks the camera and disables character movement and idle animations during intro.
 */
    lockCameraAndCharacter() {
        this.world.cameraLocked = true;
        this.world.characterCanMove = false;
        this.world.preventIdle = true;
    }

/**
 * Called at the start of the Endboss intro animation.
 * Disables chickens and updates boss health bar.
 */
    handleIntroStart() {
        this.world.statusBarManager.showBossHealthBar = true;
        this.world.statusBarManager.updateBossHealth(this.world.endboss.energy);
        this.world.gameManager.chickens = [];
        this.world.character.longIdlePermanentlyDisabled = true;
        this.world.preventIdle = true;
    }

/**
 * Called at the end of the Endboss intro animation.
 * Unlocks camera and re-enables character movement.
 */
    handleIntroEnd() {
        this.world.characterCanMove = true;
        this.world.cameraLocked = false;
        this.world.preventIdle = false;
    }

/**
 * Updates the Endboss behavior (movement, AI, falling, etc.).
 */
    updateBehavior() {
        if (!this.endboss || this.world.gameOverHandled) return;
        const boss = this.endboss;
        const pepe = this.world.character;
        if (!boss.introPlayed) {
            boss.moveLeft();
        } else {
            this.pursueTarget(pepe);
        }
        if (boss.fallAfterDeath) {
            boss.y += boss.velocityY;
            boss.velocityY += boss.gravity;
            boss.rotationAngle += 0.05;
        }
        this.world.addToMap(boss);
    }

/**
 * Updates the camera position during boss intro sequence.
 */
    updateCamera() {
        if (this.world.cameraLocked) {
            this.world.camera_x = this.endboss.x - 200;
        }
    }

/**
 * Controls boss behavior based on its current phase.
 * 
 * @param {Character} character - The player character to pursue.
 */
    pursueTarget(character) {
        const boss = this.endboss;
        if (this.shouldSkipPursuit()) return;

        switch (boss.phase) {
            case 'attack':
                this.pursueAndAttack(character);
                break;
            case 'retreat':
                this.moveBackToIntroPosition();
                break;
            case 'wait':
                // Do nothing
                break;
        }
    }

/**
 * Checks if the Endboss is close enough to attack and deals damage if applicable.
 * 
 * @param {Character} character - The player character to potentially attack.
 */
    checkAttack(character) {
        const boss = this.endboss;
        const distance = Math.abs(boss.x - character.x);
        const now = Date.now();
        const attackRange = 80;
        if (!boss.lastAttackTime) boss.lastAttackTime = 0;
        if (this.canAttack(distance, now)) {
            boss.startAttacking();
            character.takeDamage(20);
            boss.lastAttackTime = now;
            this.world.statusBarManager.updateCharacterHealth();
            boss.phase = 'retreat';
            this.world.bossFocusActive = true;
            boss.stopWalkingAnimation();
        }
    }

/**
 * Determines whether the Endboss is allowed to attack.
 * 
 * @param {number} distance - Distance to the player.
 * @param {number} now - Current timestamp.
 * @returns {boolean} True if the boss can attack.
 */
    canAttack(distance, now) {
        const b = this.endboss;
        return (
            distance < 80 &&
            !b.isDead &&
            !b.isHurt &&
            !b.isStunned &&
            now - b.lastAttackTime > 1000
        );
    }

/**
 * Moves the boss back to the intro position to reset the fight.
 * Triggers intro again when reached.
 */
    moveBackToIntroPosition() {
        const boss = this.endboss;
        const pepe = this.world.character;
        const stopX = pepe.x + 720;

        if (boss.x < stopX) {
            boss.x += boss.speed;
            boss.otherDirection = true;
            boss.startWalkingAnimation();
        } else {
            boss.stopWalkingAnimation();
            boss.otherDirection = false;
            boss.phase = 'wait';
            boss.introPlayed = false;
            boss.startIntroAnimation();
        }
    }

/**
 * Moves the boss toward the character and initiates an attack if in range.
 * 
 * @param {Character} character - The player character.
 */
    pursueAndAttack(character) {
        const boss = this.endboss;
        const dist = character.x - boss.x;

        if (Math.abs(dist) > 20) {
            boss.moveTowardsTarget(dist);
            boss.startWalkingAnimation();
        } else {
            boss.stopWalkingAnimation();
        }

        this.checkAttack(character);
    }

/**
 * Determines if the boss should currently skip pursuing the player.
 * 
 * @returns {boolean} True if boss is dead, hurt, stunned, or has no energy.
 */
    shouldSkipPursuit() {
        return this.isDead || this.isHurt || this.isStunned || this.energy <= 0;
    }
}
