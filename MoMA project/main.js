// GLOBALS AND CONSTANTS

const width = 800;
const height = 400;
const margin = { top: 20, right: 20, bottom: 30, left: 50 };

// LOAD DATA CREATE SVG
d3.csv('https://media.githubusercontent.com/media/thomagin/collection/main/Artworks.csv')
  .then(data => {
    let svgChart = null; 

    // SELECT NATIONALITY 
    function updateChart(selectedNationality) {
      const filteredData = data.filter(d => {
        const ValidDate = !isNaN(new Date(d.DateAcquired).getFullYear());
        return d.Nationality === selectedNationality && ValidDate;
      });
      const acquisitionsPerYear = d3.rollup(filteredData, v => v.length, d => new Date(d.DateAcquired).getFullYear());
      const acquisitionsData = Array.from(acquisitionsPerYear, ([key, value]) => ({ year: key, acquisitions: value }));
      const sortedData = acquisitionsData.sort((a, b) => a.year - b.year);

      const xScale = d3.scaleBand()
        .domain(sortedData.map(d => d.year.toString())) 
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.acquisitions)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      if (!svgChart) {
        svgChart = d3.select('#chart-container')
          .append('svg')
          .attr('width', width)
          .attr('height', height);
      }

      const bars = svgChart.selectAll('.bar')
        .data(sortedData, d => d.year);

      // EXIT SELECTION?
      bars.exit()
        .remove();

      // MAKE BARS
      const newBars = bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.year.toString()))
        .attr('width', xScale.bandwidth())
        .attr('y', d => height - margin.bottom) 
        .attr('height', 0) 
        .attr('fill', 'steelblue')
        .merge(bars)
        .transition()
        .duration(1000) // ANIMATION TIME, MSEC
        .attr('y', d => yScale(d.acquisitions))
        .attr('height', d => height - margin.bottom - yScale(d.acquisitions));

      svgChart.selectAll('.bar')
        .data(sortedData, d => d.year)
        .attr('x', d => xScale(d.year.toString()))
        .attr('width', xScale.bandwidth());

      svgChart.selectAll('g.axis').remove(); 

      svgChart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale)
          .tickFormat(d3.format('d')) 
        )
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)');

      svgChart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

      svgChart.selectAll('text.chart-title').remove(); 

      svgChart.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text(`${selectedNationality} Art Acquisitions Over Time`);
    }

    // LANDING CHART
    updateChart('(Cuban)');

    // EVENT LISTENER FOR DROPDOWN
    document.getElementById('nationality-select').addEventListener('change', function() {
      const selectedNationality = this.value;
      updateChart(selectedNationality);
    });
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });

