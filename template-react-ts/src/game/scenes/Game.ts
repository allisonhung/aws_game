import { EventBus } from '../EventBus';
import { Scene, GameObjects } from 'phaser';
import { Sal } from '../components/Sal';

export class Game extends Scene {
    background: GameObjects.Image;
    sal: Sal | null = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    facingLeft: boolean = false;
    private lives: number = 7;
    private livesText: Phaser.GameObjects.Text;
 
    
    constructor ()
    {
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
        
        // Remove camera zoom or set to 1.0
        this.cameras.main.setZoom(1.0); // Comment out or remove this line

        this.sal = new Sal(this, 400, gameHeight - 250, 'sal_walk');
        this.sal.setScale(0.07); // Reduced from 0.05

        if (this.sal) {
            const body = this.sal.body as Phaser.Physics.Arcade.Body;
            body.setSize(this.sal.width * 0.6, this.sal.height * 0.7); 
            body.setOffset(this.sal.width * 0.2, this.sal.height * 0.3);
        }

        const platform = this.physics.add.staticSprite(gameWidth-100,gameHeight-150,'pinkbar');
        platform.setScale(0.4).refreshBody(); // Reduced from 0.7
        if (this.sal) {
            this.physics.add.collider(this.sal, platform, undefined, (sal, plat) => {
                const salBody = (sal as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                const platBody = (plat as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                return salBody.bottom <= platBody.top + 10;
            });
        }

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

        const platform2 = this.physics.add.staticSprite(gameWidth-300,gameHeight-250,'pinkbar');
        platform2.setScale(.5).refreshBody();
        if (this.sal) {
            this.physics.add.collider(this.sal, platform2, undefined, (sal, plat) => {
                const salBody = (sal as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                const platBody = (plat as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                return salBody.bottom <= platBody.top + 10;
            });
        }

        const platform3 = this.physics.add.staticSprite(gameWidth-500,gameHeight-350,'pinkbar');
        platform3.setScale(.5).refreshBody();
        if (this.sal) {
            this.physics.add.collider(this.sal, platform3, undefined, (sal, plat) => {
                const salBody = (sal as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                const platBody = (plat as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                return salBody.bottom <= platBody.top + 5;
            });
        }


         // Create ground
         const ground = this.add.rectangle(0, gameHeight - 50, gameWidth, 50).setOrigin(0, 0);
         this.physics.add.existing(ground, true); // Static body
 
         // Add collision between sal and ground
         this.physics.add.collider(this.sal, ground);
 
         // Add lives display in top left corner
         this.livesText = this.add.text(16, 16, 'Lives: ' + this.lives, {
             fontSize: '32px',
             color: '#000'
         });
 
         EventBus.emit('current-scene-ready', this);
     }
    update() {
        if (this.sal) {
            this.sal.update();

            // When sprite touched any part of the game border, decrease lives
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
                this.updateLives(-1);
            }
        }
    }

 

    changeScene() {
        this.scene.start('GameOver');
    }

    // Add method to update lives
    private updateLives(change: number) {
        this.lives += change;
        this.livesText.setText('Lives: ' + this.lives);
        if (this.lives <= 0) {
            this.scene.start('GameOver');
        }
    }
}
