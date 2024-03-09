<script lang="ts">
    import {onMount} from "svelte";
    import PcaVis from "./PcaVis.svelte";
    import AnimeGirlDisplay from "./AnimeGirlDisplay.svelte";
    import HuTao from "./HuTao.svelte";

    let sceneIndex = 0;
    let totalScenes = 0;

    onMount(async () => {
        function prevScene() {sceneIndex = (sceneIndex - 1 + totalScenes) % totalScenes}
        function nextScene() {sceneIndex = (sceneIndex + 1) % totalScenes}

        document.getElementById("left-sidebar")!.addEventListener("click", prevScene);
        document.getElementById("right-sidebar")!.addEventListener("click", nextScene);
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {prevScene()} 
            else if (e.key === "ArrowRight") {nextScene()}
        });
    });

</script>

<div class="container" style="display: flex; flex-direction: column; height: 100vh; width: 100%; ">
    <header style="text-align: center; background-color: gray;">
        <h1>HuTao Teaches Luigi About Principal Component Analysis</h1>
    </header>
    <div class="main-content" style="display: flex; flex: 1;">
        <nav id="left-sidebar">
            <button>◀</button>
        </nav>
        <article>
            {sceneIndex}
            <AnimeGirlDisplay {sceneIndex} />
            <!-- <PcaVis {sceneIndex} /> -->
        </article>
        <nav id="right-sidebar">
            <button>▶</button>
        </nav>
    </div>
</div>

<HuTao {sceneIndex} bind:totalScenes={totalScenes} />

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