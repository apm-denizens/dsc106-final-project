<script lang="ts">

    import { onMount } from "svelte";
    import * as d3 from "d3";
    type Features = "x" | "y"

    let loaded = false;

    let mouseCX = 0;
    let mouseCY = 0;
    let uVectorX = 1 / Math.sqrt(2);
    let uVectorY = 1 / Math.sqrt(2);

    // console.log(scrollIndex)

    onMount(async () => {
        let svg_full = d3.select("#full");
        let svg_proj = d3.select("#projected");
        let width = 800;
        let height = 600;
        let inner_border = 50;

        svg_full.attr("width", width);
        svg_full.attr("height", height);
        svg_proj.attr("width", width);
        svg_proj.attr("height", 100);

        // probably going to have multiple datasets later
        Promise.all([
            d3.csv<Features>("./pca-data.csv")
        ]).then(([csv]) => {
            ready(csv);
        });

        function ready(raw_data: d3.DSVRowArray<Features>) {

            let data = raw_data.map((d) => {
                return {
                    "x": Number(d.x),
                    "y": Number(d.y)
                }
            })

            const min_x = d3.min(data, (d) => d.x)!;
            const max_x = d3.max(data, (d) => d.x)!;
            const min_y = d3.min(data, (d) => d.y)!;
            const max_y = d3.max(data, (d) => d.y)!;
            console.log(min_x, max_x, min_y, max_y);

            // 2CX functions essentially map percentage between min & max to a percentage of width
            function x2CX(x: number) {
                const real_width = width - 2 * inner_border;
                const percentage = (x - min_x) / (max_x - min_x);
                return percentage * real_width + inner_border;
            }

            function y2CY(y: number) {
                const real_height = height - 2 * inner_border;
                const percentage = (y - min_y) / (max_y - min_y);
                // need to invert the percentage
                // return (1 - percentage) * real_height + inner_border;
                return percentage * real_height + inner_border;
            }

            // plot x and y axis going through 0, 0
            svg_full.append("line")
                .attr("x1", x2CX(min_x))
                .attr("y1", y2CY(0))
                .attr("x2", x2CX(max_x))
                .attr("y2", y2CY(0))
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("opacity", 0.5);

            svg_full.append("line")
                .attr("x1", x2CX(0))
                .attr("y1", y2CY(min_y))
                .attr("x2", x2CX(0))
                .attr("y2", y2CY(max_y))
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("opacity", 0.5);

            // plot x and y datapoints on the svg
            svg_full.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("cx", (d) => x2CX(d.x))
                .attr("cy", (d) => y2CY(d.y))
                .attr("r", 3)
                .attr("fill", "blue");

            // plot the u vector direction
            svg_full.append("line")
                .attr("id", "uVector")
                .attr("x1", x2CX(uVectorX * -10000))
                .attr("y1", y2CY(uVectorY * -10000))
                .attr("x2", x2CX(uVectorX * 10000))
                .attr("y2", y2CY(uVectorY * 10000))
                .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("opacity", 0.5);

            svg_proj.append("line")
                .attr("x1", x2CX(min_x))
                .attr("y1", 50)
                .attr("x2", x2CX(max_x))
                .attr("y2", 50)
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("opacity", 0.5);



            // plot projections
            let totalInformationLoss = 0;
            const projections: number[] = []
            for(const datapoint of data) {
                // calculate dot product of u vector and datapoint
                const dotProduct = uVectorX * datapoint.x + uVectorY * datapoint.y;
                projections.push(dotProduct);

                const projectedX = dotProduct * uVectorX;
                const projectedY = dotProduct * uVectorY;
                const informationLoss = Math.sqrt((datapoint.x - projectedX) ** 2 + (datapoint.y - projectedY) ** 2);
                totalInformationLoss += informationLoss;

                svg_full.append("line")
                    .attr("class", "projection")
                    .attr("x1", x2CX(datapoint.x))
                    .attr("y1", y2CY(datapoint.y))
                    .attr("x2", x2CX(projectedX))
                    .attr("y2", y2CY(projectedY))
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("opacity", 0.25);

                svg_full.append("circle")
                    .attr("class", "projection")
                    .attr("cx", x2CX(projectedX))
                    .attr("cy", y2CY(projectedY))
                    .attr("r", 3)
                    .attr("fill", "red");

                svg_proj.append("circle")
                    .attr("class", "projection")
                    .attr("cx", x2CX(dotProduct))
                    .attr("cy", 50)
                    .attr("r", 3)
                    .attr("fill", "red");
            }

            d3.selectAll(".svglabel").remove()
            svg_full.append("text")
                .attr("class", "svglabel")
                .attr("x", 15)
                .attr("y", 30)
                .text(`Total Information Loss: ${totalInformationLoss.toFixed(2)}`);
            svg_proj.append("text")
                .attr("class", "svglabel")
                .attr("x", 15)
                .attr("y", 30)
                .text(`Projection Variance: ${d3.variance(projections)!.toFixed(2)}`);
        

            // svg listen for mouse move events
            // svg_full.on("mousemove", function (event) {
            //     mouseCX = event.offsetX;
            //     mouseCY =event.offsetY;
            // });

            // inverses of the 2CX functions
            function x2CX_INV(mouseX: number) {
                const real_width = width - 2 * inner_border;
                const percentage = (mouseX - inner_border) / real_width;
                return percentage * (max_x - min_x) + min_x;
            }

            function y2CY_INV(mouseY: number) {
                const real_height = height - 2 * inner_border;
                const percentage = (mouseY - inner_border) / real_height;
                return percentage * (max_y - min_y) + min_y;
            }

            svg_full.on("mousemove", function (event) {
                const vectorXUnormalized = x2CX_INV(event.offsetX);
                const vectorYUnormalized = y2CY_INV(event.offsetY);
                const vectorUnormalizedLength = Math.sqrt(vectorXUnormalized ** 2 + vectorYUnormalized ** 2);

                uVectorX = vectorXUnormalized / vectorUnormalizedLength;
                uVectorY = vectorYUnormalized / vectorUnormalizedLength;
                console.log(uVectorX, uVectorY, Math.sqrt(uVectorX ** 2 + uVectorY ** 2));

                // update u vector display
                svg_full.select("#uVector")
                    .attr("x1", x2CX(uVectorX * -10000))
                    .attr("y1", y2CY(uVectorY * -10000))
                    .attr("x2", x2CX(uVectorX * 10000))
                    .attr("y2", y2CY(uVectorY * 10000))

                d3.selectAll(".projection").remove();

                // plot projections
                let totalInformationLoss = 0;
                const projections: number[] = []
                for(const datapoint of data) {
                    // calculate dot product of u vector and datapoint
                    const dotProduct = uVectorX * datapoint.x + uVectorY * datapoint.y;
                    projections.push(dotProduct);

                    const projectedX = dotProduct * uVectorX;
                    const projectedY = dotProduct * uVectorY;
                    const informationLoss = Math.sqrt((datapoint.x - projectedX) ** 2 + (datapoint.y - projectedY) ** 2);
                    totalInformationLoss += informationLoss;

                    svg_full.append("line")
                        .attr("class", "projection")
                        .attr("x1", x2CX(datapoint.x))
                        .attr("y1", y2CY(datapoint.y))
                        .attr("x2", x2CX(projectedX))
                        .attr("y2", y2CY(projectedY))
                        .attr("stroke", "red")
                        .attr("stroke-width", 2)
                        .attr("opacity", 0.25);

                    svg_full.append("circle")
                        .attr("class", "projection")
                        .attr("cx", x2CX(projectedX))
                        .attr("cy", y2CY(projectedY))
                        .attr("r", 3)
                        .attr("fill", "red");
                    
                    svg_proj.append("circle")
                        .attr("class", "projection")
                        .attr("cx", x2CX(dotProduct))
                        .attr("cy", 50)
                        .attr("r", 3)
                        .attr("fill", "red");
                }

                d3.selectAll(".svglabel").remove()
                svg_full.append("text")
                    .attr("class", "svglabel")
                    .attr("x", 15)
                    .attr("y", 30)
                    .text(`Total Information Loss: ${totalInformationLoss.toFixed(2)}`);
                svg_proj.append("text")
                    .attr("class", "svglabel")
                    .attr("x", 15)
                    .attr("y", 30)
                    .text(`Projection Variance: ${d3.variance(projections)!.toFixed(2)}`);
            })
        }
    });


</script>

<div style="pointer-events: auto;">
    <svg id="full" style="border: 1px solid black; border-radius: 5px; display: block; margin-bottom: 5px;"></svg>
    <svg id="projected" style="border: 1px solid black; border-radius: 5px; display: block;"></svg>
</div>