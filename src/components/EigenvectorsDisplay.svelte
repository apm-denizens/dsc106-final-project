<script lang="ts">
    export let sceneIndex: number;

    import { onMount } from "svelte";
    import * as d3 from "d3";

    let sceneLowerBound = 49;
    let sceneUpperBound = 60;

    let eigenFaceIndex1 = 0;
    let eigenFaceIndex2 = 0;
    onMount(async () => {
        const eigenFacesText = await d3.text("./eigenfaces-norm.csv")
        const eigenFaces = d3.csvParseRows(eigenFacesText, d3.autoType) as number[][];
        console.log(eigenFaces)

        const eigenFace1Canvas = document.getElementById('eigenface1-canvas') as HTMLCanvasElement;
        const eigenFace1Ctx = eigenFace1Canvas.getContext('2d') as CanvasRenderingContext2D;
        const eigenFace1 = eigenFaces[0];
        eigenFace1Ctx.drawImage(generateImage(eigenFace1), 0, 0, 250, 250);

        const eigenFace2Canvas = document.getElementById('eigenface2-canvas') as HTMLCanvasElement;
        const eigenFace2Ctx = eigenFace2Canvas.getContext('2d') as CanvasRenderingContext2D;
        const eigenFace2 = eigenFaces[1];
        eigenFace2Ctx.drawImage(generateImage(eigenFace2), 0, 0, 250, 250);

        const eigenFace1OptionsCanvas = document.getElementById('eigenface1-options-canvas') as HTMLCanvasElement;
        const eigenFace1OptionsCtx = eigenFace1OptionsCanvas.getContext('2d') as CanvasRenderingContext2D;
        for (let i = 0; i < 5; i++) {
            for(let j=0; j<6; j++){
                const animeGirl = eigenFaces[i * 6 + j];
                eigenFace1OptionsCtx.drawImage(generateImage(animeGirl), j * 32, i * 32, 32, 32);
            }
        }
        const eigenFace2OptionsCanvas = document.getElementById('eigenface2-options-canvas') as HTMLCanvasElement;
        const eigenFace2OptionsCtx = eigenFace2OptionsCanvas.getContext('2d') as CanvasRenderingContext2D;
        for (let i = 0; i < 5; i++) {
            for(let j=0; j<6; j++){
                const animeGirl = eigenFaces[i * 6 + j];
                eigenFace2OptionsCtx.drawImage(generateImage(animeGirl), j * 32, i * 32, 32, 32);
            }
        }

        function generateImage(animeGirl: number[]) {
            const offScreenCanvas = document.getElementById('offscreen-canvas') as HTMLCanvasElement;
            const offCtx = offScreenCanvas.getContext('2d') as CanvasRenderingContext2D;
            const imageData = offCtx.createImageData(64, 64);
            for (let i = 0; i < imageData.data.length; i += 4) {
                // Assuming your array contains grayscale values, you can set R, G, and B the same and A to 255
                imageData.data[i] = animeGirl[i / 4];     // R
                imageData.data[i + 1] = animeGirl[i / 4]; // G
                imageData.data[i + 2] = animeGirl[i / 4]; // B
                imageData.data[i + 3] = 255;              // A
            }
            offCtx.putImageData(imageData, 0, 0);
            return offScreenCanvas;
        }

        document.getElementById("eigenface1-options-canvas")!.addEventListener("click", (e) => {
            const x = e.offsetX;
            const y = e.offsetY;
            const i = Math.floor(y / 32);
            const j = Math.floor(x / 32);
            eigenFaceIndex1 = i * 6 + j;
            eigenFace1Ctx.drawImage(generateImage(eigenFaces[eigenFaceIndex1]), 0, 0, 250, 250);
        });

        document.getElementById("eigenface2-options-canvas")!.addEventListener("click", (e) => {
            const x = e.offsetX;
            const y = e.offsetY;
            const i = Math.floor(y / 32);
            const j = Math.floor(x / 32);
            eigenFaceIndex2 = i * 6 + j;
            eigenFace2Ctx.drawImage(generateImage(eigenFaces[eigenFaceIndex2]), 0, 0, 250, 250);
        });
    });

</script>
<div style="pointer-events: auto;" style:display={sceneIndex >= sceneLowerBound && sceneIndex < sceneUpperBound ? 'block' : 'none'}>
    <div style="display: flex;">
        <div style="margin-right: 15px">
            <canvas id="eigenface1-canvas" width="250px" height="250px" style="border: 1px solid black; border-radius: 5px;"></canvas>
            <canvas id="eigenface1-options-canvas" width="192px" height="160px" style="border: 1px solid black; border-radius: 5px;"></canvas>
        </div>
        <div>
            <canvas id="eigenface2-canvas" width="250px" height="250px" style="border: 1px solid black; border-radius: 5px;"></canvas>
            <canvas id="eigenface2-options-canvas" width="192px" height="160px" style="border: 1px solid black; border-radius: 5px;"></canvas>
        </div>
    </div>
    <canvas id="offscreen-canvas" width="64px" height="64px" style="display: none;"></canvas>
</div>

