<script lang="ts">
    export let sceneIndex: number;

    import {onMount} from "svelte";

    onMount(async () => {
        
    });

</script>

<div style="position: fixed; bottom: 0; width: 100%; ">
    <div style="display: flex;">
        <img
            src="./hutao.png"
            alt="hutao"
            width="150px"
            height="150px"
            style="border: 1px solid black; border-radius: 5px; background-color: rgba(255, 255, 255, 0.5); white;"
        />
        <div
            style="flex-grow: 1; background-color: rgba(255, 255, 255, 0.95); padding: 20px;"
        >
            {#if sceneIndex === 0}
                <p>Hello, it is me, your teacher HuTao.</p>
            {:else if sceneIndex === 1}
                <p>Lets say that we have some images which we want to analyze. </p>
            {:else if sceneIndex === 2}
                <p>We could go through each image individually an contextualize it around other images</p>
                <p>If there are only a couple of images, it probably won't be that hard to do this</p>
            {/if}
        </div>
    </div>
</div>
