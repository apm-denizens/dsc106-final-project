<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";

    let index = 0;

    onMount(async () => {
        const text = await d3.text("./anime_girls_400x4096_alt_2.csv")
        const animeGirls = d3.csvParseRows(text, d3.autoType) as number[][];

        const canvas = document.getElementById('anime-girl-display') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        
        displayIndexImage();
        
        function displayIndexImage() {
            const animeGirl = animeGirls[index];
            ctx.drawImage(generateImage(animeGirl), 0, 0, canvas.width, canvas.height);
            document.getElementById("index-text")!.textContent = `${index+1} / ${animeGirls.length}`;
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

        function prevAnimeGirl() {
            index = (index - 1 + animeGirls.length) % animeGirls.length;
            displayIndexImage();
        }

        function nextAnimeGirl() {
            index = (index + 1) % animeGirls.length;
            displayIndexImage();
        }

        document.getElementById("anime-girl-display-prev")!.addEventListener("click", prevAnimeGirl);
        document.getElementById("anime-girl-display-next")!.addEventListener("click", nextAnimeGirl);
        document.getElementById("anime-girl-display")!.addEventListener("click", (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if(x < 250) {prevAnimeGirl()} else {nextAnimeGirl()}
        });
        document.getElementById("index-input")!.addEventListener("change", (e) => {
            const newIndex = Number((e.target as HTMLInputElement).value) - 1;
            if(newIndex >= 0 && newIndex < animeGirls.length) {
                index = newIndex;
                displayIndexImage();
            }
        });
    });


</script>
<div style="display: block;">
    <div>
        <span id="index-text"></span>
        <input id="index-input" placeholder="press enter to confirm"/>
        <button id="anime-girl-display-prev">prev</button>
        <button id="anime-girl-display-next">next</button>
    </div>
    <canvas id="anime-girl-display" width="500px" height="500px" style="border: 1px solid black; border-radius: 5px;"></canvas>
    <canvas id="offscreen-canvas" width="64px" height="64px" style="display: none;"></canvas>
    <div>
        <span style="font-size: 12px; display: block;">use buttons or click on right/left halves of the canvas to navigate</span>
        <span style="font-size: 12px; display: block;">images are loaded in through a csv for matmul convenience</span>
    </div>
</div>

