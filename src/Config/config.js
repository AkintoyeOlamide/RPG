/* global Phaser */

import 'phaser';

export default {
  type: Phaser.AUTO,
  width: 1000,
  height: 600,
  parent: 'game-container',
  pixelArt: true,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
};
