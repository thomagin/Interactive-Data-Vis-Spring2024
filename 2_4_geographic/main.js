/* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.9,
   height = window.innerHeight * 0.7,
   margin = { top: 20, bottom: 50, left: 60, right: 40 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
 Promise.all([
  d3.json("../data/world.json"),
  d3.csv("../data/MoMA_nationalities.csv", d3.autoType),
]).then(([geojson, nationalities]) => {
  console.log(geojson)
  console.log(nationalities)


  const svg = d3 
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  
  // SPECIFY PROJECTION
 
  const projection = d3.geoMercator() //look up global projection!
    .fitSize([width, height], geojson);

  // DEFINE PATH FUNCTION

  const geoPathGen = d3.geoPath(projection);

  // APPEND GEOJSON PATH  

  svg.selectAll(".property")
  .data(geojson.features)
  .join("path")
  .attr("class", "country")
  .attr("stroke", "black")
  .attr("fill", "transparent")
  .attr("d", d => geoPathGen(d));

  // APPEND DATA AS SHAPE
  svg.selectAll(".nationality")
    .data(nationalities)
    .join("circle")
    .attr("class", "nationality")
    .attr("r", d => Math.sqrt(d.Count) * 0.3) // sizing the dots
    .attr("fill", "pink")
    .attr("cx", d => {
      const country = d.Country; 
      const feature = geojson.features.find(f => f.properties.name === country);
      return feature ? projection(d3.geoCentroid(feature))[0] : null;
    })
    .attr("cy", d => {
      const country = d.Country; 
      const feature = geojson.features.find(f => f.properties.name === country);
      return feature ? projection(d3.geoCentroid(feature))[1] : null;
    });

       // .attr("cx", 20)
       // .attr("cy", 20)
       // .attr("transform", d => {
       //   const point = projection([d.longitude, d.latitude])
       //  return `translate(${point[0]},${point[1]})`
       //   })

});

