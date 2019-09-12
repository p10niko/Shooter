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
        game.load.image('laser-beam', 'assets/bullets/bullet.png');
        game.load.image('second_enemy_bullet', 'assets/bullets/bullet1.png');
        game.load.image('boss_bullet', 'assets/bullets/bullet2.png');

        //background music
        game.load.audio('level1background', 'assets/sounds/music/level1.ogg');
        game.load.audio('game_over_music', 'assets/sounds/music/death.ogg');
        game.load.audio('boss_music', 'assets/sounds/music/boss.ogg');
        game.load.audio('end_level_music', 'assets/sounds/music/start.ogg');


        //sound effects
        game.load.audio('laser', 'assets/sounds/effects/laser6.mp3');
        game.load.audio('laser2', 'assets/sounds/effects/laser2.mp3');
        game.load.audio('laser3', 'assets/sounds/effects/laser4.mp3');
        game.load.audio('laser_beam', 'assets/sounds/effects/laser_beam.mp3');
        game.load.audio('weapon_upgrade_sound', 'assets/sounds/effects/phaserUp6.mp3');
        game.load.audio('explosion', 'assets/sounds/effects/explosion.mp3');
        game.load.audio('explosion_player', 'assets/sounds/effects/explosion_player.mp3');
        game.load.audio('shields_down', 'assets/sounds/effects/lowDown.mp3');

        //items
        game.load.image('bullet_upgrade', 'assets/items/bold_silver.png');

        //Enemies
        game.load.image('first_wave_enemy', 'assets/enemies/enemy2.png');
        game.load.image('second_wave_enemy', 'assets/enemies/enemy3.png');
        game.load.image('boss', 'assets/enemies/boss.png');

        //visual effects
        game.load.spritesheet('explosion', '/assets/explode.png', 128, 128);

        //my custom font used here
        game.load.bitmapFont('spacefont', 'assets/spacefont/font.png', 'assets/spacefont/font.fnt');
        
    },

    create: function(){

        level = 1;

        game.scale.pageAlignHorizontally = true;

        levelbackgroundmusic = game.add.audio('level1background', 1, true);
        laser = game.add.audio('laser');
        laser2 = game.add.audio('laser2');
        laser3 = game.add.audio('laser3');
        laserBeamSound = game.add.audio('laser_beam');
        weaponUpgradeSound = game.add.audio('weapon_upgrade_sound');
        weaponUpgradeSound.volume = 4;
        explosionSound = game.add.audio('explosion');
        explosionPlayerSound = game.add.audio('explosion_player');
        shieldsDown = game.add.audio('shields_down');
        shieldsDown.volume = 5;
        gameOverMusic = game.add.audio('game_over_music');
        bossMusic = game.add.audio('boss_music', 1, true);
        endLevelMusic = game.add.audio('end_level_music', 1, false);

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

        //  Our beam group
        laserBeam = game.add.group();
        laserBeam.enableBody = true;
        laserBeam.physicsBodyType = Phaser.Physics.ARCADE;
        laserBeam.createMultiple(800, 'laser-beam');
        laserBeam.setAll('anchor.x', 0.5);
        laserBeam.setAll('anchor.y', 1);
        laserBeam.setAll('outOfBoundsKill', true);
        laserBeam.setAll('checkWorldBounds', true);

        //upgrade item group
        bulletUpgrade = game.add.group();
        bulletUpgrade.enableBody = true;
        bulletUpgrade.physicsBodyType = Phaser.Physics.ARCADE;
        bulletUpgrade.createMultiple(1, 'bullet_upgrade');
        bulletUpgrade.setAll('anchor.x', 0.5);
        bulletUpgrade.setAll('anchor.y', 0.5);
        bulletUpgrade.setAll('scale.x', 0.5);
        bulletUpgrade.setAll('scale.y', 0.5);
        bulletUpgrade.setAll('outOfBoundsKill', true);
        bulletUpgrade.setAll('checkWorldBounds', true);
        bulletUpgrade.forEach(function(item){ 
            item.body.setSize(20, 20);
        });
        

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

        //Second enemy
        secondEnemy = game.add.group();
        secondEnemy.enableBody = true;
        secondEnemy.physicsBodyType = Phaser.Physics.ARCADE;
        secondEnemy.createMultiple(30, 'second_wave_enemy');
        secondEnemy.setAll('anchor.x', 0.5);
        secondEnemy.setAll('anchor.y', 0.5);
        secondEnemy.setAll('scale.x', 0.5);
        secondEnemy.setAll('scale.y', 0.5);
        secondEnemy.setAll('angle', 180);
        secondEnemy.forEach(function(enemy){
            enemy.damageAmount = 20;
        });

         //  second wave enemy bullets
         secondEnemyBullets = game.add.group();
         secondEnemyBullets.enableBody = true;
         secondEnemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
         secondEnemyBullets.createMultiple(30, 'second_enemy_bullet');
         secondEnemyBullets.setAll('alpha', 0.9);
         secondEnemyBullets.setAll('anchor.x', 0.5);
         secondEnemyBullets.setAll('anchor.y', 0.5);
         secondEnemyBullets.setAll('outOfBoundsKill', true);
         secondEnemyBullets.setAll('checkWorldBounds', true);
         secondEnemyBullets.forEach(function(enemyBullets){
             enemyBullets.body.setSize(20, 20);
         });

        bossBullets = game.add.group();
        bossBullets.enableBody = true;
        bossBullets.physicsBodyType = Phaser.Physics.ARCADE;
        bossBullets.createMultiple(30, 'boss_bullet');
        bossBullets.setAll('alpha', 0.9);
        bossBullets.setAll('anchor.x', 0.5);
        bossBullets.setAll('anchor.y', 0.5);
        bossBullets.setAll('outOfBoundsKill', true);
        bossBullets.setAll('checkWorldBounds', true);
        bossBullets.forEach(function(bossBullets){
            bossBullets.body.setSize(20, 20);
        });

         //  The boss
        boss = game.add.sprite(0, 0, 'boss');
        boss.exists = false;
        boss.alive = false;
        boss.anchor.setTo(0.5, 0.5);
        boss.damageAmount = 40;
        boss.angle = 180;
        boss.scale.x = 0.5;
        boss.scale.y = 0.5;
        game.physics.enable(boss, Phaser.Physics.ARCADE);
        boss.body.maxVelocity.setTo(100, 80);
        boss.dying = false;

        boss.finishOff = function() {
            if (!boss.dying) {
                boss.dying = true;
                bossDeath.x = boss.x;
                bossDeath.y = boss.y;
                bossDeath.start(false, 1000, 50, 20);
                //  kill boss after explotions
                game.time.events.add(1000, function(){
                    var explosion = explosions.getFirstExists(false);
                    var beforeScaleX = explosions.scale.x;
                    var beforeScaleY = explosions.scale.y;
                    var beforeAlpha = explosions.alpha;
                    explosion.reset(boss.body.x + boss.body.halfWidth, boss.body.y + boss.body.halfHeight);
                    explosion.alpha = 0.4;
                    explosion.scale.x = 3;
                    explosion.scale.y = 3;
                    var animation = explosion.play('explosion', 30, false, true);
                    animation.onComplete.addOnce(function(){
                        explosion.scale.x = beforeScaleX;
                        explosion.scale.y = beforeScaleY;
                        explosion.alpha = beforeAlpha;
                    });
                    boss.kill();
                    booster.kill();
                    boss.dying = false;
                    bossDeath.on = false;
                });
                //  reset pacing for other enemies
                firstEnemySpacing = 2500;
                secondEnemySpacing = 1000;

                bossBullets.callAll('kill');
                firstEnemy.callAll('kill');
                secondEnemy.callAll('kill');
                
                game.time.events.add(4000, level2);
            }
        };

        boss.update = function() {
            if (!boss.alive) {
                booster.kill();
                return;
            }

            //  Fire
            bossBullet = bossBullets.getFirstExists(false);
            if (bossBullet &&
                                
                game.time.now > 150) {
                this.lastShot = game.time.now;
                this.bullets--;
                bossBullet.reset(this.x, this.y - this.height / 3);
                bossBullet.damageAmount = 2;
                var angle = game.physics.arcade.moveToObject(bossBullet, player, 300);
                bossBullet.angle = game.math.radToDeg(angle);
            }
            
            if (boss.y > game.height / 2) {
                boss.body.acceleration.y = -100;
            }
            if (boss.y < game.height / 2) {
                boss.body.acceleration.y = 100;
            }
            
            if (boss.x > player.x + 200) {
                boss.body.acceleration.x = -50;
            } else if (boss.x < player.x + 400) {
                boss.body.acceleration.x = 300;
            } else {
                boss.body.acceleration.x = 0;
            }
                            
            //  Squish and rotate boss for illusion of "banking"
            var bank = boss.body.velocity.y / MAXSPEED;
            boss.scale.x = 0.6 - Math.abs(bank) / 3;
            boss.angle = 270 - bank * 20;
                            
            booster.x = boss.x + 100;
            booster.y = boss.y;
            booster.setAll('angle', 90);
                                                    
        }
        //  boss's boosters
        booster = game.add.emitter(boss.body.x, boss.body.y - boss.height / 2);
        booster.width = 0;
        booster.makeParticles('second_enemy_bullet');
        booster.forEach(function(p){
        p.crop({x: 120, y: 0, width: 45, height: 50});

        //  clever way of making 2 exhaust trails by shifing particles randomly left or right
        p.anchor.x = game.rnd.pick([1,-1]) * 0.95 + 0.5;
        p.anchor.y = 0.75;
        });
        booster.setXSpeed(0, 0);
        booster.setRotation(0,0);
        booster.setYSpeed(-30, -50);
        booster.gravity = 0;
        booster.setAlpha(1, 0.1, 400);
        booster.setScale(0.3, 0, 0.7, 0, 5000, Phaser.Easing.Quadratic.Out);
        boss.bringToTop();

        //  Big explosion for boss
        bossDeath = game.add.emitter(boss.x, boss.y);
        bossDeath.width = boss.width / 2;
        bossDeath.height = boss.height / 2;
        bossDeath.makeParticles('explosion', [0,1,2,3,4,5,6,7], 20);
        bossDeath.setAlpha(0.9, 0, 900);
        bossDeath.setScale(0.3, 1.0, 0.3, 1.0, 1000, Phaser.Easing.Quintic.Out);

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

        if(bossLaunched && boss.health < 5){
            bossMusic.stop();
            boss.finishOff();
        }

        if (!bossLaunched && score > 20000) {
            firstEnemySpacing = 5000;
            secondEnemySpacing = 12000;
            //  dramatic pause before boss
            levelbackgroundmusic.stop();
			game.time.events.add(2000, function(){
				bossLaunched= true;
                launchBoss();
                bossMusic.play();
            });
            
		}

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
        game.physics.arcade.overlap(player, bulletUpgrade, weaponUpgrade, null, this);
        game.physics.arcade.overlap(player, firstEnemy, shipCollide, null, this);
        game.physics.arcade.overlap(player, secondEnemy, shipCollide, null, this);
        game.physics.arcade.overlap(firstEnemy, bullets, hitEnemy, null, this);
        game.physics.arcade.overlap(secondEnemy, bullets, hitEnemy, null, this);
        game.physics.arcade.overlap(firstEnemy, laserBeam, hitEnemy, null, this);
        game.physics.arcade.overlap(secondEnemy, laserBeam, hitEnemy, null, this);
        game.physics.arcade.overlap(secondEnemyBullets, player, enemyHitsPlayer, null, this);

        game.physics.arcade.overlap(boss, laserBeam, hitEnemy, null, this);
        game.physics.arcade.overlap(boss, bullets, hitEnemy, null, this);
        game.physics.arcade.overlap(bossBullets, player, enemyHitsPlayer, null, this);

        
        if (! player.alive && gameOver.visible === false) {
            levelbackgroundmusic.stop();
            bossMusic.stop();
            explosionPlayerSound.play();
            gameOverMusic.play();
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
        if (!secondEnemyLaunched && score > 700) {
            secondEnemyLaunched = true;
            launchSecondEnemy();
            //  Slow green enemies down now that there are other enemies
            firstEnemySpacing *= 3;
        }
    }
}