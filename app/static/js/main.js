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

