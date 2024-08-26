//* CONSTANTS AND GLOBALS
 const width = window.innerWidth * .9,
 height = window.innerHeight * .7;
 let svg;

// APPLICATION STATE

let state = {
  geojson: null,
  hover_state_name: null,
  hover_lat: null,
  hover_long: null,
};

/**
* LOAD DATA
* Using a Promise.all([]), we can load more than one dataset at a time
* */
Promise.all([
  d3.json("../data/usState.json")
]).then(([geojson]) => {
  state.geojson = geojson;
   console.log("state: ", state);
  init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
  console.log("init is run")


  //define projection and geopath

  const projection = d3.geoAlbersUsa()
  .fitSize([width, height], state.geojson)

  const geoPathGen = d3.geoPath()
    .projection(projection)

    //creat an svg element in our main d3 container element
       const svg = d3.select("#container")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

        // add states from geoJson

        svg.selectAll(".states")
          .data(state.geojson.features)
          .join("path")
          .attr("d", d => {
            console.log(d, geoPathGen(d))
            return geoPathGen(d)
          })
          .style("stroke", "black")
          .style("fill", "transparent")


          //mouseover check on state
          //mouseover
          .on("mouseenter", (mouseEvent, d) => {
            state.hover_state_name = d.properties.NAME
            console.log(state)

            draw();
          })

          //mouseover check on svg
          svg.on("mouseover", (mouseEvent) => {
            console.log("mousemoved", mouseEvent)
            const longLat = projection.invert([mouseEvent.clientX, mouseEvent.clientY])
            //console.log(longLat)

            state.hover_lat = longLat[1];
            state.hover_long = longLat[0];

        //    d3.select("#hover-content").text(`
         //     Longitude: ${longLat[0]}
         //     Latitude: ${longLat[1]}
          //    `)
          })
          
          draw(); // calls the draw function
        }
/**
* DRAW FUNCTION
* we call this every time there is an update to the data/state
* */
function draw() {
  console.log("draw is run")
  

  //update hover content
    d3.select("#hover-content")
      .html(`
      <div>State: ${state.hover_state_name}</div>
      <div>Longitude: ${state.hover_long}</div>
      <div>Latitude: ${state.hover_lat}</div>
      `)
 

}