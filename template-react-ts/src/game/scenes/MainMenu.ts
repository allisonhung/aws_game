import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';
import { Sal } from '../components/Sal';
import { Figs } from '../components/Figs';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    sal: Sal | null = null;
    figs: Figs | null = null;

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

        const gameHeight = Number(gameConfig.height);

        this.sal = new Sal(this, 400, gameHeight - 250, 'sal');
        this.sal.setScale(0.25);
        this.figs = new Figs(this, 800, gameHeight - 250, 'figs');
        this.figs.setScale(0.25);

        this.title = this.add.text(512, 460, 'Cat Chase', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        EventBus.emit('current-scene-ready', this);
    }
    update() {
        this.sal?.update();
        this.figs?.update();
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
