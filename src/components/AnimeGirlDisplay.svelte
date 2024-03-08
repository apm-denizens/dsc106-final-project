<script lang="ts">
    export let sceneIndex: number;

    import { onMount } from "svelte";
    import * as d3 from "d3";

    let animeGirlIndex = 0;

    onMount(async () => {
        const text = await d3.text("./anime_girls_400x4096_alt_2.csv")
        const animeGirls = d3.csvParseRows(text, d3.autoType) as number[][];

        const canvas = document.getElementById('anime-girl-display') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        
        displayIndexImage();
        
        function displayIndexImage() {
            const animeGirl = animeGirls[animeGirlIndex];
            ctx.drawImage(generateImage(animeGirl), 0, 0, canvas.width, canvas.height);
            document.getElementById("index-text")!.textContent = `${animeGirlIndex+1} / ${animeGirls.length}`;
        }

        const canvas2 = document.getElementById("anime-girls-display-4") as HTMLCanvasElement;
        const ctx2 = canvas2.getContext('2d') as CanvasRenderingContext2D;
        for(let i = 0; i < 4; i++) {ctx2.drawImage(generateImage(animeGirls[i]), i * 32, 0, 32, 32)}

        const canvas3 = document.getElementById("anime-girls-display-200") as HTMLCanvasElement;
        const ctx3 = canvas3.getContext('2d') as CanvasRenderingContext2D;
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++) {
                ctx3.drawImage(generateImage(animeGirls[i * 20 + j]), j * 32, i * 32, 32, 32)
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

        function prevAnimeGirl() {
            animeGirlIndex = (animeGirlIndex - 1 + animeGirls.length) % animeGirls.length;
            displayIndexImage();
        }

        function nextAnimeGirl() {
            animeGirlIndex = (animeGirlIndex + 1) % animeGirls.length;
            displayIndexImage();
        }

        document.getElementById("anime-girl-display-prev")!.addEventListener("click", prevAnimeGirl);
        document.getElementById("anime-girl-display-next")!.addEventListener("click", nextAnimeGirl);
        document.getElementById("anime-girl-display")!.addEventListener("click", (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            if(x < canvas.width / 2) {prevAnimeGirl()} else {nextAnimeGirl()}
        });
        document.getElementById("index-input")!.addEventListener("change", (e) => {
            const newIndex = Number((e.target as HTMLInputElement).value) - 1;
            if(newIndex >= 0 && newIndex < animeGirls.length) {
                animeGirlIndex = newIndex;
                displayIndexImage();
            }
        });
        document.getElementById("anime-girls-display-4")!.addEventListener("mousemove", (e) => {
            const rect = canvas2.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const i = Math.floor(x / 32);
            if(i >= 0 && i < 4) {
                animeGirlIndex = i;
                displayIndexImage();
            }
        });
        document.getElementById("anime-girls-display-200")!.addEventListener("mousemove", (e) => {
            const rect = canvas3.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const i = Math.floor(y / 32);
            const j = Math.floor(x / 32);
            if(i >= 0 && i < 20 && j >= 0 && j < 20) {
                animeGirlIndex = i * 20 + j;
                displayIndexImage();
            }
        });
    });


</script>
<div style:display={sceneIndex === 0 ? 'block' : 'none'}>
    <div style="display: flex; flex-direction: row;">
        <div>
            <div>
                <span id="index-text"></span>
                <input id="index-input" placeholder="press enter to confirm"/>
            </div>
            <div>
                <button id="anime-girl-display-prev">prev</button>
                <button id="anime-girl-display-next">next</button>
            </div>
            <canvas id="anime-girl-display" width="250px" height="250px" style="display: block; border: 1px solid black; border-radius: 5px;"></canvas>
            <div>
                <span style="font-size: 8px; display: block;">use buttons or click on right/left halves of the canvas to navigate</span>
                <span style="font-size: 8px; display: block;">images are loaded in through a csv for matmul convenience</span>
            </div>
        </div>
        <div>
            <canvas id="anime-girls-display-4" width="128px" height="32px" style="border: 1px solid black; border-radius: 5px;"></canvas>
        </div>
        <div>
            <canvas id="anime-girls-display-200" width="640" height="640px" style="border: 1px solid black; border-radius: 5px;"></canvas>
        </div>
    </div>
    <canvas id="offscreen-canvas" width="64px" height="64px" style="display: none;"></canvas>
</div>

