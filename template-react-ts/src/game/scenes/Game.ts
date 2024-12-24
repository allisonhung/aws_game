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

    constructor () {
        super('Game');
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
        this.livesText = this.add.text(16, 50, 'Lives: ' + this.lives, {
            fontSize: '32px',
            color: '#000' //black
        });
        // Add overlap between Sal and vacuum
        this.physics.add.overlap(this.sal, this.vacuum, this.handleVacuumCollision, undefined, this);

         EventBus.emit('current-scene-ready', this);
    }

    handleVacuumCollision() {
        if (this.sal && !this.sal.isInvincible()) {
            this.lives--;
            this.livesText.setText('Lives: ' + this.lives);
            const gameHeight = Number(this.sys.game.config.height); // Ensure height is a number
            this.sal.setPosition(400, gameHeight - 250); // Reset Sal's position

            // Start blinking effect
            this.sal.startBlinking();

            // Check for game over
            if (this.lives <= 0) {
                this.scene.start('GameOver');
            }
        }
    }

    update() {
        if (this.sal) {
            this.sal.update();
            

            // When sprite touched any part of the game border, decrease lives
            const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
            const gameWidth = Number(gameConfig.width);
            const salWidth = this.sal.displayWidth;
            if (this.sal.x + salWidth / 2 >= gameWidth) {   
                this.scene.start('Game_2',{lives: this.lives}); // Transition to Game_2
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
        this.scene.start('Game_2', {lives: this.lives});
    }
}
