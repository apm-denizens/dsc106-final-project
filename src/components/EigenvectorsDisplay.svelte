<script lang="ts">
    export let sceneIndex: number;

    import { onMount } from "svelte";
    import * as d3 from "d3";
    import type { HtmlTagDescriptor } from "vite";
    // import * as nj from "numjs";

    let sceneLowerBound = 49;
    let sceneUpperBound = 60;

    let eigenFaceIndex1 = 0;
    let eigenFaceIndex2 = 1;

    let AGPS: number[][] = [];
    onMount(async () => {

        const animeGirlsText = await d3.text("./anime_girls_400x4096_alt_2.csv")
        const animeGirls = d3.csvParseRows(animeGirlsText, d3.autoType) as number[][];

        const eigenFacesText = await d3.text("./eigenfaces-norm.csv")
        const eigenFaces = d3.csvParseRows(eigenFacesText, d3.autoType) as number[][];
        const eigenFace1 = eigenFaces[0];
        const eigenFace2 = eigenFaces[6];

        function calculateAnimeGirlProjections(animeGirls: number[][]) {
            const eigenFace1Length = Math.sqrt(eigenFaces[eigenFaceIndex1].reduce((acc, pixel) => acc + pixel * pixel, 0));
            const eigenFace2Length = Math.sqrt(eigenFaces[eigenFaceIndex2].reduce((acc, pixel) => acc + pixel * pixel, 0));
            const eigenFace1Unit = eigenFaces[eigenFaceIndex1].map(pixel => pixel / eigenFace1Length);
            const eigenFace2Unit = eigenFaces[eigenFaceIndex2].map(pixel => pixel / eigenFace2Length);

            const animeGirlProjections = animeGirls.map(animeGirl => {
                const projection1 = animeGirl.reduce((acc, pixel, i) => acc + pixel * eigenFace1Unit[i], 0);
                const projection2 = animeGirl.reduce((acc, pixel, i) => acc + pixel * eigenFace2Unit[i], 0);
                return [projection1, projection2];
            });
            const proj1min = Math.min(...animeGirlProjections.map(p => p[0]));
            const proj1max = Math.max(...animeGirlProjections.map(p => p[0]));
            const proj2min = Math.min(...animeGirlProjections.map(p => p[1]));
            const proj2max = Math.max(...animeGirlProjections.map(p => p[1]));

            const projmin = Math.min(proj1min, proj2min);
            const projmax = Math.max(proj1max, proj2max);

            // normalize the projections
            animeGirlProjections.forEach(p => {
                p[0] = (p[0] - proj1min) / (proj1max - proj1min) * 400;
                p[1] = (p[1] - proj2min) / (proj2max - proj2min) * 400;
            });

            return animeGirlProjections;
        }

        const eigenFace1Canvas = document.getElementById('eigenface1-canvas') as HTMLCanvasElement;
        const eigenFace1Ctx = eigenFace1Canvas.getContext('2d') as CanvasRenderingContext2D;
        eigenFace1Ctx.drawImage(generateImage(eigenFace1), 0, 0, 250, 250);

        const eigenFace2Canvas = document.getElementById('eigenface2-canvas') as HTMLCanvasElement;
        const eigenFace2Ctx = eigenFace2Canvas.getContext('2d') as CanvasRenderingContext2D;
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
            plotProjections()
        });

        document.getElementById("eigenface2-options-canvas")!.addEventListener("click", (e) => {
            const x = e.offsetX;
            const y = e.offsetY;
            const i = Math.floor(y / 32);
            const j = Math.floor(x / 32);
            eigenFaceIndex2 = i * 6 + j;
            eigenFace2Ctx.drawImage(generateImage(eigenFaces[eigenFaceIndex2]), 0, 0, 250, 250);
            plotProjections()
        });

        function plotProjections() {
            AGPS = calculateAnimeGirlProjections(animeGirls);
            const svg = d3.select("#eigen-projections");

            console.log(AGPS);
            svg.selectAll("*").remove();
            svg.append("g")
                .selectAll("circle")
                .data(AGPS)
                .enter()
                .append("circle")
                .attr("cx", d => d[0] + 50)
                .attr("cy", d => 500 - (d[1] + 50))
                .attr("r", 2)
                .attr("fill", "red");
        }

        plotProjections();

        // find the closest point to mouse
        document.getElementById("eigen-projections")!.addEventListener("mouseover", (e) => {
            const x = e.offsetX - 50;
            const y = 500 - e.offsetY - 50;
            const closest = AGPS.reduce((acc, p, i) => {
                const dist = Math.sqrt((p[0] - x) ** 2 + (p[1] - y) ** 2);
                if (dist < acc.dist) {
                    acc.dist = dist;
                    acc.index = i;
                }
                return acc;
            }, {dist: Infinity, index: -1});
            console.log(closest);

            const animeGirl = animeGirls[closest.index];
            const closestGirlCanvas = document.getElementById("closest-girl") as HTMLCanvasElement
            const closestGirlCtx = closestGirlCanvas.getContext("2d") as CanvasRenderingContext2D;

            closestGirlCtx.drawImage(generateImage(animeGirl), 0, 0, 250, 250);
        })

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
    <svg id="eigen-projections" width="500px" height="500px" style="border: 1px solid black; border-radius: 5px;"></svg>
    <canvas id="closest-girl" width="250px" height="250px" style="border: 1px solid black; border-radius: 5px;"></canvas>
    <!-- <img src="./lazy.png" /> -->
    <canvas id="offscreen-canvas" width="64px" height="64px" style="display: none;"></canvas>
</div>

