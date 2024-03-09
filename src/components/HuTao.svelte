<script lang="ts">
    export let sceneIndex: number;
    export let totalScenes: number;

    import {onMount} from "svelte";
    import * as d3 from "d3";

    interface Line {
        character: string;
        portraitSrc: string;
        text: string;
    }

    let lines: Line[] = [];
    $: currentLine = lines[sceneIndex];

    onMount(async () => {
        const scriptText = await d3.text("./script.txt");
        const linesRaw = scriptText.split("\n");

        for (const line of linesRaw) {
            if (line === "") continue;
            const splits_1 = line.split(":");
            const character_pose = splits_1[0];
            const text = splits_1[1].trim();

            const splits_2 = character_pose.split("-");
            const character = splits_2[0].trim();
            const pose = splits_2[1] ? splits_2[1].trim() : 'normal'; // Assuming a default pose if not specified

            lines.push({
                character: character,
                portraitSrc: `./images/${character.toLowerCase()}/${character.toLowerCase()}-${pose}.png`,
                text: text
            });
        }

        totalScenes = lines.length;
        currentLine = lines[0]; // very hacky. i don't understand svelte lifecycle that well. this feels so bad. 
    });
</script>

{#if currentLine}
<div style="position: fixed; bottom: 0; width: 100%;" style:display={currentLine.text ? "" : "none"}>
    <div style="display: flex;">
            <img
                src={currentLine.portraitSrc}
                alt={currentLine.character}
                width="150px"
                height="150px"
                style="border: 1px solid black; border-radius: 5px; background-color: rgba(255, 255, 255, 0.5);"
            />

            {#if currentLine.text}
                <div
                    id="dialogue"
                    style="flex-grow: 1; background-color: rgba(255, 255, 255, 0.95); padding: 20px;"
                >
                    <strong>{currentLine.character}</strong><br>
                    {currentLine.text}
                </div>
            {/if}
    </div>
</div>
{/if}