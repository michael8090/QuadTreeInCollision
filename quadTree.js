/**
 * Created by michael on 14-2-17.
 */
(function() {
    var isDebugging = true;

    window.QuadTree = function QuadTree(mainRect, level) {
        this.nodes = [];
        this.objects = [];
        this.rect = mainRect;
        if (level === undefined) {
            this.level = 0;
        } else {
            this.level = level;
        }
    };
    QuadTree.prototype = {
        maxLevel: Infinity,
        maxChildrenNumber: 100,
        getIndex: function(rect) {
            var mainRect = this.rect,
                hw = mainRect.w / 2,
                hh = mainRect.h / 2,
                mx = mainRect.x + hw,
                my = mainRect.y + hh,
                isOnUp = rect.y >= mainRect.y && rect.y < my && rect.y + rect.h >= mainRect.y && rect.y + rect.h < my,
                isOnDown = rect.y >= mainRect.y + hh && rect.y <= my + hh && rect.y + rect.h >= mainRect.y + hh && rect.y + rect.h <= my + hh,
                isOnLeft = rect.x >= mainRect.x && rect.x < mx && rect.x + rect.w >= mainRect.x && rect.x + rect.w < mx,
                isOnRight = rect.x >= mainRect.x + hw && rect.x <= mx + hw && rect.x + rect.w >= mainRect.x + hw && rect.x + rect.w <= mx + hw;
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
            return -1; //means could not be placed in sub nodes
        },
        splite: function() {
            var mainRect = this.rect,
                hw = mainRect.w / 2,
                hh = mainRect.h / 2,
                mx = mainRect.x + hw,
                my = mainRect.y + hh,
                level = this.level + 1;
            this.nodes = [
                new QuadTree({
                    x: mx,
                    y: mainRect.y,
                    w: hw,
                    h: hh
                }, level),
                new QuadTree({
                    x: mainRect.x,
                    y: mainRect.y,
                    w: hw,
                    h: hh
                }, level),
                new QuadTree({
                    x: mainRect.x,
                    y: my,
                    w: hw,
                    h: hh
                }, level),
                new QuadTree({
                    x: mx,
                    y: my,
                    w: hw,
                    h: hh
                }, level)
            ];
        },
        insert: function(object) {
            var index = this.getIndex(object.getRect());
            if (index === -1 || this.level === this.maxLevel || this.objects.length < this.maxChildrenNumber) {
                this.objects.push(object);
            } else {
                if (this.nodes.length === 0) {
                    this.splite();
                }
                this.nodes[index].insert(object);
                for (var i = 0; i < this.objects.length; i++) {
                    var object = this.objects[i];
                    var ii = this.getIndex(object.getRect());
                    if (ii !== -1) {
                        this.objects.splice(i, 1);
                        i --;
                        this.nodes[ii].insert(object);
                    }
                }
            }
        },
        retrieve: function(targetRect, ret) {
            var stack = [];
            stack.push(this, targetRect, ret);
            while(stack.length) {
                var ret = stack.pop(),
                    targetRect = stack.pop(),
                    _this = stack.pop();
                var rect = {};// = {x: targetRect.x, y: targetRect.y, w: targetRect.w, h: targetRect.h};
                rect.x = Math.max(targetRect.x, _this.rect.x);
                rect.y = Math.max(targetRect.y, _this.rect.y);
                rect.w = Math.min(targetRect.x + targetRect.w, _this.rect.x + _this.rect.w) - rect.x;
                rect.h = Math.min(targetRect.y + targetRect.h, _this.rect.y + _this.rect.h) - rect.y;

                var index = _this.getIndex(rect);
                if (index === -1) {
                    if (_this.nodes.length > 0) {
                        var mainRect = _this.rect,
                            hw = mainRect.w / 2,
                            hh = mainRect.h / 2,
                            mx = mainRect.x + hw,
                            my = mainRect.y + hh,
                            rects = [
                                {
                                    x: rect.x,
                                    y: rect.y,
                                    w: mx - rect.x,
                                    h: my - rect.y
                                },
                                {
                                    x: mx,
                                    y: rect.y,
                                    w: rect.x + rect.w - mx,
                                    h: my - rect.y
                                },
                                {
                                    x: mx,
                                    y: my,
                                    w: rect.x + rect.w - mx,
                                    h: rect.y + rect.h - my
                                },
                                {
                                    x: rect.x,
                                    y: my,
                                    w: mx - rect.x,
                                    h: rect.y + rect.h - my
                                }
                            ];
                        for (var i = 0, len = rects.length; i < len; i++) {
                            var r = rects[i];
                            if (r.w >= 0 && r.h >= 0) {
                                var ii = _this.getIndex(r);
                                if (ii !== -1) {
//                                    ret = ret.concat(_this.nodes[ii].retrieve(r));
                                    stack.push(_this.nodes[ii], r, ret);
                                }
                            }
                        }
                    }
                } else if (_this.nodes.length > 0) {
//                    ret = ret.concat(_this.nodes[index].retrieve(rect));
                    stack.push(_this.nodes[index], rect, ret);
                }
                //ret = ret.concat(_this.objects);
                [].splice.apply(ret, [0, 0].concat(_this.objects));
            }

//            return ret;
        },
        drawRect: function() {
            var canvas = document.getElementsByTagName('canvas')[0];
            if (!canvas) {
                console.log('cannot find canvas');
                return ;
            }
            var ctx = canvas.getContext('2d'),
                rect = this.rect;
            ctx.strokeStyle = 'rgba(255, 0, 0, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.rect(rect.x, rect.y, rect.w, rect.h);
            ctx.closePath();
            ctx.stroke();
            $ARRAY.forEach(this.nodes, function(node) {
                node.drawRect();
            });
        },
        clear: function() {
            this.objects = [];
            if (this.nodes.length > 0) {
                $ARRAY.forEach(this.nodes.clear());
                this.nodes = [];
            }
        }

    }
})();