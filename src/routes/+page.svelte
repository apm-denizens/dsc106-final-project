<script lang="ts">
    import AnimeGirlDisplay from "../components/AnimeGirlDisplay.svelte";
    import PcaVis from "../components/PcaVis.svelte"
</script>


<div>
<h1>PCA - Interactive Visualization Prototype</h1>
<p>move mouse over chart to see projected data. prototype writeup below. </p>
<AnimeGirlDisplay />
<PcaVis />
<p>
    Our project focuses on explaining principal component analysis. A visualization involving a 2d case with data points projected onto the mouse location dictated "unit vector". Each of the smaller red lines that stretch from each data point to the main line are the resulting projections. Those lines correspond to reconstruction error, and the user can move the mouse around to build an intuition for what case minimizes said error. 
</p>
<p>
    Meshing the narrative components with the user-interactive elements will probably be fraught with bugs. There will have to be a lot of nuanced event handling for these cases, and integrating with existing libraries for something like scrolly-telling or properly timing animations, will likely take a lot of trial and error. There won't just be a single interactive visualization, but instead multiple of them that will all share a common state, and the narrative elements can't get in the way of that. 

</p>

</div>
