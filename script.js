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

  //create  horisontal text on the left of y-axis
  svg
    .append("text")
    .attr("id", "time-minutes")
    .attr("transform", "rotate(90)")
    .attr("x", "100")
    .attr("y", "-10")

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
    .scaleTime()
    .domain([
      d3.min(dataset, (item) => {
        console.log(new Date(item["Seconds"] * 1000));
        return new Date(item["Seconds"] * 1000);
        //return item["Seconds"];
      }),
      d3.max(dataset, (item) => {
        return new Date(item["Seconds"] * 1000);
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
  // console.log("x: ", d.pageX, "y: ", d.pageY);
  const html = `${d.Name} \nYear: ${d.Year} Time: ${d.Time} '\n\n' ${d.Doping}`;
  tooltip
    .transition()
    .style("visibility", "visible")
    .style("opacity", ".9")
    .attr("data-year", () => d.Year)
    .text(html);
  // .style("top", event.pageX + "px")
  // .style("left", event.pageY + "px");
};
const mousemoving = () => {
  tooltip
    .style("top", event.clientX + "px")
    .style("left", event.clientY + "px");
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
    .style("visibility", "hidden")
    .attr("data-year", (i) => d[0].Year)
    .style("position", "absolute")
    .style("border", "1px solid black")
    .style("opacity", ".9")
    .style("font-size", ".7rem");

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
    .on("mousemove", mousemoving)
    .on("mouseout", mouseOutHandler);

  svg
    .selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .attr("x", (e) => e.Year)
    .attr("y", (e) => e.Seconds / 60)
    .text((e) => e.Year);
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
