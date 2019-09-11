var Level1 = {

	preload: function(){

        //  We need this because the assets are on github pages
        //  Remove the next 2 lines if running locally
        game.load.baseURL = 'https://p10niko.github.io/Shooter/';
        game.load.crossOrigin = 'p10niko';

        //loading background "Starfield"
        game.load.image('starfield', 'assets/starfield.png');

        //loading ship
        game.load.image('ship', 'assets/ship.png');
        
        //loading bullets
        game.load.image('bullet', 'assets/bullets/bullet.png');

        //background music
        game.load.audio('level1background', 'assets/sounds/music/level1.ogg');

        //sound effects
        game.load.audio('laser', 'assets/sounds/effects/laser6.mp3');
        game.load.audio('explosion', 'assets/sounds/effects/explosion.mp3');
        game.load.audio('explosion_player', 'assets/sounds/effects/explosion_player.mp3');

        //Enemies
        game.load.image('first_wave_enemy', '/assets/enemies/enemy2.png');

        //visual effects
        game.load.spritesheet('explosion', '/assets/explode.png', 128, 128);

        //Need to create a new font
        game.load.bitmapFont('spacefont', '/assets/spacefont/spacefont.png', '/assets/spacefont/spacefont.xml');
        
    },

    create: function(){

        level = 1;

        game.scale.pageAlignHorizontally = true;

        levelbackgroundmusic = game.add.audio('level1background', 1, true);
        laser = game.add.audio('laser');
        explosionSound = game.add.audio('explosion');
        explosionPlayerSound = game.add.audio('explosion_player');

         //starting the background music
         levelbackgroundmusic.play();
                
        //  The scrolling starfield background
        starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

        //  Our bullet group
        bullets = game.add.group();
        bullets.enableBody = true; 
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);
        

        //  The hero!
        player = game.add.sprite(100, game.height / 2, 'ship');
        player.health = 100;
        player.weaponLevel = 1;
        player.anchor.setTo(0.5, 0.5);
        game.physics.enable(player, Phaser.Physics.ARCADE);
        player.body.maxVelocity.setTo(MAXSPEED, MAXSPEED);
        player.body.drag.setTo(DRAG, DRAG);
        player.events.onKilled.add(function(){
            shipTrail.kill();
        });


        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  Add an emitter for the ship's trail
        shipTrail = game.add.emitter(player.x - 20, player.y, 400);
        shipTrail.height = 10;
        shipTrail.makeParticles('bullet');
        shipTrail.setYSpeed(20, -20);
        shipTrail.setXSpeed(-140, -120);
        shipTrail.setRotation(50, -50);
        shipTrail.setAlpha(1, 0.01, 800);
        shipTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000,
                Phaser.Easing.Quintic.Out);
        shipTrail.start(false, 5000, 10);

        //  An explosion pool
        explosions = game.add.group();
        explosions.enableBody = true;
        explosions.physicsBodyType = Phaser.Physics.ARCADE;
        explosions.createMultiple(300, 'explosion');
        explosions.setAll('anchor.x', 0.5);
        explosions.setAll('anchor.y', 0.5);
        explosions.forEach( function(explosion) {
            explosion.animations.add('explosion');
        });

        //  Big explosion
        playerDeath = game.add.emitter(player.x, player.y);
        playerDeath.width = 50;
        playerDeath.height = 50;
        playerDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 10);
        playerDeath.setAlpha(0.9, 0, 800);
        playerDeath.setScale(0.1, 0.6, 0.1, 0.6, 1000, Phaser.Easing.Quintic.Out);

        //Enemy1
        firstEnemy = game.add.group();
        firstEnemy.enableBody = true;
        firstEnemy.physicsBodyType = Phaser.Physics.ARCADE;
        firstEnemy.createMultiple(10, 'first_wave_enemy');
        firstEnemy.setAll('anchor.x', 0.5);
        firstEnemy.setAll('anchor.y', 0.5);
        firstEnemy.setAll('scale.x', 0.5);
        firstEnemy.setAll('scale.y', 0.5);
        firstEnemy.setAll('angle', 0);
        firstEnemy.setAll('outOfBoundsKill', true);
        firstEnemy.setAll('checkWorldBounds', true);
        firstEnemy.forEach(function(enemy){
            addEnemyEmitterTrail(enemy);
                enemy.damageAmount = 10;
                enemy.events.onKilled.add(function(){
                enemy.trail.kill();
            });
        });

        //Launching the first enemy
        game.time.events.add(1000, launchFirstEnemy);

         //  Shields stat
         shields = game.add.bitmapText(game.world.width - 250, 10, 'spacefont', '' + player.health +'%', 35);
         shields.render = function () {
             shields.text = 'Shields: ' + Math.max(player.health, 0) +'%';
         };
         shields.render();
 
         //  Score
         scoreText = game.add.bitmapText(10, 10, 'spacefont', '', 35);
         scoreText.render = function () {
             scoreText.text = 'Score: ' + score;
         };
         scoreText.render();

         //  Game over text
        gameOver = game.add.bitmapText(game.world.centerX, game.world.centerY, 'spacefont', 'GAME OVER!', 100);
        gameOver.x = gameOver.x - gameOver.textWidth / 2;
        gameOver.y = gameOver.y - gameOver.textHeight / 3;
        gameOver.visible = false;
       
    },

    update: function() {


        //  Scroll the background
        starfield.tilePosition.x -= 2;

        //  Reset the player, then check for movement keys
        player.body.acceleration.y = 0;
        player.body.acceleration.x = 0;
        if (cursors.up.isDown) {
            player.body.acceleration.y = -ACCLERATION;
        } else if (cursors.down.isDown) {
            player.body.acceleration.y = ACCLERATION;
        } else if (cursors.left.isDown) {
            player.body.acceleration.x = -ACCLERATION;
        } else if (cursors.right.isDown) {
            player.body.acceleration.x = ACCLERATION;
        }

        //  Stop at screen edges
        if (player.x > game.width - 30) {
            player.x = game.width - 30;
            player.body.acceleration.x = 0;
        }
        if (player.x < 30) {
            player.x = 30;
            player.body.acceleration.x = 0;
        }
        if (player.y > game.height - 15) {
            player.y = game.height - 15;
            player.body.acceleration.y = 0;
        }
        if (player.y < 15) {
            player.y = 15;
            player.body.acceleration.y = 0;
        }

        //  Fire bullet
        if (player.alive && fireButton.isDown) {
            fireBullet();
        }

        //  Keep the shipTrail lined up with the ship
        shipTrail.y = player.y;
        shipTrail.x = player.x - 20;

        //collision check
        game.physics.arcade.overlap(player, firstEnemy, shipCollide, null, this);
        game.physics.arcade.overlap(firstEnemy, bullets, hitEnemy, null, this);

        
        if (! player.alive && gameOver.visible === false) {
            explosionPlayerSound.play();
            gameOver.visible = true;
            gameOver.alpha = 0;
            var fadeInGameOver = game.add.tween(gameOver);
            fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
            fadeInGameOver.onComplete.add(setResetHandlers);
            fadeInGameOver.start();
            function setResetHandlers() {
                //  The "click to restart" handler
                tapRestart = game.input.onTap.addOnce(_restart,this);
                spaceRestart = fireButton.onDown.addOnce(_restart,this);
                function _restart() {
                    tapRestart.detach();
                    spaceRestart.detach();
                    restart();
                }
            }
        }
    }
}