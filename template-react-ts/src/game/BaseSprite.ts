import { Physics } from 'phaser';


export class BaseSprite extends Physics.Arcade.Sprite {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

    // Initialize the BaseSprite class and adds sprite to scene and physics
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        // Keyboard input to interact with sprite
        if (scene.input.keyboard) {
            this.cursors = scene.input.keyboard.createCursorKeys();
        }
    }

    update() {
        if (this.cursors) {
            if (this.cursors.left?.isDown) {
                this.setVelocityX(-160);
                this.setTexture('sal_left'); 
            } else if (this.cursors.right?.isDown) {
                this.setVelocityX(160);
                this.setTexture('sal'); 
            } else {
                this.setVelocityX(0);
                this.setTexture('sal_left'); //for when the sprite is not moving
            }

            if (this.cursors.space?.isDown && this.body?.touching.down) {
                this.setVelocityY(-500);
            }
        }
    }
}