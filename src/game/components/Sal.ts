import { Physics } from 'phaser';

export class Sal extends Physics.Arcade.Sprite {
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    facingLeft: boolean = false;
    private invincible: boolean = false;

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
        scene.anims.create({
            key: 'sal_jump_anim',
            frames: scene.anims.generateFrameNumbers('sal_jump', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: 0
        })
    }

    startBlinking(duration: number = 3000) {
        if (this.invincible) return;

        this.invincible = true;

        // Blinking effect
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.setVisible(!this.visible);
            },
            repeat: duration / 100 - 1 // Calculate the number of repeats
        });

        // Reset invincibility after the duration
        this.scene.time.delayedCall(duration, () => {
            this.invincible = false;
            this.setVisible(true); // Ensure Sal is visible after blinking
        });
    }
    isInvincible(): boolean {
        return this.invincible;
    }

    update() {
        if (!this.cursors) return;

        // 1. Horizontal movement (works even in midair)
        if (this.cursors.left?.isDown) {
            this.setVelocityX(-160);
            this.flipX = true;
            this.facingLeft = true;
        } else if (this.cursors.right?.isDown) {
            this.setVelocityX(160);
            this.flipX = false;
            this.facingLeft = false;
        } else {
            this.setVelocityX(0);
        }

        // 2. Jump if on ground
        const onGround = this.body?.touching.down || this.body?.blocked.down; 
        if ((this.cursors.space?.isDown || this.cursors.up?.isDown) && onGround) {
            this.setVelocityY(-600);
            this.anims.play('sal_jump_anim');
        }

        // 3. Animate based on whether Sal is in midair
        if (!onGround) {
            // If Sal is off the ground, ensure jump animation is playing
            if (this.anims.currentAnim?.key !== 'sal_jump_anim') {
                this.anims.play('sal_jump_anim');
            }
        } else {
            // On ground, if moving horizontally, walk; otherwise idle
            if (this.body?.velocity.x !== 0) {
                this.anims.play('sal_walk_anim', true);
            } else {
                this.anims.play('sal_idle_anim', true);
                this.flipX = this.facingLeft;
            }
        }
        
    }
}