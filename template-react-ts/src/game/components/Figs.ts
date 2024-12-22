import { Physics } from 'phaser';

export class Figs extends Physics.Arcade.Sprite {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

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
        scene.anims.create({
            key: 'figs_idle_anim',
            frames: scene.anims.generateFrameNumbers('figs_idle', { start: 0, end: 1 }),
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

        // Right movement
        } else if (this.cursors.right?.isDown) {
            this.setVelocityX(160);
            this.flipX = false;
            this.anims.play('sal_walk_anim', true);

        // Idle
        } else {
            this.setVelocityX(0);
            this.anims.play('figs_idle_anim', true);
            // Flip the idle animation if facing left
        }

        // Jump (space bar)
        if (this.cursors.space?.isDown && this.body?.touching.down) {
            this.setVelocityY(-500);
        }
    }
};