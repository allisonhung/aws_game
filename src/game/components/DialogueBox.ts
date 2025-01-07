import { Scene, GameObjects } from 'phaser';

export class DialogueBox extends GameObjects.Container {
    private dialogueIndex: number = 0;
    private dialogues: string[] = [];
    private dialogueText: GameObjects.Text;
    private typingEvent: Phaser.Time.TimerEvent;
    private currentText: string;
    private inputEnabled: boolean = true;
    private letterIndex: number = 0;

    constructor(scene: Scene, x: number, y: number, width: number, height: number, dialogues: string[]) {
        super(scene, x, y);
        this.dialogues = dialogues;

        // Add background sprite
        const background = scene.add.sprite(0, 0, 'dialogueBox');
        background.setDisplaySize(width, height);
        background.setOrigin(0.5, 1);

        // Add text
        this.dialogueText = scene.add.text(0, -height / 2, '', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#000000',
            align: 'center',
            wordWrap: { width: width - 40 }
        }).setOrigin(0.5);

        this.add(background);
        this.add(this.dialogueText);
        scene.add.existing(this);

        this.startDialogue();
    }

    private startDialogue() {
        this.dialogueIndex = 0;
        this.typeText(this.dialogues[this.dialogueIndex]);
    }

    private typeText(text: string) {
        this.inputEnabled = false;
        this.currentText = text;
        this.letterIndex = 0;
        this.dialogueText.setText('');

        if (this.typingEvent) {
            this.typingEvent.remove(false);
        }

        this.typingEvent = this.scene.time.addEvent({
            delay: 50,
            callback: this.addLetter,
            callbackScope: this,
            loop: true
        });
    }

    private addLetter() {
        if (this.letterIndex < this.currentText.length) {
            this.dialogueText.text += this.currentText[this.letterIndex];
            this.letterIndex++;
        } else {
            this.typingEvent.remove(false);
            this.inputEnabled = true;
        }
    }

    public handleInput() {
        if (!this.inputEnabled) {
            this.dialogueText.setText(this.currentText);
            this.typingEvent.remove(false);
            this.inputEnabled = true;
        } else {
            this.nextDialogue();
        }
    }

    private nextDialogue() {
        this.dialogueIndex++;
        if (this.dialogueIndex < this.dialogues.length) {
            this.typeText(this.dialogues[this.dialogueIndex]);
        } else {
            this.emit('dialogueComplete');
        }
    }
}