/* global Phaser */

import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('logo', './assets/run_man.png');
  }

  create() {
    // transition to the Preloader scene
    this.scene.start('Preloader');
  }
}
