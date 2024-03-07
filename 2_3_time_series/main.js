 /* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.7,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 50, left: 60, right: 60 };

/* LOAD DATA */
d3.csv('/Users/tfagin/Desktop/repositories/Interactive-Data-Vis-Spring2024/data/HOOD.csv', d3.autoType)
 .then(data => {
  console.log('data :>> ', data);
 
 // return {
  //   date: new Date(+d.date, 0, 1),
  //   country: d.Entity,
  //   population: +d.Population
 // }

  // SCALES
    const xScale = d3.scaleTime()
      .domain(d3.extent[data, d => d.date])
      .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
      .domain(0, d3.max(data, d = d.close_last))
      .range[(height - margin.bottom, margin.top)]

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // BUILD AND CALL AXES

  const xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("transform", 'translate(0, ${height - margin.bottom})')
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("transform", 'translate(0, ${margin.left}, 0)')
    .call(yAxis);

  // LINE GENERATOR FUNCTION

  const areaGen = d3.area()
    .x(d => xScale(d.date))
    .y(d => yScale(d.close_last))

  // DRAW LINE


  svg.append("path")
    .data(data)
    .attr("fill", "pink")
    .attr("opacity", 0.7)
    .attr("d", areaGen);

  //  svg.selectAll(".circle")
   /*    .data(date)
      .join("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.close_last))
      .attr("r", 1) */

  //  svg.selectall(".afghanistan")
/*       .data(data)
      .join("path")
      .attr("class", 'afghanistan')
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", d => lineGen(d)) */


      //generator function
    //  const groupedData = d3.groups(data, d => d.country)

/*       svg.selectAll("path.country")
        .data(groupedData)
        .join("path")
        .attr("class", "date")
        // .attr("d", d => lineGen(d[1])) this looks at the second item in the array for each country
        .attr("d", (close_last, data]) => lineGen(data))
        .attr("fill", "none")
        .attr("stroke", "black") */

});