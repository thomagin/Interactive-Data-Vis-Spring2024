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

// SCALE FOR CHOROPLETH

  const maxCount = d3.max(nationalities, d => d.Count);

// LOG COLOR SCALE (bc US has so many pieces in moma)
  const colorScale = d3.scaleLog()
    .domain([1, maxCount])
    .range(["transparent", "blue"]);

// APPEND GEOJSON PATH
svg.selectAll(".property")
    .data(geojson.features)
    .join("path")
    .attr("class", "country")
    .attr("stroke", "black")
    .attr("fill", d => {
        const country = d.properties.name;
        const nationality = nationalities.find(n => n.Country === country);
        return nationality ? colorScale(nationality.Count) : "transparent";})
    .attr("d", d => geoPathGen(d));
});

       // .attr("cx", 20)
       // .attr("cy", 20)
       // .attr("transform", d => {
       //   const point = projection([d.longitude, d.latitude])
       //  return `translate(${point[0]},${point[1]})`
       //   })


