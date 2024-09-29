// Show the next section based on button clicks
document.getElementById('enter-btn').addEventListener('click', () => {
    document.getElementById('landing-page').classList.remove('active');
    document.getElementById('what-is-ccrb').classList.add('active');
});

document.getElementById('next-to-data').addEventListener('click', () => {
    document.getElementById('what-is-ccrb').classList.remove('active');
    document.getElementById('data-ccrb').classList.add('active');
    renderCharts(); // Call the function to render the charts
});

document.getElementById('back-btn').addEventListener('click', () => {
    document.getElementById('data-ccrb').classList.remove('active');
    document.getElementById('what-is-ccrb').classList.add('active');
});

// Function to render the D3 charts
function renderCharts() {
    const data = [
        { administration: 'Bloomberg', totalComplaints: 218933, substantiatedRate: 2.97, unsubstantiatedRate: 97.03 },
        { administration: 'de Blasio', totalComplaints: 102913, substantiatedRate: 4.29, unsubstantiatedRate: 95.71 },
        { administration: 'Adams', totalComplaints: 38373, substantiatedRate: 11.66, unsubstantiatedRate: 88.34 }
    ];

    const margin = { top: 40, right: 40, bottom: 40, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svgComplaints = d3.select("#complaints-chart")
        .html("") // Clear the chart before redrawing
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.administration))
        .range([0, width])
        .padding(0.4);

    svgComplaints.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.totalComplaints)])
        .range([height, 0]);

    svgComplaints.append("g")
        .call(d3.axisLeft(y));

    svgComplaints.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.administration))
        .attr("y", d => y(d.totalComplaints))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.totalComplaints))
        .attr("fill", "steelblue");

    const svgRates = d3.select("#rates-chart")
        .html("") // Clear the chart before redrawing
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svgRates.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    const yRate = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    svgRates.append("g")
        .call(d3.axisLeft(yRate));

    svgRates.selectAll(".substantiated")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "substantiated")
        .attr("x", d => x(d.administration))
        .attr("y", d => yRate(d.substantiatedRate))
        .attr("width", x.bandwidth())
        .attr("height", d => height - yRate(d.substantiatedRate))
        .attr("fill", "green");

    svgRates.selectAll(".unsubstantiated")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "unsubstantiated")
        .attr("x", d => x(d.administration))
        .attr("y", d => yRate(d.substantiatedRate + d.unsubstantiatedRate))
        .attr("width", x.bandwidth())
        .attr("height", d => height - yRate(d.unsubstantiatedRate))
        .attr("fill", "red");
}