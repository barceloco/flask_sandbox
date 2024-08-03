document.addEventListener("DOMContentLoaded", function () {
    const socket = io.connect('http://' + document.domain + ':' + location.port);
    let isReceivingData = false;
    let startStopButton = document.getElementById("startStopButton");

    // Store the last few positions to create a tail effect
    let pathData = [];

    const width = 800;
    const height = 800;

    const svg = d3.select("#plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add a circle to the svg
    const circle = svg.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", 10)
        .style("fill", "black");

    function updateCircle(x, y, color) {
        circle.attr("cx", x)
              .attr("cy", y)
              .style("fill", `rgb(${color}, ${color}, ${color})`);
    }

    function updatePath() {
        // Append new circle position to pathData
        pathData.push({ x: circle.attr("cx"), y: circle.attr("cy"), timestamp: Date.now() });

        // Remove old positions from pathData after 10 seconds
        const tenSecondsAgo = Date.now() - 10000;
        pathData = pathData.filter(d => d.timestamp > tenSecondsAgo);

        // Create or update path line
        svg.selectAll("path").remove();

        svg.append("path")
            .datum(pathData)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-opacity", d => 0.5 + (d.timestamp - tenSecondsAgo) / 20000) // Fade effect
            .attr("d", d3.line()
                .x(d => d.x)
                .y(d => d.y));
    }

    // Handle incoming data
    socket.on('update_data', function (data) {
        if (isReceivingData) {
            const x = (width / 2) + (data.a * 400);
            const y = (height / 2) + (data.b * 400);
            const color = 255 * (0.5 + data.c / 10);

            updateCircle(x, y, color);
            updatePath();
        }
    });

    function toggleDataReception() {
        isReceivingData = !isReceivingData;
        startStopButton.textContent = isReceivingData ? "Stop" : "Start";
        if (!isReceivingData) {
            // Stop receiving data
            socket.emit('stop_data');
        } else {
            // Start receiving data
            socket.emit('start_data');
        }
    }

    startStopButton.addEventListener("click", toggleDataReception);

    // Close the socket connection when leaving the page
    window.addEventListener("beforeunload", function () {
        if (isReceivingData) {
            socket.emit('stop_data'); // Notify server to stop data generation
            socket.disconnect();
        }
    });
});
