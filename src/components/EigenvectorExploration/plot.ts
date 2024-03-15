import * as d3 from 'd3';
import updateOffScreenCanvas from '../FaceDisplay/updateOffScreenCanvas';

function setupSVG(facesArray: number[][]) {
    const svgWidth = 500;
    const svgHeight = 400;
    const svgPadding = 60;
    const svg = d3.select("#svg")
    svg
        .attr("width", svgWidth + svgPadding * 2)
        .attr("height", svgHeight + svgPadding * 2)
        .style("pointer-events", "auto")

    function plotNewData(data: number[][]) {
        const getSVGX = d3.scaleLinear()
            .domain([d3.min(data, d => d[0]) as number, d3.max(data, d => d[0]) as number])
            .range([0 + svgPadding, svgWidth + svgPadding]);
    
        const getSVGY = d3.scaleLinear()
            .domain([d3.min(data, d => d[1]) as number, d3.max(data, d => d[1]) as number])
            .range([svgHeight + svgPadding, 0 + svgPadding]);
    
        // clear the entire svg
        svg.selectAll("*").remove();
        // remove event listeners
        svg.on("mousemove", null)

        // x-axis
        svg.append("g")
            .attr("transform", `translate(0, ${svgHeight + svgPadding})`)
            .call(d3.axisBottom(getSVGX));
    
        // y-axis
        svg.append("g")
            .attr("transform", `translate(${svgPadding}, 0)`)
            .call(d3.axisLeft(getSVGY));
    
        // map datapoints onto svg
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => getSVGX(d[0]))
            .attr("cy", d => getSVGY(d[1]))
            .attr("r", 2)
            .attr("fill", "red")

        document.getElementById("svg")!.addEventListener("mousemove", (e) => {

            // calculate the mouse position in the original data space
            const mouseX = getSVGX.invert(e.offsetX);
            const mouseY = getSVGY.invert(e.offsetY);

            svg.select("#mouse-point").remove()
            svg.append("circle")
                .attr("id", "mouse-point")
                .attr("cx", e.offsetX)
                .attr("cy", e.offsetY)
                .attr("r", 1)
                .attr("fill", "black")

            // calculate the closest point to the mouse
            const closest = data.reduce((acc, p, i) => {
                const dist = Math.sqrt((p[0] - mouseX) ** 2 + (p[1] - mouseY) ** 2);
                if (dist < acc.dist) {
                    acc.dist = dist;
                    acc.index = i;
                }
                return acc;
            }, {dist: Infinity, index: -1});
            // console.log(mouseX, mouseY, closest)

            
            // add lines to the closest point
            svg.selectAll(".closest-point-lines").remove()
            svg.append("line")
                .attr("class", "closest-point-lines")
                .attr("x1", e.offsetX)
                .attr("y1", e.offsetY)
                .attr("x2", getSVGX(data[closest.index][0]))
                .attr("y2", getSVGY(data[closest.index][1]))
                .attr("stroke", "black")
                .attr("stroke-width", 1)

            svg.append("line")
                .attr("class", "closest-point-lines")
                .attr("x1", getSVGX(data[closest.index][0]))
                .attr("y1", svgHeight + svgPadding)
                .attr("x2", getSVGX(data[closest.index][0]))
                .attr("y2", getSVGY(data[closest.index][1]))
                .attr("stroke", "black")
                .attr("stroke-width", 1)

            svg.append("line")
                .attr("class", "closest-point-lines")
                .attr("x1", svgPadding)
                .attr("y1", getSVGY(data[closest.index][1]))
                .attr("x2", getSVGX(data[closest.index][0]))
                .attr("y2", getSVGY(data[closest.index][1]))
                .attr("stroke", "black")
                .attr("stroke-width", 1)

            // highlight the closest point
            svg.select("#closest-point").remove()
            svg.append("circle")
                .attr("id", "closest-point")
                .attr("cx", getSVGX(data[closest.index][0]))
                .attr("cy", getSVGY(data[closest.index][1]))
                .attr("r", 3)
                .attr("fill", "blue")

            const offScreenCanvas = updateOffScreenCanvas(facesArray[closest.index])
            const closestCanvas = document.getElementById("closest") as HTMLCanvasElement
            const closestCtx = closestCanvas.getContext("2d") as CanvasRenderingContext2D
            closestCtx.drawImage(offScreenCanvas, 0, 0, closestCanvas.width, closestCanvas.height)
        })
    }

    return { svg, plotNewData }
}


export {setupSVG};