var sceneGameOver = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { key: "sceneGameOver" });
    },
    init: function (data) {
        this.finalScore = data.score || 0;
        this.highScore = localStorage.getItem("high_score") || 0;

        if (this.finalScore > this.highScore) {
            this.highScore = this.finalScore;
            localStorage.setItem("high_score", this.highScore);
        }
    },
    preload: function () {
        this.load.setBaseURL("assets/");
        this.load.image("BGPlay", "images/BGPlay.png");
        this.load.image("ButtonPlay", "images/ButtonPlay.png");
        this.load.image("ButtonMenu", "images/ButtonMenu.png");
        this.load.audio("snd_gameover", "audio/music_gameover.mp3");
        this.load.audio("snd_touchchooter", "audio/fx_touch.mp3");
    },
    create: function () {
        this.sound.stopAll();
    
    // Inisialisasi suara touch
    this.snd_touch = this.sound.add('snd_touchchooter');
    
    // Putar musik game over
    if (this.registry.get('musicOn') === true) {
        this.sound.play("snd_gameover", { loop: false, volume: 0.5 });
    }

    // --- 2. FUNGSI HELPER SUARA ---
    const playClick = () => {
        if (this.registry.get('soundOn')) {
            // Pastikan audio konteks berjalan
            if (this.sound.context.state === 'suspended') {
                this.sound.context.resume();
            }
            this.snd_touch.play();
        }
    };
        // Tampilkan Tampilan Visual Game Over
        let bg = this.add.image(game.canvas.width / 2, game.canvas.height / 2, "BGPlay");
        bg.setDisplaySize(game.canvas.width, game.canvas.height);

        let txtGameOver = this.add.text(game.canvas.width / 2, game.canvas.height / 2 - 150, 'Game Over', {
            fontFamily: 'Arial Black, Arial', fontSize: '75px', color: '#ff0000', stroke: '#ffffff', strokeThickness: 4
        }).setOrigin(0.5);

        let txtHighScore = this.add.text(game.canvas.width / 2, game.canvas.height / 2 - 40, 'High Score: ' + this.highScore, {
            fontFamily: 'Arial Black, Arial', fontSize: '36px', color: '#ffcc00', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        let txtScore = this.add.text(game.canvas.width / 2, game.canvas.height / 2 + 30, 'Score: ' + this.finalScore, {
            fontFamily: 'Arial Black, Arial', fontSize: '36px', color: '#ffcc00', stroke: '#000000', strokeThickness: 3
        }).setOrigin(0.5);

        let btnReplay = this.add.image(game.canvas.width / 2, game.canvas.height / 2 + 150, "ButtonPlay").setScale(0.8).setInteractive();
        let btnMenu = this.add.image(game.canvas.width / 2, game.canvas.height / 2 + 300, "ButtonMenu").setScale(0.7).setInteractive();

    // Event Replay

        btnReplay.on('pointerover', () => { btnReplay.setScale(0.9); });
        btnReplay.on('pointerout', () => { btnReplay.setScale(0.8); });
        btnMenu.on('pointerover', () => { btnMenu.setScale(0.8); });
        btnMenu.on('pointerout', () => { btnMenu.setScale(0.7); });

        // Event Replay
    btnReplay.on('pointerdown', () => {
        playClick(); // Mainkan suara saat klik
        this.sound.stopByKey("snd_gameover"); 
        this.scene.start("scenePlay");
    });

    // Event Menu
    btnMenu.on('pointerdown', () => {
        playClick(); // Mainkan suara saat klik
        this.sound.stopByKey("snd_gameover");
        this.scene.start("SceneMenu");
    });
    },
    update: function () {},
});