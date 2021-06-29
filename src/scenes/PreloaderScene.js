/* global Phaser */
/* eslint radix: 0 */

import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    this.readyCount = 0;
  }

  preload() {
    // add logo image
    this.add.image(400, 200, 'logo');

    // display progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    const { width } = this.cameras.main;
    const { height } = this.cameras.main;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px courier',
        fill: '#ffffff',
      },
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px courier',
        fill: '#ffffff',
      },
    });
    percentText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px courier',
        fill: '#ffffff',
      },
    });
    assetText.setOrigin(0.5, 0.5);

    // update progress bar
    this.load.on('progress', (value) => {
      percentText.setText(`${parseInt(value * 100)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // update file progress text
    this.load.on('fileprogress', (file) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    // remove progress bar when complete
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      this.ready();
    });

    this.timedEvent = this.time.delayedCall(3000, this.ready, [], this);

    // load assets needed in our game
    this.load.image('blueButton1', './assets/ui/blue_button02.png');
    this.load.image('blueButton2', './assets/ui/blue_button03.png');
    this.load.image('box', './assets/ui/grey_box.png');
    this.load.image('checkedBox', './assets/ui/blue_boxCheckmark.png');
    this.load.audio('bgMusic', './assets/TownTheme.mp3');

    this.load.audio('jump', './assets/jump.m4a');
    this.load.audio('hit', './assets/hit.m4a');
    this.load.audio('reach', './assets/reach.m4a');
    this.load.image('restart', './assets/restart.png');
    this.load.image('game-over', './assets/game-over.png');
    this.load.image('cloud', './assets/clouds.png');
    this.load.image('ground', './assets/ground3.png');
    this.load.image('man-idle', './assets/black_man/idle/0000.png');

    this.load.image('man-run-0', './assets/black_man/run/0000.png');
    this.load.image('man-run-1', './assets/black_man/run/0001.png');
    this.load.image('man-run-2', './assets/black_man/run/0002.png');
    this.load.image('man-run-3', './assets/black_man/run/0003.png');
    this.load.image('man-run-4', './assets/black_man/run/0004.png');
    this.load.image('man-run-5', './assets/black_man/run/0005.png');

    this.load.image('enemy-fly-1', './assets/bird/frame-1.png');
    this.load.image('enemy-fly-2', './assets/bird/frame-2.png');
    this.load.image('enemy-fly-3', './assets/bird/frame-3.png');
    this.load.image('enemy-fly-4', './assets/bird/frame-4.png');
    this.load.image('enemy-fly-5', './assets/bird/frame-5.png');
    this.load.image('enemy-fly-6', './assets/bird/frame-6.png');
    this.load.image('enemy-fly-7', './assets/bird/frame-7.png');
    this.load.image('enemy-fly-8', './assets/bird/frame-8.png');

    this.load.image('enemy-bird', './assets/bird.png');

    // this.load.spritesheet('man', './assets/man-run.png', {
    //   frameWidth: 96,
    //   frameHeight: 129
    // });

    // this.load.spritesheet('enemy-bird', './assets/enemy-bird.png', {
    //   frameWidth: 92,
    //   frameHeight: 77
    // });

    this.load.image('obsticle-1', 'assets/cactuses_small_1.png');
    this.load.image('obsticle-2', 'assets/cactuses_small_2.png');
    this.load.image('obsticle-3', 'assets/cactuses_small_3.png');
    this.load.image('obsticle-4', 'assets/cactuses_big_1.png');
    this.load.image('obsticle-5', 'assets/cactuses_big_2.png');
    this.load.image('obsticle-6', 'assets/cactuses_big_3.png');
  }

  ready() {
    this.scene.start('Title');
    this.readyCount += 1;
    if (this.readyCount === 2) {
      this.scene.start('Title');
    }
  }
}
