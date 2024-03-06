/* CONSTANTS AND GLOBALS */
// const width = window.innerWidth * 0.9,
//   height = window.innerHeight * 0.7,
//   margin = { top: 20, bottom: 50, left: 60, right: 40 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
 Promise.all([
  d3.json("../data/world.json"),
  d3.csv("../data/MoMA_nationalities.csv", d3.autoType),
]).then(([geojson, nationalities]) => {
  console.log(geojscon)
  console.log(capitals)


  const svg = d3 
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // SPECIFY PROJECTION
 
    const projection = d3.geoAlbersUsa() //look up global projection!
      .fitSize(
        [width, height],
        geojson
      );

    
  // DEFINE PATH FUNCTION

  const geoPathGen = d3.geoPath(projection)

  // APPEND GEOJSON PATH  

  svg.selectAll("us.state")
        .data(geojson.features) //not just geoJson, but each one of the individual features, not an array per se
        .join("path")
        .attr("class", "us-state")
        .attr("stroke", "black")
        .attr("fill", "transparent")
        .attr("d", d => geoPathGen(d)) //path mostly good if you're using the lines around the states

  // APPEND DATA AS SHAPE
        svg.selectAll(".us-capital")
        .data(capitals)
        .join("circle")
        .attr("class", "us-capital") //make sure the class passed in matches initial selector in selectAll
        .attr("r", 3)
        //.attr("cx", 20)
        //.attr("cy", 20)
        .attr("transform", d => {
          const point = projection([d.longitude, d.latitude])
         return `translate(${point[0]},${point[1]})`
          })

});