/**
 * Manages all game audio: loading, playing, and stopping sound effects and music.
 */
class AudioManager {
    constructor() {
        /** @type {Object<string, HTMLAudioElement>} */
        this.sounds = {
            jump: this.load('./audio/jump-up-245782.mp3'),
            throw: this.load('./audio/bottle-pop-45531.mp3'),
            hurt: this.load('./audio/grunt2-85989.mp3'),
            win: this.load('./audio/spanish-motifs-329486.mp3'),
            lose: this.load('./audio/to-you-valladolid-254757.mp3'),
            bottlePickup: this.load('./audio/bottle-205353.mp3'),
            coin: this.load('./audio/coins-135571.mp3'),
            chicken: this.load('./audio/chicken-noise-228106.mp3'),
            bossHit: this.load('./audio/roaster-crows-2-363352.mp3'),
            bossIntro: this.load('./audio/dark-drone-351092.mp3'),
            bossAttack: this.load('./audio/chicken-noise-228106.mp3'),
            menuMusic: this.load('./audio/spanish-guitar-208363.mp3', true),  // für Startseite
            gameMusic: this.load('./audio/spanish-motifs-329486.mp3', true)
};

        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.musicEnabled = localStorage.getItem('musicEnabled') === 'true';
    }

    /**
     * Loads an audio file.
     * @param {string} path - Path to the audio file.
     * @param {boolean} [loop=false] - Whether the audio should loop.
     * @returns {HTMLAudioElement} The loaded audio element.
     */
    load(path, loop = false) {
        const audio = new Audio(path);
        audio.loop = loop;
        if (loop) audio.volume = 0.3;
        return audio;
    }

    /**
     * Plays a sound by name.
     * @param {string} name - The name of the sound.
     */
    play(name) {
        const sound = this.sounds[name];
        if (!sound) return;

        const isMusic = sound.loop; // Musik wird geloopt
        const isAllowed = isMusic ? this.musicEnabled : this.soundEnabled;

        if (isAllowed) {
            sound.currentTime = 0;
            sound.play().catch(e => console.warn(`Sound '${name}' failed to play:`, e));
        }
    }


    /**
     * Stops a sound by name.
     * @param {string} name - The name of the sound.
     */
    stop(name) {
        const sound = this.sounds[name];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
        }
    }

    /** Stops all sounds. */
    stopAll() {
        for (const name in this.sounds) {
            this.stop(name);
        }
    }

    /** Plays the background music if enabled and stop. */
    playMusic(name = 'gameMusic') {
        if (this.musicEnabled) {
            this.sounds[name]?.play().catch(() => { });
        }
    }

    pauseMusic(name = 'gameMusic') {
        this.sounds[name]?.pause();
    }



    /** Reloads settings from localStorage. */
    refreshSettings() {
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        this.musicEnabled = localStorage.getItem('musicEnabled') === 'true';
    }

    applySettingsBasedOnState(isStartScreenVisible) {
        this.musicEnabled = localStorage.getItem('musicEnabled') === 'true';
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

        this.refreshSettings();

        if (isStartScreenVisible) {
            if (this.musicEnabled) {
                this.play('menuMusic');
            } else {
                this.stop('menuMusic');
            }
        } else {
            if (this.musicEnabled) {
                this.play('gameMusic');
            } else {
                this.stop('gameMusic');
            }
        }
    }



}


