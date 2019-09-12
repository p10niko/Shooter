var Credits = {
	preload: function(){
        game.load.audio('credits_back_music', 'assets/sounds/music/level2.ogg');
	},

	create: function(){ 
		
		creditsTheme = game.add.audio('credits_back_music', 1, true);
		creditsTheme.play();
		game.stage.backgroundColor = '#000000';
		game.scale.setGameSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
		end1 = game.add.bitmapText(250, 800, 'spacefont', 'Thank you for playing', 40);
		end2 = game.add.bitmapText(250, 1000, 'spacefont', 'CREDITS', 30);
		end3 = game.add.bitmapText(250, 1200, 'spacefont', 'Thanks to all those guys, creating free assets', 25);
		end4 = game.add.bitmapText(250, 1400, 'spacefont', 'All the links to them are in my report', 25);
		end5 = game.add.bitmapText(250, 1600, 'spacefont', 'I hope you liked it', 25);
		end6 = game.add.bitmapText(250, 1800, 'spacefont' , 'www.freesoundeffects.com', 25);
		end7 = game.add.bitmapText(250, 2000, 'spacefont', 'www.freesound.org', 25);
		end8 = game.add.bitmapText(250, 2200,'spacefont', 'www.opengameart.org', 25);
		end9 = game.add.bitmapText(250, 2400,'spacefont', 'Thank you',25);
		end10 = game.add.bitmapText(250, 2600,'spacefont', 'Play again', 25);

		game.time.events.add(20000, menu);
},
	update: function(){

		end1.position.y = end1.position.y-2;
		end2.position.y = end2.position.y-2;
		end3.position.y = end3.position.y-2;
		end4.position.y = end4.position.y-2;
		end5.position.y = end5.position.y-2;
		end6.position.y = end6.position.y-2;
		end7.position.y = end7.position.y-2;
		end8.position.y = end8.position.y-2;
		end9.position.y = end9.position.y-2;
		end10.position.y = end10.position.y-2
	}

}