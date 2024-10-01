// Data
const data = [
    {
        administration: 'Bloomberg',
        totalComplaints: 218933,
        substantiatedRate: 2.97,
        unsubstantiatedRate: 97.03
    },
    {
        administration: 'de Blasio',
        totalComplaints: 102913,
        substantiatedRate: 4.29,
        unsubstantiatedRate: 95.71
    },
    {
        administration: 'Adams',
        totalComplaints: 38373,
        substantiatedRate: 11.66,
        unsubstantiatedRate: 88.34
    }
];

// Set up dimensions for the charts
const margin = { top: 40, right: 40, bottom: 40, left: 60 };
const width = 700 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Tooltip for hover effects
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Draw Bar Chart
function drawTotalComplaintsChart() {
    const svg = d3.select("#complaints-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // X scale and axis for administrations
    const x = d3.scaleBand()
        .domain(data.map(d => d.administration))
        .range([0, width])
        .padding(0.4);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Y scale and axis for total complaints
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.totalComplaints)])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y));

    // Bars for total complaints
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.administration))
        .attr("y", height) // Start from the bottom
        .attr("width", x.bandwidth())
        .attr("height", 0) // Start with no height
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`Total Complaints: ${d.totalComplaints}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .transition()
        .duration(1000) // Animation duration
        .attr("y", d => y(d.totalComplaints))
        .attr("height", d => height - y(d.totalComplaints));
}

// Draw Pie Chart
function drawPieChart(administration) {
    const svg = d3.select(`#${administration.replace(' ', '-').toLowerCase()}-chart`) // Replace spaces for ID compatibility
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Pie chart data
    const pieData = [
        { label: 'Substantiated', value: data.find(d => d.administration === administration).substantiatedRate },
        { label: 'Unsubstantiated', value: data.find(d => d.administration === administration).unsubstantiatedRate }
    ];

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(100);

    svg.selectAll(".arc")
        .data(pie(pieData))
        .enter()
        .append("g")
        .attr("class", "arc")
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => i === 0 ? "#003DA5" : "#FF0000") // NY License Plate Blue for substantiated, Red for unsubstantiated
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`${d.data.label}: ${d.data.value}%`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    svg.append("text")
        .attr("class", "pie-label")
        .attr("text-anchor", "middle")
        .attr("y", 10)
        .text(`CCR Substantiated ${administration}: ${data.find(d => d.administration === administration).substantiatedRate}%`);
}

// Call functions
drawTotalComplaintsChart();
drawPieChart('Bloomberg');
drawPieChart('de Blasio');
drawPieChart('Adams');

// Scroll interactivity
const sections = document.querySelectorAll('.section');
const options = {
    root: null,
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, options);

sections.forEach(section => {
    observer.observe(section);
});
