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
            method.call(scope, array[i]);
        }
    }
};

(function () {
    window.Game = {
        start: function (spritesNumber) {
            var stage = new Stage(spritesNumber);
            stage.clear();
            stage.draw();
            stage.canvas.onclick = function (e) {
                var n = 10000,
                    i = n,
                    t0 = new Date(),
                    w = stage.width,
                    h = stage.height;
                while (i --) {
                    var x = Math.random() * w,
                        y = Math.random() * h;
                    var hitSprites = stage.hitTest(x, y);
                    stage.draw(hitSprites);
                }
//                var hitSprites = stage.hitTest(e.pageX, e.pageY);
//                stage.draw(hitSprites);

                alert(new Date() - t0 +  ' ms for ' + n + ' times hit');
            };
        }
    }
})();
