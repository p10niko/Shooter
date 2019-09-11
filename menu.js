var Menu = {
	
	preload: function() {
        //  We need this because the assets are on github pages
	    //  Remove the next 2 lines if running locally
	    game.load.baseURL = 'https://p10niko.github.io/Shooter/';
	    game.load.crossOrigin = 'p10niko';

        //loading the menu theme
		game.load.audio('menu_theme', 'assets/music/level3.ogg');
		
		game.load.image('background', 'assets/menu_back.jpg');
		
		game.load.bitmapFont('spacefont', 'assets/spacefont/font.png', 'assets/spacefont/font.fnt');

        game.load.image('levels', 'assets/button.png');
	 


	},

	create: function() {

		var button1;
		var button2;
		game.scale.setGameSize(800, 600);
		game.scale.pageAlignHorizontally = true;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		menuTheme= game.add.audio('menu_theme', 1, true);
		menuTheme.play();

		background = game.add.tileSprite(0, 0, 800, 600, 'background');

		titleText = game.add.bitmapText(game.world.centerX, 50, 'spacefont', 'To the edge of Cosmos', 60);
		titleText.anchor.set(0.5, 0.5);

		button1 = game.add.sprite(game.world.centerX, 200, 'levels');	
		button1.anchor.set(0.5, 0.5);
		level1Text = game.add.bitmapText(0, 0, 'spacefont', 'Level 1', 50);
		level1Text.anchor.set(0.5, 0.5);
		button1.addChild(level1Text);
		button1.inputEnabled = true;
		button1.input.useHandCursor = true;
		button1.events.onInputDown.add(level1, this);

		button2 = game.add.sprite(game.world.centerX, 350, 'levels');	
		button2.anchor.set(0.5, 0.5);
		level2Text = game.add.bitmapText(0, 0, 'spacefont', 'Level 2', 50);
		level2Text.anchor.set(0.5, 0.5);
		button2.addChild(level2Text);
		button2.inputEnabled = true;
		button2.input.useHandCursor = true;
		button2.events.onInputDown.add(level2, this);

		button3 = game.add.sprite(game.world.centerX, 500, 'levels');	
		button3.anchor.set(0.5, 0.5);
		level3Text = game.add.bitmapText(0, 0, 'spacefont', 'Credits', 50);
		level3Text.anchor.set(0.5, 0.5);
		button3.addChild(level3Text);
		button3.inputEnabled = true;
		button3.input.useHandCursor = true;
		button3.events.onInputDown.add(credits, this);

		function level1 () {
			menuTheme.stop();
			game.state.start('level1');
		}

		function level2() {
			menuTheme.stop();
			game.state.start('level2');
		}

		function credits() {
			menuTheme.stop();
			game.state.start('credits');
		}
    },
    

        
    
	
}