export default function createCanvas(width: number, height: number) {
    const canvas = document.createElement('canvas');
    const {devicePixelRatio} = window;
    const canvasWidth = width * devicePixelRatio;
    const canvasHeight = height * devicePixelRatio;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.cssText = `display: block; width: ${width}px; height: ${height}px`;
    return {
        canvas,
        canvasWidth,
        canvasHeight
    };
}
