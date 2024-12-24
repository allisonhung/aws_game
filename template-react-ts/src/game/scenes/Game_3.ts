import { Scene } from 'phaser';

export class Game_3 extends Scene {
    private dialogueIndex: number = 0;
    private dialogues: string[] = [
        "Welcome to the next part of the game.",
        "Here, you will learn more about the story.",
        "Press space to continue through the dialogue."
    ];
    private dialogueText: Phaser.GameObjects.Text;

    constructor() {
        super('Game_3');
    }

    create() {
        const gameConfig = this.sys.game.config as unknown as Phaser.Types.Core.GameConfig;
        const gameWidth = Number(gameConfig.width);
        const gameHeight = Number(gameConfig.height);

        // Set background color
        this.cameras.main.setBackgroundColor('#000000');

        // Display the first dialogue
        this.dialogueText = this.add.text(gameWidth / 2, gameHeight / 2, this.dialogues[this.dialogueIndex], {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: gameWidth - 40 }
        }).setOrigin(0.5);

        // Add space key listener
        if (this.input.keyboard){
            this.input.keyboard.on('keydown-UP', this.nextDialogue, this);
        }
    }

    nextDialogue() {
        this.dialogueIndex++;
        if (this.dialogueIndex < this.dialogues.length) {
            this.dialogueText.setText(this.dialogues[this.dialogueIndex]);
        } else {
            // Transition to the next scene or restart the game
            this.scene.start('MainMenu'); // Example: Restart the game
        }
    } 
}