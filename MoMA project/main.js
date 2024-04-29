// GLOBALS AND CONSTANTS
const width = 800;
const height = 400;
const margin = { top: 20, right: 20, bottom: 30, left: 50 };

// LOAD DATA CREATE SVG
d3.csv('https://media.githubusercontent.com/media/thomagin/collection/main/Artworks.csv')
  .then(data => {
    console.log(data);
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
        .attr('fill', '#A98F88')
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
          .tickFormat(d3.format('d')))
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
        .attr('y', margin.top / 2 + 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text(`${selectedNationality} Art Acquisitions Over Time`);

      // LITTLE PARAGRAPHS 
      
      const nationalityText = document.getElementById('nationality-text');
      switch (selectedNationality) {
        case '(Cuban)':
          nationalityText.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet leo ut tempus scelerisque. Pellentesque at nulla et erat molestie vehicula sit amet ut elit. Ut blandit enim nulla, et scelerisque turpis semper sed. Vivamus ex nulla, varius nec blandit at, sagittis et sem. Donec a urna ut velit tempus porta. Maecenas ullamcorper diam tempus tellus scelerisque vestibulum. Proin tristique lobortis egestas. Proin porta, turpis nec ultrices luctus, eros orci imperdiet erat, vel dapibus neque felis id ligula. Sed dignissim neque sed dignissim tempus. Mauris ornare ipsum id scelerisque porttitor. Nunc volutpat ex nulla, eget sodales eros sodales sed. Pellentesque congue suscipit arcu, non ultricies nulla. Maecenas viverra placerat hendrerit. Vivamus ligula lorem, faucibus ac tempus non, tristique ultrices magna. Donec non varius ligula.";
          break;
        case '(Iranian)':
          nationalityText.textContent = "Vivamus suscipit eros sem, at laoreet erat scelerisque sit amet. Ut et vulputate diam. Quisque ut enim ac turpis ultricies scelerisque. Maecenas nec felis vel odio suscipit feugiat sit amet quis lacus. Fusce tristique diam eu purus venenatis, id tincidunt nunc interdum. Aenean eget nibh rutrum, sagittis nisi vitae, fringilla ligula. Suspendisse potenti.";
          break;
        case '(Chinese)':
          nationalityText.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet leo ut tempus scelerisque. Pellentesque at nulla et erat molestie vehicula sit amet ut elit. Ut blandit enim nulla, et scelerisque turpis semper sed. Vivamus ex nulla, varius nec blandit at, sagittis et sem. Donec a urna ut velit tempus porta. Maecenas ullamcorper diam tempus tellus scelerisque vestibulum. Proin tristique lobortis egestas. Proin porta, turpis nec ultrices luctus, eros orci imperdiet erat, vel dapibus neque felis id ligula. Sed dignissim neque sed dignissim tempus. Mauris ornare ipsum id scelerisque porttitor. Nunc volutpat ex nulla, eget sodales eros sodales sed. Pellentesque congue suscipit arcu, non ultricies nulla. Maecenas viverra placerat hendrerit. Vivamus ligula lorem, faucibus ac tempus non, tristique ultrices magna. Donec non varius ligula.";
          break;
        case '(German)':
          nationalityText.textContent = "Vivamus suscipit eros sem, at laoreet erat scelerisque sit amet. Ut et vulputate diam. Quisque ut enim ac turpis ultricies scelerisque. Maecenas nec felis vel odio suscipit feugiat sit amet quis lacus. Fusce tristique diam eu purus venenatis, id tincidunt nunc interdum. Aenean eget nibh rutrum, sagittis nisi vitae, fringilla ligula. Suspendisse potenti.";
          break;
        case '(Japanese)':
          nationalityText.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet leo ut tempus scelerisque. Pellentesque at nulla et erat molestie vehicula sit amet ut elit. Ut blandit enim nulla, et scelerisque turpis semper sed. Vivamus ex nulla, varius nec blandit at, sagittis et sem. Donec a urna ut velit tempus porta. Maecenas ullamcorper diam tempus tellus scelerisque vestibulum. Proin tristique lobortis egestas. Proin porta, turpis nec ultrices luctus, eros orci imperdiet erat, vel dapibus neque felis id ligula. Sed dignissim neque sed dignissim tempus. Mauris ornare ipsum id scelerisque porttitor. Nunc volutpat ex nulla, eget sodales eros sodales sed. Pellentesque congue suscipit arcu, non ultricies nulla. Maecenas viverra placerat hendrerit. Vivamus ligula lorem, faucibus ac tempus non, tristique ultrices magna. Donec non varius ligula.";
          break;
        case '(Russian)':
          nationalityText.textContent = "Vivamus suscipit eros sem, at laoreet erat scelerisque sit amet. Ut et vulputate diam. Quisque ut enim ac turpis ultricies scelerisque. Maecenas nec felis vel odio suscipit feugiat sit amet quis lacus. Fusce tristique diam eu purus venenatis, id tincidunt nunc interdum. Aenean eget nibh rutrum, sagittis nisi vitae, fringilla ligula. Suspendisse potenti.";
          break;
        case '(Ukrainian)':
          nationalityText.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet leo ut tempus scelerisque. Pellentesque at nulla et erat molestie vehicula sit amet ut elit. Ut blandit enim nulla, et scelerisque turpis semper sed. Vivamus ex nulla, varius nec blandit at, sagittis et sem. Donec a urna ut velit tempus porta. Maecenas ullamcorper diam tempus tellus scelerisque vestibulum. Proin tristique lobortis egestas. Proin porta, turpis nec ultrices luctus, eros orci imperdiet erat, vel dapibus neque felis id ligula. Sed dignissim neque sed dignissim tempus. Mauris ornare ipsum id scelerisque porttitor. Nunc volutpat ex nulla, eget sodales eros sodales sed. Pellentesque congue suscipit arcu, non ultricies nulla. Maecenas viverra placerat hendrerit. Vivamus ligula lorem, faucibus ac tempus non, tristique ultrices magna. Donec non varius ligula.";
          break;
        default:
          nationalityText.textContent = "Select a nationality from the dropdown to see related information.";
      }
    }

    // LANDING CHART
    updateChart('(Cuban)');

    // EVENT LISTENER FOR DROPDOWN
    document.getElementById('nationality-select').addEventListener('change', function () {
      const selectedNationality = this.value;
      updateChart(selectedNationality);
    });
  })
  .catch(error => {
    console.error('Error loading data:', error);
  });