var scenePilihHero = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { key: "scenePilihHero" });
    },
    init: function () {},
    preload: function () {
        this.load.setBaseURL("assets/");
        this.load.image("BGPilihPesawat", "images/BGPilihPesawat.png");
        this.load.image("ButtonMenu", "images/ButtonMenu.png");
        this.load.image("ButtonNext", "images/ButtonNext.png");
        this.load.image("ButtonPrev", "images/ButtonPrev.png");
        this.load.image("Pesawat1", "images/Pesawat1.png");
        this.load.image("Pesawat2", "images/Pesawat2.png");
        this.load.audio("snd_touchchooter", "audio/fx_touch.mp3");
    },
    create: function () {
    this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPilihPesawat');
    var buttonMenu = this.add.image(50, 50, 'ButtonMenu').setInteractive();
    var buttonNext = this.add.image(X_POSITION.CENTER + 250, Y_POSITION.CENTER, 'ButtonNext').setInteractive();
    var buttonPrevious = this.add.image(X_POSITION.CENTER - 250, Y_POSITION.CENTER, 'ButtonPrev').setInteractive();
    var heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'Pesawat' + (currentHero + 1)).setInteractive().setScale(0.35);

    this.snd_touch = this.sound.add('snd_touchchooter');

    // Fungsi pembantu untuk memutar suara dengan aman
    const playClick = () => {
        if (this.registry.get('soundOn')) {
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            this.snd_touch.play();
        }
    };

    // --- EVENT LISTENER ---
    // Gunakan 'gameobjectdown' untuk feedback visual (tint)
    this.input.on('gameobjectdown', function (pointer, gameObject) {
        gameObject.setTint(0x666666);
    }, this);

    // Gunakan 'gameobjectup' untuk aksi (pindah scene, ganti hero) & SUARA
    this.input.on('gameobjectup', function (pointer, gameObject) {
        gameObject.setTint(0xffffff); // Reset warna
        playClick(); // Mainkan suara HANYA saat klik dilepas (seperti tombol asli)

        if (gameObject === buttonMenu) {
            this.scene.start("SceneMenu");
        } else if (gameObject === buttonNext) {
            currentHero = (currentHero + 1) % countHero;
            heroShip.setTexture('Pesawat' + (currentHero + 1));
        } else if (gameObject === buttonPrevious) {
            currentHero = (currentHero - 1 + countHero) % countHero;
            heroShip.setTexture('Pesawat' + (currentHero + 1));
        } else if (gameObject === heroShip) {
            this.scene.start("scenePlay");
        }
    }, this);

    // Efek hover (hanya visual, tidak perlu suara)
    this.input.on('gameobjectover', (pointer, gameObject) => {
        gameObject.setTint(0x999999);
    });

    this.input.on('gameobjectout', (pointer, gameObject) => {
        gameObject.setTint(0xffffff);
    });
},
    update: function () {},
});