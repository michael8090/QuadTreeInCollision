import { WithRect } from "./Rect";

export default class Sprite implements WithRect {
    static maxX = 100;
    static maxY = 100;
    static defaultColor = 'rgba(0, 0, 0, 0.1)';
    x = Math.random() * Sprite.maxX;
    y = Math.random() * Sprite.maxY;
    r = Math.random() * 9 + 1;
    v = {
        x: Math.random() - 0.5,
        y: Math.random() - 0.5
    };
    color = Sprite.defaultColor;
    constructor(public ctx: CanvasRenderingContext2D) {}
    move() {
        let t = 5,
            v = this.v,
            x = this.x + v.x * t,
            y = this.y + v.y * t,
            maxX = Sprite.maxX,
            maxY = Sprite.maxY;
        if (x < 0) {
            x = 0;
            v.x *= -1;
        } else if (x > maxX) {
            x = maxX;
            v.x *= -1;
        }
        if (y < 0) {
            y = 0;
            v.y *= -1;
        } else if (y > maxY) {
            y = maxY;
            v.y *= -1;
        }
        this.x = x;
        this.y = y;
    }
    draw() {
        const ctx = this.ctx;
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    getRect() {
        return {
            x: this.x - this.r,
            y: this.y - this.r,
            w: 2 * this.r,
            h: 2 * this.r
        };
    }
}
