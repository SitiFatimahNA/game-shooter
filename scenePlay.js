var scenePlay = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { key: "scenePlay" });
    },
    init: function () {
        // --- PERBAIKAN UTAMA: Mengambil nilai status suara langsung dari registry Menu ---
        // Jika status di menu OFF, maka di sini otomatis akan bernilai false
        this.soundOn = this.registry.get('soundOn');
        this.musicOn = this.registry.get('musicOn');
    },
    preload: function () {
        this.load.setBaseURL("assets/");
        this.load.image("BG1", "images/BG1.png");
        this.load.image("BG2", "images/BG2.png");
        this.load.image("BG3", "images/BG3.png");
        this.load.image("GroundTransisi", "images/Transisi.png");
        this.load.image("Pesawat1", "images/Pesawat1.png");
        this.load.image("Pesawat2", "images/Pesawat2.png");
        this.load.image("Peluru", "images/Peluru.png");
        this.load.image("EfekLedakan", "images/EfekLedakan.png");
        this.load.image("cloud", "images/cloud.png");
        this.load.image("Musuh1", "images/Musuh1.png");
        this.load.image("Musuh2", "images/Musuh2.png");
        this.load.image("Musuh3", "images/Musuh3.png");
        this.load.image("MusuhBos", "images/MusuhBos.png");
        this.load.audio("snd_shoot", "audio/music_menu.mp3");
        this.load.audio("snd_explode", "audio/fx_explode.mp3");
        this.load.audio("snd_play", "audio/music_play.mp3");
    },
    create: function () {
        // Inisialisasi audio ke dalam scene
        this.snd_shoot = this.sound.add('snd_shoot');
        this.snd_explode = this.sound.add('snd_explode');
        this.snd_play = this.sound.add('snd_play', { loop: true, volume: 0.5 });

        // PERBAIKAN: Hanya mainkan lagu game jika musik utama bernilai true (ON)
        if (this.registry.get('musicOn') === true) {
            this.snd_play.play();
        }

        // Menentukan indeks background secara acak
        this.lastBgIndex = Phaser.Math.Between(1,3);
        this.bgBottomSize = { 'width':768, 'height':1664 };
        this.arrBgBottom = [];

        this.createBGBottom = function(xPos, yPos) {
            let bgBottom = this.add.image(xPos, yPos, 'BG' + this.lastBgIndex);
            bgBottom.setData('kecepatan', 3);
            bgBottom.setDepth(1);
            bgBottom.flipX = Phaser.Math.Between(0,1);
            this.arrBgBottom.push(bgBottom);

            let newBgIndex = Phaser.Math.Between(1,3);
            if(newBgIndex != this.lastBgIndex) {
                let bgBottomAddition = this.add.image(xPos, yPos - this.bgBottomSize.height/2, 'GroundTransisi');
                bgBottomAddition.setData('kecepatan', 3);
                bgBottomAddition.setData('tambahan',true);
                bgBottomAddition.setDepth(2);
                bgBottomAddition.flipX = Phaser.Math.Between(0,1);
                this.arrBgBottom.push(bgBottomAddition);
            }
            this.lastBgIndex = newBgIndex;
        };

        this.addBgBottom = function() {
            if(this.arrBgBottom.length > 0) {
                let lastBG = this.arrBgBottom[this.arrBgBottom.length - 1];
                if(lastBG.getData('tambahan')){
                    lastBG = this.arrBgBottom[this.arrBgBottom.length - 2];
                }
                this.createBGBottom(game.canvas.width/2, lastBG.y - this.bgBottomSize.height);
            }else{
                this.createBGBottom(game.canvas.width/2, game.canvas.height - this.bgBottomSize.height/2);
            }
        };

        this.addBgBottom();
        this.addBgBottom();
        this.addBgBottom();

        // Background lapisan atas (Awan)
        this.bgCloudSize = {'width': 768, 'height':1962};
        this.arrBgTop = [];

        this.createBGTop = function(xPos, yPos) {
            var bgTop = this.add.image(xPos, yPos, 'cloud');
            bgTop.setData('kecepatan', 6);
            bgTop.setDepth(5);
            bgTop.flipX = Phaser.Math.Between(0,1);
            bgTop.setAlpha(Phaser.Math.Between(4,7)/10);
            this.arrBgTop.push(bgTop);
        };

        this.addBgTop = function() {
            if(this.arrBgTop.length > 0) {
                let lastBG = this.arrBgTop[this.arrBgTop.length - 1];
                this.createBGTop(game.canvas.width/2, lastBG.y - this.bgCloudSize.height * Phaser.Math.Between(1,4));
            }else{
                this.createBGTop(game.canvas.width/2, - this.bgCloudSize.height);
            }
        };

        this.addBgTop();   

        // Variabel & Label Skor
        this.scoreValue = 0;
        this.scoreLabel = this.add.text(X_POSITION.CENTER, Y_POSITION.TOP + 80, '0', { 
            fontFamily: 'Verdana, Arial',
            fontSize: '70px',
            color: '#ffffff',
            stroke: '#5c5c5c',
            strokeThickness: 2,
        }).setOrigin(0.5).setDepth(100);

        // Menambahkan pesawat hero (currentHero disesuaikan dengan pilihan)
        this.heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.BOTTOM - 200, 'Pesawat' + (currentHero + 1));
        this.heroShip.setDepth(4);
        this.heroShip.setScale(0.35);

        this.cursorKeyListener = this.input.keyboard.createCursorKeys();

        // Mengaktifkan pergerakan mouse / touch
        this.input.on('pointermove', function (pointer) {
            let movementX = this.heroShip.x;
            let movementY = this.heroShip.y;

            if(pointer.x > 70 && pointer.x < (X_POSITION.RIGHT - 70)){
                movementX = pointer.x;
            } else {
                movementX = (pointer.x <= 70) ? 70 : X_POSITION.RIGHT - 70;
            }

            if(pointer.y > 70 && pointer.y < (Y_POSITION.BOTTOM - 70)){
                movementY = pointer.y;
            } else {
                movementY = (pointer.y <= 70) ? 70 : Y_POSITION.BOTTOM - 70;
            }

            let a = this.heroShip.x - movementX;
            let b = this.heroShip.y - movementY;
            let durationToMove = Math.sqrt(a*a + b*b) * 0.8;

            this.tweens.add({
                targets: this.heroShip,
                x: movementX,
                y: movementY,
                duration: durationToMove,
                overwrite: 'auto'
            });
        }, this);

        // Titik Pola Gerakan Musuh
        let pointA = [new Phaser.Math.Vector2(-200, 100), new Phaser.Math.Vector2(250, 200), new Phaser.Math.Vector2(200,(Y_POSITION.BOTTOM + 200)/2), new Phaser.Math.Vector2(200, Y_POSITION.BOTTOM + 200 )];
        let pointB = [new Phaser.Math.Vector2(900, 100), new Phaser.Math.Vector2(550, 200), new Phaser.Math.Vector2(500,(Y_POSITION.BOTTOM + 200)/2), new Phaser.Math.Vector2(500, Y_POSITION.BOTTOM + 200 )];
        let pointC = [new Phaser.Math.Vector2(900, 100), new Phaser.Math.Vector2(550, 200), new Phaser.Math.Vector2(400,(Y_POSITION.BOTTOM + 200)/2), new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200 )];
        let pointD = [new Phaser.Math.Vector2(-200, 100), new Phaser.Math.Vector2(550, 200), new Phaser.Math.Vector2(650,(Y_POSITION.BOTTOM + 200)/2), new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200 )];

        var points = [pointA, pointB, pointC, pointD];
        this.arrEnemies = []; 

        // Class Template Enemy
        var Enemy = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize: function Enemy(scene, idxPath) {
                Phaser.GameObjects.Image.call(this, scene);
                this.setTexture('Musuh' + Phaser.Math.Between(1,3));
                this.setDepth(4);
                this.setScale(0.35);
                this.curve = new Phaser.Curves.Spline(points[idxPath]);
                this.path = {t:0, vec: new Phaser.Math.Vector2()};
                scene.tweens.add({
                    targets: this.path,
                    t: 1,
                    duration: 3000,
                    onComplete: () => { this.setActive(false); }
                });
            }, 
            move: function() {
                this.curve.getPoint(this.path.t, this.path.vec);
                this.x = this.path.vec.x;
                this.y = this.path.vec.y;
            }
        });

        // Spawner Musuh (Setiap 250ms)
        this.time.addEvent({delay:250, callback: function() {
            if(this.arrEnemies.length < 3) {
                this.arrEnemies.push(this.children.add(new Enemy(this, Phaser.Math.Between(0, points.length - 1))));
            }
        }, callbackScope: this, loop: true});

        // Class Template Bullet
        var Bullet = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize: function Bullet(scene, x, y) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Peluru');
                this.setDepth(3);
                this.setPosition(x, y);
                this.setScale(0.5);
                this.speed = Phaser.Math.GetSpeed(20000, 1);
            },
            move: function() {
                this.y -= this.speed;
                if(this.y < -50){ this.setActive(false); }
            }
        });
        this.arrBullets = [];

        // Spawner Peluru (Setiap 250ms)
        this.time.addEvent({delay:250, callback: function() {
            this.arrBullets.push(this.children.add(new Bullet(this, this.heroShip.x, this.heroShip.y - 30)));
            // PERBAIKAN: Hanya bunyikan laser jika soundOn bernilai true (ON)
            if (this.registry.get('soundOn') === true) {
                this.snd_shoot.play();
            }
        }, callbackScope: this, loop: true});

        // Partikel Ledakan
        let partikelExplode = this.add.particles('EfekLedakan').setDepth(4);
        this.emiterExplode1 = partikelExplode.createEmitter({
            speed: {min: -800, max: 800},
            angle: {min: 0, max: 360},
            scale: {start: 0.8, end: 0},
            blendMode: 'SCREEN',
            lifespan: 200,
            tint: 0xffa500,
        }).setPosition(-100, -100);
        this.emiterExplode1.explode();
    }, 

    update: function () {
        // Pergerakan Background Lapisan Bawah
        for(let i = this.arrBgBottom.length - 1; i >= 0; i--) {
            this.arrBgBottom[i].y += this.arrBgBottom[i].getData('kecepatan');
            if(this.arrBgBottom[i].y >= game.canvas.height + this.bgBottomSize.height/2) {
                this.addBgBottom();
                this.arrBgBottom[i].destroy();
                this.arrBgBottom.splice(i,1);
            }
        }
        // Pergerakan Background Lapisan Atas (Awan)
        for(let i = this.arrBgTop.length - 1; i >= 0; i--) {
            this.arrBgTop[i].y += this.arrBgTop[i].getData('kecepatan');
            if(this.arrBgTop[i].y >= game.canvas.height + this.bgCloudSize.height/2) {
                this.arrBgTop[i].destroy();
                this.arrBgTop.splice(i,1);
                this.addBgTop();
            }
        }

        // Input Keyboard Bergerak Manual
        if(this.cursorKeyListener.left.isDown && this.heroShip.x > 70) { this.heroShip.x -= 12; }
        if(this.cursorKeyListener.right.isDown && this.heroShip.x < (X_POSITION.RIGHT - 70)) { this.heroShip.x += 12; }
        if(this.cursorKeyListener.up.isDown && this.heroShip.y > 70) { this.heroShip.y -= 12; }
        if(this.cursorKeyListener.down.isDown && this.heroShip.y < (Y_POSITION.BOTTOM - 70)) { this.heroShip.y += 12; }

        // Menggerakkan Musuh
        for(let i = 0; i < this.arrEnemies.length; i++) { this.arrEnemies[i].move(); }

        // --- PERBAIKAN LOGIKA: Manajemen Memori Pembersihan Musuh Mati (Hitung Mundur) ---
        for(let i = this.arrEnemies.length - 1; i >= 0; i--) {
            if(!this.arrEnemies[i].active) {
                this.arrEnemies[i].destroy();
                this.arrEnemies.splice(i,1);
            }
        }

        // Menggerakkan Peluru
        for (let i=0; i<this.arrBullets.length; i++) { this.arrBullets[i].move(); }

        // --- PERBAIKAN LOGIKA: Manajemen Memori Pembersihan Peluru Hangus (Hitung Mundur) ---
        for (let i = this.arrBullets.length - 1; i >= 0; i--) {
            if (!this.arrBullets[i].active) {
                this.arrBullets[i].destroy();
                this.arrBullets.splice(i,1);
            }
        }

        // Deteksi Tabrakan Fisik Game
        for (let i = this.arrEnemies.length - 1; i >= 0; i--) {
            if (!this.arrEnemies[i] || !this.arrEnemies[i].active) continue;

            // Logika Game Over (Hero Tabrak Musuh)
            if (Phaser.Geom.Intersects.RectangleToRectangle(this.heroShip.getBounds(), this.arrEnemies[i].getBounds())) {
                this.snd_play.stop(); 
                
                // Hanya putar SFX ledakan jika soundOn bernilai true (ON)
                if (this.registry.get('soundOn') === true) {
                this.snd_shoot.play();
            }
                
                this.scene.start("sceneGameOver", { score: this.scoreValue });
                return;
            }
        
            // Logika Tembakan (Peluru Kena Musuh)
            for(let j = this.arrBullets.length - 1; j >= 0; j--) {
                if (!this.arrBullets[j] || !this.arrBullets[j].active) continue;
                
                if(this.arrEnemies[i].getBounds().contains(this.arrBullets[j].x, this.arrBullets[j].y)) {
                    this.arrEnemies[i].setActive(false);
                    this.arrBullets[j].setActive(false);
                    this.scoreValue++;
                    this.scoreLabel.setText(this.scoreValue);

                    this.emiterExplode1.setPosition(this.arrBullets[j].x, this.arrBullets[j].y);
                    this.emiterExplode1.explode();
                    
                    // Hanya putar SFX ledakan musuh jika soundOn bernilai true (ON)
                    if (this.registry.get('soundOn') === true) {
                this.snd_shoot.play();
            }
                    break;
                }
            }
        }
    },
});