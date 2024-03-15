import * as d3 from "d3";

export interface Line {
    character: string;
    portraitSrc: string;
    scene: string;
    stage: number;
    text: string;
}

export async function loadDialogue() {
    const lines: Line[] = []
    const scriptText = await d3.text("./script.txt");
    const linesRaw = scriptText.split("\n");

    for (const line of linesRaw) {
        if (line === "") continue;
        const splits_1 = line.split(":");
        const character_pose = splits_1[0];
        const text = splits_1[1].trim();

        const splits_2 = character_pose.split("-");
        const character = splits_2[0].trim();
        const pose = splits_2[1] ? splits_2[1].trim() : 'normal';
        const scene = splits_2[2] ? splits_2[2].trim() : '';
        const stage = splits_2[3] ? Number(splits_2[3].trim()) : 0;

        lines.push({
            character: character,
            portraitSrc: `./images/${character.toLowerCase()}/${character.toLowerCase()}-${pose}.png`,
            scene: scene,
            stage: stage,
            text: text
        });
    }

    return lines
}