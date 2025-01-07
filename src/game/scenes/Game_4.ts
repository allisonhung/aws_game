import { Scene, GameObjects } from 'phaser';
import { Sal } from '../components/Sal';
import { EventBus } from '../EventBus';

export class Game_4 extends Scene {
    private lives: number;
    private background: GameObjects.Image;
    private sal: Sal;
    private livesText: GameObjects.Text;

    constructor() {
        super('Game_4');
    }

    init(data: { lives: number }) {
        this.lives = data.lives;
    }

    create() {
        // set background
        const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
        const gameWidth = Number(gameConfig.width);
        const gameHeight = Number(gameConfig.height);

        // Position the background image so that the top half is initially visible
        this.background = this.add.image(0, -gameHeight, 'background_3').setOrigin(0, 0);
        this.background.setDisplaySize(gameWidth, gameHeight * 2); // Cover the entire game height

        // Create Sal at the top of the screen
        this.sal = new Sal(this, gameWidth * 0.2, 0, 'sal_walk');
        this.sal.setScale(0.1);

        // Enable gravity for Sal
        this.physics.world.gravity.y = 300;
        // Ensure Sal's physics body is created and set to be dynamic
        this.physics.add.existing(this.sal);
        const salBody = this.sal.body as Phaser.Physics.Arcade.Body;
        salBody.setCollideWorldBounds(true);
        salBody.setVelocityX(100); // Set initial X velocity


        // Create ground
        const ground = this.add.rectangle(0, gameHeight - 50, gameWidth, 50).setOrigin(0, 0);
        this.physics.add.existing(ground, true);

        // Add collision between sal and ground
        this.physics.add.collider(this.sal, ground);

        // Lives counter
        this.livesText = this.add.text(16, 50, 'Lives: ' + this.lives, {
            fontSize: '32px',
            color: '#000' // black
        }).setScrollFactor(0);

        // Set camera bounds and make it follow Sal
        this.cameras.main.setBounds(0, -gameHeight, gameWidth, gameHeight * 2);
        this.cameras.main.startFollow(this.sal);

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        if (this.sal) {
            this.sal.update();
        }
        this.livesText.setText('Lives: ' + this.lives);

        // Stop camera follow when the camera's bottom is in line with the background image's bottom
        const gameHeight = Number(this.sys.game.config.height);
        if (this.cameras.main.scrollY >= gameHeight) {
            this.cameras.main.stopFollow();
        }
    }

    changeScene() {
        this.scene.start('Game_3');
    }
}

export default Game_4;