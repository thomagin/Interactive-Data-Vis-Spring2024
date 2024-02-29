
/* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.8
 const height = 500

/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType)
  .then(data => {
    console.log("data", data)

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d=> d.count)])
      .range([height, 0])

    const yScale = d3.scaleBand()
      .domain(d3.map(d=> d.activity))
      .range([0, width]) //visual variable
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
        .attr("width", yScale.bandwidth())
        .attr("height", d => width - xScale(d.count))
        .attr("x", d=>xScale(d.nationality))
        .attr("y", d=>yScale(d.count))



  })