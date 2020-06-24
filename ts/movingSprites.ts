import Sprite from './Sprite';
import createCanvas from './createCanvas';
import QuadTree from './quadTree';

export default class Game {
    ctx: CanvasRenderingContext2D;
    sprites: Sprite[] = [];
    width: number = 0;
    height: number = 0;
    constructor(spriteCount: number) {
        const {canvas, canvasHeight, canvasWidth} = createCanvas(document.body.offsetWidth, document.body.offsetHeight);
        this.ctx = canvas.getContext('2d')!;
        Sprite.maxX = canvasWidth;
        Sprite.maxY = canvasHeight;
        this.width = canvasWidth;
        this.height = canvasHeight;
        for(let i = 0; i < spriteCount; i++) {
            this.sprites.push(new Sprite(this.ctx));
        }
    }
    tick() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
}
