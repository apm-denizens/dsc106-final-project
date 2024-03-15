<script lang="ts">
    import {onMount} from "svelte";
    import PcaVis from "./PcaVis.svelte";
    import AnimeGirlDisplay from "./AnimeGirlDisplay.svelte";
    import Dialogue from "./Dialogue.svelte";
    import Controls from "./Controls.svelte";
    import PcaVisBest from "./PcaVisBest.svelte";
    import LinAlg from "./LinAlg.svelte";
    import CuteEigenface from "./CuteEigenface.svelte";
    import EigenvectorsDisplay from "./EigenvectorsDisplay.svelte";
    import EigenvectorExploration from "./EigenvectorExploration/EigenvectorExploration.svelte";
    import { loadDialogue, type Line } from "./loadDialogue";
    import { unzipAndLoad } from "./Unzip/loadAndUnzip";
    import HutaoSpook from "./HutaoSpook.svelte";
    import BooSpook from "./BooSpook.svelte";

    let sceneIndex: number = 0;
    let totalScenes: number = 89;

    let lines: Line[] = [];
    let currentLine: Line = {character: "", portraitSrc: "", scene: "", stage: 0, text: ""};
    let scene: string = ""
    let stage: number = 0;

    let ready = false;

    onMount(async () => {
        window.dialogueLinesPromise = loadDialogue() as Promise<Line[]>;
        window.facesTextPromise = unzipAndLoad("./anime_girls_mario.csv.zip");
        window.eigenVectorsTextPromise = unzipAndLoad("./eigenfaces-2000.csv.zip");
        lines = await window.dialogueLinesPromise;

        function prevScene() {sceneIndex = Math.max(0, sceneIndex - 1)}
        function nextScene() {sceneIndex = Math.min(totalScenes, sceneIndex + 1)}
        document.getElementById("left-sidebar")!.addEventListener("click", prevScene);
        document.getElementById("right-sidebar")!.addEventListener("click", nextScene);
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {prevScene()} 
            else if (e.key === "ArrowRight") {nextScene()}
        });

        ready = true;
    });


    $: {
        currentLine = lines[sceneIndex];
        if (currentLine) {
            scene = currentLine.scene;
            stage = currentLine.stage;
        }
    }

</script>
<div class="container" style="display: flex; flex-direction: column; height: 100vh; width: 100%; ">
    <header style="text-align: center; background-color: gray;">
        <h1>HuTao Teaches Luigi Principal Component Analysis</h1>
    </header>
    <div class="main-content" style="display: flex; flex: 1;">
        <nav id="left-sidebar" style="pointer-events: auto; border: 1px solid black; border-radius: 5px;">
            <button>◀</button>
        </nav>
        <article>
            {#if ready && currentLine}
            <div style:display={scene == "controls" ? "block": "none"}>
                <Controls {sceneIndex} />
            </div>
            <div style:display={scene == "hutaospook" ? "block": "none"}>
                <HutaoSpook />
            </div>
            <div style:display={scene == "animedisplay" ? "block": "none"}>
                <AnimeGirlDisplay stage={stage} />
            </div>
            <div style:display={scene == "boospook" ? "block": "none"}>
                <BooSpook />
            </div>
            <div style:display={scene == "pcaimage" ? "block": "none"}>
                <img src="./pca-image.png" width="600px" />
            </div>
            <div style:display={scene == "4096to2" ? "block": "none"}>
                <img src="./4096to2.png" width="600px" />
            </div>
            <div style:display={scene=="pcavis" ? "block" : "none"}>
                <PcaVis />
            </div>
            <div style:display={scene=="pcavisideal" ? "block" : "none"}>
                <img src="./pca-vis-ideal.png" width="500px" />
            </div>
            <div style:display={scene=="linalg" ? "block" : "none"}>
                <img src="./linalg/4.jpg" width="500px" />
            </div>
            <div style:display={scene=="specter" ? "block" : "none"}>
                <img src="./specter.png" width="500px" />
            </div>
            <div style:display={scene=="cuteeigenface" ? "block" : "none"}>
                <img src="./kindacute.png" width="500px" />
            </div>
            <div style:display={scene=="cuteeigenfacealt" ? "block" : "none"}>
                <img src="./kindacute-alt.png" width="500px" />
            </div>
            <div style:display={scene=="dpprojection" ? "block" : "none"}>
                <img src="./dpprojection.png" width="500px" />
            </div>
            <div style:display={scene=="eigenselector" ? "block" : "none"}>
                <EigenvectorExploration />
            </div>
            <div style:display={scene=="template1" ? "block" : "none"}>
                <img src="./template1.png" width="250px"/>
            </div>
            <div style:display={scene=="template1similar" ? "block" : "none"}>
                <img src="./template1-similar.png" width="600px" />
            </div>
            <div style:display={scene=="template1dissimilar" ? "block" : "none"}>
                <img src="./template1-dissimilar.png" width="600px" />
            </div>

            <div style:display={scene=="fin" ? "block" : "none"}>
                <h2>FIN</h2>
                <img src="./fin.png" width="600px" />
            </div>
                <!-- <AnimeGirlDisplay {sceneIndex} />
                <PcaVis {sceneIndex} />
                <PcaVisBest {sceneIndex} />
                <LinAlg {sceneIndex} />
                <CuteEigenface {sceneIndex} />
                <EigenvectorExploration {sceneIndex} /> -->
                <!-- <EigenvectorsDisplay {sceneIndex} /> -->
            {/if}
        </article>
        <nav id="right-sidebar" style="pointer-events: auto; border: 1px solid black; border-radius: 5px;">
            <button>▶</button>
        </nav>
    </div>
</div>

<Dialogue {sceneIndex} bind:totalScenes={totalScenes} />
<div style="position: absolute; bottom: 0; right: 0; z-index: 1;">{sceneIndex}/{totalScenes-1}</div>
<style>

#left-sidebar, #right-sidebar {
    width: 50px;
    background: #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
}

#left-sidebar button, #right-sidebar button {
    border: none;
    background: none;
    font-size: 24px;
    cursor: pointer;
}

article {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
}
</style>