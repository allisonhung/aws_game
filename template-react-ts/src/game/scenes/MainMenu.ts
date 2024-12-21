import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    sal: GameObjects.Sprite | null = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.image(0, 0, 'background_1').setOrigin(0,0);
        // Ensure the background image scales to fit the game dimensions
        const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
        this.background.displayWidth = gameConfig.width as number;
        this.background.displayHeight = gameConfig.height as number;



        this.title = this.add.text(512, 460, 'Cat Chase', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        this.sal = this.add.sprite(400, 300, 'sal');
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        EventBus.emit('current-scene-ready', this);
    }
    update() {
        if (this.cursors && this.sal) {
            if (this.cursors.left?.isDown) {
                this.sal.x -= 5;
            } else if (this.cursors.right?.isDown) {
                this.sal.x += 5;
            }

            if (this.cursors.up?.isDown) {
                this.sal.y -= 5;
            } else if (this.cursors.down?.isDown) {
                this.sal.y += 5;
            }
        }
    }
    
    changeScene ()
    {
        if (this.logoTween)
        {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start('Game');
    }

    // set mechanics for moving sprites here?

}
