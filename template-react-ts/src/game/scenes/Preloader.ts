import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Game Assets
        this.load.setPath('assets');
        this.load.image('background_1', 'background_1.png')
        this.load.image('logo', 'logo.png');
        this.load.image('sal', 'sal_32bit_v3.png');
        this.load.image('sal_left', 'sal_32bit_left_v3.png');
        this.load.image('figs', 'figs_32bit.png');
        this.load.spritesheet('sal_walk', 'sal_32bit_walk_v3.png', { 
            frameWidth: 1024, 
            frameHeight: 704 });
        this.load.spritesheet('sal_idle','sal_32bit_idling_v3.png', {
            frameWidth: 1024,
            frameHeight: 704 });
        this.load.spritesheet('figs_idle', 'figs_32bit_idling.png', {
            frameWidth: 1024,
            frameHeight: 1024 });
        this.load.spritesheet('figs_walk', 'figs_32bit_walking.png', {
            frameWidth: 1024,
            frameHeight: 1024 });
        
        this.load.image('pinkbar', 'pink_bar.png');
        //this.load.image('vacuum', 'vacuum.png');
    }

    create ()
    {
        
        this.scene.start('MainMenu');
    }
}
