import { EventBus } from '../EventBus';
import { Scene, GameObjects, Physics} from 'phaser';

export class Game extends Scene
{
    background: GameObjects.Image;
    sal: Physics.Arcade.Sprite | null = null;
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

        const gameWidth = Number(gameConfig.width);
        const gameHeight = Number(gameConfig.height);
        this.physics.world.setBounds(
            0,               // x
            0,               // y
            gameWidth,       // width
            gameHeight,      // height
            false,           // checkLeft
            false,           // checkRight
            false,           // checkUp
            true             // checkDown
          );


        // Convert sal to a physics-enabled sprite
        this.sal = this.physics.add.sprite(400, 300, 'sal');
        this.sal.setScale(0.25);
        this.sal.setCollideWorldBounds(true);

        if (this.input.keyboard){
            this.cursors = this.input.keyboard.createCursorKeys();
        }


        EventBus.emit('current-scene-ready', this);
    }
    update() {
        if (this.sal && this.cursors) {
            if (this.cursors.left?.isDown) {
                this.sal.setVelocityX(-160);
            } else if (this.cursors.right?.isDown) {
                this.sal.setVelocityX(160);
            } else {
                this.sal.setVelocityX(0);
            }

            if (this.cursors.up?.isDown && this.sal.body && this.sal.body.touching.down) {
                this.sal.setVelocityY(-330);
            }

            // When sprite touched any part of the game border, change scene
            const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
            const gameWidth = Number(gameConfig.width);
            const gameHeight = Number(gameConfig.height);
            if (
                this.sal.x <= 0 ||
                this.sal.x >= gameWidth ||
                this.sal.y <= 0 ||
                this.sal.y >= gameHeight
            ) {
                this.changeScene();
            }
        }
        }
    
    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
