document.addEventListener("DOMContentLoaded", function () {
    const socket = io(); // Initialize SocketIO client
    const width = 800; // Double the width
    const height = 800; // Double the height
    const svg = d3.select("#plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    let circle = svg.append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", 10)
        .style("fill", "rgb(127, 127, 127)"); // 50% black

    let trajectory = [];
    const maxTrailLength = 100; // Maximum number of points in the trail
    const trailDuration = 1000; // Duration for the trail to completely fade in milliseconds

    let isRunning = false;

    // Start/Stop Button Logic
    const startStopButton = document.getElementById("startStopButton");
    startStopButton.addEventListener("click", function () {
        isRunning = !isRunning;
        startStopButton.textContent = isRunning ? "Stop" : "Start";

        if (isRunning) {
            socket.connect();
        } else {
            socket.disconnect();
        }
    });

    socket.on('data', function (message) {
        if (!isRunning) return; // Prevent updates when not running

        const data = JSON.parse(message);
        const a = data.x;
        const b = data.y;
        const c = data.color;

        const newX = (width / 2) + a/5 * (width / 2); // Scale x-coordinate
        const newY = (height / 2) + b/5 * (height / 2); // Scale y-coordinate
        const newColorValue = 127 + (c / 10) * 255; // Adjust color (0 to 255)

        trajectory.push({ x: newX, y: newY, timestamp: Date.now() });

        // Remove old points to maintain maxTrailLength
        if (trajectory.length > maxTrailLength) {
            trajectory.shift();
        }

        // Draw fading trail
        const now = Date.now();
        const fadeScale = d3.scaleLinear()
            .domain([0, trailDuration])
            .range([1, 0]);

        svg.selectAll(".trail")
            .data(trajectory)
            .join("line")
            .attr("class", "trail")
            .attr("x1", (d, i) => i > 0 ? trajectory[i - 1].x : d.x)
            .attr("y1", (d, i) => i > 0 ? trajectory[i - 1].y : d.y)
            .attr("x2", d => d.x)
            .attr("y2", d => d.y)
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("opacity", d => fadeScale(now - d.timestamp));

        // Update circle position
        circle
            .attr("cx", newX)
            .attr("cy", newY)
            .style("fill", `rgb(${newColorValue}, ${newColorValue}, ${newColorValue})`);
    });

    // Disconnect socket initially
    socket.disconnect();
});
