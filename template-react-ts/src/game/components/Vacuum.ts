import { Physics } from 'phaser';

export class Vacuum extends Physics.Arcade.Sprite {
    private speed: number = 300;
    private direction: number = 1;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Set up physics body
        const body = this.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        this.setScale(1.0);
    }

    update() {
        // Move back and forth
        this.setVelocityX(this.speed * this.direction);

        // Change direction when hitting bounds
        const body = this.body as Phaser.Physics.Arcade.Body;
        if (body.touching.right || body.blocked.right) {
            this.direction = -1;
        } else if (body.touching.left || body.blocked.left) {
            this.direction = 1;
        }
    }
}