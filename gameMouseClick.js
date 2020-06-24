/**
 *
 * Created by michael on 14-2-17.
 */

(function () {
    window.Game = {
        start: function (spritesNumber) {
            var stage = new Stage(spritesNumber);
            stage.clear();
            stage.draw();
            stage.canvas.onclick = function (e) {
                var hitSprites = stage.hitTest(e.pageX, e.pageY);
                stage.draw(hitSprites);

                alert(new Date() - t0 +  ' ms for ' + n + ' times hit');
            };
        }
    }
})();
