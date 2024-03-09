<script lang="ts">
    export let sceneIndex: number;

    import { onMount } from "svelte";
    import * as d3 from "d3";

    let sceneLowerBound = 8;
    let sceneUpperBound = 28;

    let animeGirlIndex = 0;

    onMount(async () => {
        const text = await d3.text("./anime_girls_2000x4096.csv")
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

        const canvas3 = document.getElementById("anime-girls-display-400") as HTMLCanvasElement;
        const ctx3 = canvas3.getContext('2d') as CanvasRenderingContext2D;
        for(let i = 0; i < 20; i++) {
            for(let j = 0; j < 20; j++) {
                ctx3.drawImage(generateImage(animeGirls[i * 20 + j]), j * 32, i * 32, 32, 32)
            }
        }

        const canvas4 = document.getElementById("anime-girls-display-900") as HTMLCanvasElement;
        const ctx4 = canvas4.getContext('2d') as CanvasRenderingContext2D;
        for(let i = 0; i < 30; i++) {
            for(let j = 0; j < 30; j++) {
                ctx4.drawImage(generateImage(animeGirls[i * 30 + j]), j * 32, i * 32, 32, 32)
            }
        }

        const canvas5 = document.getElementById("anime-girls-display-2000") as HTMLCanvasElement;
        const ctx5 = canvas5.getContext('2d') as CanvasRenderingContext2D;
        for(let i=0; i < 40; i++) {
            for(let j=0; j < 50; j++) {
                ctx5.drawImage(generateImage(animeGirls[i * 50 + j]), j * 32, i * 32, 32, 32)
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
        document.getElementById("anime-girls-display-400")!.addEventListener("mousemove", (e) => {
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

        document.getElementById("anime-girls-display-900")!.addEventListener("mousemove", (e) => {
            const rect = canvas4.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const i = Math.floor(y / 32);
            const j = Math.floor(x / 32);
            if(i >= 0 && i < 30 && j >= 0 && j < 30) {
                animeGirlIndex = i * 30 + j;
                displayIndexImage();
            }
        });

        document.getElementById("anime-girls-display-2000")!.addEventListener("mousemove", (e) => {
            const rect = canvas5.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const i = Math.floor(y / 32);
            const j = Math.floor(x / 32);
            if(i >= 0 && i < 40 && j >= 0 && j < 50) {
                animeGirlIndex = i * 50 + j;
                displayIndexImage();
            }
        });
    });


</script>
<div style:display={sceneIndex >= sceneLowerBound && sceneIndex < sceneUpperBound ? 'block' : 'none'}>
    <div style="display: flex; flex-direction: row;">
        <div style="margin-right: 5px; pointer-events: auto;">
            <div  style="border: 1px solid black; border-radius: 5px; padding: 5px; background-color: white;">
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
        </div>
        <div>
            <canvas id="anime-girls-display-4" width="128px" height="32px" style="border: 1px solid black; border-radius: 5px; pointer-events: auto;" style:display={sceneIndex >= 10 && sceneIndex < 13 ? "block" : "none"}></canvas>
        </div>
        <div>
            <canvas id="anime-girls-display-400" width="640px" height="640px" style="border: 1px solid black; border-radius: 5px; pointer-events: auto;" style:display={sceneIndex >= 13 && sceneIndex < 14 ? "block" : "none"}></canvas>
        </div>
        <div>
            <canvas id="anime-girls-display-900" width="960px" height="960px" style="border: 1px solid black; border-radius: 5px; pointer-events: auto;" style:display={sceneIndex >= 14 && sceneIndex < 15 ? "block" : "none"}></canvas>
        </div>
        <div>
            <canvas id="anime-girls-display-2000" width="1600px" height="1280px" style="border: 1px solid black; border-radius: 5px; position: absolute; top: 0; left: 0; z-index: -1; pointer-events: auto;" style:display={sceneIndex >= 15 ? "block" : "none"}></canvas>
        </div>
    </div>
    <canvas id="offscreen-canvas" width="64px" height="64px" style="display: none;"></canvas>
</div>

