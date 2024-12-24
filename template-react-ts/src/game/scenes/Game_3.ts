import { Scene } from 'phaser';
import { DialogueBox } from '../components/DialogueBox';

export class Game_3 extends Scene {
    private sal: Phaser.GameObjects.Sprite;
    private salDad: Phaser.GameObjects.Sprite;
    private dialogueBox: DialogueBox;

    constructor() {
        super('Game_3');
    }

    create() {
        const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
        const gameWidth = Number(gameConfig.width);
        const gameHeight = Number(gameConfig.height);

        // Set background color
        this.cameras.main.setBackgroundColor('#ffffff');
        // Add Sal and Sal_dad sprites on the top half of the screen
        this.sal = this.add.sprite((gameWidth / 4) * 3, gameHeight / 4, 'sal_left');
        this.sal.setScale(0.15);
        this.salDad = this.add.sprite(gameWidth / 4, gameHeight / 4, 'sal_dad');
        this.salDad.setScale(0.2);

        // Add dialogue box
        const dialogues = [
            "Welcome to the next part of the game. Press the up arrow key to continue.",
            "Here, you will learn more about the story.",
            "Here is more dialogue."
        ];
        this.dialogueBox = new DialogueBox(this, gameWidth / 2, gameHeight - 50, gameWidth * 0.9, 150, dialogues);

        // Add input listener
        if (this.input.keyboard) {
            this.input.keyboard.on('keydown-UP', () => this.dialogueBox.handleInput(), this);
        }

        // Listen for dialogue completion
        this.dialogueBox.on('dialogueComplete', () => {
            this.scene.start('MainMenu'); // Example: Restart the game
        });
    }
}