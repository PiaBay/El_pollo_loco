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
        this.setupMobileControls();
    }

    setupListeners() {
        window.addEventListener('keydown', (e) => this.setKey(e.key, true));
        window.addEventListener('keyup', (e) => this.setKey(e.key, false));
    }


    setupMobileControls() {
        const btnLeft = document.querySelector('.btn-left');
        const btnRight = document.querySelector('.btn-right');
        const btnJump = document.querySelector('.btn-jump');
        const btnThrow = document.querySelector('.btn-throw');

        if (!btnLeft || !btnRight || !btnJump || !btnThrow) return;

        // Hilfsfunktion zum Zurücksetzen aller Keys
        const resetKeys = () => {
            this.setKey('ArrowLeft', false);
            this.setKey('ArrowRight', false);
            this.setKey('ArrowUp', false);
            this.setKey(' ', false);
        };

        // ⬅️ Links
        btnLeft.addEventListener('pointerdown', () => {
            resetKeys();
            this.setKey('ArrowLeft', true);
        });
        btnLeft.addEventListener('pointerup', () => this.setKey('ArrowLeft', false));
        btnLeft.addEventListener('pointerleave', () => this.setKey('ArrowLeft', false));

        // ➡️ Rechts
        btnRight.addEventListener('pointerdown', () => {
            resetKeys();
            this.setKey('ArrowRight', true);
        });
        btnRight.addEventListener('pointerup', () => this.setKey('ArrowRight', false));
        btnRight.addEventListener('pointerleave', () => this.setKey('ArrowRight', false));

        // ⬆️ Springen
        btnJump.addEventListener('pointerdown', () => {
            resetKeys();
            this.setKey('ArrowUp', true);
        });
        btnJump.addEventListener('pointerup', () => this.setKey('ArrowUp', false));
        btnJump.addEventListener('pointerleave', () => this.setKey('ArrowUp', false));

        // 🧴 Werfen
        btnThrow.addEventListener('pointerdown', () => {
            resetKeys();
            this.setKey(' ', true);
        });
        btnThrow.addEventListener('pointerup', () => this.setKey(' ', false));
        btnThrow.addEventListener('pointerleave', () => this.setKey(' ', false));
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
        const bossIntroActive = this.world.endboss?.isIntroRunning;
        console.log('isIntroRunning?', this.world.endboss?.isIntroRunning);
        // Bewegung nach rechts blockieren während Boss-Intro
        if (
            (!this.world.gameManager.characterCanMove && ['LEFT', 'RIGHT'].includes(direction)) ||
            (bossIntroActive && direction === 'RIGHT')
        ) {
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
