<script lang="ts">

    export let sceneIndex: number;

    import { onMount } from "svelte";
    import * as d3 from "d3"
    import updateOffScreenCanvas from "../FaceDisplay/updateOffScreenCanvas"
    import { setupEigenVectorSelectors } from "./setupEigenvalueSelectors";
    import { calculateProjections } from "./calculateProjections";
    import { loadData } from "./loadData";
    import { setupSVG } from "./plot";

    let sceneLowerBound = 49;
    let sceneUpperBound = 60;

    let eigenVector1Index = 0;
    let eigenVector2Index = 1;

    onMount(async () => {

        const { facesArray, facesCentered, eigenVectors, eigenVectorsNormalizedArray } = await loadData()
        const projections = calculateProjections(facesCentered, eigenVectors, eigenVector1Index, eigenVector2Index)
        const data = await projections.array() as number[][]

        setupEigenVectorSelectors(eigenVectorsNormalizedArray as number[][])
        document.getElementById("eigenvector-1-select")!.addEventListener("click", (e) => {
            console.log(e)
            eigenVector1Index = Math.floor(e.offsetY / 32) * 6 + Math.floor(e.offsetX / 32);
            const eigenVector1CTX = (document.getElementById("eigenvector-1") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D
            eigenVector1CTX.drawImage(updateOffScreenCanvas(eigenVectorsNormalizedArray[eigenVector1Index]), 0, 0, 256, 256);
            const newProjections = calculateProjections(facesCentered, eigenVectors, eigenVector1Index, eigenVector2Index)
            const newData = newProjections.arraySync() as number[][]
            plotNewData(newData)
        })
        document.getElementById("eigenvector-2-select")!.addEventListener("click", (e) => {
            eigenVector2Index = Math.floor(e.offsetY / 32) * 6 + Math.floor(e.offsetX / 32);
            const eigenVector2CTX = (document.getElementById("eigenvector-2") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D
            eigenVector2CTX.drawImage(updateOffScreenCanvas(eigenVectorsNormalizedArray[eigenVector2Index]), 0, 0, 256, 256);
            const newProjections = calculateProjections(facesCentered, eigenVectors, eigenVector1Index, eigenVector2Index)
            const newData = newProjections.arraySync() as number[][]
            plotNewData(newData)
        })


        const closestCanvas = document.getElementById("closest") as HTMLCanvasElement
        const closestCtx = closestCanvas.getContext("2d") as CanvasRenderingContext2D
        closestCtx.drawImage(updateOffScreenCanvas(facesArray[0]), 0, 0, closestCanvas.width, closestCanvas.height)

        const {svg, plotNewData} = setupSVG(facesArray)
        plotNewData(data)

        
    })

    
</script>

<div style="padding: 10px" style:display={sceneIndex >= sceneLowerBound && sceneIndex < sceneUpperBound ? 'block' : 'none'}>

    <div>
        <canvas id="eigenvector-1"></canvas>
        <canvas id="eigenvector-1-select"></canvas>
        <canvas id="eigenvector-2"></canvas>
        <canvas id="eigenvector-2-select"></canvas>
    </div>

    <svg id="svg" style="border: 1px solid black; border-radius: 5px;"></svg>
    <canvas id="closest" width="256px" height="256px" style="border: 1px solid black; border-radius: 5px;"></canvas>
</div>