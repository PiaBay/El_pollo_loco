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

    /** Checks if the Endboss should be activated based on character position. */
    checkActivation() {
        if (this.world.gameOverHandled) return;
        if (!this.world.bossActivated && this.world.character.x > 2200) {
            this.activate();
        }
    }

    /** Activates the Endboss, sets handlers, and locks camera/player. */
    activate() {
        this.endboss = new Endboss();
        this.endboss.world = this.world;
        this.endboss.statusBarManager = this.world.statusBarManager;

        this.world.endboss = this.endboss;
        this.world.bossActivated = true;
        this.bossFocusActive = true; // 👉 Damit Kamera auf Boss geht!
        this.world.statusBarManager.showBossHealthBar = true;
        this.world.audio.play('bossIntro');
        this.lockCameraAndCharacter();

        this.endboss.onIntroStart = () => this.handleIntroStart();
        this.endboss.onIntroEnd = () => this.handleIntroEnd();
    }

    /** Locks player and camera during intro. */
    lockCameraAndCharacter() {
        this.world.cameraLocked = true;
        this.world.characterCanMove = false;
        this.world.preventIdle = true;
    }

    /** Called at the start of the Endboss intro. */
    handleIntroStart() {
        this.world.chickens = [];
        this.world.character.longIdlePermanentlyDisabled = true;
        this.world.preventIdle = true;
    }

    /** Called at the end of the Endboss intro. */
    handleIntroEnd() {
        this.world.characterCanMove = true;
        this.world.cameraLocked = false;
        this.world.preventIdle = false;
    }

    /** Updates the Endboss behavior and falling if dead. */
    updateBehavior() {
        if (!this.endboss || this.world.gameOverHandled) return;
        const boss = this.endboss;
        const pepe = this.world.character;

        if (!boss.introPlayed) {
            boss.moveLeft();
        } else {
            boss.pursueTarget(pepe);
        }

        if (boss.fallAfterDeath) {
            boss.y += boss.velocityY;
            boss.velocityY += boss.gravity;
        }

        this.world.addToMap(boss);
    }

    /** Updates camera to follow Endboss during intro. */
    updateCamera() {
        if (this.world.cameraLocked) {
            this.world.camera_x = this.endboss.x - 200;
        }
    }
}  
