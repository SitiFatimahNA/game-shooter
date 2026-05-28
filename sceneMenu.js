var SceneMenu = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function SceneMenu() {
        Phaser.Scene.call(this, { key: "SceneMenu" });
    },
    init: function () {
        // Logika Kriteria: Amankan inisialisasi status awal saat pertama kali dibuka / refresh
        if (this.registry.get('musicOn') === undefined) {
            this.registry.set('musicOn', true);
        }
        if (this.registry.get('soundOn') === undefined) {
            this.registry.set('soundOn', true);
        }
    },
    preload: function () {
        this.load.setBaseURL("assets/");
        this.load.image("BGPlay", "images/BGPlay.png");
        this.load.image("Title", "images/Title.png");
        this.load.image("ButtonPlay", "images/ButtonPlay.png");
        this.load.image("ButtonSoundOn", "images/ButtonSoundOn.png");
        this.load.image("ButtonSoundOff", "images/ButtonSoundOff.png");
        this.load.image("ButtonMusicOn", "images/ButtonMusicOn.png");
        this.load.image("ButtonMusicOff", "images/ButtonMusicOff.png");
        this.load.audio("snd_menu", "audio/music_menu.mp3");
        this.load.audio("snd_touchchooter", "audio/fx_touch.mp3");
    },
    create: function () {
        // --- 1. KOORDINAT ---
        X_POSITION = { 'LEFT' : 0, 'CENTER' : game.canvas.width / 2, 'RIGHT' : game.canvas.width };
        Y_POSITION = { 'TOP' : 0, 'CENTER' : game.canvas.height / 2, 'BOTTOM' : game.canvas.height };

        // --- 2. VISUAL ---
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPlay');
        this.add.image(X_POSITION.CENTER, Y_POSITION.TOP + 350, 'Title');
        var buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 150, 'ButtonPlay').setInteractive();

        // --- 3. PUSAT LOGIKA AUDIO (Mencegah Double & Hilang Refresh) ---
        // Cari dulu di manager global, jika belum ada baru buat instansinya
        this.bgMusic = this.sound.get('snd_menu');
        if (!this.bgMusic) {
            this.bgMusic = this.sound.add('snd_menu', { loop: true });
        }

        // Jalankan play secara default di latar belakang
        this.bgMusic.play();

        // Atur volume awal mengikuti status registry terbaru
        this.bgMusic.setVolume(this.registry.get('musicOn') ? 0.5 : 0);

        this.snd_touch = this.sound.get('snd_touchchooter');
        if (!this.snd_touch) {
            this.snd_touch = this.sound.add('snd_touchchooter');
        }

        // Fungsi pembuka gembok keamanan browser (Autoplay Policy)
        var unlockAudioContext = () => {
            if (this.sound.context && this.sound.context.state === 'suspended') {
                this.sound.context.resume().then(() => {
                    if (this.bgMusic) {
                        this.bgMusic.setVolume(this.registry.get('musicOn') ? 0.5 : 0);
                    }
                });
            }
        };

        // Pasang trigger sekali klik di seluruh layar menu
        this.input.once('pointerdown', unlockAudioContext);

        // --- 4. TOMBOL PLAY ---
        buttonPlay.on('pointerdown', () => {
    // Ubah menjadi hanya cek soundOn saja
    if (this.registry.get('soundOn')) {
        if (this.snd_touch) this.snd_touch.play();
    }
    
    if (this.bgMusic) this.bgMusic.setVolume(0);
    this.scene.start('scenePilihHero');
}, this);

        // --- 5. LOGIKA & TOMBOL SOUND ON/OFF (SFX) ---
        let currentSoundTexture = this.registry.get('soundOn') ? 'ButtonSoundOn' : 'ButtonSoundOff';
        this.btnSound = this.add.image(X_POSITION.RIGHT - 60, Y_POSITION.TOP + 60, currentSoundTexture).setInteractive().setScale(0.8);

        this.btnSound.on('pointerdown', function () {
            unlockAudioContext();

            let isSoundOn = !this.registry.get('soundOn');
            this.registry.set('soundOn', isSoundOn);
            this.btnSound.setTexture(isSoundOn ? 'ButtonSoundOn' : 'ButtonSoundOff');
            
            // Perbaikan: Selalu cek apakah sound baru saja dinyalakan
            // Jika user baru menyalakan sound, berikan feedback suara
            if (isSoundOn && this.snd_touch) {
                this.snd_touch.play();
            }
        }, this);
        // --- 6. LOGIKA & TOMBOL MUSIC ON/OFF (BGM) ---
        // --- 6. LOGIKA & TOMBOL MUSIC ON/OFF (BGM) ---
        let currentMusicTexture = this.registry.get('musicOn') ? 'ButtonMusicOn' : 'ButtonMusicOff';
        this.btnMusic = this.add.image(X_POSITION.RIGHT - 140, Y_POSITION.TOP + 60, currentMusicTexture).setInteractive().setScale(0.8);

        this.btnMusic.on('pointerdown', function () {
            unlockAudioContext();

            let isMusicOn = !this.registry.get('musicOn');
            this.registry.set('musicOn', isMusicOn);
            this.btnMusic.setTexture(isMusicOn ? 'ButtonMusicOn' : 'ButtonMusicOff');

            if (this.bgMusic) {
                this.bgMusic.setVolume(isMusicOn ? 0.5 : 0);
            }
            
            // Perbaikan: Tambahkan trigger suara touch agar terdengar saat tombol ini diklik
            if (this.registry.get('soundOn') && this.snd_touch) {
                this.snd_touch.play();
            }
        }, this);
    },
    update: function () {},
});