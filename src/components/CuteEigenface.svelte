<script lang="ts">
    export let sceneIndex: number;
</script>
<div style="text-align: center;" style:display={ sceneIndex == 46 || sceneIndex == 47 || sceneIndex == 48 ? "block" : "none" }>
    {#if sceneIndex == 48} 
    <strong>Sleep Paralysis Demon</strong><br>
    {/if}
    <img src="./kindacute.png" />
</div>