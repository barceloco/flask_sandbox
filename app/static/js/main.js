document.addEventListener("DOMContentLoaded", function() {
    fetch('/api/get-data')
        .then(response => response.json())
        .then(data => {
            console.log(data.send_data); // Access and log the data
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });


    let fetchInterval;
    let isFetching = false;

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
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear()
          .domain([0, 20])
          .range([ 0, width ]);
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
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

        // svg.append("svg")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform", `translate(${margin.left},${margin.top})`);

        const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

  const circle = svg.append("circle")
    .attr("r", 0)
    .attr("fill", "steelblue")
    .style("stroke", "white")
    .attr("opacity", .70)
    .style("pointer-events", "none");

  const listeningRect = svg.append("rect")
    .attr("width", width)
    .attr("height", height);

  // create the mouse move function

  listeningRect.on("mousemove", function (event) {
    const [xCoord] = d3.pointer(event, this);
    const bisectDate = d3.bisector(d => d.key).left;
    const x0 = x.invert(xCoord);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - d0.key > d1.key - x0 ? d1 : d0;
    const xPos = x(d.key);
    const yPos = y(d.val);

    // Update the circle position

    circle.attr("cx", xPos)
      .attr("cy", yPos);

    // Add transition for the circle radius

    circle.transition()
      .duration(50)
      .attr("r", 5);

    // add in  our tooltip

    tooltip
      .style("display", "block")
      .style("left", `${xPos + 100}px`)
      .style("top", `${yPos + 50}px`)
      .html(`<strong>Date:</strong> <br><strong>Population:</strong> 'k'`)
      // .html(`<strong>Date:</strong> ${d.key.toLocaleDateString()}<br><strong>Population:</strong> ${d.val !== undefined ? (d.val).toFixed(3) + 'k' : 'N/A'}`)

  });
    }

    function fetchData() {
        d3.json("/get-data").then(show_data);
    }

    function toggleFetching() {
        const button = document.getElementById("startStopButton");
        // console.log(isFetching)
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

