/* eslint-disable */

import 'phaser';
import domManip from '../components/domManip';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.dom = domManip();

    this.id = 'ylaQJIceB2zpscPcvxIj';
    this.gameSpeed = 10;
    const { height, width } = this.game.config;
    this.isGameRunning = false;
    this.respawnTime = 0;
    this.score = 0;

    this.jumpSound = this.sound.add('jump', { volume: 0.2 });
    this.hitSound = this.sound.add('hit', { volume: 0.2 });
    this.reachSound = this.sound.add('reach', { volume: 0.2 });

    // trigger for starting game
    this.startTrigger = this.physics.add.sprite(0, 200).setOrigin(0, 1).setImmovable();

    this.ground = this.add.tileSprite(0, height, 88, 56, 'ground').setOrigin(0, 1);
    this.man = this.physics.add.sprite(0, height, 'man-idle')
      .setOrigin(0, 1)
      .setCollideWorldBounds(true)
      .setBodySize(44, 244)
      .setDepth(1)
      .setGravityY(5000);

    this.scoreText = this.add
      .text(width, 0, '00000', { fill: '#535353', font: '900 20px Courier', resolution: 5 })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.highScoreText = this.add
      .text(0, 0, '00000', { fill: '#535353', font: '900 20px Courier', resolution: 5 })
      .setOrigin(1, 0)
      .setAlpha(0);

    this.gameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(0);
    this.gameOverText = this.add.image(0, 0, 'game-over');
    this.restart = this.add.image(0, 80, 'restart').setInteractive();

    this.environment = this.add.group();
    this.environment.addMultiple([
      this.add.image(width / 2, 300, 'cloud'),
      this.add.image(width - 80, 350, 'cloud'),
      this.add.image((width / 1.3), 400, 'cloud'),
    ]);

    this.environment.setAlpha(0);

    this.gameOverScreen.add([
      this.gameOverText, this.restart,
    ]);

    this.obsticles = this.physics.add.group();
    this.initAnims();
    this.initStartTrigger();
    this.initColliders();
    this.handleInputs();
    this.handleScore();
  }

  initColliders() {
    this.physics.add.collider(this.man, this.obsticles, () => {
      this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

      const highScore = this.highScoreText.text.substr(this.highScoreText.text.length - 5);
      const newScore = Number(this.scoreText.text) > Number(highScore) ? this.scoreText.text : highScore;

      this.highScoreText.setText(`HIGH ${newScore}`);
      this.highScoreText.setAlpha(1);

      this.physics.pause();
      this.isGameRunning = false;
      this.anims.pauseAll();
      this.man.setTexture('man-idle');
      this.respawnTime = 0;
      this.environment.setAlpha(0);
      this.gameSpeed = 10;
      this.gameOverScreen.remove(this.restart);
      this.gameOverScreen.setAlpha(1);
      // send score to leaderboard
      this.addScore(
        localStorage.getItem('current_player'),
        this.score,
        this.id,
      );
      this.score = 0;
      this.hitSound.play();
    }, null, this);
  }

  initStartTrigger() {
    const { width, height } = this.game.config;
    this.physics.add.overlap(this.startTrigger, this.man, () => {
      if (this.startTrigger.y === 200) {
        this.startTrigger.body.reset(0, height);
        return;
      }

      this.startTrigger.disableBody(true, true);

      const startEvent = this.time.addEvent({
        delay: 1000 / 60,
        loop: true,
        callbackScope: this,
        callback: () => {
          this.man.setVelocityX(80);
          this.man.play('man-run-anim', 1);

          if (this.ground.width < width) {
            this.ground.width += 17 * 2;
          }

          if (this.ground.width >= width) {
            this.ground.width = width;
            this.isGameRunning = true;
            this.man.setVelocityX(0);
            // show scores and environment (clouds)
            this.scoreText.setAlpha(1);
            this.environment.setAlpha(1);
            startEvent.remove();
          }
        },
      });
    }, null, this);
  }

  initAnims() {
    this.anims.create({
      key: 'man-run-anim',
      frames: [
        { key: 'man-run-0' },
        { key: 'man-run-1' },
        { key: 'man-run-2' },
        { key: 'man-run-3' },
        { key: 'man-run-4' },
        { key: 'man-run-5' },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'man-down-anim',
      frames: [
        { key: 'man-run-3', duration: 50 },
      ],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'enemy-fly-anim',
      frames: [
        { key: 'enemy-fly-1' },
        { key: 'enemy-fly-2' },
        { key: 'enemy-fly-3' },
        { key: 'enemy-fly-4' },
        { key: 'enemy-fly-5' },
        { key: 'enemy-fly-6' },
        { key: 'enemy-fly-7' },
        { key: 'enemy-fly-8' },
      ],
      frameRate: 6,
      repeat: -1,
    });
  }

  addScore(name, score, id) {
    this.dom.gameButtons.classList.add('d-none');
    this.dom.loading.classList.remove('d-none');
    const content = {
      user: name,
      score,
    };
    form.reset();
    fetch(`https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${id}/scores/`,
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      })
      .then((response) => response.json())
      .then((response) => {
        this.dom.loading.classList.add('d-none');
        this.dom.result.classList.remove('d-none');
        this.dom.result.innerHTML = response.result;

        setTimeout(() => {
          this.dom.result.classList.add('d-none');
          this.dom.gameButtons.classList.remove('d-none');
          this.gameOverScreen.add(this.restart);
        }, 2000);
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleScore() {
    this.time.addEvent({
      delay: 1000 / 10,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) { return; }

        this.score++;
        this.gameSpeed += 0.01;

        if (this.score % 100 === 0) {
          this.reachSound.play();

          // animation of the score text when hitting multiple of 100
          this.tweens.add({
            targets: this.scoreText,
            duration: 100,
            repeat: 3,
            alpha: 0,
            yoyo: true,
          });
        }

        const score = Array.from(String(this.score), Number);
        for (let i = 0; i < 5 - String(this.score).length; i++) {
          score.unshift(0);
        }

        this.scoreText.setText(score.join(''));
      },
    });
  }

  handleInputs() {
    this.restart.on('pointerdown', () => {
      this.man.setVelocityY(0);
      this.man.body.height = 244;
      this.man.body.offset.y = 0;
      this.physics.resume();
      this.obsticles.clear(true, true);
      this.isGameRunning = true;
      this.gameOverScreen.setAlpha(0);
      this.environment.setAlpha(1);
      this.anims.resumeAll();
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      if (!this.man.body.onFloor() || this.man.body.velocity.x > 0) {
        return;
      }

      this.jumpSound.play();
      this.man.body.height = 244;
      this.man.body.offset.y = 0;

      this.man.setVelocityY(-1800);
      this.man.setTexture('man-idle', 0);
    });

    this.input.keyboard.on('keydown-DOWN', () => {
      if (!this.man.body.onFloor() || !this.isGameRunning) {
        return;
      }
      this.man.body.height = 158;
      this.man.body.offset.y = 86;
    });

    this.input.keyboard.on('keyup-DOWN', () => {
      this.man.body.height = 244;
      this.man.body.offset.y = 0;
    });
  }

  placeObsticle() {
    const obsticleNum = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(600, 900);

    let obsticle;
    if (obsticleNum > 6) {
      const enemyHeight = [60, 80];
      obsticle = this.obsticles.create(this.game.config.width + distance, this.game.config.height - enemyHeight[Math.floor(Math.random() * 2)], 'enemy-bird')
        .setOrigin(0, 1);
      obsticle.play('enemy-fly-anim', 1);
      obsticle.body.height = obsticle.body.height / 1.5;
    } else {
      obsticle = this.obsticles.create(this.game.config.width + distance, this.game.config.height - 25, `obsticle-${obsticleNum}`)
        .setOrigin(0, 1);
      obsticle.body.offset.y = +10;
    }

    obsticle.setImmovable();
  }

  update(time, delta) {
    if (!this.isGameRunning) { return; }

    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), -0.5);

    this.respawnTime += delta * this.gameSpeed * 0.08;

    if (this.respawnTime >= 1500) {
      this.placeObsticle();
      this.respawnTime = 0;
    }

    this.obsticles.getChildren().forEach(obsticle => {
      if (obsticle.getBounds().right < 0) {
        obsticle.destroy();
      }
    });

    this.environment.getChildren().forEach(env => {
      if (env.getBounds().right < 0) {
        env.x = this.game.config.width + 30;
      }
    });

    if (this.man.body.deltaAbsY() > 0) {
      this.man.anims.stop();
      this.man.setTexture('man-idle');
    } else {
      this.man.body.height <= 58
        ? this.man.play('man-down-anim', true)
        : this.man.play('man-run-anim', true);
    }
  }
}