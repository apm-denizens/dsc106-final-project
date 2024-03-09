<script lang="ts">
    export let sceneIndex: number;
</script>
<div style:display={sceneIndex >= 37 ? "block": "none"}>
    {#if sceneIndex==37}
        <img src="./linalg/1.jpg" width="550px"/>
    {:else if sceneIndex==38}
        <img src="./linalg/2.jpg" width="550px"/>
    {:else if sceneIndex==39 || sceneIndex==40 || sceneIndex==41}
        <img src="./linalg/3.jpg" width="550px"/>
    {:else if sceneIndex>=42 && sceneIndex < 46}
        <img src="./linalg/4.jpg" width="550px"/>
    {/if}
</div>