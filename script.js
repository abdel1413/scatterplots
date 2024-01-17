//variables
let xScale, yScale, xAxis, yAxis, data, svg;
const height = 500,
  width = 900,
  padding = 50;

// canvas
const drawCanvas = () => {
  svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "lightgray");

  svg
    .append("h2")
    .attr("id", "title")
    .text("Doping in Professional Bicycle Racing");

  svg
    .append("p")
    .attr("id", "subtitle")
    .text("35 Fastest times up Alpe d'Huez");
};

//scales
const generateScales = () => {};

// axis
const drawAxis = () => {};

// circles
const drawCircles = (d) => {};

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
fetch(url)
  .then((respone) => respone.json())
  .then((data) => {
    drawCanvas();
    generateScales();
    drawAxis();
    drawCircles(data);
  });
