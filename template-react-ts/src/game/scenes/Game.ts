import { EventBus } from '../EventBus';
import { Scene, GameObjects} from 'phaser';

export class Game extends Scene
{
    background: GameObjects.Image;
    logoTween: Phaser.Tweens.Tween | null;
    sal: GameObjects.Sprite | null = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    
    constructor ()
    {
        super('Game');
    }
    
    create ()
    {
        // set background
        this.background = this.add.image(0, 0, 'background_1').setOrigin(0,0);
        // Ensure the background image scales to fit the game dimensions
        const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
        this.background.displayWidth = gameConfig.width as number;
        this.background.displayHeight = gameConfig.height as number;

        // add sal
        this.sal = this.add.sprite(400, 300, 'sal');
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }
        this.sal.setScale(0.25);

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
        this.scene.start('GameOver');
    }
}
