<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";

    onMount(async () => {

        const canvas = document.getElementById('anime-girl-display') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.width = 64; offScreenCanvas.height = 64;
        const offCtx = offScreenCanvas.getContext('2d') as CanvasRenderingContext2D;
        const imageData = offCtx.createImageData(64, 64);

        const text = await d3.text("./anime_girls_400x4096_alt.csv")
        const animeGirls = d3.csvParseRows(text, d3.autoType) as number[][];
        const animeGirl = animeGirls[0];

        for (let i = 0; i < imageData.data.length; i += 4) {
            // Assuming your array contains grayscale values, you can set R, G, and B the same and A to 255
            imageData.data[i] = animeGirl[i / 4];     // R
            imageData.data[i + 1] = animeGirl[i / 4]; // G
            imageData.data[i + 2] = animeGirl[i / 4]; // B
            imageData.data[i + 3] = 255;          // A
        }

        offCtx.putImageData(imageData, 0, 0);

        ctx.drawImage(offScreenCanvas, 0, 0, 250, 250);

    });
</script>

<p>sanity check</p>
<canvas id="anime-girl-display" width="500px" height="500px" style="border: 1px solid black; border-radius: 5px;"></canvas>
<canvas id="offscreen-canvas" width="64px" height="64px"></canvas>

