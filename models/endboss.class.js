class Endboss extends MovableObject {
    walking = false;
    activated = false;
    energy = 100;
    introPlayed = false;
    isHurt = false;
    isDead = false;
    isStunned = false;

    attackInterval = null;


    IMAGES_WALKING = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G1.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G2.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G3.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G5.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G6.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G7.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G8.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G9.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G10.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G11.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/2_alert/G12.png'

    ];

    IMAGES_ATTACK = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G13.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G14.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G15.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G16.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G17.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G18.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G19.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/3_attack/G20.png'
    ]

    IMAGES_HURT = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G21.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G22.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];


    IMAGES_DIE = [
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G24.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G25.png',
        './assets/img_pollo_locco/img/4_enemie_boss_chicken/5_dead/G26.png'
    ]


    constructor(x) {
        super();
        this.x = x;              
        this.y = 180;  
        this.width = 250;
        this.height = 300;
        this.speed = 8;
        this.introPositionX = 2600;

        this.velocityY = 0;
        this.gravity = 0.8;
        this.groundY = 180;

        // 🔽 ALLE Bilder vorladen
        this.loadImages(this.IMAGES_WALKING, () => {
            this.setImage(this.IMAGES_WALKING[0]);
        });
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DIE);    }

    canTakeDamage() {
        return Date.now() - this.lastHitTime > this.hurtCooldown;
    }

    
    startIntroAnimation() {
        if (this.introPlayed) return;

        this.introPlayed = true; // 🔁 Direkt am Anfang – verhindert Mehrfachaufruf!
        this.speed = 0;

        // ➕ Intro-Callback aufrufen (Chickens entfernen)
        if (typeof this.onIntroStart === 'function') {
            this.onIntroStart();
        }

        this.loadImages(this.IMAGES_ALERT, () => {
            let frame = 0;
            this.alertInterval = setInterval(() => {
                this.setImage(this.IMAGES_ALERT[frame % this.IMAGES_ALERT.length]);
                frame++;
                if (frame >= this.IMAGES_ALERT.length * 1) {
                    clearInterval(this.alertInterval);
                    this.alertInterval = null;

                    this.startWalkingAnimation();
                    this.startAttacking();

                    if (typeof this.onIntroEnd === 'function') {
                        this.onIntroEnd();
                    }
                }
            }, 500);
        });
    }


    /**
     * Starts walking animation when ready.
     */
    startWalkingAnimation() {
        if (this.animationInterval) return; // Nur auf Interval prüfen

        console.log('@ Starte Walking');
        this.walking = true;
        this.currentImage = 0;

        this.animationInterval = setInterval(() => {
            const i = this.currentImage % this.IMAGES_WALKING.length;
            this.setImage(this.IMAGES_WALKING[i]);
            this.currentImage++;
        }, 350);
    }



    /**
     * Moves the boss to the left (only after landing).
     */
    moveLeft() {
        if (this.isHurt || this.introPlayed) return;

        if (!this.walking) this.startWalkingAnimation();

        if (this.x > this.introPositionX) {
            this.x -= this.speed;
        } else if (!this.introPlayed) {
            console.log('🐓 Endboss angekommen');
            this.stopWalkingAnimation();
            this.startIntroAnimation(); // 🔁 Nur 1x!
        }
    }





    stopWalkingAnimation() {
        this.walking = false;
        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
    }



    startAttacking() {
        if (this.attackInterval) return;

        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;
        const attackImages = this.IMAGES_ATTACK;

        this.loadImages(this.IMAGES_ATTACK, () => {
            let frame = 0;
            this.animationInterval = setInterval(() => {
                if (frame < attackImages.length) {
                    this.setImage(attackImages[frame]);
                    frame++;
                } else {
                    clearInterval(this.animationInterval);
                    this.animationInterval = null;
                    this.currentImage = 0;
                    this.isHurt = false;
                    this.setImage(this.IMAGES_WALKING[0]);
                }
            }, 300);

        });
    }



    playHurtAnimation() {
        if (this.isDead) return;

        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.currentImage = 0;

        const hurtImages = this.IMAGES_HURT;
        let frame = 0;

        this.animationInterval = setInterval(() => {
            if (frame < hurtImages.length) {
                this.setImage(hurtImages[frame]);
                frame++;
            } else {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                this.currentImage = 0;
                this.setImage(this.IMAGES_WALKING[0]);
                this.walking = false;
                this.startWalkingAnimation();
                this.startAttacking();
            }
        }, 300);
    }

    /**
     * Reduces energy and checks if the boss dies.
     */
    hit(amount = 30, statusBar = null) {
        if (this.isDead) return;

        this.energy = Math.max(0, this.energy - amount);

        // ✅ Immer Statusbar aktualisieren
        if (statusBar) {
            statusBar.setPercentage(this.energy);
        } else if (this.bossHealthBar) {
            this.bossHealthBar.setPercentage(this.energy);
        }

        this.lastHitTime = Date.now();
        this.isHurt = true;
        this.isStunned = true;

        if (this.energy <= 0) {
            this.die();
        } else {
            this.playHurtAnimation();
            setTimeout(() => {
                this.isHurt = false;
                this.isStunned = false;
            }, 600);
        }
    }




    /**
     * Handles boss death.
     */
    die() {
        if (this.isDead) return;
        this.isDead = true;

        if (this.bossHealthBar) {
            this.bossHealthBar.setPercentage(0);
        }

        clearInterval(this.animationInterval);
        this.animationInterval = null;
        this.walking = false;
        this.currentImage = 0;

        let frame = 0;
        const interval = setInterval(() => {
            if (frame < this.IMAGES_DIE.length) {
                this.setImage(this.IMAGES_DIE[frame]);
                frame++;
            } else {
                clearInterval(interval);
                this.velocityY = -5;
                this.vxAfterDeath = 3;
                this.fallAfterDeath = true;
            }
        }, 300);
    }

}
