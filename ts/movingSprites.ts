import Sprite from './Sprite';
import createCanvas from './createCanvas';
import QuadTree from './QuadTree';

export default class Game {
    ctx: CanvasRenderingContext2D;
    sprites: Sprite[] = [];
    width: number = 0;
    height: number = 0;
    quadTree!: QuadTree;
    constructor(spriteCount: number) {
        const {canvas, canvasHeight, canvasWidth} = createCanvas(document.body.offsetWidth, document.body.offsetHeight);
        this.ctx = canvas.getContext('2d')!;
        Sprite.maxX = canvasWidth;
        Sprite.maxY = canvasHeight;
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.quadTree = new QuadTree({x: 0, y: 0, w: canvasWidth, h: canvasHeight});
        for(let i = 0; i < spriteCount; i++) {
            const sprite = new Sprite(this.ctx);
            this.sprites.push(sprite);
            this.quadTree.insert(sprite);
        }

    }
    tick() {
        const {sprites, quadTree} = this;
        sprites.forEach(s => {
            s.move();
            s.color = Sprite.defaultColor;
        });
        sprites.forEach(s => {
            const ss = quadTree.retrieve(s.getRect());
            
        })
        this.ctx.clearRect(0, 0, this.width, this.height);

    }
}
