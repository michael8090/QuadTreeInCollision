export interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export interface WithRect {
    getRect(): Rect;
}

export function intersect(a: Rect, b: Rect) {
    const rx = Math.max(a.x, b.x);
    const ry = Math.max(a.y, b.y);
    const rw =
        Math.min(
            a.x + a.w,
            b.x + b.w
        ) - rx;
    const rh =
        Math.min(
            a.y + a.h,
            b.y + b.h
        ) - ry;

    const rect: Rect = {
        x: rx,
        y: ry,
        w: rw,
        h: rh,
    };
    return rect;
}