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
    },
    create: function () {
        //menambahkan backdrop atau latar untuk scene pilih pesawat her
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPilihPesawat');
        //menambahkan tombol menu
        var buttonMenu = this.add.image(50, 50, 'ButtonMenu');
        //menambahkan tombol next
        var buttonNext = this.add.image(X_POSITION.CENTER + 250, Y_POSITION.CENTER, 'ButtonNext');
        //menambahkan tombol previous
        var buttonPrevious = this.add.image(X_POSITION.CENTER - 250, Y_POSITION.CENTER, 'ButtonPrev');
        //menambahkan pesawat hero berdasarkan dengan hero yang sedang aktif
        var heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'Pesawat' + (currentHero + 1));
        heroShip.setScale(0.35);

        //membuat tombol menu bisa dikenai interaksi
        buttonMenu.setInteractive();
        //membuat tombol next bisa dikenai interaksi
        buttonNext.setInteractive();
        //membuat tombol previous bisa dikenai interaksi
        buttonPrevious.setInteractive();
        //membuat pesawat hero bisa dikenai interaksi
        heroShip.setInteractive();

        //event listener 'gameobjectover'
        this.input.on('gameobjectover', function (pointer, gameObject) {
            //melakukan cek jika game objek yang sedang terkena
            //listener 'gameobjectover' adalah button buttonMenu
            if (gameObject === buttonMenu) {
                buttonMenu.setTint(0x999999);
            }
            //melakukan cek jika game objek yang sedang terkena
            //listener 'gameobjectover' adalah button buttonNext
            if (gameObject === buttonNext) {
                buttonNext.setTint(0x999999);
            }
            //melakukan cek jika game objek yang sedang terkena
            //listener 'gameobjectover' adalah button buttonPrevious
            if (gameObject === buttonPrevious) {
                buttonPrevious.setTint(0x999999);
            }
            //melakukan cek jika game objek yang sedang terkena
            //listener 'gameobjectover' adalah pesawat heroShip
            if (gameObject === heroShip) {
                heroShip.setTint(0x999999);
            }
        }, this);

        //event listener 'gameobjectdown'
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if (gameObject === buttonMenu) {
                buttonMenu.setTint(0x666666);
            }
            if (gameObject === buttonNext) {
                buttonNext.setTint(0x666666);
            }
            if (gameObject === buttonPrevious) {
                buttonPrevious.setTint(0x666666);
            }
            if (gameObject === heroShip) {
                heroShip.setTint(0x666666);
            }
        }, this);

        //event listener 'gameobjectout'
        this.input.on('gameobjectout', function (pointer, gameObject) {
            //melakukan cek jika game objek yang sedang terkena
            //listener 'gameobjectout' adalah button buttonMenu
            if (gameObject === buttonMenu) {
                buttonMenu.setTint(0xffffff);
            }
            if (gameObject === buttonNext) {
                buttonNext.setTint(0xffffff);
            }
            if (gameObject === buttonPrevious) {
                buttonPrevious.setTint(0xffffff);
            }
            if (gameObject === heroShip) {
                heroShip.setTint(0xffffff);
            }

        }, this);

        //event listener 'gameobjectup'
        this.input.on('gameobjectup', function (pointer, gameObject) {
            if (gameObject === buttonMenu) {
                buttonMenu.setTint(0xffffff);
                this.scene.start("SceneMenu");
            }
            if (gameObject === buttonNext) {
                buttonNext.setTint(0xffffff);
                currentHero++;
                if (currentHero >= countHero) {
                    currentHero = 0;
                }
                heroShip.setTexture('Pesawat' + (currentHero + 1));
            }
            if (gameObject === buttonPrevious) {
                buttonPrevious.setTint(0xffffff);
                currentHero--;
                if (currentHero < 0) {
                    currentHero = countHero - 1;
                }
                heroShip.setTexture('Pesawat' + (currentHero + 1));
            }
            if (gameObject === heroShip) {
                heroShip.setTint(0xffffff);
                this.scene.start("scenePlay");
            }
        }, this);

    },
    update: function () {},
});