//variables
let xScale,
  yScale,
  xAxis,
  yAxis,
  dataset = [],
  svg;
const height = 500,
  width = 900,
  padding = 50;

// canvas
const drawCanvas = () => {
  svg = d3
    .select("body")
    .append("div")
    .attr("id", "container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "black")
    .attr("padding", padding);

  svg
    .append("text")
    .attr("id", "title")
    .attr("x", "25%")
    .attr("y", "40px")
    .html("Doping in Professional Bicycle Racing");

  svg
    .append("text")
    .attr("id", "subtitle")
    .attr("x", "32%")
    .attr("y", "70px")
    .html("35 Fastest times up Alpe d'Huez");
};

//scales

const generateScales = () => {
  const dateArray = dataset.map((item) => item.Year);

  const minutes = dataset.map((item) => item.Seconds / 60);
  console.log(dateArray);

  xScale = d3
    .scaleLinear()
    .domain([d3.min(dateArray), d3.max(dateArray)])
    .range([padding, width - padding]);

  yScale = d3
    .scaleLinear()
    .domain([d3.min(minutes), d3.max(minutes)])
    .range([padding, height - padding]);
};

// axis
const generateAxis = () => {
  xAxis = d3.axisBottom(xScale);
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
};

// circles
const drawCircles = (d) => {};

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then((respone) => respone.json())
  .then((data) => {
    dataset = data;

    drawCanvas();
    generateScales();
    generateAxis();
    drawCircles(data);
  });

// const req = new XMLHttpRequest();
// req.open("GET", url, true);
// req.onload = () => {
//   data = JSON.parse(req.response);

//   dataset = data.map((d) => d.Year);

//   drawCanvas();
//   generateScales();
//   drawAxis();
//   drawCircles();
// };
// req.send();
