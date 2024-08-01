document.addEventListener("DOMContentLoaded", function() {
    // Fetch initial data
    fetch('/matrix-get-data')
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            drawMatrix(data);
        });

    function drawMatrix(matrix) {
        const width = 500;
        const height = 500;
        const cellSize = 2;

        const svg = d3.select("#matrix").append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.selectAll("rect")
            .data(matrix.flat())
            .enter()
            .append("rect")
            .attr("x", (d, i) => (i % 250) * cellSize)
            .attr("y", (d, i) => Math.floor(i / 250) * cellSize)
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("fill", d => `rgb(${d * 255}, ${(1 - d) * 255}, ${d * d * 255})`);
    }
});
