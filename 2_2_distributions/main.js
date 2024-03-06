/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
   height = window.innerHeight * 0.7,
   margin = { top: 20, bottom: 60, left: 60, right: 40 },
   radius = 5;

/* LOAD DATA */
d3.csv("../data/MoMA_distributions.csv", d3.autoType)
  .then(data => {
    console.log(data)

    /* SCALES */
    const xScale = d3.scaleLinear()
      .domain([0,1])
       // .range([0, width])
       // .range([margin, width - margin])
        .range([margin.left, width - margin.right])

    const yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height - margin.bottom, margin.top])
    
    /* HTML ELEMENTS */

    //svg
    const svg = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    //axis scales
    const xAxis = d3.axisBottom(xScale)
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis)

    const yAxis = d3.axisBottom(yScale)
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis)

      //draw circles

      svg.selectAll(".circle")
        .data(data)
        .join("circle")
        .attr("r", radius)
        .attr("cx", d => d.ideologyScore2020)
        .attr("cy", d => yScale(d.envScore2020))


      let currentData = data;

     
      
        const draw = () => {
        svg.selectAll(".circle")
        .data(currentData, d => d.BioID)
        .join(
          enter => enter
          .append("circle")
          .attr("class", "circle")
          .attr("r", radius)
          .attr("cx", d => xScale(d.ideologyScore2020))
          .attr("cy", d => yScale(d.envScore2020)),
          attr("fill", d => colorScale(d.Party)), //throwing up error bc of . before attr??
        update => update
          .call(sel => sel.transition()
          .attr("cx", d => xScale(d.ideologyScore2020))
          .attr("cy", d => yScale(d.envScore2020)))
        ,
        exit => exit
          .call(sel => sel.transition()
            .duration(2500)
            .attr("r", 0)
            .remove()
          )
        )

      }
      draw();

    }, 3000)

    setTimeout(() => {
      console.log("its run")
      currentData = data.filter(d => d.party === "D")
     //   .attr("cx", (d, i) => xScale(d.))
     // test test
     //console.log("its run", currentData)
     //draw();
  });