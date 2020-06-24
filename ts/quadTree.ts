/**
 * Created by michael on 14-2-17.
 */

import { WithRect, Rect, intersect } from "./Rect";

export default class QuadTree {
    static maxLevel = Infinity;
    static maxChildrenCount = 0; // the number for hit test is neat when it's set to 100

    children: QuadTree[] = [];
    objects: WithRect[] = [];

    constructor(public rect: Rect, public level = 0) {}

    getIndex(rect: Rect) {
        const mainRect = this.rect,
            hw = mainRect.w / 2,
            hh = mainRect.h / 2,
            mx = mainRect.x + hw,
            my = mainRect.y + hh,
            isOnUp =
                rect.y >= mainRect.y &&
                rect.y < my &&
                rect.y + rect.h >= mainRect.y &&
                rect.y + rect.h < my,
            isOnDown =
                rect.y >= mainRect.y + hh &&
                rect.y <= my + hh &&
                rect.y + rect.h >= mainRect.y + hh &&
                rect.y + rect.h <= my + hh,
            isOnLeft =
                rect.x >= mainRect.x &&
                rect.x < mx &&
                rect.x + rect.w >= mainRect.x &&
                rect.x + rect.w < mx,
            isOnRight =
                rect.x >= mainRect.x + hw &&
                rect.x <= mx + hw &&
                rect.x + rect.w >= mainRect.x + hw &&
                rect.x + rect.w <= mx + hw;
        if (isOnUp) {
            if (isOnLeft) {
                return 1;
            } else if (isOnRight) {
                return 0;
            }
        } else if (isOnDown) {
            if (isOnLeft) {
                return 2;
            } else if (isOnRight) {
                return 3;
            }
        }
        return -1; // means could not be placed in sub nodes
    }
    split() {
        const mainRect = this.rect,
            hw = mainRect.w * 0.5,
            hh = mainRect.h * 0.5,
            mx = mainRect.x + hw,
            my = mainRect.y + hh,
            level = this.level + 1;
        this.children = [
            new QuadTree(
                {
                    x: mx,
                    y: mainRect.y,
                    w: hw,
                    h: hh,
                },
                level
            ),
            new QuadTree(
                {
                    x: mainRect.x,
                    y: mainRect.y,
                    w: hw,
                    h: hh,
                },
                level
            ),
            new QuadTree(
                {
                    x: mainRect.x,
                    y: my,
                    w: hw,
                    h: hh,
                },
                level
            ),
            new QuadTree(
                {
                    x: mx,
                    y: my,
                    w: hw,
                    h: hh,
                },
                level
            ),
        ];
    }
    insert(object: WithRect) {
        const index = this.getIndex(object.getRect());
        if (
            index === -1 ||
            this.level === QuadTree.maxLevel ||
            this.objects.length < QuadTree.maxChildrenCount
        ) {
            this.objects.push(object);
        } else {
            if (this.children.length === 0) {
                this.split();
            }
            this.children[index].insert(object);
            // todo: the following logic is not necessary, as it only moves the nodes down and then some other nodes will be pushed to it again
            // for (let i = 0; i < this.objects.length; i++) {
            //     const obj = this.objects[i];
            //     const ii = this.getIndex(obj.getRect());
            //     if (ii !== -1) {
            //         this.objects.splice(i, 1);
            //         i--;
            //         this.children[ii].insert(object);
            //     }
            // }
        }
    }
    /** we make sure that targetRect is always within this.rect */
    retrieve(targetRect: Rect) {
        const stack = [];
        let result: WithRect[] = [];
        stack.push(this, targetRect);
        while (stack.length !== 0) {
            targetRect = stack.pop() as Rect;
            const node = stack.pop() as QuadTree;
            const {children} = node;

            result = result.concat(this.objects);

            if (children.length > 0) {
                const index = node.getIndex(targetRect);
                if (index === -1) {
                    for (let i = 0, l = children.length; i < l; i++) {
                        const child = children[i];
                        const r = intersect(child.rect, targetRect);
                        if (r.w >= 0 && r.h >= 0) {
                            stack.push(child, r);
                        }
                    }
                } else {
                    stack.push(node.children[index], targetRect);
                }
            }
        }
        return result;
    }
    drawRect(ctx: CanvasRenderingContext2D) {
        let rect = this.rect;
        ctx.strokeStyle = "rgba(255, 0, 0, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(rect.x, rect.y, rect.w, rect.h);
        ctx.closePath();
        ctx.stroke();
        this.children.forEach(function (node) {
            node.drawRect(ctx);
        });
    }
    clear() {
        this.objects = [];
        if (this.children.length > 0) {
            this.children.forEach((node) => node.clear());
            this.children = [];
        }
    }
}
