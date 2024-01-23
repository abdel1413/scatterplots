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
  padding = 60;

// canvas
const drawCanvas = () => {
  svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
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
    .attr("x", "40%")
    .attr("y", "70px")

    .style("display", "inline-block")
    .text("35 Fastest times up Alpe d'Huez");

  //create  horisontal text on the left of y-axis
  svg
    .append("text")
    .attr("id", "time-minutes")
    .attr("transform", "rotate(90)")
    .attr("x", "100")
    .attr("y", "-5")
    .text("Time in Minutes")
    .style("font-size", "1.2rem");

  //create legends

  svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", "translate(500,100)")
    .style("fill", "black")
    .style("border", "3px solid red");

  const legend = d3.select("#legend");

  legend
    .append("g")
    .attr("class", "legend-label")
    .append("rect")
    .attr("width", "15")
    .attr("height", "15")
    .attr("x", "250")
    .attr("y", "40")
    .style("fill", "blue");

  legend
    .append("text")
    .attr("x", "105")
    .attr("y", "50")
    .text("Riders with doping allegations ")
    .style("font-size", ".7rem");
  legend
    .append("g")
    .append("rect")
    .attr("width", "15")
    .attr("height", "15")
    .attr("class", "legend-label")
    .attr("x", "250")
    .attr("y", "20")
    .style("fill", "orange");

  legend
    .append("text")
    .attr("x", "145")
    .attr("y", "30")
    .text("No doping allegations ")
    .style("font-size", ".7rem");
};

//scales

const generateScales = () => {
  // subtract 1 to min to push dots to the right
  // add 1 to max to push the right
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(dataset, (d) => d.Year) - 1,
      d3.max(dataset, (d, i) => d.Year) + 1,
    ])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(dataset, (item) => {
        return new Date(item.Seconds * 1000);
        //return item["Seconds"];
      }),
      d3.max(dataset, (item) => {
        return new Date(item.Seconds * 1000);
        // return item["Seconds"];
      }),
    ])
    .range([padding, height - padding]);
};

// axis
const generateAxis = () => {
  //note to get read of commas in date , use call d3.tickFormat()
  //and pass  d3.format() inside which you need to indicate the
  //format. In this case d3.thickFormat(d3.format('d'))
  xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  svg
    .append("g")
    .attr("id", "x-axis")
    .call(xAxis)
    .attr("transform", "translate(0," + (height - padding) + ")");

  // to create minutes: seconds format,:
  //1st : date must be new Date object
  //2nd pass spacifire (%M:%S) as param of d3.timeformat which is
  //then passed ss d3.tichFormat's param

  const specifier = "%M:%S";
  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat(specifier));

  svg
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis)
    .attr("transform", "translate(" + padding + ",0)");
};

const mouseOverHandler = (e, d) => {
  const name = `Name: ${d.Name}.`;
  const yearTime = `Year: ${d.Year}. Time: ${d.Time}.`;
  const doping = `Doping:  ${d.Doping}.`;

  tooltip

    .style("visibility", "visible")
    .style("opacity", "0.9")
    .attr("data-year", () => d.Year)
    .style("top", e.pageY + 5 + "px")
    .style("left", e.pageX + 10 + "px")
    .html(`${name}<br>${yearTime}<br><br>${doping}`)
    .style("width", "auto");

  // tooltip
  //   .append("div")
  //   .text(`${html}`)
  //   .append("br")
  //   .text(`${html2}`)
  //   .style("visibility", "visible");
};

const mouseOutHandler = () => {
  tooltip.transition().style("visibility", "hidden");
};
// circles
const drawCircles = (d, i) => {
  // tooltip

  tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("opacity", "0");

  // .html(
  //   `<p>${item.Name}</p <br> <p>Year:${item.Year}, Time: ${item.Time} </p> <br><br> <p>${item.Doping}</p> `
  // )

  //

  // .attr("data-xvalue", (d) => d["Year"])
  //   .attr("data-yvalue", (d) => new Date(d["Seconds"]*1000))
  // //
  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", (d) => d.Year)
    .attr("data-yvalue", (d) => new Date(d["Seconds"] * 1000))
    .attr("cx", (d) => {
      return xScale(d.Year);
    })
    .attr("cy", (d) => {
      return yScale(new Date(d.Seconds) * 1000);
    })
    .attr("r", 8)
    .attr("fill", (d) => {
      return d.Doping != "" ? "blue" : "orange";
    })

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
