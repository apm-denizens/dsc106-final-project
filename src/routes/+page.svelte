<script lang="ts">
    import { onMount } from "svelte";
    import * as d3 from "d3";

    type Features = "x" | "y"

    let mouseX = 0;
    let mouseY = 0;

    onMount(async () => {
        let svg_full = d3.select("#full");
        let width = 750;
        let height = 400;
        let inner_border = 50;

        svg_full.attr("width", width);
        svg_full.attr("height", height);

        // probably going to have multiple datasets later
        Promise.all([
            d3.csv<Features>("./pca-data.csv")
        ]).then(([csv]) => {
            ready(csv);
        });

        function ready(raw_data: d3.DSVRowArray<Features>) {

            const data = raw_data.map((d) => {
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
                .attr("r", 2)
                .attr("fill", "blue");
        }
    });
</script>


<div>
<h1>Interactive Visualization Prototype</h1>
<!-- black border to visualization 1 -->
<svg id="full" style="border: 1px solid black; border-radius: 5px;"></svg>
<svg id="projected"></svg>
</div>
