import Phaser from 'phaser';
import playerPic from '../assets/img/player.png';
import playerJson from '../assets/img/player_atlas.json';
import playerAnim from '../assets/img/player_anim.json';
import items from '../assets/img/items.png';
import playerHit from '../assets/audio/player.wav';
import MatterEntity from './matterEntity';
import APIHandler from '../utils/apiHandler';

export default class Player extends MatterEntity {
  constructor(data) {
    const {
      scene, x, y, texture, frame, // eslint-disable-line
    } = data;
    super({
      ...data, health: 5, drops: [], name: 'player',
    });
    this.touching = [];
    this.score = 0;
    localStorage.setItem('score:', JSON.stringify(this.score));
    // Weapon
    this.spriteWeapon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'items', 91);
    this.spriteWeapon.setScale(0.6);
    this.spriteWeapon.setOrigin(0.15, 0.85);
    this.scene.add.existing(this.spriteWeapon);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    const playerCollider = Bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'playerCollider' });
    const playerSensor = Bodies.circle(this.x, this.y, 24, { isSensor: true, label: 'playerSensor' });
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
    // create mining  collisions
    this.createMiningCollisions(playerSensor);
    // create pick up collisions
    this.createPickupCollisions(playerCollider);
    // flip player when looking other way
    this.scene.input.on('pointermove', pointer => { if (!this.dead) this.setFlipX(pointer.worldX < this.x); });
  }

  static preload(scene) {
    scene.load.atlas('player', playerPic, playerJson);
    scene.load.animation('player_anim', playerAnim);
    scene.load.spritesheet('items', items, { frameWidth: 32, frameHeight: 32 });
    scene.load.audio('player', playerHit);
  }

  onDeath() {
    this.anims.stop();
    this.setTexture('items', 0);
    this.setOrigin(0.5);
    this.spriteWeapon.destroy();

    const username = JSON.parse(localStorage.getItem('username:'));

    const obj = {
      user: username,
      score: this.score,
    };
    APIHandler.postData('https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/nJMvjp5o0e7RhCRrNWFM/scores', obj)
      .then(data => { // eslint-disable-line
      });
    this.scene.scene.stop('mainScene');
    this.scene.scene.start('titleScene');
    window.location.reload(); // temporary solution until I can fix the replayability problem
  }

  update() {
    if (this.dead) return;
    const speed = 2.5;
    const playerVelocity = new Phaser.Math.Vector2();
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
    }

    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
    }
    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);

    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play('player_walk', true);
    } else {
      this.anims.play('player_idle', true);
    }

    // connect Weapon to Player
    this.spriteWeapon.setPosition(this.x, this.y);
    this.weaponRotate();
  }

  weaponRotate() {
    const pointer = this.scene.input.activePointer;
    if (pointer.isDown) {
      this.weaponRotation += 6;
    } else {
      this.weaponRotation = 0;
    }
    if (this.weaponRotation > 100) {
      this.destroyStuff();
      this.weaponRotation = 0;
    }
    if (this.flipX) {
      this.spriteWeapon.setAngle(-this.weaponRotation - 90);
    } else {
      this.spriteWeapon.setAngle(this.weaponRotation);
    }
  }


  createMiningCollisions(playerSensor) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [playerSensor],
      callback: other => {
        if (other.bodyB.isSensor) return;
        this.touching.push(other.gameObjectB);
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideEnd({
      objectA: [playerSensor],
      callback: other => {
        this.touching = this.touching.filter(gameObject => gameObject = !other.gameObjectB); // eslint-disable-line
      },
      context: this.scene,
    });
  }

  createPickupCollisions(playerCollider) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: [playerCollider],
      callback: other => {
        if (other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();
      },
      context: this.scene,
    });

    this.scene.matterCollision.addOnCollideActive({
      objectA: [playerCollider],
      callback: other => {
        if (other.gameObjectB && other.gameObjectB.pickup) other.gameObjectB.pickup();
      },
      context: this.scene,
    });
  }

  destroyStuff() {
    this.touching = this.touching.filter(gameObject => gameObject.hit && !gameObject.dead);
    this.touching.forEach(gameobject => {
      gameobject.hit();
      if (gameobject.dead) {
        if (gameobject.name === 'troll' || gameobject.name === 'ent' || gameobject.name === 'bandit') this.score += 200;
        if (gameobject.name === 'tree' || gameobject.name === 'bush' || gameobject.name === 'rock') this.score += 100;
        gameobject.destroy();
      }
    });
  }
}