import { Physics } from 'phaser';

export class Sal extends Physics.Arcade.Sprite {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    facingLeft: boolean = false;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Ensure keyboard input is available
        if (scene.input.keyboard){
            this.cursors = scene.input.keyboard?.createCursorKeys();
        }

        // Scale & bounds
        this.setScale(0.5);
        this.setCollideWorldBounds(true);

        // Create the walk animation (must match loaded frames in Preloader)
        // For example, if sal_walk is 4 frames (0..3):
        scene.anims.create({
            key: 'sal_walk_anim',
            frames: scene.anims.generateFrameNumbers('sal_walk', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });

        // Create the idle animation (must match loaded frames for sal_idle)
        scene.anims.create({
            key: 'sal_idle_anim',
            frames: scene.anims.generateFrameNumbers('sal_idle', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
    }

    update() {
        if (!this.cursors) return; // If no keyboard, do nothing

        // Left movement
        if (this.cursors.left?.isDown) {
            this.setVelocityX(-160);
            this.flipX = true;
            this.anims.play('sal_walk_anim', true);
            this.facingLeft = true;

        // Right movement
        } else if (this.cursors.right?.isDown) {
            this.setVelocityX(160);
            this.flipX = false;
            this.anims.play('sal_walk_anim', true);
            this.facingLeft = false;

        // Idle
        } else {
            this.setVelocityX(0);
            this.anims.play('sal_idle_anim', true);
            // Flip the idle animation if facing left
            this.flipX = this.facingLeft;
        }

        // Jump (space bar)
        if (this.cursors.space?.isDown && this.body?.touching.down) {
            this.setVelocityY(-500);
        }
    }
}