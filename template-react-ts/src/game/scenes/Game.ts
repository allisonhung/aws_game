import { EventBus } from '../EventBus';
import { Scene, GameObjects, Physics } from 'phaser';
import { BaseSprite } from '../BaseSprite';

export class Game extends Scene {
    background: GameObjects.Image;
    sal: BaseSprite | null = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;

    constructor() {
        super('Game');
    }

    create() {
        // set background
        this.background = this.add.image(0, 0, 'background_1').setOrigin(0, 0);
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

         // Create ground
         const ground = this.add.rectangle(0, gameHeight - 50, gameWidth, 50).setOrigin(0, 0);
         this.physics.add.existing(ground, true); // Static body
 
         // Create sal as an instance of BaseSprite
         this.sal = new BaseSprite(this, 400, gameHeight - 250, 'sal');
         this.sal.setScale(0.25);
 
         // Add collision between sal and ground
         this.physics.add.collider(this.sal, ground);
 
         EventBus.emit('current-scene-ready', this);
     }
    update() {
        if (this.sal) {
            this.sal.update();

            // When sprite touched any part of the game border, change scene
            const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
            const gameWidth = Number(gameConfig.width);
            const gameHeight = Number(gameConfig.height);
            const salWidth = this.sal.displayWidth;
            const salHeight = this.sal.displayHeight;
            if (
                this.sal.x - salWidth / 2 <= 0 ||
                this.sal.x + salWidth / 2 >= gameWidth ||
                this.sal.y - salHeight / 2 <= 0 ||
                this.sal.y + salHeight / 2 >= gameHeight
            ) {
                this.changeScene();
            }
        }
    }

 

    changeScene() {
        this.scene.start('GameOver');
    }
}
