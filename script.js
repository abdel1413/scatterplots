//variables
let xScale,
  yScale,
  xAxis,
  yAxis,
  dataset = [],
  svg;
let tooltip;
const height = 500,
  width = 800,
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
    .attr("display", "block")
    .html("Doping in Professional Bicycle Racing");

  svg
    .append("text")
    .attr("class", "subtitle")
    .attr("x", "32%")
    .attr("y", "70px")
    .style("display", "inline-block")
    .html("35 Fastest times up Alpe d'Huez");
};

//scales

const generateScales = () => {
  const dateArray = dataset.map((item) => item.Year);

  const minutes = dataset.map((item) => item.Seconds / 60);

  const time = dataset.map((item) => {
    return item.Time;
  });

  xScale = d3
    .scaleLinear()
    .domain([d3.min(dataset, (d) => d.Year), d3.max(dataset, (d, i) => d.Year)])
    .range([padding, width - padding]);

  //   yScale = d3
  //     .scaleLinear()
  //     .domain([d3.max(minutes), d3.min(minutes)])
  //     .range([height - padding, padding]);
  yScale = d3
    .scaleLinear()
    .domain([d3.max(minutes), d3.min(minutes)])
    .range([height - padding, padding]);
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

const mouseOverHandler = () => {
  tooltip.transition().style("visibility", "visible");
};
const mouseOutHandler = () => {};
// circles
const drawCircles = (d, i) => {
  console.log(d[0].Year);

  const date = d.map((item) => item.Year);

  // tooltip
  tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "visible")
    .attr("data-year", () => d)
    .style("position", "absolute")
    .style("background", "yellow")
    .style("border", "1px solid black")
    .style("opacity", ".9")
    .text(() => console.log("d", d));

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => new Date(d.Year))
    .attr("data-yvalue", (d) => d.Seconds / 60)
    .attr("cx", (d) => {
      return xScale(d.Year);
    })
    .attr("cy", (d) => {
      return yScale(d.Seconds / 60);
    })
    .attr("r", 8)
    .attr("fill", (d) => {
      return d.Doping != "" ? "blue" : "orange";
    })
    .style("border-color", "black")
    .on("mouseover", mouseOverHandler)
    .on("mouseout", mouseOutHandler);
};

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then((respone) => respone.json())
  .then((data) => {
    dataset = data;

    drawCanvas();
    generateScales();
    generateAxis();
    drawCircles(dataset);
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
