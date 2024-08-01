document.addEventListener("DOMContentLoaded", function() {
    // Fetch initial data
    fetch('/dd/get-data')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            drawCircle(data);
        });

    function drawCircle(data) {
        const svg = d3.select("#plot").append("svg")
            .attr("width", 500)
            .attr("height", 500);

        // Ensure the coordinates are numbers
        const a = Number(data.a);
        const b = Number(data.b);
        const c = Number(data.c);

        const circle = svg.append("circle")
            .attr("cx", 100 * a)
            .attr("cy", 100 * b)
            .attr("r", 25 * c)
            .attr("fill", "green")
            .attr("class", "draggable")
            .call(d3.drag()
                .on("start", function(event, d) {
                    d3.select(this).attr("fill", "blue");
                })
                .on("drag", function(event, d) {
                    d3.select(this)
                        .attr("cx", event.x)
                        .attr("cy", event.y);

                    // Send updated coordinates to the backend
                    fetch('/dd/update-coordinates', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ a: event.x / 10, b: event.y / 10 })
                    });
                })
                .on("end", function(event, d) {
                    d3.select(this).attr("fill", "green");
                }));
    }
});
