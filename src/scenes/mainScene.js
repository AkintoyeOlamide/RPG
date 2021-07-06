import Phaser from 'phaser';


import mapPic from '../assets/img/rpg_nature_tileset.png';
import mapJson from '../assets/img/map.json';

import Player from '../entities/player';
import Resource from '../entities/resource';
import Enemy from '../entities/enemy';

export default class mainScene extends Phaser.Scene {
  constructor() {
    super('mainScene');
    this.enemies = [];
  }

  preload() {
    Enemy.preload(this);
    Player.preload(this);
    Resource.preload(this);
    this.load.image('tiles', mapPic);
    this.load.tilemapTiledJSON('map', mapJson);
  }

  create() {
    // create  layered tile map
    const map = this.make.tilemap({ key: 'map' });
    this.map = map;
    const tileset = map.addTilesetImage('rpg_nature_tileset', 'tiles', 32, 32, 0, 0);
    const layer1 = map.createStaticLayer('Tile Layer 1', tileset, 0, 0);
    const layer2 = map.createStaticLayer('Tile Layer 2', tileset, 0, 0);  // eslint-disable-line
    layer1.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(layer1);
    // map objects Resources
    this.map.getObjectLayer('Resources').objects.forEach(resource => new Resource({ scene: this, resource }));
    // map objects Enemies
    this.map.getObjectLayer('Enemies').objects.forEach(enemy => this.enemies.push(new Enemy({ scene: this, enemy })));
    // add player to scene
    this.player = new Player({
      scene: this, x: 250, y: 150, texture: 'player', frame: 'eliteknight_idle_1',
    });
    // player movement
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      left: Phaser.Input.Keyboard.KeyCodes.A,
    });
    this.score = this.add.text(10, 470, '');
  }

  update() {
    this.enemies.forEach(enemy => enemy.update());
    this.player.update();

    this.score.setText(`score:${this.player.score}`);
  }
}