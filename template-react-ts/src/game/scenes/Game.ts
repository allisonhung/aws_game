import { EventBus } from '../EventBus';
import { Scene, GameObjects } from 'phaser';
import { Sal } from '../components/Sal';
import { Vacuum } from '../components/Vacuum';

export class Game extends Scene {
    background: GameObjects.Image;
    sal: Sal | null = null;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
    facingLeft: boolean = false;
    private lives: number = 7;
    private livesText: Phaser.GameObjects.Text;
    vacuum: Vacuum | null = null;
    private vacuumDirection: number = 1;

constructor ()
    {
        super('Game');
    }

    private createPlatform(x: number, y: number): void {
        const platform = this.physics.add.staticSprite(x, y, 'pinkbar');
        platform.setScale(0.5).refreshBody();
        
        if (this.sal) {
            this.physics.add.collider(this.sal, platform, undefined, (sal, plat) => {
                const salBody = (sal as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                const platBody = (plat as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.Body;
                return salBody.bottom <= platBody.top + 5;
            });
        }
    }

    create() {
        // set background
        this.background = this.add.image(0, 0, 'background_1').setOrigin(0, 0);
        
        const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
        this.background.displayWidth = gameConfig.width as number;
        this.background.displayHeight = gameConfig.height as number;

        const gameWidth = Number(gameConfig.width);
        const gameHeight = Number(gameConfig.height);

        // Creating Sal
        this.sal = new Sal(this, 400, gameHeight - 250, 'sal_walk');
        this.sal.setScale(0.1); 

          // Creating vacuum enemy
        this.vacuum = new Vacuum(this, 700, gameHeight - 250, 'vacuum');
        this.vacuum.setScale(0.1);
        // Create ground
        const ground = this.add.rectangle(0, gameHeight - 50, gameWidth, 50).setOrigin(0, 0);
        this.physics.add.existing(ground, true); 


        // Platform positions
        const platformPositions = [
            { x: gameWidth-100, y: gameHeight-150 },
            { x: gameWidth-300, y: gameHeight-250 },
            { x: gameWidth-500, y: gameHeight-350 },
            { x: gameWidth-300, y: gameHeight-450 },
            { x: gameWidth-400, y: gameHeight-550 },
            { x: gameWidth-200, y: gameHeight-650 },
            { x: gameWidth-300, y: gameHeight-750 },
            { x: gameWidth-800, y: gameHeight-350 }
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
         // vacuum collision
         this.physics.add.collider(this.vacuum, ground);
 
         // Lives counter
         this.livesText = this.add.text(16, 16, 'Lives: ' + this.lives, {
             fontSize: '32px',
             color: '#000' //black
         });

         // collision between vacuum and sal, need to add else for =0 lives
         this.physics.add.overlap(this.sal, this.vacuum, () => {
            if (this.lives >= 0) {
                this.lives--;
                this.livesText.setText('Lives: ' + this.lives);
                // Reset Sal's position when hit
                if (this.sal) {
                    this.sal.setPosition(400, gameHeight - 250);
                }
            }
            if (this.lives <= 0) {
                this.scene.start('GameOver');
            }
        }, undefined, this);

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

        if (this.vacuum) {
            this.vacuum.update();
            const vacuumBody = this.vacuum.body as Phaser.Physics.Arcade.Body;
            
            // Check if vacuum hits world bounds
            if (vacuumBody.blocked.left) {
                this.vacuumDirection = 1;
            } else if (vacuumBody.blocked.right) {
                this.vacuumDirection = -1;
            }
            
            // Use vacuumDirection to set velocity
            vacuumBody.setVelocityX(200 * this.vacuumDirection);
            this.vacuum.setFlipX(this.vacuumDirection > 0);
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
