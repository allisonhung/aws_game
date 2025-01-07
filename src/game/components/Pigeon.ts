import { Scene, GameObjects, Physics} from 'phaser';

export class Pigeon extends GameObjects.Sprite {
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        const body = this.body as Physics.Arcade.Body;
        body.setAllowGravity(false);
        body.setImmovable(true);

        // Add timed event to flip bird's x-axis occasionally
        scene.time.addEvent({
            delay: 2000, // Interval in milliseconds
            callback: this.flipSpriteX,
            callbackScope: this,
            loop: true
        });
    }

    private flipSpriteX() {
        if (Math.random() > 0.5) {
            this.flipX = !this.flipX;
        }
    }
}