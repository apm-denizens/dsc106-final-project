import updateOffScreenCanvas from "../FaceDisplay/updateOffScreenCanvas";

function setupEigenVectorSelectors(eigenVectors: number[][]) {
    setupEigenVectorSelector(eigenVectors, "eigenvector-1", 0)
    setupEigenVectorSelector(eigenVectors, "eigenvector-2", 1)
}

function setupEigenVectorSelector(eigenVectors: number[][], canvas_id: string, selectedIndex: number) {
    const eigenVectorDisplay = document.getElementById(canvas_id) as HTMLCanvasElement;
    eigenVectorDisplay.width = 256
    eigenVectorDisplay.height = 256
    eigenVectorDisplay.style.pointerEvents = "auto"
    const eigenVectorDisplayCTX = eigenVectorDisplay.getContext("2d") as CanvasRenderingContext2D;
    eigenVectorDisplayCTX.drawImage(updateOffScreenCanvas(eigenVectors[selectedIndex]), 0, 0, 256, 256);

    const selector = document.getElementById(canvas_id + "-select") as HTMLCanvasElement;
    selector.width = 192
    selector.height = 160
    selector.style.pointerEvents = "auto"
    const selectorCTX = selector.getContext("2d") as CanvasRenderingContext2D;
    for (let i = 0; i < 5; i++) {
        for(let j=0; j<6; j++){
            const eigenVector = eigenVectors[i * 6 + j];
            selectorCTX.drawImage(updateOffScreenCanvas(eigenVector), j * 32, i * 32, 32, 32);
        }
    }
}

export { setupEigenVectorSelectors }