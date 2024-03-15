function updateOffScreenCanvas(animeGirl: number[]) {
    const offScreenCanvas = document.getElementById('offscreen-canvas') as HTMLCanvasElement;

    const offCtx = offScreenCanvas.getContext('2d') as CanvasRenderingContext2D;
    const imageData = offCtx.createImageData(64, 64);
    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = animeGirl[i / 4];     // R
        imageData.data[i + 1] = animeGirl[i / 4]; // G
        imageData.data[i + 2] = animeGirl[i / 4]; // B
        imageData.data[i + 3] = 255;              // A
    }
    offCtx.putImageData(imageData, 0, 0);
    return offScreenCanvas;
}

export default updateOffScreenCanvas;