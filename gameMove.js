/**
 *
 * Created by michael on 14-2-17.
 */

$ARRAY = {
    forEach: function (array, method, scope) {
        var i,
            len = array.length;
        scope = scope || window;
        for (i = 0; i < len; i++) {
            if (method.call(scope, array[i], i) === false) {
                return ;
            }
        }
    }
};

(function () {
    
    var NORMAL_COLOR = 'rgba(0, 0, 0, 0.1)',
        HIGHLIGHT_COLOR = 'rgba(0, 0, 255, 0.5)';

    function Sprite(geometry) {
        if (!geometry) {
            geometry = {
                x: Math.random() * this.stage.width,
                y: Math.random() * this.stage.height,
                r: Math.random() * 9 + 1
            }
        }
        this.geometry = geometry;
        this.v = {
            x: Math.random() - 0.5,
            y: Math.random() - 0.5
        };
        this.color = NORMAL_COLOR;
    }

    Sprite.prototype = {
        move: function () {
            var t = 5,
                v = this.v,
                g = this.geometry,
                x = g.x + v.x * t,
                y = g.y + v.y * t,
                maxX = this.stage.width,
                maxY = this.stage.height;
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
            g.x = x;
            g.y = y;
        },
        draw: function () {
            var ctx = this.stage.canvas.getContext('2d'),
                g = this.geometry;
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        },
        getRect: function () {
            var g = this.geometry;
            return {
                x: g.x - g.r,
                y: g.y - g.r,
                w: 2 * g.r,
                h: 2 * g.r
            };
        },
        isCollided: function(sprite) {
            var g1 = this.geometry,
                g2 = sprite.geometry;
            return (g1.x - g2.x) * (g1.x - g2.x) + (g1.y - g2.y) * (g1.y - g2.y) <= (g1.r + g2.r) * (g1.r + g2.r);
        }
    };

    function Stage(spriteNumber) {
        spriteNumber = spriteNumber || 500;
        this.width = document.body.offsetWidth;
        this.height = document.body.offsetHeight;
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.style.display = 'block';

        this.canvas = canvas;
        document.body.appendChild(canvas);

        this.sprites = [];
        Sprite.prototype.stage = this;
        while (spriteNumber--) {
            var sprite = new Sprite();
            this.sprites.push(sprite);
        }
        this.buildQuadTree();

        var span = document.createElement('span');
        span.style.cssText = 'position: absolute; left: 10px; top: 10px;';
        span.innerHTML = 'the number of bubbles involved in a hit test: <label></label>'
        document.body.appendChild(span);
        this.label = span.querySelector('label');
    }

    Stage.prototype = {
        clear: function () {
            this.canvas.width = this.canvas.width;
            if (this.quadTree) {
                this.quadTree.drawRect();
            }
        },
        clearSpritesColor: function() {
            $ARRAY.forEach(this.sprites, function(sprite) {
                sprite.color = NORMAL_COLOR;
            });
        },
        buildQuadTree: function () {
            var isQuadTreeEnabled = !!window.QuadTree,
                quadTree;
            if (isQuadTreeEnabled) {
                quadTree = new QuadTree({
                    x: 0,
                    y: 0,
                    w: this.width,
                    h: this.height
                });
                $ARRAY.forEach(this.sprites, function (sprite) {
                    quadTree.insert(sprite);
                });
            }
            this.quadTree = quadTree;
        },
        move: function () {
            $ARRAY.forEach(this.sprites, function(sprite) {
                sprite.move();
            });
        },
        draw: function (sprites) {
            if (!sprites) {
                sprites = this.sprites;
            }
            $ARRAY.forEach(sprites, function (sprite) {
                sprite.draw();
            });
        },
        hitTest: function (x, y) {
            var isQuadTreeEnabled = !!window.QuadTree,
                quadTree = this.quadTree;
            var isCollised = false,
                ss = this.sprites,
                spritesToUpdate = [];

            if (isQuadTreeEnabled) {
                ss = [];
                quadTree.retrieve({x: x, y: y, w: 0, h: 0}, ss);
            }
            this.label.innerText = ss.length + 1;
            for (var i = 0, len = ss.length; i < len; i++) {
                var s = ss[i];
                var g = s.geometry;
                if ((x - g.x) * (x - g.x) + (y - g.y) * (y - g.y) <= g.r * g.r) {
                    isCollised = true;
                    s.color = HIGHLIGHT_COLOR;
                    spritesToUpdate.push(s);
                }
            }
            return spritesToUpdate;
        },
        collisionTest: function() {
            $ARRAY.forEach(this.sprites, function(sprite) {
                var ss = this.sprites;
                if (this.quadTree) {
                    ss = [];
                    this.quadTree.retrieve(sprite.getRect(), ss);
                }
                this.label.innerText = ss.length + 1;
                $ARRAY.forEach(ss, function(s) {
                    if (sprite !== s && sprite.isCollided(s)) {
                        sprite.color = HIGHLIGHT_COLOR;
                        s.color = HIGHLIGHT_COLOR;
                    }
                })
            }, this);
        }
    };

    var stage,
        isPlaying = false;

    window.Game = {
        init: function (spritesNumber) {
            stage = new Stage(spritesNumber);
        },
        start: function () {
            function draw() {
                if (!isPlaying) {
                    return;
                }
                stage.clear();
                stage.move();
                stage.buildQuadTree();
                stage.clearSpritesColor();
                stage.collisionTest();
                stage.draw();
                requestAnimationFrame(draw);
            }
            isPlaying = true;
            requestAnimationFrame(draw);
        },
        pause: function () {
            isPlaying = false;
        },
        toggle: function () {
            isPlaying ? Game.pause() : Game.start();
        }
    }
})();
