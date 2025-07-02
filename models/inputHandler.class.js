class InputHandler {
    constructor(character, world) {
        this.character = character;
        this.world = world;

        this.keys = {
            LEFT: false,
            RIGHT: false,
            UP: false,
            SPACE: false,
        };

        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => this.setKey(e.key, true));
        window.addEventListener('keyup', (e) => this.setKey(e.key, false));
    }

    setKey(key, isPressed) {
        if (isPressed && !this.world.gameManager.characterCanMove && ['ArrowRight', 'ArrowLeft'].includes(key)) {
            return;
        }
        switch (key) {
            case 'ArrowRight':
                this.keys.RIGHT = isPressed;
                break;
            case 'ArrowLeft':
                this.keys.LEFT = isPressed;
                break;
            case 'ArrowUp':
                if (isPressed) this.handleJump();
                this.keys.UP = isPressed;
                break;
            case ' ':
                if (isPressed) this.handleThrow();
                this.keys.SPACE = isPressed;
                break;
        }
    }

    handleJump() {
        if (!this.character.isInAir) {
            this.world.audio.play('jump');
            this.character.jump();
        }
    }

    handleThrow() {
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

    isPressed(direction) {
        if (!this.world.gameManager.characterCanMove && ['LEFT', 'RIGHT'].includes(direction)) {
            return false;
        }
        return this.keys[direction];
    }
    resetKeys() {
        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }
}
