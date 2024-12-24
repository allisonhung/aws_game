import { EventBus } from '../EventBus';
import { Scene, GameObjects } from 'phaser';
import { Sal } from '../components/Sal';

export class Game_2 extends Scene {
    background: GameObjects.Image;
    sal: Sal | null = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    facingLeft: boolean = false;
    private lives: number = 7;
    private livesText: Phaser.GameObjects.Text;
    cameraStartedFollowing: boolean = false;

constructor ()
    {
        super('Game_2');
    }

    private createPlatform(x: number, y: number): void {
            const platform = this.physics.add.staticSprite(x, y, 'greenbar');
            platform.setScale(0.5).refreshBody();
            
            if (this.sal) {
                this.physics.add.collider(this.sal, platform, undefined, (sal, plat) => {
                    const salBody = (sal as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                    const platBody = (plat as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                    return salBody.bottom <= platBody.top +10;
                });
            }
        }

    create() {
        // set background
        const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
        const gameWidth = Number(gameConfig.width);
        const gameHeight = Number(gameConfig.height);

         // Position the background image so that the bottom half is initially visible
         this.background = this.add.image(0, -gameHeight, 'background_2').setOrigin(0, 0);
         this.background.setDisplaySize(gameWidth, gameHeight * 2); // Cover the entire game height
 
        // Create Sal at the same ground level as the previous scene
        this.sal = new Sal(this, 10, gameHeight - 250, 'sal_walk');
        this.sal.setScale(0.1);

        // Create ground
        const ground = this.add.rectangle(0, gameHeight - 50, gameWidth, 50).setOrigin(0, 0);
        this.physics.add.existing(ground, true);

        // Platform positions
        const platformPositions = [
            { x: gameWidth-650, y: gameHeight-200 },
            { x: gameWidth-400, y: gameHeight-350 },
            { x: gameWidth-650, y: gameHeight-500 },
            { x: gameWidth-400, y: gameHeight-650 },
            { x: gameWidth-650, y: gameHeight-800 },
            { x: gameWidth-400, y: gameHeight-950 },
            { x: gameWidth-650, y: gameHeight-1100 },
            { x: gameWidth-400, y: gameHeight-1250 }
        ];


        // Create all platforms
        platformPositions.forEach(pos => this.createPlatform(pos.x, pos.y));

       
        this.physics.world.setBounds(
            0,               // x
            0,               // y
            gameWidth,       // width
            gameHeight,      // height
            true,           // checkLeft
            true,           // checkRight
            false,           // checkUp
            true             // checkDown
        );
 
         // Add collision between sal and ground
         this.physics.add.collider(this.sal, ground);
 
         // Lives counter
         this.livesText = this.add.text(16, 16, 'Lives: ' + this.lives, {
             fontSize: '32px',
             color: '#000' //black
         });

         

         EventBus.emit('current-scene-ready', this);
     }
    update() {
        if (this.sal) {
            this.sal.update();
            // Check if Sal has reached the halfway point of the display scene
            const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
            const gameHeight = Number(gameConfig.height);
            if (this.sal.y <= gameHeight / 2 && !this.cameraStartedFollowing) {
                // Start camera follow
                this.cameras.main.startFollow(this.sal);
                this.cameraStartedFollowing = true;
            }
            
            
        }

        
    }

 

    changeScene() {
        this.scene.start('Game_3');
    }



}