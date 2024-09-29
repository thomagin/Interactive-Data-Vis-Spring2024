document.addEventListener('DOMContentLoaded', function () {
  const enterBtn = document.getElementById('enter-btn');
  const sections = document.querySelectorAll('.section');
  let currentSection = 0;

  // Hide all sections except the landing page
  sections.forEach((section, index) => {
    if (index !== currentSection) section.classList.add('hidden');
  });

  // Function to reveal the next section when scrolling
  function revealNextSection() {
    if (currentSection < sections.length - 1) {
      sections[currentSection].classList.add('hidden');
      currentSection += 1;
      sections[currentSection].classList.remove('hidden');
      sections[currentSection].classList.add('visible');

      // Load visualizations when reaching the "Data on CCRB" section
      if (currentSection === sections.length - 1) {
        loadVisualizations();
      }
    }
  }

  // Smooth scroll or button click to reveal the first section
  enterBtn.addEventListener('click', () => {
    sections[currentSection].classList.add('hidden');
    currentSection += 1;
    sections[currentSection].classList.remove('hidden');
    sections[currentSection].classList.add('visible');
  });

  // Function to load D3 visualizations
  function loadVisualizations() {
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

    const margin = { top: 40, right: 40, bottom: 40, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svgComplaints = d3.select("#complaints-chart")
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
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", d => y(d.totalComplaints))
      .attr("height", d => height - y(d.totalComplaints));

    const svgRates = d3.select("#rates-chart")
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
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", d => yRate(d.substantiatedRate))
      .attr("height", d => height - yRate(d.substantiatedRate));

    svgRates.selectAll(".unsubstantiated")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "unsubstantiated")
      .attr("x", d => x(d.administration))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", d => yRate(d.substantiatedRate + d.unsubstantiatedRate))
      .attr("height", d => height - yRate(d.unsubstantiatedRate));
  }

  // Scroll event to reveal next section
  window.addEventListener('scroll', function () {
    const currentPos = window.scrollY;
    const windowHeight = window.innerHeight;

    if (currentPos > windowHeight * currentSection * 0.9) {
      revealNextSection();
    }
  });
});