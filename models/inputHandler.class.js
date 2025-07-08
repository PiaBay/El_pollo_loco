/**
 * Handles keyboard and mobile input for controlling the character.
 * Supports directional movement, jumping, and bottle throwing.
 */
class InputHandler {
/**
 * Creates a new InputHandler instance.
 * 
 * @param {Character} character - The player character instance.
 * @param {World} world - The world instance.
 */
    constructor(character, world) {
        this.character = character;
        this.world = world;

/**
 * Stores the current state of relevant keys.
 * @type {{LEFT: boolean, RIGHT: boolean, UP: boolean, SPACE: boolean}}
 */
        this.keys = {
            LEFT: false,
            RIGHT: false,
            UP: false,
            SPACE: false,
        };
        this.setupListeners();
        this.setupMobileControls();
    }

/** Sets up key listeners for desktop keyboard input. */
    setupListeners() {
        window.addEventListener('keydown', (e) => this.setKey(e.key, true));
        window.addEventListener('keyup', (e) => this.setKey(e.key, false));
    }

/** Sets up all mobile button controls for touch-based gameplay. */
    setupMobileControls() {
        this.bindMobileButton('.btn-left', 'ArrowLeft');
        this.bindMobileButton('.btn-right', 'ArrowRight');
        this.bindMobileButton('.btn-jump', 'ArrowUp');
        this.bindMobileButton('.btn-throw', ' ');
    }

/**
 * Binds pointer events for a mobile control button.
 * @param {string} selector - The CSS selector for the button element.
 * @param {string} keyCode - The simulated key (e.g., 'ArrowLeft', ' ').
 */
    bindMobileButton(selector, keyCode) {
        const button = document.querySelector(selector);
        if (!button) return;
        const onDown = () => {
            this.resetAllKeys();
            this.setKey(keyCode, true);
        };
        const onUp = () => this.setKey(keyCode, false);
        button.addEventListener('pointerdown', onDown);
        button.addEventListener('pointerup', onUp);
        button.addEventListener('pointerleave', onUp);
    }

/** Resets all directional/interaction keys to false. */
    resetAllKeys() {
        this.setKey('ArrowLeft', false);
        this.setKey('ArrowRight', false);
        this.setKey('ArrowUp', false);
        this.setKey(' ', false);
    }

/**
 * Updates the key state and triggers corresponding actions.
 * 
 * @param {string} key - The key being pressed or released.
 * @param {boolean} isPressed - Whether the key is pressed (true) or released (false).
 */
    setKey(key, isPressed) {
        if (
            isPressed &&
            !this.world.gameManager.characterCanMove &&
            ['ArrowRight', 'ArrowLeft'].includes(key)
        ) {
            return;
        }
        switch (key) {
            case 'ArrowRight':
                this.updateKeyState('RIGHT', isPressed);
                break;
            case 'ArrowLeft':
                this.updateKeyState('LEFT', isPressed);
                break;
            case 'ArrowUp':
                this.updateKeyState('UP', isPressed);
                if (isPressed) this.handleJump();
                break;
            case ' ':
                this.updateKeyState('SPACE', isPressed);
                if (isPressed) this.handleThrow();
                break;
        }
    }

/**
    * Updates the internal key state object.
    * 
    * @param {string} direction - The key identifier (e.g., 'LEFT', 'RIGHT', 'UP', 'SPACE').
    * @param {boolean} isPressed - New pressed state.
    */
    updateKeyState(direction, isPressed) {
        this.keys[direction] = isPressed;
    }

/** Triggers jump if character is on the ground. */
    handleJump() {
        if (!this.character.isInAir) {
            this.world.audio.play('jump');
            this.character.jump();
        }
    }

/** Triggers bottle throw if bottles are available. */
    handleThrow() {
        const boss = this.world.endboss;
        if (boss?.phase === 'retreat') return;
        const gm = this.world.gameManager;
        if (gm.availableBottles > 0) {
            this.character.throwBottle(this.world);
            gm.availableBottles--;
            this.world.statusBarManager.updateBottles(
                gm.availableBottles,
                gm.maxBottleCapacity
            );
        }
    }

/**
 * Returns whether a direction key is currently pressed.
 * Blocks movement if boss intro or camera lock is active.
 * 
 * @param {string} direction - One of "LEFT", "RIGHT", "UP", "SPACE".
 * @returns {boolean} Whether the direction key is currently pressed.
 */
    isPressed(direction) {
        const bossIntroActive = this.world.endboss?.isIntroRunning;
        if (
            (!this.world.gameManager.characterCanMove &&
                ['LEFT', 'RIGHT'].includes(direction)) ||
            (bossIntroActive && direction === 'RIGHT')
        ) {
            return false;
        }
        return this.keys[direction];
    }

/** Resets all key states (used when pausing or ending game). */
    resetKeys() {
        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }
}
