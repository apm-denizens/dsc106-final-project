<script lang="ts">
    import AnimeGirlDisplay from "../components/AnimeGirlDisplay.svelte";
    import PcaVis from "../components/PcaVis.svelte"
    import Scroller from "../components/Scroller.svelte";
</script>


<h1 style="text-align: center; position: sticky; top: 0;">HuTao Teaches You About Principal Component Analysis</h1>
<Scroller />
<div style="position: fixed; bottom: 0;">
    <div style="display: flex;">
        <img src="./hutao.png" alt="hutao" style="border: 1px solid black; border-radius: 5px; background-color: rgba(255, 255, 255, 0.5); white;"/>
        <div style="background-color: rgba(255, 255, 255, 0.5); padding: 20px;">
            HELLO IT IS ME. YOUR TEACHER, HUTAO.
        </div>
    </div>
</div>
<div style="display: flex;">
    <AnimeGirlDisplay />
    <PcaVis />
</div>
