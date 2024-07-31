document.addEventListener("DOMContentLoaded", function() {
    let fetchInterval;
    let isFetching = false;
    let currentMouseX = null;
    let currentMouseY = null;

    // Variables to be accessed in both functions
    let x, y, circle, tooltip;

    // Create tooltip once
    tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    function show_data(data){
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // Remove any existing SVG elements before drawing new ones
        d3.select("#plot1").selectAll("*").remove();

        // Append the svg object to the body of the page
        var svg = d3.select("#plot1")
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x = d3.scaleLinear()
          .domain([0, 20])
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add Y axis
        y = d3.scaleLinear()
          .domain([0, 1])
          .range([ height, 0]);
        svg.append("g")
          .call(d3.axisLeft(y));

        // Add dots
        svg.append('g')
          .selectAll("dot")
          .data(data)
          .enter()
          .append("circle")
            .attr("cx", function (d) { return x(d.key); } )
            .attr("cy", function (d) { return y(d.val); } )
            .attr("r", 1.50)
            .style("fill", "#69b3a2");

        circle = svg.append("circle")
            .attr("r", 0)
            .attr("fill", "steelblue")
            .style("stroke", "white")
            .attr("opacity", .70)
            .style("pointer-events", "none");

        const listeningRect = svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill-opacity", 0);

        listeningRect.on("mousemove", function (event) {
            [currentMouseX, currentMouseY] = d3.pointer(event, this);
            updateTooltip(currentMouseX, currentMouseY, data);
        });

        listeningRect.on("mouseleave", function () {
            tooltip.style("display", "none");
            circle.transition().duration(50).attr("r", 0);
        });
    }

    function updateTooltip(xCoord, yCoord, data) {
        const bisectDate = d3.bisector(d => d.key).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];

        if (!d0 || !d1) {
            tooltip.style("display", "none");
            circle.transition().duration(50).attr("r", 0);
            return;
        }

        const d = x0 - d0.key > d1.key - x0 ? d1 : d0;
        const xPos = x(d.key);
        const yPos = y(d.val);

        // Check if the mouse is close to a data point
        if (Math.abs(xPos - xCoord) < 5 && Math.abs(yPos - yCoord) < 5) {
            // Update the circle position
            circle.attr("cx", xPos).attr("cy", yPos);

            // Add transition for the circle radius
            circle.transition().duration(50).attr("r", 5);

            // Adjust the tooltip position based on the SVG container
            const svgRect = d3.select("#plot1 svg").node().getBoundingClientRect();

            tooltip
                .style("display", "block")
                .style("left", `${svgRect.left + xPos}px`)
                .style("top", `${svgRect.top + yPos}px`)
                .html(`<strong>Date:</strong> ${d.key}<br><strong>Population:</strong> ${d.val}`);
        } else {
            tooltip.style("display", "none");
            circle.transition().duration(50).attr("r", 0);
        }
    }

    function fetchData() {
        d3.json("/get-data").then(data => {
            show_data(data);
            if (currentMouseX !== null && currentMouseY !== null) {
                updateTooltip(currentMouseX, currentMouseY, data);
            }
        });
    }

    function toggleFetching() {
        const button = document.getElementById("startStopButton");
        if (isFetching) {
            clearInterval(fetchInterval);
            button.textContent = "Start";
        } else {
            fetchInterval = setInterval(fetchData, 100);
            button.textContent = "Stop";
        }
        isFetching = !isFetching;
    }

    document.getElementById("startStopButton").addEventListener("click", toggleFetching);
    fetchData();
});
