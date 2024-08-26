
/* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.8;
 const height = 500;
 const margin = 40;

 const colorScale = d3.scaleOrdinal(d3.schemeAccent);

/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType)
  .then(data => {
    console.log("data", data)

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d=> d.Count)])
      .range([0, width - margin])

    const yScale = d3.scaleBand()
      .domain(data.map(d=> d.Nationality))
      .range([height, 0]) //visual variable
      .paddingInner(.2)

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */

    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

      //bars

      svg.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", d => xScale(d.Count))
        .attr("height", d => yScale.bandwidth())
        .attr("x", xScale(0))
        .attr("y", d => yScale(d.Nationality))
        .attr("fill", d => colorScale(d.Nationality))
        ;

      // labels

    svg.selectAll("text")
    .data(data)
    .join("text")
    .text(d => d.Nationality)
    .attr("x", d => xScale(d.Count) + 5) 
    .attr("y", d => yScale(d.Nationality) + yScale.bandwidth() / 2) 
    .style("fill", "black")
    .style("font-size", "9px"); 

    })

    //https://thomagin.github.io/Interactive-Data-Vis-Spring2024/2_1_quantities_and_amounts/
    //https://github.com/thomagin/Interactive-Data-Vis-Spring2024/blob/main/2_1_quantities_and_amounts/main.js